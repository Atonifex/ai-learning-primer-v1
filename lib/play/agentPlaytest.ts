/**
 * Local agent playtest helpers — skip login / first-run for Cursor, Grok, etc.
 * Never enable on public production hosts.
 */

export function isAgentPlaytestEnabled(
  hostHeader?: string | null,
  env: { nodeEnv?: string; agentFlag?: string | null } = {}
): boolean {
  const nodeEnv = env.nodeEnv ?? process.env.NODE_ENV;
  const agentFlag = env.agentFlag ?? process.env.PRIMER_AGENT_PLAYTEST;
  if (nodeEnv === "development") return true;
  if (agentFlag !== "1") return false;
  const host = (hostHeader ?? "").split(":")[0]?.toLowerCase() ?? "";
  return host === "localhost" || host === "127.0.0.1";
}

export type AgentPlayOpen = "dialogue" | "board" | "none";

export function buildAgentLearnUrl(
  sessionId: string,
  open: AgentPlayOpen = "dialogue"
): string {
  const base = `/learn/${sessionId}`;
  if (open === "dialogue") return `${base}?dialogue=1`;
  if (open === "board") return `${base}?board=1`;
  return base;
}
