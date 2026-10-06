import { describe, expect, it } from "vitest";
import { openCampPlanTool } from "./campPlanTool";

describe("openCampPlanTool", () => {
  it("exposes open_camp_plan for the camp resource lesson", () => {
    expect(openCampPlanTool.function.name).toBe("open_camp_plan");
    expect(openCampPlanTool.function.description).toMatch(/Plan what camp can afford/);
    expect(openCampPlanTool.function.description).toMatch(/MA\.3\.NSO\.2\.1/);
    expect(openCampPlanTool.function.description).toMatch(/MA\.3\.AR\.1\.2/);
    expect(openCampPlanTool.function.description).not.toMatch(/MA\.3\.NSO\.2\.3/);
  });
});
