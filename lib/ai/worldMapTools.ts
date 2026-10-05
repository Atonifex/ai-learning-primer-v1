export const showWorldMapTool = {
  type: "function" as const,
  function: { name: "show_world_map", description: "Open the captain's real island map. Optionally select a place using its exact ID from LIVING ISLAND MAP. Use when asked where something is, to see the map, or to explain a route. Does not walk, start work, or change subjects.",
    parameters: { type: "object", properties: { node_id: { type: "string", description: "Optional exact saved map location ID." } } } },
};
export const saveMapNoteTool = {
  type: "function" as const,
  function: { name: "save_map_note", description: "Save or replace a short captain-requested note at an available location. Capture their observation or plan faithfully. Does not build, unlock anything, or award mastery. Do not save invented facts or sensitive personal details.",
    parameters: { type: "object", properties: { node_id: { type: "string" }, note: { type: "string", maxLength: 240 } }, required: ["node_id", "note"] } },
};
