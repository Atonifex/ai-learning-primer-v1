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
      "Generate an AI mini-quiz tied to one standard in the active session subject.",
    parameters: {
      type: "object",
      properties: {
        standard_code: { type: "string", description: "Benchmark code to target." },
        title: { type: "string", description: "Short learner-facing quiz title." },
        instructions: { type: "string", description: "One concise instruction sentence." },
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
