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
