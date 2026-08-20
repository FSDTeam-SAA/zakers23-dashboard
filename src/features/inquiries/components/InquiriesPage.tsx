"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { OverviewSidebar } from "@/features/overview/components/OverviewSidebar";

const inquiries = [
  ["Alexandra Mercer", "alexandra.mercer@gmail.com", "+1 (305) 555-0142", "REQUEST PRICING", "pricing", "Aurelia Residences", "Jun 24, 2026", "IN PROGRESS", "progress"],
  ["Benjamin Ortiz", "benjamin.ortiz@yahoo.com", "+1 (212) 555-0198", "PRIVATE CONSULTATION", "consultation", "Harbor View Condos", "Jul 2, 2026", "CONTACTED", "contacted"],
  ["Chloe Kim", "chloe.kim@hotmail.com", "+1 (415) 555-0234", "SCHEDULE TOUR", "tour", "Maplewood Estates", "Jun 30, 2026", "IN PROGRESS", "progress"],
  ["Darius Johnson", "darius.johnson@gmail.com", "+1 (718) 555-0117", "OWNER LISTING", "listing", "Sunset Villas", "Jul 5, 2026", "IN PROGRESS", "progress"],
  ["Elena Vasquez", "elena.vasquez@outlook.com", "+1 (617) 555-0183", "SCHEDULE TOUR", "tour", "Cedar Park Lofts", "Jun 28, 2026", "CONTACTED", "contacted"],
  ["Felix Nguyen", "felix.nguyen@gmail.com", "+1 (323) 555-0175", "OWNER LISTING", "listing", "Lakeside Residences", "Jul 1, 2026", "IN PROGRESS", "progress"],
  ["Grace Lee", "grace.lee@mail.com", "+1 (206) 555-0129", "SCHEDULE TOUR", "tour", "Pinecrest Apartments", "Jun 29, 2026", "CLOSED", "closed"],
  ["Hassan Ali", "hassan.ali@gmail.com", "+1 (303) 555-0160", "REQUEST PRICING", "pricing", "Willow Creek Homes", "Jul 3, 2026", "CLOSED", "closed"],
  ["Isabella Rossi", "isabella.rossi@hotmail.com", "+1 (917) 555-0104", "PRIVATE CONSULTATION", "consultation", "Skyline Towers", "Jul 4, 2026", "CONTACTED", "contacted"],
  ["Javier Martinez", "javier.martinez@gmail.com", "+1 (408) 555-0159", "SCHEDULE TOUR", "tour", "Orchard Gardens", "Jun 27, 2026", "CONTACTED", "contacted"],
] as const;

const stats = [
  ["6", "Total Inquiries", "users"], ["3", "New Leads", "user-add"], ["2", "Contacted", "phone"], ["342", "Closed", "circle-check"],
] as const;

const typeColors: Record<string, string> = { pricing: "bg-[#fbf1d9] text-[#987110]", consultation: "bg-[#fae4e5] text-[#ff1313]", tour: "bg-[#e8eaec] text-[#10203a]", listing: "bg-[#ddf3e6] text-[#008f3f]" };
const statusColors: Record<string, string> = { progress: "bg-[#fff0d7] text-[#a36400]", contacted: "bg-[#e6e9ed] text-[#10203a]", closed: "bg-[#def3e6] text-[#009b46]" };

