import { prisma } from "../db/prisma";
import { signToken, type JWTPayload } from "./jwt";
import type { UserRole } from "@prisma/client";

type TokenUser = {
  id: string;
  email: string | null;
  role: UserRole;
  householdId: string | null;
  learnerProfile: { id: string } | null;
};

export async function tokenForUser(user: TokenUser): Promise<string> {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email ?? "",
    role: user.role,
    householdId: user.householdId ?? "",
    learnerId: user.learnerProfile?.id,
  };
  return signToken(payload);
}

export async function loadTokenUser(userId: string): Promise<TokenUser | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      householdId: true,
      learnerProfile: { select: { id: true } },
    },
  });
}
