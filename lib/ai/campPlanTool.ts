/**
 * Orchestrator tool for the deterministic Camp resource plan.
 */

export const openCampPlanTool = {
  type: "function" as const,
  function: {
    name: "open_camp_plan",
    description:
      "Open the on-screen Camp resource plan (goal: Plan what camp can afford). Use for the camp math job after teaching, or when the captain is ready to budget rations, scrap, timber, and canvas and then build one upgrade. Lesson codes MA.3.NSO.2.1, MA.3.NSO.2.4, and MA.3.AR.1.2. Deterministic costs; do not invent what they can afford or score the plan in chat. Never ask them to type the tool name.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
};
