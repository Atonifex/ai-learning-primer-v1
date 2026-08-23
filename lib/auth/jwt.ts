import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production"
);

export type AuthRole = "PARENT" | "CHILD";

export interface JWTPayload {
  userId: string;
  email: string;
  role: AuthRole;
  householdId: string;
  learnerId?: string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const userId = typeof payload.userId === "string" ? payload.userId : null;
    if (!userId) return null;
    const email = typeof payload.email === "string" ? payload.email : "";
    const role: AuthRole = payload.role === "CHILD" ? "CHILD" : "PARENT";
    const householdId =
      typeof payload.householdId === "string" ? payload.householdId : "";
    const learnerId =
      typeof payload.learnerId === "string" ? payload.learnerId : undefined;
    return { userId, email, role, householdId, learnerId };
  } catch {
    return null;
  }
}
