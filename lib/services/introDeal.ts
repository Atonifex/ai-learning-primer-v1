import { prisma } from "../db/prisma";
import { advanceIntroDeal, parseIntroDeal, type IntroEvent } from "../play/introDeal";
export const introDealMemoryId = (learnerId: string) => `${learnerId}:intro:v3`;
export async function getIntroDeal(learnerId: string) {
  const item = await prisma.memoryItem.findUnique({ where: { id: introDealMemoryId(learnerId) } });
  try { return parseIntroDeal(item ? JSON.parse(item.content) : null); }
  catch { return parseIntroDeal(null); }
}
export async function saveIntroDealEvent(learnerId: string, event: IntroEvent) {
  return prisma.$transaction(async (tx) => {
    const id = introDealMemoryId(learnerId);
    const item = await tx.memoryItem.findUnique({ where: { id } });
    let previous;
    try { previous = parseIntroDeal(item ? JSON.parse(item.content) : null); }
    catch { previous = parseIntroDeal(null); }
    const next = advanceIntroDeal(previous, event);
    const content = JSON.stringify({ ...next, story: next.acceptedShare === null ? "The captain is making a deal for the island trip." : `The captain's agreed share is ${next.acceptedShare}% of mission profit: money left after costs. The company lets the captain build a base and lead a crew.` });
    await tx.memoryItem.upsert({ where: { id }, create: { id, learnerProfileId: learnerId, type: "STORY_CONTINUITY", content }, update: { content } });
    return next;
  }, { isolationLevel: "Serializable" });
}
