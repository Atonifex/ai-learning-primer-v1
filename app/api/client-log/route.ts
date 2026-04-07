import { NextRequest } from "next/server";

/**
 * Development-only endpoint for logging client-side events to the terminal.
 * Fire-and-forget from client code via: clientLog("message", { ...data })
 */
export async function POST(req: NextRequest) {
  const { message, data } = await req.json();
  if (data && Object.keys(data).length > 0) {
    console.log(`[Client] ${message}`, data);
  } else {
    console.log(`[Client] ${message}`);
  }
  return new Response(null, { status: 204 });
}
