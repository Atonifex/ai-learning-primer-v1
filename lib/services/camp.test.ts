import { beforeEach, describe, expect, it, vi } from "vitest";
import { emptyCamp, MATH_CHECK_GRANT, WRECK_SALVAGE_GRANT } from "../play/camp";

const db = vi.hoisted(() => ({
  campState: { findUnique: vi.fn(), upsert: vi.fn() },
  learningActivity: { findUnique: vi.fn() },
  learningActivityCompletion: { findFirst: vi.fn() },
  learnerProfile: { findUnique: vi.fn() },
}));
vi.mock("../db/prisma", () => ({ prisma: db }));

import { applyCampGrantToLearner, ensureCampForLearner } from "./camp";

beforeEach(() => {
  vi.clearAllMocks();
  db.campState.findUnique.mockResolvedValue(null);
  db.campState.upsert.mockResolvedValue({});
  db.learningActivity.findUnique.mockResolvedValue({ id: "wreck-activity" });
  db.learningActivityCompletion.findFirst.mockResolvedValue(null);
  db.learnerProfile.findUnique.mockResolvedValue(null);
});

describe("camp persistence", () => {
  it("creates an empty camp when nothing is saved and wreck is unfinished", async () => {
    const camp = await ensureCampForLearner("captain");
    expect(camp.stage).toBe("clearing");
    expect(camp.rations).toBe(0);
    expect(camp.crewFound).toBe(0);
    expect(db.campState.upsert).toHaveBeenCalled();
    expect(db.campState.upsert.mock.calls[0][0].create.learnerProfileId).toBe("captain");
    expect(db.campState.upsert.mock.calls[0][0].create.stage).toBe("clearing");
  });

  it("backfills the wreck crate pile when salvage is already complete", async () => {
    db.learningActivityCompletion.findFirst.mockResolvedValue({ id: "done" });
    const camp = await ensureCampForLearner("captain");
    expect(camp.stage).toBe("crates");
    expect(camp.rations).toBe(2);
    expect(camp.scrap).toBe(1);
    expect(db.campState.upsert.mock.calls[0][0].create.appliedGrantIds).toContain(
      WRECK_SALVAGE_GRANT.id
    );
  });

  it("does not rewrite when the wreck grant is already stored", async () => {
    const stored = emptyCamp();
    stored.appliedGrantIds = [WRECK_SALVAGE_GRANT.id];
    stored.stage = "crates";
    stored.rations = 2;
    stored.scrap = 1;
    db.campState.findUnique.mockResolvedValue({
      ...stored,
      crew: stored.crew,
    });
    db.learningActivityCompletion.findFirst.mockResolvedValue({ id: "done" });
    const camp = await ensureCampForLearner("captain");
    expect(camp.stage).toBe("crates");
    expect(db.campState.upsert).not.toHaveBeenCalled();
  });

  it("backfills the tent when a math starting point is already saved", async () => {
    const stored = applyReadyWreck();
    db.campState.findUnique.mockResolvedValue(stored);
    db.learningActivityCompletion.findFirst.mockResolvedValue({ id: "done" });
    db.learnerProfile.findUnique.mockResolvedValue({
      mathPlacementCode: null,
      mathPlacementStatus: "below_catalog",
    });
    const camp = await ensureCampForLearner("captain");
    expect(camp.stage).toBe("tent");
    expect(camp.rations).toBe(3);
    expect(camp.canvas).toBe(1);
    expect(camp.crewFound).toBe(0);
    expect(db.campState.upsert.mock.calls[0][0].update.appliedGrantIds).toContain(
      MATH_CHECK_GRANT.id
    );
  });

  it("applies a named grant without duplicating an existing wreck grant", async () => {
    const stored = applyReadyWreck();
    db.campState.findUnique.mockResolvedValue(stored);
    const camp = await applyCampGrantToLearner("captain", {
      id: "ela-check",
      canvas: 1,
      findCrewId: "mara",
      minStage: "tent",
    });
    expect(camp.stage).toBe("tent");
    expect(camp.canvas).toBe(1);
    expect(camp.crewFound).toBe(1);
    expect(camp.rations).toBe(2);
  });
});

function applyReadyWreck() {
  return {
    stage: "crates",
    rations: 2,
    scrap: 1,
    timber: 0,
    canvas: 0,
    appliedGrantIds: [WRECK_SALVAGE_GRANT.id],
    crew: emptyCamp().crew,
  };
}
