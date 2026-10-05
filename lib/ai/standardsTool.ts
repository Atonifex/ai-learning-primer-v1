export const recordStandardObservationTool = {
  type: "function" as const,
  function: {
    name: "record_standard_observation",
    description:
      "Record learner performance evidence against one standard code in the current session subject.",
    parameters: {
      type: "object",
      properties: {
        standard_code: { type: "string", description: "Benchmark code, e.g. MA.3.NSO.1.2" },
        evidence_tier: {
          type: "string",
          enum: ["CONVERSATIONAL", "GUIDED", "CHECKPOINT"],
          description: "Evidence strength tier. Use CONVERSATIONAL for normal dialogue checks.",
        },
        correctness: {
          type: "number",
          description: "Estimated correctness from 0.0 to 1.0",
        },
        notes: {
          type: "string",
          description: "Short note about what the learner demonstrated or struggled with.",
        },
      },
      required: ["standard_code", "evidence_tier"],
    },
  },
};

export const generateLearningActivityTool = {
  type: "function" as const,
  function: {
    name: "generate_learning_activity",
    description:
      "Generate and save an AI mini-quiz tied to one standard. Only after a math starting point is saved. Until then the tool is unavailable. Work appears at the chosen map location; the captain chooses when to open it.",
    parameters: {
      type: "object",
      properties: {
        standard_code: { type: "string", description: "Benchmark code to target." },
        title: { type: "string", description: "Short learner-facing quiz title." },
        instructions: { type: "string", description: "One concise instruction sentence." },
        map_location_id: { type: "string", description: "Available location ID from LIVING ISLAND MAP where this work belongs. Defaults to camp. Never invent a location." },
        items: {
          type: "array",
          description: "3-5 quiz items.",
          items: {
            type: "object",
            properties: {
              question: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              correct_option_index: { type: "number" },
              explanation: { type: "string" },
            },
            required: ["question", "options", "correct_option_index"],
          },
        },
      },
      required: ["standard_code", "title", "instructions", "items"],
    },
  },
};

export const suggestNextMissionTool = {
  type: "function" as const,
  function: {
    name: "suggest_next_mission",
    description:
      "Look up which island jobs are locked, available, or done. Call when the captain asks what to do next or how to advance.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
};

export const openMissionTool = {
  type: "function" as const,
  function: {
    name: "open_mission",
    description:
      "Open a mission-board job for the captain (may switch the session subject). Use a mission id from the MISSION BOARD: wreck-math, dune-ela, treeline-sci, creek-ss, camp-math. Call when they agree to start that job.",
    parameters: {
      type: "object",
      properties: {
        mission_id: {
          type: "string",
          description: "Mission id from the board, e.g. dune-ela.",
        },
      },
      required: ["mission_id"],
    },
  },
};

export const showMissionBoardTool = {
  type: "function" as const,
  function: {
    name: "show_mission_board",
    description:
      "Open the on-screen Camp needs overlay for the captain. Until a math starting point is saved this is not a four-subject jobs buffet. Call when they ask what camp needs, or you invite them to pick the next salvage task. Does not start a quiz — use open_mission after they choose.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
};

export const openCrewLogTool = {
  type: "function" as const,
  function: {
    name: "open_crew_log",
    description:
      "Optional: open the on-screen crew-log slate so the captain can leave a note for the missing engineer. Jobs (including camp-math) do not wait on this. Never ask them to type the tool name.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
};

export const saveCrewLogTool = {
  type: "function" as const,
  function: {
    name: "save_crew_log",
    description:
      "Optional: save the captain's crew-log note from this conversation (or a short paraphrase). Jobs do not wait on this. Never ask them to type the tool name.",
    parameters: {
      type: "object",
      properties: {
        note: {
          type: "string",
          description:
            "The captain's crew-log sentence in their words (fix spelling lightly if needed).",
        },
      },
      required: ["note"],
    },
  },
};
