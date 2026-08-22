"use client";

import Image from "next/image";
import { useState } from "react";
import { OverviewHeader } from "@/features/overview/components/OverviewHeader";
import { OverviewSidebar } from "@/features/overview/components/OverviewSidebar";

type Property = {
  id: number;
  name: string;
  neighborhood: string;
  price: string;
  updated: string;
};

const initialProperties: Property[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  name: "Marisol Bayfront",
  neighborhood: "Brickell, Miami",
  price: "$18,500,000",
  updated: "Jun 22, 2026",
}));

export function WaterfrontPropertiesPage() {
  const [properties, setProperties] = useState(initialProperties);

  const addProperty = () => {
    setProperties((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((property) => property.id)) + 1,
        name: "New Waterfront Property",
        neighborhood: "Miami, Florida",
        price: "$0",
        updated: "Just now",
      },
    ]);
  };

  return (
    <div className="min-h-dvh bg-white text-ink lg:flex">
      <OverviewSidebar active="Waterfront Properties" />
      <div className="min-w-0 flex-1">
        <OverviewHeader
          title="Waterfront Properties"
          description="All listings featured on the Waterfront Estates page."
          action={
            <button
              type="button"
              onClick={addProperty}
              className="hidden h-[47px] items-center rounded bg-[#d3aa20] px-8 font-inter text-base font-semibold text-white transition-colors hover:bg-[#b78e12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 lg:flex"
            >
              Add Property
            </button>
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
                        <div className="flex justify-center gap-1">
                          <button type="button" aria-label={`Edit ${property.name}`} className="grid size-8 place-items-center rounded-full transition-colors hover:bg-[#fbf5e1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                            <img src="/figma/waterfront/edit.svg" alt="" className="size-6" />
                          </button>
                          <button type="button" onClick={() => setProperties((current) => current.filter((item) => item.id !== property.id))} aria-label={`Delete ${property.name}`} className="grid size-8 place-items-center rounded-full transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger">
                            <img src="/figma/waterfront/delete.svg" alt="" className="size-6" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
