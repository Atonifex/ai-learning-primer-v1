import { describe, expect, it } from "vitest";
import {
  clearPlot,
  emptyGardenState,
  evaluateGarden,
  GARDEN_LEARNER_GOAL,
  GARDEN_STANDARD_CODE,
  gardenVisualKind,
  LESSON1_MIN_HEALTHY,
  markLesson1Passed,
  parseGardenState,
  placeSeedling,
  scorePlantedPlot,
  TUTORIAL_GARDEN_PLOTS,
  plotById,
} from "./gardenPlot";

describe("gardenPlot", () => {
  it("faces the learner goal and SC.3.L.17.2 without inventing codes", () => {
    expect(GARDEN_STANDARD_CODE).toBe("SC.3.L.17.2");
    expect(GARDEN_LEARNER_GOAL).toBe("What plants need to grow");
  });

  it("scores creek-sun healthy and ocean-spray failed for the same rules every time", () => {
    const creek = plotById("creek-sun")!;
    const ocean = plotById("ocean-spray")!;
    expect(scorePlantedPlot(creek).health).toBe("healthy");
    expect(scorePlantedPlot(ocean).health).toBe("failed");
    expect(scorePlantedPlot(ocean).reasons.join(" ")).toMatch(/salt/i);
    expect(scorePlantedPlot(creek)).toEqual(scorePlantedPlot(creek));
  });

  it("fails deep shade and dry ridge; tent-morning is healthy", () => {
    expect(scorePlantedPlot(plotById("tree-shade")!).health).toBe("failed");
    expect(scorePlantedPlot(plotById("dry-ridge")!).health).toBe("struggling");
    expect(scorePlantedPlot(plotById("tent-morning")!).health).toBe("healthy");
    expect(scorePlantedPlot(plotById("crate-shadow")!).health).toBe("failed");
  });

  it("lesson1 passes only with enough healthy beds and no salt plantings", () => {
    let state = emptyGardenState();
    const a = placeSeedling(state, "creek-sun", "t0");
    expect(a.ok).toBe(true);
    if (!a.ok) return;
    state = a.state;
    const b = placeSeedling(state, "tent-morning", "t1");
    expect(b.ok).toBe(true);
    if (!b.ok) return;
    state = b.state;
    const pass = evaluateGarden(state);
    expect(pass.healthyCount).toBeGreaterThanOrEqual(LESSON1_MIN_HEALTHY);
    expect(pass.lesson1Pass).toBe(true);
    expect(markLesson1Passed(state).lesson1Passed).toBe(true);

    let salty = emptyGardenState();
    const c = placeSeedling(salty, "creek-sun", "t0");
    expect(c.ok).toBe(true);
    if (!c.ok) return;
    salty = c.state;
    const d = placeSeedling(salty, "ocean-spray", "t1");
    expect(d.ok).toBe(true);
    if (!d.ok) return;
    salty = d.state;
    expect(evaluateGarden(salty).lesson1Pass).toBe(false);
  });

  it("caps seedlings and clears beds deterministically", () => {
    let state = emptyGardenState();
    for (const id of ["creek-sun", "tent-morning", "dry-ridge"]) {
      const r = placeSeedling(state, id, "t");
      expect(r.ok).toBe(true);
      if (!r.ok) return;
      state = r.state;
    }
    expect(placeSeedling(state, "tree-shade").ok).toBe(false);
    const cleared = clearPlot(state, "dry-ridge");
    expect(cleared.ok).toBe(true);
    if (!cleared.ok) return;
    state = cleared.state;
    expect(state.plantings.map((p) => p.plotId)).toEqual(["creek-sun", "tent-morning"]);
  });

  it("parses only known plots and drops invalid lesson1Passed flags", () => {
    const parsed = parseGardenState({
      version: 1,
      layoutId: "tutorial-shore-v1",
      lesson1Passed: true,
      plantings: [{ plotId: "ocean-spray", plantedAt: "t" }, { plotId: "nope", plantedAt: "t" }],
    });
    expect(parsed.plantings).toHaveLength(1);
    expect(parsed.lesson1Passed).toBe(false);
    expect(gardenVisualKind(parsed)).toBe("struggling");
  });

  it("exposes six authored tutorial plots", () => {
    expect(TUTORIAL_GARDEN_PLOTS).toHaveLength(6);
  });
});
