import { NextResponse } from "next/server";

const SESSION_COOKIE = "zakers_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24;

type LoginRequestBody = {
  email?: unknown;
  password?: unknown;
  remember?: unknown;
};

type BackendLoginResponse = {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    user: {
      _id: string;
      name: string;
      email: string;
      username: string;
      role: "admin";
    };
  };
};

export async function POST(request: Request) {
  const backendApiUrl = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!backendApiUrl) {
    return NextResponse.json(
      { success: false, message: "BACKEND_API_URL is not configured" },
      { status: 500 },
    );
  }

  let body: LoginRequestBody;
  try {
    body = (await request.json()) as LoginRequestBody;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid login request" },
      { status: 400 },
    );
  }

  try {
    const backendResponse = await fetch(`${backendApiUrl}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, password: body.password }),
      cache: "no-store",
    });
    const payload = (await backendResponse.json()) as BackendLoginResponse;

    if (!backendResponse.ok || !payload.success || !payload.data) {
      return NextResponse.json(
        { success: false, message: payload.message || "Unable to sign in" },
        { status: backendResponse.status },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: payload.message,
      data: { user: payload.data.user },
    });

    response.cookies.set({
      name: SESSION_COOKIE,
      value: payload.data.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      ...(body.remember === true ? { maxAge: SESSION_MAX_AGE } : {}),
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "The authentication service is unavailable. Please try again." },
      { status: 503 },
    );
  }
}