export function InquiriesPage() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  return <div className="min-h-dvh bg-white text-ink lg:flex">
    <OverviewSidebar active="Inquiries" />
    <div className="min-w-0 flex-1">
      <header className="flex min-h-[88px] items-center justify-between gap-5 border-b border-line px-5 py-4 sm:px-8">
        <div><h1 className="font-inter text-2xl font-normal leading-7">Inquiries</h1><p className="mt-2 text-base text-muted">Manage all customer inquiries and leads from the website.</p></div>
        <div className="flex items-center gap-4"><label className="hidden h-11 w-[360px] items-center gap-3 rounded-full border border-line px-4 text-[#a3a3a3] xl:flex"><Icon name="search" size={17}/><input aria-label="Search inquiries" className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#a3a3a3]" placeholder="Articles" /></label><button aria-label="Notifications" className="relative grid size-11 place-items-center rounded-full border border-line"><Icon name="bell" size={18}/><span className="absolute right-[10px] top-[10px] size-1.5 rounded-full bg-red-600" /></button></div>
      </header>
      <main className="mx-auto max-w-[1620px] space-y-6 px-5 py-6 sm:px-9">
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Inquiry statistics">
          {stats.map(([value, label, icon]) => <article key={label} className="flex h-[108px] items-center gap-4 rounded border border-line px-6"><span className="grid size-12 place-items-center rounded-full bg-[#f8f9fb] text-gold"><Icon name={icon} size={20}/></span><div><p className="font-display text-[25px] font-semibold leading-7">{value}</p><p className="mt-1 text-base text-[#72798a]">{label}</p></div></article>)}
        </section>
        <section className="overflow-x-auto rounded border border-line" aria-label="Inquiries list"><div className="min-w-[1120px]">
          <div className="grid h-[54px] grid-cols-[1.15fr_1.3fr_1.2fr_1.3fr_1.05fr_1.1fr_.75fr] items-center bg-[#0e1e39] px-6 text-center text-base text-white"><span>Client</span><span>Contact</span><span>Inquiry Type</span><span>Development</span><span>Submitted</span><span>Status</span><span>Action</span></div>
          {inquiries.map(([name, email, phone, type, typeKey, development, date, status, statusKey]) => <article key={name} className="grid min-h-[81px] grid-cols-[1.15fr_1.3fr_1.2fr_1.3fr_1.05fr_1.1fr_.75fr] items-center border-b border-line px-6 last:border-b-0">
            <h2 className="text-left text-lg leading-5">{name}</h2><div className="text-sm leading-5"><p>{email}</p><p className="text-stone-500">{phone}</p></div><div className="text-center"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${typeColors[typeKey]}`}>{type}</span></div><p className="text-center text-lg text-stone-500">{development}</p><p className="text-center text-lg">{date}</p><div className="text-center"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusColors[statusKey]}`}>{status}</span></div><div className="flex items-center justify-center gap-2 text-gold"><button onClick={() => setIsDetailOpen(true)} aria-label={`View ${name}`} className="grid size-8 place-items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"><Icon name="eye" size={20}/></button><button aria-label={`Delete ${name}`} className="grid size-8 place-items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"><Icon name="trash" size={20}/></button></div>
          </article>)}
        </div><footer className="flex h-[76px] min-w-[1120px] items-center justify-between px-6"><label className="flex items-center gap-2 text-lg text-[#72798a]">Show <select aria-label="Rows per page" className="h-9 w-[72px] rounded border border-line bg-white px-3 text-sm"><option>10</option></select> per page</label><nav aria-label="Pagination" className="flex items-center gap-2 text-sm text-[#72798a]"><button aria-label="Previous page" className="grid size-8 place-items-center rounded-full border border-line"><Icon name="chevron-left" size={14}/></button><button aria-current="page" className="grid size-8 place-items-center rounded-full bg-[#0e1e39] text-white">1</button><button className="grid size-8 place-items-center rounded-full">2</button><button className="grid size-8 place-items-center rounded-full">3</button><button aria-label="Next page" className="grid size-8 place-items-center rounded-full border border-line"><Icon name="chevron-right" size={14}/></button></nav></footer>
        </section>
      </main>
      {isDetailOpen && <InquiryDetailsModal onClose={() => setIsDetailOpen(false)} />}
    </div>
  </div>;
}

function InquiryDetailsModal({ onClose }: { onClose: () => void }) {
  const details = [["Email", "alexandra.mercer@gmail", "search"], ["Phone Number", "+1 (305) 555-0142", "phone"], ["Development", "Aurelia Residences", "document"], ["Budget", "$1.8M – $2.4M", "activity"], ["Preferred Timeline", "3–6 Months", "activity"], ["Submission Date", "Jun 24, 2026", "circle-check"]] as const;
  return <div role="dialog" aria-modal="true" aria-labelledby="inquiry-details-title" className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onMouseDown={onClose}>
    <div className="w-full max-w-[660px] overflow-hidden rounded-[4px] bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
      <header className="flex h-[88px] items-center justify-between border-b border-line px-6"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-[#f0f3f7] text-[10px] text-[#10203a]">AM</span><div><p className="text-[8px] font-semibold tracking-[.22em] text-gold">INQUIRY DETAILS</p><h2 id="inquiry-details-title" className="mt-1 font-display text-[23px] leading-6 text-[#0a1629]">Alexandra Mercer</h2></div></div><button onClick={onClose} aria-label="Close inquiry details" className="grid size-9 place-items-center text-xl text-[#94a3b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">×</button></header>
      <div className="space-y-3 p-4 sm:p-6"><div className="flex gap-2"><span className="rounded bg-gold px-3 py-1.5 text-xs text-white">REQUEST PRICING</span><span className="rounded bg-gold px-3 py-1.5 text-xs text-white">NEW</span></div><div className="grid grid-cols-2 gap-3">{details.map(([label, value, icon]) => <article key={label} className="min-h-[69px] rounded border border-line p-3"><Icon name={icon} size={16}/><p className="mt-1.5 text-xs text-[#6b7280]">{label}</p><p className="text-xs font-semibold text-[#0a1629]">{value}</p></article>)}</div><article className="rounded border border-line p-3"><p className="flex items-center gap-2 text-xs font-semibold text-gold"><Icon name="document" size={17}/>Message</p><p className="mt-2 text-xs leading-[1.25] text-[#1a1a1a]">Interested in receiving current pricing for 2–3 bedroom residences with waterfront views. Would also like to know about pre-construction incentives currently available.</p></article><div className="space-y-2"><button className="h-8 w-full rounded bg-gold text-xs font-semibold text-white">Mark As Contacted</button><button className="h-8 w-full rounded border-2 border-gold text-xs font-semibold text-gold">Close Inquiry</button><button className="h-8 w-full rounded border border-red-600 text-xs font-semibold text-red-600">DELETE INQUIRY</button></div></div>
    </div>
  </div>;
}
