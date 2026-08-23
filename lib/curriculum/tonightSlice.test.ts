import { describe, expect, it } from "vitest";
import { filterTonightSliceCodes, isTonightSliceCode } from "./tonightSlice";

describe("§4.6 tonight slice", () => {
  it("keeps the wreck-quiz math code and drops invented ones", () => {
    expect(isTonightSliceCode("MA.3.NSO.1.1")).toBe(true);
    expect(filterTonightSliceCodes(["MA.3.NSO.1.1", "FAKE.9.9.9", "ELA.3.C.1.4"])).toEqual([
      "MA.3.NSO.1.1",
      "ELA.3.C.1.4",
    ]);
  });
});
