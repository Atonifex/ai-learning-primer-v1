export const presentCaptainChoicesTool = {
  type: "function" as const,
  function: {
    name: "present_captain_choices",
    description:
      "Show 2–3 on-screen decision buttons (A/B/C) for the captain to tap. Call whenever you ask them to choose between concrete options — never only write 'A or B or C' in chat. Keep labels short and child-facing. Do not use this for Camp needs jobs (use show_mission_board / open_mission), map places (show_world_map), quizzes, or yes/no mic-only questions with no real fork.",
    parameters: {
      type: "object",
      properties: {
        decision_prompt: {
          type: "string",
          description:
            "Optional one-line question shown above the buttons, e.g. 'Where do we look first?'",
        },
        options: {
          type: "array",
          minItems: 2,
          maxItems: 3,
          description: "Exactly 2 or 3 choices. Ids must be A, B, then C if needed.",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                enum: ["A", "B", "C"],
                description: "Letter on the button: A, B, or C.",
              },
              label: {
                type: "string",
                description:
                  "Short tap label (under ~60 chars), e.g. 'Check the wreck first'.",
              },
            },
            required: ["id", "label"],
          },
        },
      },
      required: ["options"],
    },
  },
};
