import { describe, expect, it } from "vitest";
import { openGardenPlotTool } from "./gardenTool";

describe("openGardenPlotTool", () => {
  it("exposes open_garden_plot for the Treeline plants lesson", () => {
    expect(openGardenPlotTool.function.name).toBe("open_garden_plot");
    expect(openGardenPlotTool.function.description).toMatch(/What plants need to grow/);
    expect(openGardenPlotTool.function.description).toMatch(/SC\.3\.L\.17\.2/);
  });
});
