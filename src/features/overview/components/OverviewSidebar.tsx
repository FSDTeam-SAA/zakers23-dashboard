"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
const nav: [
  string,
  "grid" | "chart" | "users" | "document" | "settings" | "activity",
  string,
][] = [
  ["Dashboard", "grid", "/"],
  ["Developments", "document", "/developments"],
  ["Neighborhoods", "users", "/neighborhoods"],
  ["Waterfront Properties", "activity", "/waterfront-properties"],
  ["Insights", "chart", "/insights"],
  ["Inquiries", "document", "/inquiries"],
  ["Settings", "settings", "/settings"],
];
export function OverviewSidebar({ active = "Dashboard" }: { active?: string }) {
  const router = useRouter();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [admin, setAdmin] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    fetch("/api/settings/profile")
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => setAdmin(payload?.data ?? null))
      .catch(() => setAdmin(null));
  }, []);

  useEffect(() => {
    if (!isLogoutOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsLogoutOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isLogoutOpen]);

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  };

  return (
    <>
      <aside className="dashboard-sidebar hidden h-dvh w-[300px] shrink-0 flex-col justify-between overflow-y-auto bg-cream px-6 pb-6 pt-3 lg:sticky lg:top-0 lg:flex">
        <div className="space-y-14">
          <Image
            className="dashboard-brand mx-auto"
            src="/figma/image-2.png"
            alt="The Miami Condo Source"
            width={150}
            height={150}
          />
          <nav className="space-y-6">
            {nav.map(([label, icon, href]) => (
              <Link
                href={href}
                key={label}
                className={`dashboard-nav-link flex h-12 items-center gap-2 rounded-lg px-3 font-inter font-semibold ${active === label ? "dashboard-nav-link--active bg-gold text-white" : "text-ink hover:bg-[#eee9df]"}`}
              >
                <Icon name={icon} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[#25333d] text-sm font-bold text-white" aria-hidden="true">{admin?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "AD"}</div>
            <div className="min-w-0">
              <p className="truncate font-inter font-bold">{admin?.name || "Administrator"}</p>
              <p className="text-xs capitalize text-gold">{admin?.role || "admin"}</p>
            </div>
          </div>
          <button type="button" onClick={() => setIsLogoutOpen(true)} className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-danger font-inter font-semibold text-danger transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger">
            <span aria-hidden="true">↪</span>Log out
          </button>
        </div>
      </aside>

      {isLogoutOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-5" role="dialog" aria-modal="true" aria-labelledby="logout-title" aria-describedby="logout-description">
          <button type="button" aria-label="Close logout confirmation" onClick={() => setIsLogoutOpen(false)} className="absolute inset-0 bg-[#0d1b34]/55 backdrop-blur-[2px]" />
          <section className="relative w-full max-w-md border border-line bg-white p-6 shadow-[0_24px_70px_rgba(13,27,52,0.24)] sm:p-8">
            <span className="grid size-12 place-items-center rounded-full bg-red-50 text-danger"><span className="text-xl" aria-hidden="true">↪</span></span>
            <h2 id="logout-title" className="mt-5 font-inter text-2xl font-semibold text-ink">Log out of your account?</h2>
            <p id="logout-description" className="mt-3 leading-6 text-muted">You will be returned to the administrator sign-in page. You can sign in again anytime.</p>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" autoFocus onClick={() => setIsLogoutOpen(false)} className="h-11 rounded border border-line px-5 font-inter font-semibold text-ink transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">Cancel</button>
              <button type="button" onClick={confirmLogout} disabled={isLoggingOut} className="flex h-11 items-center justify-center rounded bg-danger px-5 font-inter font-semibold text-white transition-colors hover:bg-[#c92f2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70">{isLoggingOut ? "Logging out…" : "Yes, log out"}</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
