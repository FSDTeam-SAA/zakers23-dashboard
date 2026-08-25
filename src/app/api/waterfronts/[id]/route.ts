import { NextRequest, NextResponse } from "next/server";

type Context = { params: Promise<{ id: string }> };
async function forward(request: NextRequest, context: Context, method: "GET" | "PATCH" | "DELETE") {
  const base = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!base) return NextResponse.json({ success: false, message: "BACKEND_API_URL is not configured" }, { status: 500 });
  const token = request.cookies.get("zakers_admin_session")?.value;
  const response = await fetch(`${base}/waterfronts/${(await context.params).id}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(method === "PATCH" ? { body: await request.text() } : {}),
    cache: "no-store",
  });
  return NextResponse.json(await response.json(), { status: response.status });
}
export const GET = (request: NextRequest, context: Context) => forward(request, context, "GET");
export const PATCH = (request: NextRequest, context: Context) => forward(request, context, "PATCH");
export async function DELETE(request: NextRequest, context: Context) {
  return forward(request, context, "DELETE");
}
