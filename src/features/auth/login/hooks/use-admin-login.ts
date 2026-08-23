"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginAdmin } from "../api/auth.api";
import type { AdminLoginFormValues } from "../types/auth.types";

function getLoginErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "We could not sign you in. Please check your connection and try again.";
}

export function useAdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async ({ email, password, remember }: AdminLoginFormValues) => {
    setError("");
    setIsSubmitting(true);

    try {
      await loginAdmin({ email: email.trim(), password, remember });
      router.replace("/");
    } catch (loginError) {
      setError(getLoginErrorMessage(loginError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { error, isSubmitting, login };
}
