import { describe, expect, it } from "vitest";
import { isClientAiDebug } from "./clientAiDebug";

describe("isClientAiDebug", () => {
  it("is off unless NEXT_PUBLIC_PRIMER_AI_DEBUG is truthy", () => {
    const prev = process.env.NEXT_PUBLIC_PRIMER_AI_DEBUG;
    delete process.env.NEXT_PUBLIC_PRIMER_AI_DEBUG;
    expect(isClientAiDebug()).toBe(false);
    process.env.NEXT_PUBLIC_PRIMER_AI_DEBUG = "0";
    expect(isClientAiDebug()).toBe(false);
    process.env.NEXT_PUBLIC_PRIMER_AI_DEBUG = "1";
    expect(isClientAiDebug()).toBe(true);
    process.env.NEXT_PUBLIC_PRIMER_AI_DEBUG = "true";
    expect(isClientAiDebug()).toBe(true);
    if (prev === undefined) delete process.env.NEXT_PUBLIC_PRIMER_AI_DEBUG;
    else process.env.NEXT_PUBLIC_PRIMER_AI_DEBUG = prev;
  });
});
