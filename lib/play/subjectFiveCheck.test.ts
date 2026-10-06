import { describe, expect, it } from "vitest";
import { checkDomain, scoreSubjectCheck, subjectCheckItems, type CheckDomain } from "./subjectFiveCheck";
import { isTonightSliceCode } from "../curriculum/tonightSlice";

describe("fresh subject starter samples", () => {
  for (const domain of ["ela", "science", "social_studies"] as CheckDomain[]) {
    it(`${domain}: five distinct questions, verified codes, varied answer positions`, () => {
      const items = subjectCheckItems(domain);
      expect(new Set(items.map((item) => item.prompt)).size).toBe(5);
      expect(new Set(items.map((item) => item.correctIndex)).size).toBe(3);
      expect(items.every((item) => isTonightSliceCode(item.standardCode))).toBe(true);
      const answers = items.map((item) => ({ itemId: item.id, choiceIndex: item.correctIndex }));
      const result = scoreSubjectCheck(domain, answers);
      expect(result.done).toBe(true); expect(result.evidence).toHaveLength(5);
      expect(result.evidence.every((row) => row.correct)).toBe(true);
      expect(result.childLine).not.toMatch(/mastered|solid|grade 7/i);
    });
    it(`${domain}: two distinct floor misses offer support without inventing a lower code`, () => {
      const first = subjectCheckItems(domain)[0];
      const answers = [{ itemId: first.id, choiceIndex: (first.correctIndex + 1) % 3 }];
      const retry = scoreSubjectCheck(domain, answers).item!;
      expect(retry.prompt).not.toBe(first.prompt);
      const stopped = [0, 1, 2].map((index) => scoreSubjectCheck(domain, [...answers, { itemId: retry.id, choiceIndex: index }])).find((result) => result.done)!;
      expect(stopped.status).toBe("needs_support"); expect(stopped.asked).toBe(2);
      expect(JSON.stringify(stopped)).not.toMatch(/(?:ELA|SC|SS)\.2\./);
    });
  }
  it("rejects malformed and out-of-order submissions", () => {
    expect(() => scoreSubjectCheck("ela", [{ itemId: "ela-details", choiceIndex: 0 }])).toThrow();
    expect(() => scoreSubjectCheck("science", [null as never])).toThrow();
    expect(() => scoreSubjectCheck("science", [{ itemId: subjectCheckItems("science")[0].id, choiceIndex: 1.5 }])).toThrow();
    expect(checkDomain("art")).toBeNull(); expect(checkDomain("science_g7")).toBeNull();
  });
});
