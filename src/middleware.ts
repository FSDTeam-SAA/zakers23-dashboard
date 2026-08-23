import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "zakers_admin_session";

function redirectToLogin(request: NextRequest, clearSession = false) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);

  const response = NextResponse.redirect(loginUrl);
  if (clearSession) response.cookies.delete(SESSION_COOKIE);

  return response;
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(SESSION_COOKIE)?.value;
  if (!accessToken) return redirectToLogin(request);

  const backendApiUrl = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!backendApiUrl) return redirectToLogin(request, true);

  try {
    const verificationResponse = await fetch(`${backendApiUrl}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!verificationResponse.ok) return redirectToLogin(request, true);

    const payload = (await verificationResponse.json()) as { data?: { role?: string } };
    if (payload.data?.role !== "admin") return redirectToLogin(request, true);
  } catch {
    return redirectToLogin(request, true);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|login|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
