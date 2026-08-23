import { describe, expect, it } from "vitest";
import {
  decorateMissions,
  formatMissionsForPrompt,
  missionByPin,
  resolveMissionStatus,
  TUTORIAL_MISSIONS,
} from "./missions";

describe("mission catalog", () => {
  it("covers four subjects on five pins with §4.6 bank slugs", () => {
    const subjects = new Set(TUTORIAL_MISSIONS.map((m) => m.subjectSlug));
    expect(subjects.has("math_g3")).toBe(true);
    expect(subjects.has("ela_g3")).toBe(true);
    expect(subjects.has("science_g3")).toBe(true);
    expect(subjects.has("social_studies_g3")).toBe(true);
    expect(missionByPin("wreck")?.activitySlug).toBe("g3-ma-wreck-number-forms");
    expect(missionByPin("dune")?.subjectSlug).toBe("ela_g3");
    expect(missionByPin("treeline")?.subjectSlug).toBe("science_g3");
    expect(missionByPin("creek")?.subjectSlug).toBe("social_studies_g3");
    expect(missionByPin("camp")?.lockedUntil).toBe("ch1-reflection");
  });

  it("keeps other pins locked until wreck salvage, camp until crew log", () => {
    const gates = {
      wreckQuizDone: false,
      chapter1ReflectionDone: false,
      completedSlugs: new Set<string>(),
    };
    expect(resolveMissionStatus(missionByPin("wreck")!, gates).status).toBe("available");
    expect(resolveMissionStatus(missionByPin("dune")!, gates).status).toBe("locked");
    expect(resolveMissionStatus(missionByPin("camp")!, gates).status).toBe("locked");

    gates.wreckQuizDone = true;
    expect(resolveMissionStatus(missionByPin("dune")!, gates).status).toBe("available");
    expect(resolveMissionStatus(missionByPin("camp")!, gates).status).toBe("locked");

    gates.chapter1ReflectionDone = true;
    expect(resolveMissionStatus(missionByPin("camp")!, gates).status).toBe("available");
  });

  it("marks a slug completed and injects next open job into Rho's prompt", () => {
    const missions = decorateMissions({
      wreckQuizDone: true,
      chapter1ReflectionDone: false,
      completedSlugs: new Set(["g3-ma-wreck-number-forms"]),
    });
    expect(missions[0]?.status).toBe("completed");
    const prompt = formatMissionsForPrompt(missions);
    expect(prompt).toContain("dune-ela [available]");
    expect(prompt).toContain("Next open job: dune-ela");
  });
});
