"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OverviewHeader } from "@/features/overview/components/OverviewHeader";
import { OverviewSidebar } from "@/features/overview/components/OverviewSidebar";

type ProjectCard = { id: string; title: string; subtitle: string; from: string; description: string; subDescription: string; highlights: string[] };
const makeCard = (): ProjectCard => ({ id: crypto.randomUUID(), title: "", subtitle: "", from: "", description: "", subDescription: "", highlights: [""] });
const input = "mt-2 h-12 w-full rounded border border-line bg-white px-4 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";
const area = "mt-2 min-h-28 w-full resize-y rounded border border-line bg-white p-4 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";
const highlightPlaceholders = [
  "$105M",
  "5940 N Bay Rd",
  "2.3-acre lot",
  "No fixed bridges",
  "Open water, no height limit",
  "North Bay Road",
  "Closed Jul 2025",
];

export function AddWaterfrontPropertyPage({ propertyId }: { propertyId?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [cards, setCards] = useState<ProjectCard[]>([makeCard()]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(Boolean(propertyId));
  const updateCard = (id: string, patch: Partial<ProjectCard>) => setCards((current) => current.map((card) => card.id === id ? { ...card, ...patch } : card));

  useEffect(() => {
    if (!propertyId) return;
    fetch(`/api/waterfronts/${propertyId}`).then((response) => response.json()).then((payload) => {
      if (!payload.success) throw new Error(payload.message);
      setTitle(payload.data.propertyName);
      setSubtitle(payload.data.subtitle);
      setCards(payload.data.contentCards.map((card: Omit<ProjectCard, "id"> & { _id?: string }) => ({ ...card, id: card._id || crypto.randomUUID(), highlights: card.highlights || [""] })));
    }).catch((error) => setMessage(error instanceof Error ? error.message : "Could not load property")).finally(() => setLoading(false));
  }, [propertyId]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true); setMessage("");
    try {
      const propertySlug = `${title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now()}`;
      const response = await fetch(propertyId ? `/api/waterfronts/${propertyId}` : "/api/waterfronts", { method: propertyId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ propertyName: title, ...(!propertyId ? { propertySlug } : {}), subtitle, contentCards: cards.map(({ id, ...card }) => ({ ...card, highlights: card.highlights.map((item) => item.trim()).filter(Boolean) })) }) });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "Could not publish property");
      router.push("/waterfront-properties");
      router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not publish property"); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="min-h-dvh bg-canvas lg:flex"><OverviewSidebar active="Waterfront Properties"/><main className="grid flex-1 place-items-center text-muted">Loading property…</main></div>;
  return <div className="min-h-dvh bg-canvas text-ink lg:flex"><OverviewSidebar active="Waterfront Properties"/><div className="min-w-0 flex-1"><OverviewHeader title={propertyId ? "Edit Property" : "Add Property"} description={propertyId ? "Update the main content, cards and highlights." : "Create the main heading and as many project cards as you need."}/><main className="mx-auto max-w-[1200px] px-5 py-7 sm:px-8"><form onSubmit={submit} className="overflow-hidden rounded border border-line bg-white shadow-sm">
    <section className="border-b border-line px-6 py-7 sm:px-8"><p className="text-xs font-semibold uppercase tracking-[.16em] text-gold">Main content</p><h2 className="mt-2 font-display text-3xl font-bold">Title & subtitle</h2><p className="mt-1 text-sm text-muted">These remain as the main heading above every project card.</p><div className="mt-6 grid gap-5 md:grid-cols-2"><label className="text-sm font-semibold">Main title<input required value={title} onChange={(e)=>setTitle(e.target.value)} className={input} placeholder="Waterfront collection"/></label><label className="text-sm font-semibold">Main subtitle<input required value={subtitle} onChange={(e)=>setSubtitle(e.target.value)} className={input} placeholder="Exceptional homes by the water"/></label></div></section>
    <section className="px-6 py-7 sm:px-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-gold">Submain content</p><h2 className="mt-2 font-display text-3xl font-bold">Project cards</h2><p className="mt-1 text-sm text-muted">Add, edit or remove cards independently.</p></div><button type="button" onClick={()=>setCards((current)=>[...current,makeCard()])} className="min-h-11 rounded bg-[#0d1b34] px-5 text-sm font-semibold text-white hover:bg-[#172b4d]">+ Add another card</button></div>
      <div className="mt-6 space-y-5">{cards.map((card,index)=><article key={card.id} className="rounded-lg border border-line bg-[#fffdf8] p-5 sm:p-6"><div className="flex items-center justify-between gap-4"><div><span className="text-xs font-semibold uppercase tracking-wider text-gold">Project card {index+1}</span><h3 className="mt-1 text-lg font-semibold">Project information</h3></div>{cards.length>1&&<button type="button" onClick={()=>setCards((current)=>current.filter((item)=>item.id!==card.id))} className="min-h-11 px-3 text-sm font-semibold text-danger">Remove</button>}</div><div className="mt-5 grid gap-5 md:grid-cols-2"><label className="text-sm font-semibold">Title<input required value={card.title} onChange={(e)=>updateCard(card.id,{title:e.target.value})} className={input}/></label><label className="text-sm font-semibold">Subtitle<input required value={card.subtitle} onChange={(e)=>updateCard(card.id,{subtitle:e.target.value})} className={input}/></label><label className="text-sm font-semibold md:col-span-2">From<input required value={card.from} onChange={(e)=>updateCard(card.id,{from:e.target.value})} className={input} placeholder="From $2,500,000"/></label><label className="text-sm font-semibold md:col-span-2">Description<textarea required value={card.description} onChange={(e)=>updateCard(card.id,{description:e.target.value})} className={area}/></label><label className="text-sm font-semibold md:col-span-2">Sub-description<textarea required value={card.subDescription} onChange={(e)=>updateCard(card.id,{subDescription:e.target.value})} className={area}/></label></div><fieldset className="mt-6 border-t border-line pt-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><legend className="text-sm font-semibold">Property highlights</legend><p className="mt-1 text-xs text-muted">Price, address, lot details, water access, location, closing date, etc.</p></div><button type="button" onClick={()=>updateCard(card.id,{highlights:[...card.highlights,""]})} className="min-h-11 rounded border border-gold px-4 text-sm font-semibold text-gold">+ Add highlight</button></div><div className="mt-3 grid gap-3 md:grid-cols-2">{card.highlights.map((highlight,highlightIndex)=><div key={highlightIndex} className="flex items-end gap-2"><label className="min-w-0 flex-1 text-xs font-semibold text-muted">Highlight {highlightIndex+1}<input required value={highlight} onChange={(e)=>updateCard(card.id,{highlights:card.highlights.map((item,itemIndex)=>itemIndex===highlightIndex?e.target.value:item)})} className={input} placeholder={highlightPlaceholders[highlightIndex] ?? `Additional property highlight ${highlightIndex+1}`}/></label>{card.highlights.length>1&&<button type="button" aria-label={`Remove highlight ${highlightIndex+1}`} onClick={()=>updateCard(card.id,{highlights:card.highlights.filter((_,itemIndex)=>itemIndex!==highlightIndex)})} className="min-h-12 rounded px-3 text-sm font-semibold text-danger">Remove</button>}</div>)}</div></fieldset></article>)}</div>
    </section><footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-white px-6 py-5 sm:px-8"><p role="status" className="text-sm text-danger">{message}</p><div className="ml-auto flex gap-3"><Link href="/waterfront-properties" className="min-h-11 rounded border border-gold px-5 py-3 text-sm font-semibold text-gold">Cancel</Link><button disabled={saving} className="min-h-11 rounded bg-gold px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Saving…" : propertyId ? "Save changes" : "Publish property"}</button></div></footer>
  </form></main></div></div>;
}
