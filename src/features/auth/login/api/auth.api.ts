import type {
  AdminLoginFormValues,
  AdminLoginResponse,
} from "../types/auth.types";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function loginAdmin(credentials: AdminLoginFormValues) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const payload = (await response.json()) as ApiResponse<AdminLoginResponse>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "We could not sign you in. Please try again.");
  }

  return payload.data;
}
