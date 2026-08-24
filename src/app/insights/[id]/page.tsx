import Link from "next/link";
import { OverviewSidebar } from "@/features/overview/components/OverviewSidebar";

export default async function ViewArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="min-h-dvh bg-white text-ink lg:flex">
      <OverviewSidebar active="Insights" />
      <div className="min-w-0 flex-1">
        <header className="flex min-h-[89px] items-center justify-between border-b border-line bg-white/90 px-5 py-4 backdrop-blur-md sm:px-8">
          <div>
            <h1 className="font-inter text-2xl leading-7">View Article</h1>
            <p className="mt-2 text-base text-muted">ID: {id}</p>
          </div>
          <div className="flex gap-4">
            <Link href={`/insights/${id}/edit`} className="rounded border-2 border-gold px-5 py-2.5 font-inter text-sm font-semibold text-gold transition-colors hover:bg-[#fffaf0]">
              Edit Article
            </Link>
            <Link href="/insights" className="rounded border-2 border-gold px-5 py-2.5 font-inter text-sm font-semibold text-gold transition-colors hover:bg-[#fffaf0]">
              Back to List
            </Link>
          </div>
        </header>
        <main className="px-6 py-10 lg:px-6">
          <div className="mx-auto max-w-[1532px] rounded border border-line bg-white p-7 text-center">
            <h2 className="text-2xl font-bold">Article View Mode</h2>
            <p className="mt-4 text-gray-500">This page will display the full details of article {id}.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
