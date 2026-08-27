"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { OverviewHeader } from "@/features/overview/components/OverviewHeader";
import { OverviewSidebar } from "@/features/overview/components/OverviewSidebar";
import {
  useDeleteDevelopment,
  useDevelopments,
} from "../hooks/use-developments";
import type {
  ConstructionStage,
  Development,
} from "../types/development.types";
import { DevelopmentDetailDrawer } from "./DevelopmentDetailDrawer";

const stages: ConstructionStage[] = [
  "pre-construction",
  "under construction",
  "move in ready",
];
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function neighbourhoodName(value: Development["selectedNeighbourhood"]) {
  return typeof value === "string" ? "—" : value.name;
}

export function DevelopmentsPage() {
  const [constructionStage, setConstructionStage] = useState<
    ConstructionStage | ""
  >("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const {
    data: developments = [],
    isLoading,
    error,
  } = useDevelopments(constructionStage ? { constructionStage } : {});
  const deleteMutation = useDeleteDevelopment();
  const handleDelete = (development: Development) => {
    if (
      window.confirm(
        `Delete ${development.developmentName}? This cannot be undone.`,
      )
    )
      deleteMutation.mutate(development._id);
  };

  return (
    <div className="min-h-dvh bg-canvas text-ink lg:flex">
      <OverviewSidebar active="Developments" />
      <div className="min-w-0 flex-1">
        <OverviewHeader
          title="Developments"
          description="Manage all luxury developments, pricing, galleries and project information."
          action={
            <Link
              href="/developments/new"
              className="hidden h-[51px] items-center rounded bg-gold px-8 font-inter font-semibold text-white transition-colors hover:bg-[#ad8b1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 lg:flex"
            >
              Add Development
            </Link>
          }
        />
        <main className="mx-auto max-w-[1620px] space-y-6 px-5 py-6 sm:px-8">
          <section className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <p className="font-inter text-sm text-muted">
              {developments.length} development
              {developments.length === 1 ? "" : "s"} found
            </p>
            <select
              value={constructionStage}
              onChange={(event) =>
                setConstructionStage(
                  event.target.value as ConstructionStage | "",
                )
              }
              aria-label="Filter by construction stage"
              className="h-11 min-w-48 rounded border border-line bg-white px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="">All construction stages</option>
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </section>
          <section className="overflow-hidden rounded border border-line bg-white p-4 sm:p-7">
            {isLoading && (
              <p className="py-12 text-center text-muted" aria-live="polite">
                Loading developments…
              </p>
            )}
            {error && (
              <p
                role="alert"
                className="rounded border border-red-200 bg-red-50 px-4 py-3 text-danger"
              >
                {error.message}
              </p>
            )}
            {!isLoading && !error && developments.length === 0 && (
              <p className="py-12 text-center text-muted">
                No developments found. Add the first one to get started.
              </p>
            )}
            {!isLoading && !error && developments.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-[960px] w-full border-collapse">
                  <thead>
                    <tr className="bg-[#0D1B34] text-left font-inter text-sm text-white">
                      <th className="px-5 py-4 font-normal">Project</th>
                      <th className="px-4 py-4 font-normal">Neighborhood</th>
                      <th className="px-4 py-4 font-normal">Starting price</th>
                      <th className="px-4 py-4 font-normal">
                        Construction stage
                      </th>
                      <th className="px-4 py-4 font-normal">Delivery</th>
                      <th className="px-4 py-4 text-center font-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {developments.map((development) => (
                      <tr
                        key={development._id}
                        className="border-b border-line last:border-0"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src={development.heroImage}
                              alt=""
                              width={64}
                              height={48}
                              className="h-12 w-16 rounded object-cover"
                            />
                            <span className="font-inter font-semibold">
                              {development.developmentName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 text-muted">
                          {neighbourhoodName(development.selectedNeighbourhood)}
                        </td>
                        <td className="px-4 font-inter font-semibold">
                          {money.format(development.startingPrice)}
                        </td>
                        <td className="px-4">
                          <span className="rounded-full bg-canvas px-3 py-1 text-sm capitalize">
                            {development.constructionStage}
                          </span>
                        </td>
                        <td className="px-4 text-muted">
                          {development.deliveryYear}
                        </td>
                        <td className="px-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setSelectedId(development._id)}
                              aria-label={`View ${development.developmentName}`}
                              className="grid size-11 place-items-center rounded-full text-gold hover:bg-[#fbf5e1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                            >
                              <Icon name="eye" size={17} />
                            </button>
                            <Link
                              href={`/developments/${development._id}/edit`}
                              aria-label={`Edit ${development.developmentName}`}
                              className="grid size-11 place-items-center rounded-full text-gold hover:bg-[#fbf5e1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                            >
                              <Icon name="edit" size={17} />
                            </Link>
                            <button
                              onClick={() => handleDelete(development)}
                              disabled={deleteMutation.isPending}
                              aria-label={`Delete ${development.developmentName}`}
                              className="grid size-11 place-items-center rounded-full text-danger hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger disabled:opacity-50"
                            >
                              <Icon name="trash" size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
      {selectedId && (
        <DevelopmentDetailDrawer
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
