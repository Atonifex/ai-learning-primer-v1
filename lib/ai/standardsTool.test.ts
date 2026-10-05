import { describe, expect, it } from "vitest";
import { buildSystemPrompt } from "./contextBuilder";
import {
  openCrewLogTool,
  openMissionTool,
  saveCrewLogTool,
  showMissionBoardTool,
  suggestNextMissionTool,
} from "./standardsTool";
import type { LearnerProfileData } from "../types";
import { decorateMissions, formatMissionsForPrompt } from "../play/missions";

const profile: LearnerProfileData = {
  id: "learner",
  displayName: "Aaron",
  gradeBand: "3",
  readingLevel: "3",
  firstRunStep: "complete",
  introSeenAt: null,
  householdId: "house",
  primarySubjectSlug: "math_g3",
  goals: "",
  interests: [],
  activeLanguage: null,
  currentLevel: null,
  enrolledSubjects: [],
};

describe("mission board tools", () => {
  it("exposes show_mission_board as a callable tool distinct from open_mission", () => {
    expect(showMissionBoardTool.function.name).toBe("show_mission_board");
    expect(openMissionTool.function.name).toBe("open_mission");
    expect(suggestNextMissionTool.function.name).toBe("suggest_next_mission");
    expect(showMissionBoardTool.function.description.toLowerCase()).toContain(
      "mission board"
    );
  });

  it("exposes open_crew_log and save_crew_log for the camp unlock gate", () => {
    expect(openCrewLogTool.function.name).toBe("open_crew_log");
    expect(saveCrewLogTool.function.name).toBe("save_crew_log");
    expect(openCrewLogTool.function.description.toLowerCase()).toContain(
      "never ask them to type the tool name"
    );
    expect(saveCrewLogTool.function.description.toLowerCase()).toContain(
      "already wrote or spoke"
    );
  });

  it("instructs Rho to call tools instead of only narrating the board", () => {
    const missions = decorateMissions({
      wreckQuizDone: false,
      chapter1ReflectionDone: false,
      completedSlugs: new Set(),
    });
    const prompt = buildSystemPrompt(profile, [], null, [], {
      subjectSlug: "math_g3",
      missionBoard: missions,
    });
    expect(prompt).toContain("show_mission_board");
    expect(prompt).toContain("Do not only describe a wooden board");
    expect(prompt).toContain("open_mission");
    expect(prompt).toContain("open_crew_log");
    expect(prompt).toContain("save_crew_log");
    expect(prompt).toContain("never ask the captain to type a tool name");
  });

  it("tells Rho to save or open the crew log when camp is locked", () => {
    const missions = decorateMissions({
      wreckQuizDone: true,
      chapter1ReflectionDone: false,
      completedSlugs: new Set(["g3-ma-wreck-number-forms"]),
    });
    const board = formatMissionsForPrompt(missions);
    expect(board).toContain("save_crew_log");
    expect(board).toContain("open_crew_log");
    expect(board).toContain("never ask them to type a tool name");
  });
});
