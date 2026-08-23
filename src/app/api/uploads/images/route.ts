import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const backendApiUrl = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  const accessToken = request.cookies.get("zakers_admin_session")?.value;
  if (!backendApiUrl) return NextResponse.json({ success: false, message: "BACKEND_API_URL is not configured" }, { status: 500 });
  if (!accessToken) return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });

  const formData = await request.formData();
  const backendResponse = await fetch(`${backendApiUrl}/uploads/images`, { method: "POST", headers: { Authorization: `Bearer ${accessToken}` }, body: formData, cache: "no-store" });
  const payload = await backendResponse.json();
  return NextResponse.json(payload, { status: backendResponse.status });
}
