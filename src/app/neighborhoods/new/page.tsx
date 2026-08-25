"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { OverviewHeader } from "@/features/overview/components/OverviewHeader";
import { OverviewSidebar } from "@/features/overview/components/OverviewSidebar";
import { useCreateNeighborhood } from "@/features/neighborhoods/hooks/use-neighborhoods";
import type { NeighborhoodPayload } from "@/features/neighborhoods/types/neighborhood.types";

const input =
  "mt-2 h-12 w-full rounded border border-line bg-white px-4 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";
const area =
  "mt-2 min-h-36 w-full resize-y rounded border border-line bg-white p-4 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

export default function AddNeighborhood() {
  const create = useCreateNeighborhood();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    subTitle: "",
    activeProjects: "",
    priceRange: "",
    averagePricePerSqft: "",
    location: "",
    deliveryWindow: "",
    description: "",
    isFeatured: false,
  });
  const set = (key: Exclude<keyof typeof form, "isFeatured">, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const slugBase = form.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const payload: NeighborhoodPayload = {
      name: form.title,
      slug: `${slugBase}-${Date.now()}`,
      title: form.title,
      subTitle: form.subTitle,
      activeProjects: Number(form.activeProjects),
      priceRange: form.priceRange,
      averagePricePerSqft: form.averagePricePerSqft,
      deliveryWindow: form.deliveryWindow,
      description: form.description,
      location: { city: form.location },
      isFeatured: form.isFeatured,
    };
    try {
      await create.mutateAsync(payload);
      router.push("/neighborhoods");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not publish neighborhood",
      );
    }
  }

  return (
    <div className="min-h-dvh bg-canvas text-ink lg:flex">
      <OverviewSidebar active="Neighborhoods" />
      <div className="min-w-0 flex-1">
        <OverviewHeader
          title="Add Neighborhood"
          description="Create a neighborhood market profile for the public website."
        />
        <main className="mx-auto max-w-[1100px] p-5 sm:p-8">
          <form
            onSubmit={submit}
            className="overflow-hidden rounded-lg border border-line bg-white shadow-sm"
          >
            <section className="border-b border-line bg-[#0d1b34] px-6 py-8 text-white sm:px-9">
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#e6c75f]">
                Neighborhood profile
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold">
                Add neighborhood details
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                Enter the headline, market snapshot, location and description
                shown on the neighborhood page.
              </p>
            </section>
            <section className="px-6 py-8 sm:px-9">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Title" hint="Example: Bal Harbour">
                  <input
                    required
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    className={input}
                    placeholder="Bal Harbour"
                  />
                </Field>
                <Field label="Subtitle" hint="Short supporting headline">
                  <input
                    required
                    value={form.subTitle}
                    onChange={(e) => set("subTitle", e.target.value)}
                    className={input}
                    placeholder="Oceanfront living at its most refined"
                  />
                </Field>
                <Field label="Active projects">
                  <input
                    required
                    min="0"
                    step="1"
                    type="number"
                    value={form.activeProjects}
                    onChange={(e) => set("activeProjects", e.target.value)}
                    className={input}
                    placeholder="6"
                  />
                </Field>
                <Field label="Price range">
                  <input
                    required
                    value={form.priceRange}
                    onChange={(e) => set("priceRange", e.target.value)}
                    className={input}
                    placeholder="$2.5M – $35M+"
                  />
                </Field>
                <Field label="Avg $/sf">
                  <input
                    required
                    value={form.averagePricePerSqft}
                    onChange={(e) => set("averagePricePerSqft", e.target.value)}
                    className={input}
                    placeholder="$2,150/sf"
                  />
                </Field>
                <Field label="Location">
                  <input
                    required
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    className={input}
                    placeholder="Bal Harbour, Miami-Dade County"
                  />
                </Field>
                <Field label="Delivery window" className="md:col-span-2">
                  <input
                    required
                    value={form.deliveryWindow}
                    onChange={(e) => set("deliveryWindow", e.target.value)}
                    className={input}
                    placeholder="2026 – 2028"
                  />
                </Field>
                <Field
                  label="Description"
                  hint="Describe the neighborhood, lifestyle and real-estate market."
                  className="md:col-span-2"
                >
                  <textarea
                    required
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    className={area}
                    placeholder="Known for pristine beaches, luxury residences and world-class shopping…"
                  />
                </Field>
                <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded border border-line bg-[#fffdf8] px-4 text-sm font-semibold md:col-span-2"><input type="checkbox" checked={form.isFeatured} onChange={(e)=>setForm((current)=>({...current,isFeatured:e.target.checked}))} className="size-4 accent-gold"/><span>Feature this neighborhood on the dashboard and website</span></label>
              </div>
            </section>
            <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-[#fffdf8] px-6 py-5 sm:px-9">
              <p role="status" className="text-sm text-danger">
                {message}
              </p>
              <div className="ml-auto flex gap-3">
                <Link
                  href="/neighborhoods"
                  className="min-h-11 rounded border border-gold px-6 py-3 text-sm font-semibold text-gold"
                >
                  Cancel
                </Link>
                <button
                  disabled={create.isPending}
                  className="min-h-11 rounded bg-gold px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {create.isPending ? "Publishing…" : "Publish Neighborhood"}
                </button>
              </div>
            </footer>
          </form>
        </main>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block text-sm font-semibold ${className}`}>
      {label}
      {hint && (
        <span className="ml-2 text-xs font-normal text-muted">{hint}</span>
      )}
      {children}
    </label>
  );
}
