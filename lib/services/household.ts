import bcrypt from "bcryptjs";
import { prisma } from "../db/prisma";
import {
  DEFAULT_GRADE_BAND,
  parseLearnerGradeBand,
  type LearnerGradeBand,
} from "../constants/grades";
import { normalizeUsername, parsePin } from "../auth/credentials";
import { createProfile } from "./profile";

export const COPPA_CONSENT_VERSION = "2026-08-23";

export class UsernameTakenError extends Error {
  constructor() {
    super("That captain login is already taken");
    this.name = "UsernameTakenError";
  }
}

export class HouseholdNotFoundError extends Error {
  constructor() {
    super("Household not found");
    this.name = "HouseholdNotFoundError";
  }
}

export async function createParentWithHousehold(input: {
  email: string;
  passwordHash: string;
  coppaConsent: boolean;
}) {
  const email = input.email.trim().toLowerCase();
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: input.passwordHash,
      role: "PARENT",
    },
  });
  const household = await prisma.household.create({
    data: {
      parentUserId: user.id,
      coppaConsentAt: input.coppaConsent ? new Date() : null,
      coppaConsentVersion: input.coppaConsent ? COPPA_CONSENT_VERSION : null,
    },
  });
  const parent = await prisma.user.update({
    where: { id: user.id },
    data: { householdId: household.id },
    include: { learnerProfile: { select: { id: true } } },
  });
  return { parent, household };
}

export async function recordCoppaConsent(householdId: string): Promise<void> {
  await prisma.household.update({
    where: { id: householdId },
    data: {
      coppaConsentAt: new Date(),
      coppaConsentVersion: COPPA_CONSENT_VERSION,
    },
  });
}

export async function ensureParentHousehold(parentUserId: string) {
  const existing = await prisma.household.findUnique({
    where: { parentUserId },
  });
  if (existing) {
    await prisma.user.update({
      where: { id: parentUserId },
      data: { householdId: existing.id, role: "PARENT" },
    });
    return existing;
  }
  const household = await prisma.household.create({
    data: { parentUserId },
  });
  await prisma.user.update({
    where: { id: parentUserId },
    data: { householdId: household.id, role: "PARENT" },
  });
  return household;
}

export type HouseholdCaptain = {
  userId: string;
  learnerId: string;
  username: string | null;
  displayName: string | null;
  gradeBand: string;
  firstRunStep: string;
};

export async function listHouseholdCaptains(
  parentUserId: string
): Promise<HouseholdCaptain[]> {
  const household = await prisma.household.findUnique({
    where: { parentUserId },
    include: {
      learnerProfiles: {
        include: { user: { select: { id: true, username: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!household) return [];
  return household.learnerProfiles
    .filter((p) => p.user.role === "CHILD")
    .map((p) => ({
      userId: p.user.id,
      learnerId: p.id,
      username: p.user.username,
      displayName: p.displayName,
      gradeBand: p.gradeBand,
      firstRunStep: p.firstRunStep,
    }));
}

export async function addCaptain(input: {
  parentUserId: string;
  username: string;
  pin: string;
  gradeBand?: string | null;
  displayName?: string | null;
}) {
  const username = normalizeUsername(input.username);
  const pin = parsePin(input.pin);
  if (!username) throw new Error("Invalid captain login");
  if (!pin) throw new Error("PIN must be 4 digits");

  const household = await ensureParentHousehold(input.parentUserId);
  const taken = await prisma.user.findUnique({ where: { username } });
  if (taken) throw new UsernameTakenError();

  const gradeBand: LearnerGradeBand = parseLearnerGradeBand(
    input.gradeBand,
    DEFAULT_GRADE_BAND
  );
  const pinHash = await bcrypt.hash(pin, 12);

  const child = await prisma.user.create({
    data: {
      username,
      passwordHash: pinHash,
      role: "CHILD",
      householdId: household.id,
    },
  });

  const profile = await createProfile(child.id, {
    displayName: input.displayName,
    gradeBand,
    firstRunStep: "video",
  });

  return { child, profile };
}

/** Move a LearnerProfile that still sits on the parent User onto a child login. */
export async function claimFusedCaptain(input: {
  parentUserId: string;
  username: string;
  pin: string;
}) {
  const username = normalizeUsername(input.username);
  const pin = parsePin(input.pin);
  if (!username) throw new Error("Invalid captain login");
  if (!pin) throw new Error("PIN must be 4 digits");

  const fused = await prisma.learnerProfile.findUnique({
    where: { userId: input.parentUserId },
  });
  if (!fused) throw new Error("No captain profile on this parent account");

  const taken = await prisma.user.findUnique({ where: { username } });
  if (taken) throw new UsernameTakenError();

  const household = await ensureParentHousehold(input.parentUserId);
  const pinHash = await bcrypt.hash(pin, 12);

  const child = await prisma.user.create({
    data: {
      username,
      passwordHash: pinHash,
      role: "CHILD",
      householdId: household.id,
    },
  });

  await prisma.learnerProfile.update({
    where: { id: fused.id },
    data: { userId: child.id, householdId: household.id },
  });

  return { childUserId: child.id, learnerId: fused.id, username };
}

export async function resetCaptainPin(input: {
  parentUserId: string;
  childUserId: string;
  pin: string;
}) {
  const pin = parsePin(input.pin);
  if (!pin) throw new Error("PIN must be 4 digits");
  const household = await prisma.household.findUnique({
    where: { parentUserId: input.parentUserId },
  });
  if (!household) throw new HouseholdNotFoundError();
  const child = await prisma.user.findFirst({
    where: {
      id: input.childUserId,
      role: "CHILD",
      householdId: household.id,
    },
  });
  if (!child) throw new Error("Captain not found in this household");
  await prisma.user.update({
    where: { id: child.id },
    data: { passwordHash: await bcrypt.hash(pin, 12) },
  });
}
