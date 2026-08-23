"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { useAdminLogin } from "../hooks/use-admin-login";

export function LoginForm() {
  const { error, isSubmitting, login } = useAdminLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim();
    const nextEmailError = !normalizedEmail
      ? "Enter your email address."
      : !/^\S+@\S+\.\S+$/.test(normalizedEmail)
        ? "Enter a valid email address."
        : "";
    const nextPasswordError = password ? "" : "Enter your password.";

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) return;

    await login({ email: normalizedEmail, password, remember });
  };

  return (
    <main className="login-screen grid min-h-dvh bg-[#faf8f5] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="login-panel relative hidden overflow-hidden bg-[#0d1b34] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(201,162,39,0.28),_transparent_40%)]" />
        <div className="login-copy relative">
          <span className="inline-flex border border-white/25 px-3 py-1.5 font-inter text-xs font-semibold uppercase tracking-[0.18em] text-[#e9cf78]">
            Admin Portal
          </span>
          <h1 className="mt-8 max-w-xl font-display text-6xl font-bold leading-[0.96]">
            The details behind exceptional living.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-white/70">
            Manage your property portfolio, local intelligence and client inquiries from one refined workspace.
          </p>
        </div>
      </section>

      <section className="flex min-h-dvh items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[430px]">
          <Image
            src="/figma/image-2.png"
            alt="The Miami Condo Source"
            width={134}
            height={134}
            className="login-logo mx-auto mb-9 h-[134px] w-[134px] object-contain"
            priority
          />
          <div className="login-card border border-line bg-white p-6 shadow-[0_18px_45px_rgba(13,27,52,0.08)] sm:p-9">
            <p className="font-inter text-sm font-semibold uppercase tracking-[0.16em] text-gold">Welcome back</p>
            <h1 className="mt-3 font-inter text-3xl font-semibold text-ink">Admin sign in</h1>
            <p className="mt-3 text-base leading-6 text-muted">Use your administrator credentials to access the dashboard.</p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="email" className="mb-2 block font-inter text-sm font-semibold text-ink">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (emailError) setEmailError("");
                  }}
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? "email-error" : undefined}
                  placeholder="admin@example.com"
                  className="login-input h-12 w-full rounded border border-line px-4 text-base outline-none placeholder:text-[#9b9b9b] focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
                {emailError && <p id="email-error" className="mt-2 text-sm text-danger">{emailError}</p>}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label htmlFor="password" className="font-inter text-sm font-semibold text-ink">Password</label>
                  <button
                    type="button"
                    className="min-h-11 px-1 text-sm font-semibold text-gold transition-colors hover:text-[#a77f12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={passwordError ? "password-error" : undefined}
                  placeholder="Enter your password"
                  className="login-input h-12 w-full rounded border border-line px-4 text-base outline-none placeholder:text-[#9b9b9b] focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
                {passwordError && <p id="password-error" className="mt-2 text-sm text-danger">{passwordError}</p>}
              </div>

              <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  name="remember"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="size-4 accent-[#c9a227]"
                />
                Remember me on this device
              </label>

              {error && (
                <p role="alert" className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-danger">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="login-submit flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded bg-gold font-inter font-semibold text-white transition-colors hover:bg-[#ad8b1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <><span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> Signing in…</>
                ) : (
                  <>Sign in to dashboard <Icon name="arrow" size={17} /></>
                )}
              </button>
            </form>
          </div>
          <p className="login-legal mt-6 text-center text-sm leading-6 text-muted">
            This is a protected administration area. Unauthorized access is prohibited.
          </p>
        </div>
      </section>
    </main>
  );
}
