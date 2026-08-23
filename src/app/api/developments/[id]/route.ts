import { NextRequest, NextResponse } from "next/server";

function backendUrl() {
  return process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
}

async function forward(request: NextRequest, method: "GET" | "PATCH" | "DELETE", id: string) {
  const baseUrl = backendUrl();
  if (!baseUrl) return NextResponse.json({ success: false, message: "BACKEND_API_URL is not configured" }, { status: 500 });

  const accessToken = request.cookies.get("zakers_admin_session")?.value;
  const backendResponse = await fetch(`${baseUrl}/developments/${id}`, {
    method,
    headers: { "Content-Type": "application/json", ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
    ...(method === "PATCH" ? { body: await request.text() } : {}),
    cache: "no-store",
  });
  const payload = await backendResponse.json();
  return NextResponse.json(payload, { status: backendResponse.status });
}

type Context = { params: Promise<{ id: string }> };
export async function GET(request: NextRequest, context: Context) { return forward(request, "GET", (await context.params).id); }
export async function PATCH(request: NextRequest, context: Context) { return forward(request, "PATCH", (await context.params).id); }
export async function DELETE(request: NextRequest, context: Context) { return forward(request, "DELETE", (await context.params).id); }
