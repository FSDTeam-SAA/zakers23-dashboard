"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { OverviewHeader } from "@/features/overview/components/OverviewHeader";
import { OverviewSidebar } from "@/features/overview/components/OverviewSidebar";

type Property = {
  id: string;
  name: string;
  neighborhood: string;
  price: string;
  updated: string;
};

export function WaterfrontPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/waterfronts").then((response) => response.json()).then((payload) => {
      if (!payload.success) throw new Error(payload.message);
      setProperties(payload.data.map((item: { _id: string; propertyName: string; subtitle?: string; city?: string; startingPrice?: number; contentCards?: { from: string }[]; updatedAt?: string }) => ({
        id: item._id,
        name: item.propertyName,
        neighborhood: item.city || item.subtitle || "Waterfront collection",
        price: item.startingPrice ? `$${item.startingPrice.toLocaleString()}` : item.contentCards?.[0]?.from || "—",
        updated: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "Just now",
      })));
    }).finally(() => setLoading(false));
  }, []);

  async function deleteProperty(id: string) {
    if (!confirm("Delete this waterfront property?")) return;
    const response = await fetch(`/api/waterfronts/${id}`, { method: "DELETE" });
    if (response.ok) setProperties((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="min-h-dvh bg-white text-ink lg:flex">
      <OverviewSidebar active="Waterfront Properties" />
      <div className="min-w-0 flex-1">
        <OverviewHeader
          title="Waterfront Properties"
          description="All listings featured on the Waterfront Estates page."
          action={
            <Link
              href="/waterfront-properties/new"
              className="hidden h-[47px] items-center rounded bg-[#d3aa20] px-8 font-inter text-base font-semibold text-white transition-colors hover:bg-[#b78e12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 lg:flex"
            >
              Add Property
            </Link>
          }
        />

        <main className="mx-auto max-w-[1620px] px-5 py-7 sm:px-8 sm:py-8">
          <section className="rounded border border-line bg-white p-4 sm:p-7">
            <div className="overflow-x-auto rounded border border-line">
              <table className="min-w-[1040px] w-full border-collapse">
                <thead>
                  <tr className="bg-[#0d1b34] font-inter text-base text-white">
                    {['Property', 'Neighborhood', 'Starting Price', 'Status', 'Updated', 'Action'].map((heading) => (
                      <th key={heading} className="px-5 py-4 text-center font-normal">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id} className="border-b border-line last:border-b-0">
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <Image
                            src="/figma/waterfront/marisol-bayfront.png"
                            alt="Marisol Bayfront"
                            width={64}
                            height={48}
                            className="h-12 w-16 shrink-0 rounded object-cover"
                          />
                          <span className="font-inter text-[13px] font-semibold whitespace-nowrap">{property.name}</span>
                        </div>
                      </td>
                      <td className="px-5 text-center text-muted">{property.neighborhood}</td>
                      <td className="px-5 text-center text-muted">{property.price}</td>
                      <td className="px-5 text-center">
                        <span className="inline-flex rounded-full bg-[#16a34a]/10 px-3 py-1 text-[10px] font-semibold tracking-[0.04em] text-[#16a34a]">PUBLISHED</span>
                      </td>
                      <td className="px-5 text-center">{property.updated}</td>
                      <td className="px-5">
                        <div className="flex justify-center gap-2">
                          <Link href={`/waterfront-properties/${property.id}`} aria-label={`View ${property.name}`} title="View" className="rounded border border-line px-3 py-2 text-xs font-semibold text-[#0d1b34] transition-colors hover:bg-slate-50">View</Link>
                          <Link href={`/waterfront-properties/${property.id}/edit`} aria-label={`Edit ${property.name}`} title="Edit" className="rounded border border-gold px-3 py-2 text-xs font-semibold text-gold transition-colors hover:bg-[#fbf5e1]">Edit</Link>
                          <button type="button" onClick={() => deleteProperty(property.id)} aria-label={`Delete ${property.name}`} title="Delete" className="rounded border border-red-200 px-3 py-2 text-xs font-semibold text-danger transition-colors hover:bg-red-50">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading && <p className="p-8 text-center text-muted">Loading properties…</p>}
              {!loading && !properties.length && <p className="p-8 text-center text-muted">No waterfront properties yet. Add your first property.</p>}
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-2 pt-5 text-muted">
              <label className="flex items-center gap-2">
                Show
                <select aria-label="Rows per page" className="h-9 rounded border border-line bg-white px-3 text-sm text-muted"><option>10</option></select>
                per page
              </label>
              <div className="flex items-center gap-2">
                <button aria-label="Previous page" className="grid size-8 place-items-center rounded-full border border-line text-muted">‹</button>
                <button aria-current="page" className="grid size-8 place-items-center rounded-full bg-[#0d1b34] text-sm text-white">1</button>
                <button className="grid size-8 place-items-center rounded-full text-sm">2</button>
                <button className="grid size-8 place-items-center rounded-full text-sm">3</button>
                <button aria-label="Next page" className="grid size-8 place-items-center rounded-full border border-line text-muted">›</button>
              </div>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}
