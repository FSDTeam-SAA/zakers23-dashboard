import { NextRequest, NextResponse } from "next/server";

const base = () => process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

async function forward(r: NextRequest, m: "GET" | "POST") {
  const url = base();
  const token = r.cookies.get("zakers_admin_session")?.value;
  if (!url) {
    return NextResponse.json({ success: false, message: "BACKEND_API_URL is not configured" }, { status: 500 });
  }

  const response = await fetch(`${url}/articles${r.nextUrl.search}`, {
    method: m,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(m === "POST" ? { body: await r.text() } : {}),
    cache: "no-store",
  });

  return NextResponse.json(await response.json(), { status: response.status });
}

export const GET = (r: NextRequest) => forward(r, "GET");
export const POST = (r: NextRequest) => forward(r, "POST");
