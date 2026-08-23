"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { useDevelopment } from "../hooks/use-developments";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function DevelopmentDetailDrawer({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const { data: development, isLoading, error } = useDevelopment(id);
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="development-drawer-title"
    >
      <button
        aria-label="Close development details"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <aside className="relative h-dvh w-full max-w-[720px] overflow-y-auto bg-white px-6 pb-10 pt-5 shadow-2xl sm:px-10">
        <header className="flex items-center border-b border-line pb-4">
          <button
            onClick={onClose}
            className="flex min-h-11 items-center gap-3 font-display text-2xl font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <span className="rotate-180">
              <Icon name="arrow" size={20} />
            </span>
            <span id="development-drawer-title">
              {development?.developmentName ?? "Development details"}
            </span>
          </button>
        </header>
        {isLoading && (
          <p className="py-16 text-center text-muted" aria-live="polite">
            Loading development…
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="mt-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-danger"
          >
            {error.message}
          </p>
        )}
        {development && (
          <div className="pt-8">
            <Image
              src={development.heroImage}
              alt={development.developmentName}
              width={1200}
              height={600}
              className="h-auto w-full rounded object-cover"
              priority
            />
            <p className="mt-6 text-base text-gold">{development.city}</p>
            <h2 className="mt-2 font-display text-4xl font-bold text-ink">
              {development.developmentName}
            </h2>
            <p className="mt-2 text-muted">{development.address}</p>
            <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Fact
                label="Starting price"
                value={money.format(development.startingPrice)}
              />
              <Fact
                label="Construction stage"
                value={development.constructionStage}
              />
              <Fact label="Delivery" value={development.deliveryYear} />
              <Fact label="Developer" value={development.developer} />
            </section>
            <section className="mt-6 rounded border border-line p-6">
              <h3 className="font-inter text-lg font-semibold text-ink">
                Project overview
              </h3>
              <p className="mt-3 whitespace-pre-wrap leading-7 text-muted">
                {development.projectOverview}
              </p>
            </section>
            <section className="mt-6 rounded border border-line p-6">
              <h3 className="font-inter text-lg font-semibold text-ink">
                Residences
              </h3>
              <div className="mt-4 space-y-3">
                {development.residences.map((residence, index) => (
                  <div
                    key={`${residence.residenceType}-${index}`}
                    className="flex flex-wrap justify-between gap-2 border-b border-line pb-3 last:border-0 last:pb-0"
                  >
                    <span className="font-semibold">
                      {residence.residenceType} · {residence.bedrooms} bed
                    </span>
                    <span className="text-muted">
                      {money.format(residence.startingPrice)} ·{" "}
                      {residence.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </aside>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded border border-line p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-inter text-xl font-semibold capitalize text-ink">
        {value}
      </p>
    </article>
  );
}
