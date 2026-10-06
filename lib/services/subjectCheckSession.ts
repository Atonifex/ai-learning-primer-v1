import { prisma } from "../db/prisma";
import { checkDomain, scoreSubjectCheck, type CheckAnswer, type CheckDomain } from "../play/subjectFiveCheck";
import { recordStandardObservation } from "./standardsProgress";

export const subjectCheckMemoryPrefix = (profileId: string) => `${profileId}:subject-check:v1:`;
const memoryId = (profileId: string, domain: CheckDomain) => `${subjectCheckMemoryPrefix(profileId)}${domain}`;
export async function subjectCheckGuidance(profileId: string, slug: string) {
  const domain = checkDomain(slug);
  if (!domain) return "";
  const row = await prisma.memoryItem.findUnique({ where: { id: memoryId(profileId, domain) } });
  if (!row) return "";
  const scored = scoreSubjectCheck(domain, readAnswers(row.content));
  return `SAVED SUBJECT STARTER (Grade 3 sample, not independent mastery or a school-grade placement): ${domain}; ${scored.asked} fresh questions answered; ${scored.childLine ?? "The captain can resume the saved check in Focus."} ${scored.focusCode ? `Practice focus: ${scored.focusCode}.` : ""} If the captain returns to discuss it, give one brief example and one supported next step for that skill. Never repeat an entire check in chat or invent a camp reward.`;
}
function readAnswers(content?: string): CheckAnswer[] {
  if (!content) return [];
  const parsed = JSON.parse(content);
  if (!Array.isArray(parsed.answers)) throw new Error("This saved check could not be read.");
  return parsed.answers;
}

export async function loadSubjectCheck(profileId: string, domain: CheckDomain) {
  const saved = await prisma.memoryItem.findUnique({ where: { id: memoryId(profileId, domain) } });
  const answers = readAnswers(saved?.content);
  if (saved?.sourceSessionId) await flushEvidence(profileId, domain, saved.sourceSessionId, saved.createdAt.getTime(), scoreSubjectCheck(domain, answers));
  return { ...scoreSubjectCheck(domain, answers), answers, catalog: `${domain}_g3`, saved: Boolean(saved) };
}

export async function saveSubjectCheck(input: { profileId: string; sessionId: string; domain: CheckDomain; answers: CheckAnswer[] }) {
  const scored = scoreSubjectCheck(input.domain, input.answers);
  const id = memoryId(input.profileId, input.domain);
  const saved = await prisma.$transaction(async (tx) => {
    const previous = await tx.memoryItem.findUnique({ where: { id } });
    const answers = readAnswers(previous?.content);
    if (input.answers.length < answers.length || input.answers.length > answers.length + 1 || answers.some((answer, index) => answer.itemId !== input.answers[index]?.itemId || answer.choiceIndex !== input.answers[index]?.choiceIndex)) {
      throw new Error("This check changed in another window. Close and reopen it to continue.");
    }
    return tx.memoryItem.upsert({ where: { id }, create: { id, learnerProfileId: input.profileId, type: "PREFERENCE", sourceSessionId: input.sessionId, content: JSON.stringify({ answers: input.answers }) }, update: { content: JSON.stringify({ answers: input.answers }) } });
  }, { isolationLevel: "Serializable" });
  await flushEvidence(input.profileId, input.domain, saved.sourceSessionId ?? input.sessionId, saved.createdAt.getTime(), scored);
  return { ...scored, answers: input.answers, catalog: `${input.domain}_g3`, saved: true };
}

async function flushEvidence(profileId: string, domain: CheckDomain, sessionId: string, attempt: number, scored: ReturnType<typeof scoreSubjectCheck>) {
  // Reconcile a partially interrupted save with stable keys. A reload cannot award another observation.
  const id = memoryId(profileId, domain);
  for (const row of scored.evidence) {
    await recordStandardObservation({ sessionId, standardCode: row.code, evidenceTier: "GUIDED", sourceType: "ASSESSMENT", correctness: row.correct ? 1 : 0, catalogSubjectSlug: `${domain}_g3`, sourceId: row.itemId, notes: `subject-check:${domain}:${row.itemId}`, idempotencyKey: `${id}:${attempt}:${row.itemId}` });
  }
}
