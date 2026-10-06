/**
 * Orchestrator tools for the deterministic Treeline garden mini-game.
 * Design: docs/TREELINE_GARDEN_LESSON_2026-10-06.md
 */

export const openGardenPlotTool = {
  type: "function" as const,
  function: {
    name: "open_garden_plot",
    description:
      "Open the on-screen Treeline garden mini-game so the captain places wild seedlings. Use during the plants lesson (SC.3.L.17.2 / goal: What plants need to grow) after teaching Sun, air, and water — or when they revisit the garden. Deterministic beds; do not invent plot outcomes in chat. Never ask them to type the tool name.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
};
