import OpenAI from "openai";
import { LIVE_INTERACTION_MODEL } from "./models";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import {
  buildSystemPrompt,
  type CoherenceMapBlockInput,
} from "./contextBuilder";
import {
  generateSceneImage,
} from "./imageTool";
import { offerLearningClipTool } from "./learningClipTool";
import { findLearningClip } from "../play/learningClipSearch";
import {
  generateLearningActivityTool,
  openCrewLogTool,
  openMissionTool,
  recordStandardObservationTool,
  saveCrewLogTool,
  showMissionBoardTool,
  suggestNextMissionTool,
} from "./standardsTool";
import { getReferenceBuffersForScene } from "./referenceImages";
import { recordStandardObservation } from "../services/standardsProgress";
import { createGeneratedMiniQuiz } from "../services/learningActivities";
import { getMissionBoard } from "../services/missions";
import {
  formatStandardsBlock,
  getStandardCodesForSubject,
} from "../services/standardsCatalog";
import {
  hasCompletedChapterReflection,
  saveChapterReflectionFromNote,
} from "../play/chapterReflection";
import { findCrewLogNoteCandidate } from "../play/crewLogCandidate";
import {
  aiDebug,
  isAiDebug,
  isAiDebugFull,
  summarizeMessagesForDebug,
} from "./aiDebug";
import type {
  LearnerProfileData,
  MemoryItemData,
  StorySpineContext,
  StoryStateData,
  StreamChunk,
  MessageData,
} from "../types";
import { storySpineSubjectSlug } from "../constants/subjects";
import { expandHiddenTurn, isHiddenTurn } from "../play/hiddenTurns";

