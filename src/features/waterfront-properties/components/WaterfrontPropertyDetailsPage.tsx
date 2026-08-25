"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OverviewHeader } from "@/features/overview/components/OverviewHeader";
import { OverviewSidebar } from "@/features/overview/components/OverviewSidebar";

type Property = { _id: string; propertyName: string; subtitle: string; createdAt: string; contentCards: Array<{ _id: string; title: string; subtitle: string; from: string; description: string; subDescription: string; highlights: string[] }> };

export function WaterfrontPropertyDetailsPage({ id }: { id: string }) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { fetch(`/api/waterfronts/${id}`).then((r)=>r.json()).then((p)=>p.success?setProperty(p.data):setError(p.message)).catch(()=>setError("Could not load property")); }, [id]);
  async function remove() { if (!confirm("Permanently delete this waterfront property and all of its cards?")) return; const response=await fetch(`/api/waterfronts/${id}`,{method:"DELETE"}); if(response.ok){router.push("/waterfront-properties");router.refresh();}else setError("Could not delete property"); }
  return <div className="min-h-dvh bg-canvas text-ink lg:flex"><OverviewSidebar active="Waterfront Properties"/><div className="min-w-0 flex-1"><OverviewHeader title="View Property" description="Review the published main content, project cards and highlights."/><main className="mx-auto max-w-[1200px] px-5 py-7 sm:px-8">{error?<p className="rounded border border-red-200 bg-red-50 p-5 text-danger">{error}</p>:!property?<p className="text-muted">Loading property…</p>:<><section className="rounded border border-line bg-[#0d1b34] p-7 text-white sm:p-10"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#e6c75f]">Main content</p><h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{property.propertyName}</h1><p className="mt-3 max-w-3xl text-base text-white/70 sm:text-lg">{property.subtitle}</p><div className="mt-7 flex flex-wrap gap-3"><Link href={`/waterfront-properties/${id}/edit`} className="rounded bg-gold px-5 py-3 text-sm font-semibold text-white">Edit property</Link><button onClick={remove} className="rounded border border-red-300 px-5 py-3 text-sm font-semibold text-red-200">Delete property</button><Link href="/waterfront-properties" className="rounded border border-white/30 px-5 py-3 text-sm font-semibold text-white">Back to list</Link></div></section><div className="mt-6 grid gap-6">{property.contentCards.map((card,index)=><article key={card._id || index} className="rounded-lg border border-line bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-gold">Project card {index+1}</p><h2 className="mt-2 font-display text-3xl font-bold">{card.title}</h2><p className="mt-1 text-muted">{card.subtitle}</p></div><span className="rounded-full bg-gold/10 px-4 py-2 text-sm font-bold text-gold">{card.from}</span></div><p className="mt-6 leading-7">{card.description}</p><p className="mt-3 leading-7 text-muted">{card.subDescription}</p><div className="mt-6 grid gap-3 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-3">{card.highlights?.map((item,itemIndex)=><div key={itemIndex} className="rounded border border-line bg-[#fffdf8] px-4 py-3 text-sm font-semibold"><span className="mr-2 text-gold">•</span>{item}</div>)}</div></article>)}</div></>}</main></div></div>;
}
