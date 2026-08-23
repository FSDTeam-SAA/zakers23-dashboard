import { NextRequest, NextResponse } from "next/server";

function backendUrl() {
  return process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
}

async function forward(request: NextRequest, method: "GET" | "POST") {
  const baseUrl = backendUrl();
  if (!baseUrl) return NextResponse.json({ success: false, message: "BACKEND_API_URL is not configured" }, { status: 500 });

  const accessToken = request.cookies.get("zakers_admin_session")?.value;
  const target = `${baseUrl}/developments${request.nextUrl.search}`;
  const backendResponse = await fetch(target, {
    method,
    headers: { "Content-Type": "application/json", ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
    ...(method === "POST" ? { body: await request.text() } : {}),
    cache: "no-store",
  });
  const payload = await backendResponse.json();
  return NextResponse.json(payload, { status: backendResponse.status });
}

export async function GET(request: NextRequest) { return forward(request, "GET"); }
export async function POST(request: NextRequest) { return forward(request, "POST"); }