function extractCoherenceMap(
  spine: StorySpineContext | null | undefined,
  subjectSlug: string
): CoherenceMapBlockInput | null {
  if (!spine || !spine.plannerJson || typeof spine.plannerJson !== "object")
    return null;
  const planner = spine.plannerJson as Record<string, unknown>;
  const subjectPlans =
    planner.subjectPlans && typeof planner.subjectPlans === "object"
      ? (planner.subjectPlans as Record<string, unknown>)
      : null;
  const plannerKey = storySpineSubjectSlug(subjectSlug);
  const subjectPlan =
    subjectPlans && typeof subjectPlans[plannerKey] === "object"
      ? (subjectPlans[plannerKey] as CoherenceMapBlockInput["subjectPlan"])
      : subjectPlans && typeof subjectPlans[subjectSlug] === "object"
        ? (subjectPlans[subjectSlug] as CoherenceMapBlockInput["subjectPlan"])
        : undefined;
  return {
    sharedBeat: typeof planner.sharedBeat === "string" ? planner.sharedBeat : undefined,
    anchorQuestion:
      typeof planner.anchorQuestion === "string" ? planner.anchorQuestion : undefined,
    chapterQuestion:
      typeof planner.chapterQuestion === "string" ? planner.chapterQuestion : undefined,
    investigationQuestions: Array.isArray(planner.investigationQuestions)
      ? (planner.investigationQuestions as string[])
      : undefined,
    subjectPlan,
  };
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
/** Live child-facing turns — cheap model named in MASTER_VISION_PLAN §4.4. */
const MODEL = LIVE_INTERACTION_MODEL;

function throwIfAborted(signal: AbortSignal | undefined) {
  if (signal?.aborted) {
    const e = new Error("The operation was aborted");
    e.name = "AbortError";
    throw e;
  }
}

function toOpenAIMessages(messages: MessageData[]): ChatCompletionMessageParam[] {
  return messages
    .filter((m) => m.content && !isHiddenTurn(m.content))
    .map((m) => ({
      role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    }));
}

export async function* streamSessionResponse(
  profile: LearnerProfileData,
  memoryItems: MemoryItemData[],
  storyState: StoryStateData | null,
  recentSummaries: string[],
  sessionMessages: MessageData[],
  userMessage: string,
  opts: {
    /** Subject lens for this session — required so we inject the right template + standards. */
    subjectSlug: string;
    abortSignal?: AbortSignal;
    spine?: StorySpineContext | null;
    previouslyOn?: string | null;
    chapterHandoff?: string | null;
    sessionId?: string;
  }
): AsyncGenerator<StreamChunk> {
  const abortSignal = opts.abortSignal;

  const standards = await getStandardCodesForSubject(opts.subjectSlug);
  const standardsBlock = formatStandardsBlock(standards);
  const coherenceMap = extractCoherenceMap(opts.spine, opts.subjectSlug);
  const missionBoard = await getMissionBoard(profile.id);

  const systemPrompt = buildSystemPrompt(
    profile,
    memoryItems,
    storyState,
    recentSummaries,
    {
      subjectSlug: opts.subjectSlug,
      spine: opts.spine ?? null,
      previouslyOn: opts.previouslyOn ?? null,
      standardsBlock,
      coherenceMap,
      missionBoard: missionBoard.missions,
      chapterHandoff: opts.chapterHandoff ?? null,
    }
  );

  const priorMessages = toOpenAIMessages(sessionMessages);
  const captainName = profile.displayName?.trim() || "Captain";
  const expandedUser = expandHiddenTurn(userMessage, captainName);
  const isHidden = isHiddenTurn(userMessage);

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...priorMessages,
    { role: "user" as const, content: expandedUser },
  ];

  if (isAiDebug()) {
    aiDebug("orchestrator", "turn_start", {
      model: MODEL,
      turn: isHidden ? "hidden_tutorial_beat" : "user_message",
      systemPromptChars: systemPrompt.length,
      priorTurns: priorMessages.length,
      messagesOutline: summarizeMessagesForDebug(
        messages.map((m) => ({
          role: m.role,
          content: typeof m.content === "string" ? m.content : "[multipart]",
        })),
        120
      ),
    });
    if (isAiDebugFull()) {
      console.log(
        "[Primer AI:orchestrator] system_prompt (full — PRIMER_AI_DEBUG_FULL)\n---\n" +
          systemPrompt +
          "\n---"
      );
    }
  }

  let fullText = "";
  const toolCalls = new Map<number, { id: string; name: string; args: string }>();
  let imageUrl: string | null = null;

  const stream = await openai.chat.completions.create(
    {
      model: MODEL,
      messages,
      // Stills-pack loop (§11 Step 1): do not call generate_scene_image per turn.
      tools: [
        recordStandardObservationTool,
        generateLearningActivityTool,
        suggestNextMissionTool,
        showMissionBoardTool,
        openMissionTool,
        openCrewLogTool,
        saveCrewLogTool,
        offerLearningClipTool,
      ],
      tool_choice: "auto",
      // gpt-5.6-luna rejects function tools unless reasoning is off.
      reasoning_effort: "none",
      stream: true,
      //4/7/2026: Experiment with max_completion_tokens to see if it helps with the length of the responses.
      //This is temporary; a more sophisticated solution will calculate max_completion_tokens or 
      //verbosity based on user's age, language level, demonstrated interest, assessment type, etc.
      //I am worried about limiting effective tool calling if I implement low verbosity or max_completion_tokens.
      verbosity: "low",
      //max_completion_tokens: 150,
    },
    { signal: abortSignal }
  );

  for await (const chunk of stream) {
    throwIfAborted(abortSignal);
    const choice = chunk.choices[0];
    if (!choice) continue;

    const delta = choice.delta;

    if (delta.content) {
      fullText += delta.content;
      yield { type: "text", content: delta.content };
    }

    if (delta.tool_calls) {
      for (const tc of delta.tool_calls) {
        const index = tc.index ?? 0;
        const existing = toolCalls.get(index);
        if (!existing) {
          toolCalls.set(index, { id: tc.id || "", name: tc.function?.name || "", args: "" });
        }
        const row = toolCalls.get(index)!;
        if (tc.id) row.id = tc.id;
        if (tc.function?.name) row.name = tc.function.name;
        if (tc.function?.arguments) {
          row.args += tc.function.arguments;
        }
      }
    }

    if (choice.finish_reason === "tool_calls" && toolCalls.size > 0) {
      const orderedCalls = [...toolCalls.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([, v]) => v);
      const toolResults: Array<{ tool_call_id: string; content: string }> = [];

      yield { type: "assistant_thinking", phase: "tools" };

      for (const call of orderedCalls) {
        aiDebug("orchestrator", "tool_calls_finish", {
          toolName: call.name,
          toolCallId: call.id,
          argsChars: call.args.length,
        });
        if (isAiDebug()) {
          console.log(
            `[Primer AI:orchestrator] tool_arguments (truncated)`,
            call.args.length > 800 ? `${call.args.slice(0, 800)}…` : call.args
          );
        }

        let args: Record<string, unknown>;
        try {
          args = JSON.parse(call.args);
        } catch (e) {
          aiDebug("orchestrator", "tool_args_parse_error", {
            error: e instanceof Error ? e.message : String(e),
          });
          toolResults.push({
            tool_call_id: call.id,
            content: JSON.stringify({ success: false, error: "Invalid JSON arguments" }),
          });
          continue;
        }

        if (call.name === "generate_scene_image") {
          const prompt = typeof args.prompt === "string" ? args.prompt : "";
          const charactersInScene = Array.isArray(args.characters_in_scene)
            ? args.characters_in_scene.filter((v): v is string => typeof v === "string")
            : [];
          if (!prompt) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({ success: false, error: "Missing prompt" }),
            });
            continue;
          }

          throwIfAborted(abortSignal);
          yield { type: "image_start" };

          try {
            const referenceBuffers = await getReferenceBuffersForScene(
              profile.id,
              charactersInScene,
              sessionMessages
            );
            throwIfAborted(abortSignal);
            imageUrl = await generateSceneImage(prompt, {
              referenceBuffers,
              abortSignal,
            });
            aiDebug("orchestrator", "image_done", {
              ok: true,
              imageChars: imageUrl.length,
              refCount: referenceBuffers.length,
            });
            yield {
              type: "image_done",
              url: imageUrl,
              prompt,
              charactersInScene,
            };
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: true,
                description: "Scene image generated and displayed to learner.",
              }),
            });
          } catch (err) {
            if (err instanceof Error && err.name === "AbortError") throw err;
            console.error("Image generation failed:", err);
            aiDebug("orchestrator", "image_done", {
              ok: false,
              error: err instanceof Error ? err.message : String(err),
            });
            imageUrl = null;
            yield {
              type: "image_done",
              url: "",
              prompt,
              charactersInScene,
            };
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({ success: false, error: "Image generation failed" }),
            });
          }
        } else if (call.name === "record_standard_observation") {
          const sessionId = opts?.sessionId;
          const standardCode =
            typeof args.standard_code === "string" ? args.standard_code.trim() : "";
          const evidenceTier =
            args.evidence_tier === "CONVERSATIONAL" ||
            args.evidence_tier === "GUIDED" ||
            args.evidence_tier === "CHECKPOINT"
              ? args.evidence_tier
              : "CONVERSATIONAL";
          if (!sessionId || !standardCode) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({ success: false, error: "Missing session or standard_code" }),
            });
            continue;
          }

          try {
            const result = await recordStandardObservation({
              sessionId,
              standardCode,
              evidenceTier,
              correctness: typeof args.correctness === "number" ? args.correctness : undefined,
              notes: typeof args.notes === "string" ? args.notes : undefined,
            });
            yield {
              type: "standard_observation",
              standardCode: result.standardCode,
              mastery: result.mastery,
            };
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({ success: true, ...result }),
            });
          } catch (err) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: false,
                error: err instanceof Error ? err.message : String(err),
              }),
            });
          }
        } else if (call.name === "generate_learning_activity") {
          const sessionId = opts?.sessionId;
          const standardCode =
            typeof args.standard_code === "string" ? args.standard_code.trim() : "";
          if (!sessionId || !standardCode) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({ success: false, error: "Missing session or standard_code" }),
            });
            continue;
          }

          try {
            const activity = await createGeneratedMiniQuiz({
              sessionId,
              standardCode,
              title:
                typeof args.title === "string" ? args.title : `Mini quiz: ${standardCode}`,
              instructions:
                typeof args.instructions === "string"
                  ? args.instructions
                  : "Pick the best answer for each question.",
              items: args.items,
            });
            yield { type: "activity_generated", activity };
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: true,
                activityId: activity.id,
                standardCode: activity.standardCode,
                itemCount: activity.items.length,
              }),
            });
          } catch (err) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: false,
                error: err instanceof Error ? err.message : String(err),
              }),
            });
          }
        } else if (call.name === "suggest_next_mission") {
          try {
            const board = await getMissionBoard(profile.id);
            const next = board.missions.find((m) => m.status === "available") ?? null;
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: true,
                nextJob: next
                  ? {
                      id: next.id,
                      pin: next.pinId,
                      subject: next.subjectSlug,
                      title: next.title,
                      theme: next.theme,
                    }
                  : null,
                missions: board.missions.map((m) => ({
                  id: m.id,
                  status: m.status,
                  pin: m.pinId,
                  subject: m.subjectSlug,
                  title: m.title,
                  theme: m.theme,
                  minutes: m.estimatedMinutes,
                  lockReason: m.lockReason,
                })),
              }),
            });
          } catch (err) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: false,
                error: err instanceof Error ? err.message : String(err),
              }),
            });
          }
        } else if (call.name === "show_mission_board") {
          try {
            const board = await getMissionBoard(profile.id);
            yield { type: "mission_board_open" };
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: true,
                opened: true,
                tellCaptain:
                  "The Jobs board is on screen. Briefly name the open jobs; wait for them to pick before open_mission.",
                missions: board.missions.map((m) => ({
                  id: m.id,
                  status: m.status,
                  pin: m.pinId,
                  title: m.title,
                  lockReason: m.lockReason,
                })),
              }),
            });
          } catch (err) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: false,
                error: err instanceof Error ? err.message : String(err),
              }),
            });
          }
        } else if (call.name === "open_mission") {
          const missionId = typeof args.mission_id === "string" ? args.mission_id.trim() : "";
          if (!missionId) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({ success: false, error: "Missing mission_id" }),
            });
            continue;
          }
          try {
            const board = await getMissionBoard(profile.id);
            const mission = board.missions.find((m) => m.id === missionId);
            if (!mission) {
              toolResults.push({
                tool_call_id: call.id,
                content: JSON.stringify({ success: false, error: "Unknown mission" }),
              });
              continue;
            }
            if (mission.status === "locked") {
              const needsCrewLog = mission.lockedUntil === "ch1-reflection";
              if (needsCrewLog && opts.sessionId) {
                const candidate = findCrewLogNoteCandidate(
                  userMessage,
                  sessionMessages.map((m) => ({ role: m.role, content: m.content }))
                );
                if (candidate) {
                  try {
                    const saved = await saveChapterReflectionFromNote({
                      sessionId: opts.sessionId,
                      learnerProfileId: profile.id,
                      note: candidate,
                    });
                    yield {
                      type: "crew_log_saved",
                      text: saved.text,
                      handoffSummary: saved.handoffSummary,
                      alreadyCompleted: saved.alreadyCompleted,
                    };
                    const boardAfter = await getMissionBoard(profile.id);
                    const unlocked = boardAfter.missions.find((m) => m.id === missionId);
                    if (unlocked && unlocked.status !== "locked") {
                      const switched = unlocked.subjectSlug !== opts.subjectSlug;
                      yield {
                        type: "mission_open",
                        missionId: unlocked.id,
                        subjectSlug: unlocked.subjectSlug,
                        activitySlug: unlocked.activitySlug,
                        sessionId: opts.sessionId,
                        switched,
                      };
                      toolResults.push({
                        tool_call_id: call.id,
                        content: JSON.stringify({
                          success: true,
                          missionId: unlocked.id,
                          pin: unlocked.pinId,
                          subjectSlug: unlocked.subjectSlug,
                          sessionSwitched: switched,
                          crewLogSaved: true,
                          note: saved.text,
                          tellCaptain:
                            "You saved their crew-log note from chat and opened camp-math. Thank them briefly. Do not ask them to retype the note or a tool name.",
                        }),
                      });
                      continue;
                    }
                  } catch (err) {
                    aiDebug("orchestrator", "crew_log_autosave_failed", {
                      error: err instanceof Error ? err.message : String(err),
                    });
                  }
                }
              }
              toolResults.push({
                tool_call_id: call.id,
                content: JSON.stringify({
                  success: false,
                  error: mission.lockReason || "That job is still locked.",
                  nextAction: needsCrewLog
                    ? "save_crew_log_or_open_crew_log"
                    : "show_mission_board",
                  tellCaptain: needsCrewLog
                    ? "Do not ask them to type tool names. If they already wrote a crew-log note in chat, call save_crew_log with that note. Otherwise call open_crew_log."
                    : "Explain the lock briefly; open the board if helpful.",
                }),
              });
              continue;
            }
            const switched = mission.subjectSlug !== opts.subjectSlug;
            yield {
              type: "mission_open",
              missionId: mission.id,
              subjectSlug: mission.subjectSlug,
              activitySlug: mission.activitySlug,
              sessionId: opts.sessionId ?? "",
              switched,
            };
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: true,
                missionId: mission.id,
                pin: mission.pinId,
                subjectSlug: mission.subjectSlug,
                sessionSwitched: switched,
                tellCaptain: switched
                  ? `A new ${mission.subjectSlug} sitting is opening. Point them to the ${mission.pinId}.`
                  : `The overlay job at the ${mission.pinId} is opening. Stay with them.`,
              }),
            });
          } catch (err) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: false,
                error: err instanceof Error ? err.message : String(err),
              }),
            });
          }
        } else if (call.name === "open_crew_log") {
          try {
            const alreadyDone = await hasCompletedChapterReflection(profile.id);
            if (alreadyDone) {
              toolResults.push({
                tool_call_id: call.id,
                content: JSON.stringify({
                  success: true,
                  alreadyCompleted: true,
                  tellCaptain:
                    "The crew log is already saved. If they want camp-math, call open_mission with camp-math.",
                }),
              });
            } else {
              yield { type: "crew_log_open" };
              toolResults.push({
                tool_call_id: call.id,
                content: JSON.stringify({
                  success: true,
                  opened: true,
                  tellCaptain:
                    "The crew-log slate is on screen. Invite a short note; wait for them. Do not invent that it is already saved.",
                }),
              });
            }
          } catch (err) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: false,
                error: err instanceof Error ? err.message : String(err),
              }),
            });
          }
        } else if (call.name === "save_crew_log") {
          const note = typeof args.note === "string" ? args.note.trim() : "";
          const sessionId = opts?.sessionId;
          if (!note) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: false,
                error: "Missing note",
                tellCaptain:
                  "Ask for one short crew-log sentence, then call save_crew_log again.",
              }),
            });
          } else if (!sessionId) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: false,
                error: "Missing sessionId",
              }),
            });
          } else {
            try {
              const saved = await saveChapterReflectionFromNote({
                sessionId,
                learnerProfileId: profile.id,
                note,
              });
              yield {
                type: "crew_log_saved",
                text: saved.text,
                handoffSummary: saved.handoffSummary,
                alreadyCompleted: saved.alreadyCompleted,
              };
              toolResults.push({
                tool_call_id: call.id,
                content: JSON.stringify({
                  success: true,
                  alreadyCompleted: saved.alreadyCompleted,
                  note: saved.text,
                  handoffSummary: saved.handoffSummary,
                  tellCaptain: saved.alreadyCompleted
                    ? "Crew log was already on file. Camp-math should be open — call open_mission if they want it."
                    : "Crew log saved. Thank them briefly. Camp-math is unlocked — call open_mission with camp-math if they want to start it now.",
                }),
              });
            } catch (err) {
              toolResults.push({
                tool_call_id: call.id,
                content: JSON.stringify({
                  success: false,
                  error: err instanceof Error ? err.message : String(err),
                }),
              });
            }
          }
        } else if (call.name === "offer_learning_clip") {
          const learningGoal =
            typeof args.learning_goal === "string" ? args.learning_goal.trim() : "";
          const topicQuery =
            typeof args.topic_query === "string" ? args.topic_query.trim() : "";
          if (!learningGoal || !topicQuery) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: false,
                opened: false,
                error: "Missing learning_goal or topic_query",
                tellCaptain: "Teach this yourself. Do not invent a video or a link.",
              }),
            });
          } else {
            try {
              throwIfAborted(abortSignal);
              const found = await findLearningClip({
                gradeBand: profile.gradeBand,
                subjectSlug: opts.subjectSlug,
                learningGoal,
                topicQuery,
                signal: abortSignal,
              });
              if (found.status === "clip") {
                yield {
                  type: "learning_clip_open",
                  videoId: found.clip.videoId,
                  title: found.clip.title,
                  channelTitle: found.clip.channelTitle,
                  questions: found.clip.questions,
                  missionPrompt: found.clip.missionPrompt,
                };
                toolResults.push({
                  tool_call_id: call.id,
                  content: JSON.stringify({
                    success: true,
                    opened: true,
                    title: found.clip.title,
                    channel: found.clip.channelTitle,
                    tellCaptain:
                      "The clip is on screen with questions. Stop talking and let them watch. When they come back, connect their note to the mission. Do not offer another clip for this goal.",
                  }),
                });
              } else if (found.status === "off") {
                toolResults.push({
                  tool_call_id: call.id,
                  content: JSON.stringify({
                    success: false,
                    opened: false,
                    reason: "clips_off",
                    tellCaptain:
                      "Learning clips are off. Teach this yourself in one short example. Do not invent a YouTube link.",
                  }),
                });
              } else {
                toolResults.push({
                  tool_call_id: call.id,
                  content: JSON.stringify({
                    success: true,
                    opened: false,
                    reason: found.reason,
                    tellCaptain:
                      "No suitable clip. Teach this yourself. Do not invent a video or a link.",
                  }),
                });
              }
            } catch (err) {
              toolResults.push({
                tool_call_id: call.id,
                content: JSON.stringify({
                  success: false,
                  opened: false,
                  error: err instanceof Error ? err.message : String(err),
                  tellCaptain: "Teach this yourself. Do not invent a video or a link.",
                }),
              });
            }
          }
        } else {
          toolResults.push({
            tool_call_id: call.id,
            content: JSON.stringify({ success: false, error: `Unknown tool: ${call.name}` }),
          });
        }
      }

      for (const row of toolResults) {
        const call = orderedCalls.find((c) => c.id === row.tool_call_id);
        let success = false;
        let error: string | undefined;
        try {
          const parsed = JSON.parse(row.content) as {
            success?: boolean;
            error?: string;
          };
          success = parsed.success === true;
          error = typeof parsed.error === "string" ? parsed.error : undefined;
        } catch {
          // keep defaults
        }
        aiDebug("orchestrator", "tool_result", {
          toolName: call?.name,
          toolCallId: row.tool_call_id,
          success,
          error,
        });
        if (isAiDebug()) {
          yield {
            type: "debug_tool",
            name: call?.name ?? "unknown",
            ok: success,
            detail: error ?? (success ? "ok" : row.content.slice(0, 240)),
          };
        }
      }

      throwIfAborted(abortSignal);

      // Continue conversation after tool execution
      const continuationMessages: ChatCompletionMessageParam[] = [
        ...messages,
        {
          role: "assistant",
          content: fullText || null,
          tool_calls: orderedCalls.map((call) => ({
            id: call.id,
            type: "function",
            function: { name: call.name, arguments: call.args },
          })),
        },
        ...toolResults.map((row) => ({
          role: "tool" as const,
          tool_call_id: row.tool_call_id,
          content: row.content,
        })),
      ];

      aiDebug("orchestrator", "continuation_request", {
        model: MODEL,
        messagesInRequest: continuationMessages.length,
      });

      yield { type: "assistant_thinking", phase: "continuation" };

      const stream2 = await openai.chat.completions.create(
        {
          model: MODEL,
          messages: continuationMessages,
          reasoning_effort: "none",
          stream: true,
        },
        { signal: abortSignal }
      );

      for await (const chunk2 of stream2) {
        throwIfAborted(abortSignal);
        const c2 = chunk2.choices[0];
        const delta2 = c2?.delta;
        if (delta2?.content) {
          fullText += delta2.content;
          yield { type: "text", content: delta2.content };
        }
        const fr2 = c2?.finish_reason;
        if (fr2 && isAiDebug()) {
          aiDebug("orchestrator", "continuation_chunk_finish", {
            finish_reason: fr2,
          });
        }
      }
      toolCalls.clear();
    } else if (choice.finish_reason && choice.finish_reason !== "tool_calls") {
      aiDebug("orchestrator", "first_stream_finish", {
        finish_reason: choice.finish_reason,
        assistantTextChars: fullText.length,
      });
    }
  }

  if (isAiDebug()) {
    aiDebug("orchestrator", "turn_end", {
      totalAssistantChars: fullText.length,
    });
  }
}
