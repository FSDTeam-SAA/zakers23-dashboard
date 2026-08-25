"use client";

import Link from "next/link";
import { FormEvent, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OverviewHeader } from "@/features/overview/components/OverviewHeader";
import { OverviewSidebar } from "@/features/overview/components/OverviewSidebar";
import {
  useNeighborhood,
  useUpdateNeighborhood,
} from "@/features/neighborhoods/hooks/use-neighborhoods";

const input =
    "mt-2 h-12 w-full rounded border border-line bg-white px-4 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20",
  area =
    "mt-2 min-h-36 w-full resize-y rounded border border-line bg-white p-4 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";
type Form = {
  title: string;
  subTitle: string;
  activeProjects: string;
  priceRange: string;
  averagePricePerSqft: string;
  location: string;
  deliveryWindow: string;
  description: string;
  isFeatured: boolean;
};

export default function EditNeighborhood({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params),
    { data, isLoading, error } = useNeighborhood(id),
    update = useUpdateNeighborhood(),
    router = useRouter();
  const [message, setMessage] = useState(""),
    [form, setForm] = useState<Form>({
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
  useEffect(() => {
    if (data)
      setForm({
        title: data.title || data.name,
        subTitle: data.subTitle || "",
        activeProjects: String(data.activeProjects || 0),
        priceRange: data.priceRange || "",
        averagePricePerSqft: data.averagePricePerSqft || "",
        location: data.location.city || "",
        deliveryWindow: data.deliveryWindow || "",
        description: data.description || data.fullDescription || "",
        isFeatured: Boolean(data.isFeatured),
      });
  }, [data]);
  const set = (key: Exclude<keyof Form, "isFeatured">, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    try {
      await update.mutateAsync({
        id,
        payload: {
          name: form.title,
          title: form.title,
          subTitle: form.subTitle,
          activeProjects: Number(form.activeProjects),
          priceRange: form.priceRange,
          averagePricePerSqft: form.averagePricePerSqft,
          deliveryWindow: form.deliveryWindow,
          description: form.description,
          location: { city: form.location },
          isFeatured: form.isFeatured,
        },
      });
      router.push("/neighborhoods");
      router.refresh();
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : "Could not update neighborhood",
      );
    }
  }
  return (
    <div className="min-h-dvh bg-canvas lg:flex">
      <OverviewSidebar active="Neighborhoods" />
      <div className="min-w-0 flex-1">
        <OverviewHeader
          title="Edit Neighborhood"
          description="Update the neighborhood market profile."
        />
        <main className="mx-auto max-w-[1100px] p-5 sm:p-8">
          {isLoading ? (
            <p className="text-muted">Loading neighborhood…</p>
          ) : error ? (
            <p className="text-danger">{error.message}</p>
          ) : (
            <form
              onSubmit={submit}
              className="overflow-hidden rounded-lg border border-line bg-white"
            >
              <section className="bg-[#0d1b34] px-7 py-8 text-white">
                <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#e6c75f]">
                  Edit profile
                </p>
                <h2 className="mt-2 font-display text-4xl font-bold">
                  {form.title || "Neighborhood"}
                </h2>
              </section>
              <section className="grid gap-5 p-7 md:grid-cols-2">
                {(
                  [
                    ["title", "Title"],
                    ["subTitle", "Subtitle"],
                    ["activeProjects", "Active projects"],
                    ["priceRange", "Price range"],
                    ["averagePricePerSqft", "Avg $/sf"],
                    ["location", "Location"],
                    ["deliveryWindow", "Delivery window"],
                  ] as [Exclude<keyof Form, "isFeatured">, string][]
                ).map(([key, label]) => (
                  <label
                    key={key}
                    className={`text-sm font-semibold ${key === "deliveryWindow" ? "md:col-span-2" : ""}`}
                  >
                    {label}
                    <input
                      required
                      min={key === "activeProjects" ? 0 : undefined}
                      type={key === "activeProjects" ? "number" : "text"}
                      value={form[key]}
                      onChange={(e) => set(key, e.target.value)}
                      className={input}
                    />
                  </label>
                ))}
                <label className="text-sm font-semibold md:col-span-2">
                  Description
                  <textarea
                    required
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    className={area}
                  />
                </label>
                <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded border border-line bg-[#fffdf8] px-4 text-sm font-semibold md:col-span-2"><input type="checkbox" checked={form.isFeatured} onChange={(e)=>setForm((current)=>({...current,isFeatured:e.target.checked}))} className="size-4 accent-gold"/><span>Feature this neighborhood on the dashboard and website</span></label>
              </section>
              <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-[#fffdf8] px-7 py-5">
                <p role="status" className="text-sm text-danger">
                  {message}
                </p>
                <div className="ml-auto flex gap-3">
                  <Link
                    href="/neighborhoods"
                    className="rounded border border-gold px-6 py-3 text-sm font-semibold text-gold"
                  >
                    Cancel
                  </Link>
                  <button
                    disabled={update.isPending}
                    className="rounded bg-gold px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {update.isPending ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </footer>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
