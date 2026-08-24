import { NextRequest, NextResponse } from "next/server";

const base = () => process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

async function forward(r: NextRequest, m: "GET" | "PATCH" | "DELETE" | "PUT", id: string) {
  const url = base();
  const token = r.cookies.get("zakers_admin_session")?.value;
  if (!url) {
    return NextResponse.json({ success: false, message: "BACKEND_API_URL is not configured" }, { status: 500 });
  }

  const response = await fetch(`${url}/articles/${id}`, {
    method: m,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(m === "PATCH" || m === "PUT" ? { body: await r.text() } : {}),
    cache: "no-store",
  });

  return NextResponse.json(await response.json(), { status: response.status });
}

type Context = { params: Promise<{ id: string }> };

export async function GET(r: NextRequest, c: Context) { return forward(r, "GET", (await c.params).id); }
export async function PATCH(r: NextRequest, c: Context) { return forward(r, "PATCH", (await c.params).id); }
export async function PUT(r: NextRequest, c: Context) { return forward(r, "PUT", (await c.params).id); }
export async function DELETE(r: NextRequest, c: Context) { return forward(r, "DELETE", (await c.params).id); }
