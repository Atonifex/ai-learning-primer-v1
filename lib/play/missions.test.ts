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
    expect(missionByPin("camp")?.lockedUntil).toBe("wreck-quiz");
  });

  it("keeps other pins locked until wreck salvage, including camp", () => {
    const gates = {
      wreckQuizDone: false,
      completedSlugs: new Set<string>(),
    };
    expect(resolveMissionStatus(missionByPin("wreck")!, gates).status).toBe("available");
    expect(resolveMissionStatus(missionByPin("dune")!, gates).status).toBe("locked");
    expect(resolveMissionStatus(missionByPin("camp")!, gates).status).toBe("locked");

    gates.wreckQuizDone = true;
    expect(resolveMissionStatus(missionByPin("dune")!, gates).status).toBe("locked");
    expect(resolveMissionStatus(missionByPin("camp")!, gates).status).toBe("locked");
    expect(resolveMissionStatus(missionByPin("camp")!, { ...gates, placementReady: true }).status).toBe(
      "available"
    );
    expect(resolveMissionStatus(missionByPin("dune")!, { ...gates, placementReady: true }).status).toBe(
      "available"
    );
  });

  it("marks a slug completed and injects next open job into Rho's prompt", () => {
    const missions = decorateMissions({
      wreckQuizDone: true,
      completedSlugs: new Set(["g3-ma-wreck-number-forms"]),
    });
    expect(missions[0]?.status).toBe("completed");
    const prompt = formatMissionsForPrompt(missions);
    expect(prompt).toContain("camp-math [locked]");
    expect(prompt).toContain("dune-ela [locked]");
    expect(prompt).toContain("No open jobs");
    expect(prompt).toContain("show_mission_board");
    expect(prompt).toContain("open the on-screen Camp needs overlay");
    expect(prompt).not.toContain("Crew log still needed");
    expect(prompt).not.toContain("locked on the crew log");
  });

  it("adds the saved camp snapshot when one is passed", () => {
    const missions = decorateMissions({
      wreckQuizDone: true,
      completedSlugs: new Set(["g3-ma-wreck-number-forms"]),
    });
    const prompt = formatMissionsForPrompt(missions, {
      stage: "crates",
      stageLabel: "Crate pile",
      founded: true,
      rations: 2,
      scrap: 1,
      timber: 0,
      canvas: 0,
      crew: [],
      crewFound: 0,
      crewTotal: 5,
    });
    expect(prompt).toContain("Crate pile");
    expect(prompt).toContain("Rations 2");
    expect(prompt).toContain("Do not invent extra buildings");
  });
});
