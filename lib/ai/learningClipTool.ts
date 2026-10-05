export const offerLearningClipTool = {
  type: "function" as const,
  function: {
    name: "offer_learning_clip",
    description:
      "Open one evaluated learning clip on screen for the current mission, with questions to hold while watching. Call when a short explainer would help. Never invent a video URL or send the captain to YouTube. If this returns no clip, teach the idea yourself. Do not call again for the same goal after they come back.",
    parameters: {
      type: "object",
      properties: {
        learning_goal: {
          type: "string",
          description: "The mission question this clip should help with, in one sentence.",
        },
        topic_query: {
          type: "string",
          description: "Short search phrase for the idea, such as 'grade 3 fractions equal parts'.",
        },
      },
      required: ["learning_goal", "topic_query"],
    },
  },
};
