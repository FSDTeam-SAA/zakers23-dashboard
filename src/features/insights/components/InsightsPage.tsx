import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { OverviewSidebar } from "@/features/overview/components/OverviewSidebar";

const articles = Array.from({ length: 9 }, (_, index) => ({ id: index + 1, title: "The Vertical Mega-Compound", category: "Market Intelligence", date: "Jun 22, 2026" }));
const stats = [
  { value: "6", label: "Total Articles", icon: "document" as const },
  { value: "3", label: "Published", icon: "check" as const },
  { value: "2", label: "Featured Articles", icon: "activity" as const },
  { value: "342", label: "Completed Projects", icon: "activity" as const },
];

function ArticleActions({ title }: { title: string }) {
  return <div className="flex items-center justify-center"><Link href="/insights/marisol-bayfront" aria-label={`View ${title}`} className="grid size-8 place-items-center text-[#c9a227] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"><span className="text-[19px] leading-none">◉</span></Link><button aria-label={`Edit ${title}`} className="grid size-8 place-items-center text-[#c9a227] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"><span className="-rotate-45 text-[21px] leading-none">⌁</span></button><button aria-label={`Delete ${title}`} className="grid size-8 place-items-center text-[#c9a227] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"><span className="text-[19px] leading-none">♧</span></button></div>;
}

export function InsightsPage() {
  return <div className="min-h-dvh bg-white text-ink lg:flex">
    <OverviewSidebar active="Insights" />
    <div className="min-w-0 flex-1">
      <header className="flex min-h-[88px] items-center justify-between gap-5 border-b border-line bg-white/90 px-5 py-4 backdrop-blur-md sm:px-8">
        <div><h1 className="font-inter text-2xl font-normal leading-7">Insights</h1><p className="mt-2 text-base text-muted">Manage all market intelligence articles.</p></div>
        <div className="flex shrink-0 items-center gap-3 sm:gap-4"><Link href="/insights/new" className="inline-flex h-10 items-center gap-2 rounded bg-gold px-3 font-inter text-sm font-semibold text-white transition-colors hover:bg-[#ad8a20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 sm:px-4"><Icon name="plus" size={16}/><span>Add</span></Link><label className="hidden h-10 w-80 items-center gap-2.5 rounded-full border border-line bg-white px-4 text-[#a3a3a3] xl:flex"><Icon name="activity" size={14}/><span className="sr-only">Search articles</span><input className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#a3a3a3]" placeholder="Articles" /></label><button aria-label="Notifications" className="relative grid size-10 place-items-center rounded-full border border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"><Icon name="bell" size={16}/><span className="absolute right-[9px] top-[9px] size-1.5 rounded-full bg-red-600" /></button></div>
      </header>
      <main className="mx-auto max-w-[1620px] space-y-6 px-5 py-6 sm:px-8">
        <section aria-label="Article statistics" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => <article key={stat.label} className="flex min-h-[128px] items-center gap-4 rounded border border-line bg-white p-6"><span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#f8f9fb] text-gold"><Icon name={stat.icon} size={20}/></span><div className={stat.label === "Published" ? "space-y-3" : "space-y-1.5"}><p className="font-display text-2xl font-semibold leading-6">{stat.value}</p><p className={`text-gray-500 ${stat.label.length > 16 ? "text-xs leading-4" : "text-base"}`}>{stat.label}</p></div></article>)}
        </section>
        <section className="rounded border border-line bg-white p-5 sm:p-7" aria-label="Articles">
          <div className="overflow-x-auto rounded border border-line"><div className="min-w-[1040px]">
            <div className="grid h-14 grid-cols-5 bg-[#0f1f3a] text-base text-white"><span className="grid place-items-center">Articles</span><span className="grid place-items-center">Category</span><span className="grid place-items-center">Publish Date</span><span className="grid place-items-center">Status</span><span className="grid place-items-center">Action</span></div>
            <div>{articles.map((article) => <article key={article.id} className="grid min-h-[96px] grid-cols-5 items-center border-b border-line last:border-b-0"><div className="flex items-center justify-center gap-1 p-6"><Image src="/figma/insights/article-1.jpeg" alt="" width={64} height={48} className="h-12 w-16 shrink-0 rounded object-cover"/><h2 className="text-sm font-semibold leading-5">{article.title}</h2></div><span className="grid place-items-center p-6 text-base text-stone-500">{article.category}</span><span className="grid place-items-center p-6 text-base">{article.date}</span><span className="grid place-items-center p-6"><span className="rounded-full bg-green-600/10 px-3 py-1 text-xs font-semibold tracking-wide text-green-600">PUBLISHED</span></span><ArticleActions title={article.title}/></article>)}</div>
          </div></div>
          <footer className="mt-0 flex min-h-[72px] flex-wrap items-center justify-between gap-4 border-x border-b border-line px-5 py-4 sm:px-6"><label className="flex items-center gap-2 text-base text-gray-500">Show <select aria-label="Rows per page" className="h-9 w-16 rounded border border-line bg-white px-3 text-xs shadow-sm"><option>10</option></select> per page</label><nav aria-label="Pagination" className="flex items-center gap-1.5 text-xs text-gray-500"><button aria-label="Previous page" className="grid size-8 place-items-center rounded-full border border-line">‹</button><button aria-current="page" className="grid size-8 place-items-center rounded-full bg-[#0f1f3a] font-semibold text-white">1</button><button className="grid size-8 place-items-center rounded-full">2</button><button className="grid size-8 place-items-center rounded-full">3</button><button aria-label="Next page" className="grid size-8 place-items-center rounded-full border border-line">›</button></nav></footer>
        </section>
      </main>
    </div>
  </div>;
}
