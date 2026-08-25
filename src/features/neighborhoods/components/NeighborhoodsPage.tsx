"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { OverviewHeader } from "@/features/overview/components/OverviewHeader";
import { OverviewSidebar } from "@/features/overview/components/OverviewSidebar";
import {
  useDeleteNeighborhood,
  useNeighborhoods,
} from "../hooks/use-neighborhoods";
import type { Neighborhood } from "../types/neighborhood.types";

export function NeighborhoodsPage() {
  const { data: neighborhoods = [], isLoading, error } = useNeighborhoods();
  const remove = useDeleteNeighborhood();
  const [selected, setSelected] = useState<Neighborhood | null>(null);
  return (
    <div className="min-h-dvh bg-canvas lg:flex">
      <OverviewSidebar active="Neighborhoods" />
      <div className="min-w-0 flex-1">
        <OverviewHeader
          title="Neighborhoods"
          description="Manage neighborhood guides, local insights and featured community information."
          action={
            <Link
              href="/neighborhoods/new"
              className="hidden min-h-11 items-center rounded bg-gold px-6 font-semibold text-white lg:flex"
            >
              Add Neighborhood
            </Link>
          }
        />
        <main className="mx-auto max-w-[1620px] space-y-6 p-5 sm:p-8">
          <section className="grid gap-5 md:grid-cols-3">
            <Metric value={neighborhoods.length} label="Total Neighborhoods" />
            <Metric
              value={neighborhoods.reduce((sum, x) => sum + (x.activeProjects || 0), 0)}
              label="Active Projects"
            />
            <Metric
              value={
                neighborhoods.filter((x) => x.isFeatured).length
              }
              label="Featured Neighborhoods"
            />
          </section>
          <section className="overflow-x-auto rounded border border-line bg-white p-4 sm:p-7">
            <div className="mb-5">
              <p className="text-gold">Community Management</p>
              <h2 className="font-inter text-2xl">All Neighborhoods</h2>
            </div>
            {isLoading ? (
              <p className="py-10 text-muted">Loading neighborhoods…</p>
            ) : error ? (
              <p role="alert" className="py-10 text-danger">
                {error.message}
              </p>
            ) : (
              <table className="min-w-[1050px] w-full border-collapse">
                <thead>
                  <tr className="bg-[#0D1B34] text-left text-white">
                    <th className="p-4">Neighborhood</th>
                    <th>Active Projects</th>
                    <th>Price Range</th>
                    <th>Avg $/sf</th>
                    <th>Location</th>
                    <th>Delivery</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {neighborhoods.map((item) => (
                    <tr key={item._id} className="border-b border-line">
                      <td className="p-5"><p className="font-semibold">{item.title || item.name}</p><p className="mt-1 max-w-52 truncate text-xs text-muted">{item.subTitle}</p></td>
                      <td>{item.activeProjects || 0}</td>
                      <td>{item.priceRange || "—"}</td>
                      <td>{item.averagePricePerSqft || "—"}</td>
                      <td className="text-muted">{item.location.city}</td>
                      <td>{item.deliveryWindow || "—"}</td>
                      <td className="space-x-4">
                        <button
                          onClick={() => setSelected(item)}
                          className="min-h-11 text-gold hover:underline"
                        >
                          View
                        </button>
                        <Link href={`/neighborhoods/${item._id}/edit`} className="inline-flex min-h-11 items-center text-[#0d1b34] hover:underline">Edit</Link>
                        <button
                          disabled={remove.isPending}
                          onClick={() => {
                            if (confirm(`Delete ${item.name}?`))
                              remove.mutate(item._id);
                          }}
                          className="min-h-11 text-danger hover:underline disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!isLoading && !error && !neighborhoods.length && (
              <p className="py-10 text-muted">
                No neighborhoods yet. Add your first one.
              </p>
            )}
          </section>
        </main>
      </div>
      {selected && <Drawer item={selected} close={() => setSelected(null)} />}
    </div>
  );
}
function Metric({ value, label }: { value: number; label: string }) {
  return (
    <article className="min-h-[108px] rounded border border-line bg-white p-6">
      <p className="font-display text-[27px]">{value}</p>
      <p className="mt-3 text-muted">{label}</p>
    </article>
  );
}
function Drawer({ item, close }: { item: Neighborhood; close: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Neighborhood details"
    >
      <button
        aria-label="Close details"
        onClick={close}
        className="absolute inset-0 bg-black/60"
      />
      <aside className="relative h-dvh w-full max-w-[720px] overflow-y-auto bg-white p-8">
        <button onClick={close} className="min-h-11 text-gold">
          ← Back to neighborhoods
        </button>
        <p className="mt-10 text-gold">Neighborhood Guide</p>
        <h2 className="mt-2 font-display text-5xl">{item.title || item.name}</h2>
        <p className="mt-2 text-lg text-muted">{item.subTitle}</p>
        {item.heroImage && <Image src={item.heroImage} alt={item.name} width={1200} height={700} className="mt-7 aspect-[16/8] w-full rounded object-cover" />}
        <div className="mt-7 grid grid-cols-2 gap-3">
          <Info label="Active projects" value={String(item.activeProjects || 0)} />
          <Info label="Price range" value={item.priceRange || "—"} />
          <Info label="Avg $/sf" value={item.averagePricePerSqft || "—"} />
          <Info label="Delivery window" value={item.deliveryWindow || "—"} />
        </div>
        <section className="mt-6">
          <h3 className="font-display text-3xl">About {item.title || item.name}</h3>
          <p className="mt-4 whitespace-pre-line text-muted">
            {item.description || item.fullDescription}
          </p>
        </section>
        <section className="mt-6 rounded bg-canvas p-5"><p className="text-xs font-semibold uppercase tracking-wider text-gold">Location</p><p className="mt-2 font-semibold">{item.location.city}</p></section>
      </aside>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded border border-line p-4"><p className="text-xs text-muted">{label}</p><p className="mt-1 font-semibold">{value}</p></div>;
}
