"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { OverviewSidebar } from "@/features/overview/components/OverviewSidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function InsightsPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewArticle, setViewArticle] = useState<any>(null); // For the modal

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      if (data.success) {
        setArticles(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchArticles(); // reload
      } else {
        alert("Failed to delete article");
      }
    } catch (err) {
      alert("Error deleting article");
    }
  };

  const stats = [
    { value: articles.length.toString(), label: "Total Articles", icon: "document" as const },
    { value: articles.length.toString(), label: "Published", icon: "check" as const },
    { value: "0", label: "Featured Articles", icon: "activity" as const },
  ];

  return (
    <div className="min-h-dvh bg-white text-ink lg:flex relative">
      <OverviewSidebar active="Insights" />
      <div className="min-w-0 flex-1">
        <header className="flex min-h-[88px] items-center justify-between gap-5 border-b border-line bg-white/90 px-5 py-4 backdrop-blur-md sm:px-8">
          <div>
            <h1 className="font-inter text-2xl font-normal leading-7">Insights</h1>
            <p className="mt-2 text-base text-muted">Manage all market intelligence articles.</p>
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <Link href="/insights/new" className="inline-flex h-10 items-center gap-2 rounded bg-gold px-3 font-inter text-sm font-semibold text-white transition-colors hover:bg-[#ad8a20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 sm:px-4">
              <Icon name="plus" size={16} />
              <span>Add</span>
            </Link>
            <label className="hidden h-10 w-80 items-center gap-2.5 rounded-full border border-line bg-white px-4 text-[#a3a3a3] xl:flex">
              <Icon name="activity" size={14} />
              <span className="sr-only">Search articles</span>
              <input className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#a3a3a3]" placeholder="Articles" />
            </label>
            <button aria-label="Notifications" className="relative grid size-10 place-items-center rounded-full border border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
              <Icon name="bell" size={16} />
              <span className="absolute right-[9px] top-[9px] size-1.5 rounded-full bg-red-600" />
            </button>
          </div>
        </header>
        
        <main className="mx-auto max-w-[1620px] space-y-6 px-5 py-6 sm:px-8">
          <section aria-label="Article statistics" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => (
              <article key={stat.label} className="flex min-h-[128px] items-center gap-4 rounded border border-line bg-white p-6">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#f8f9fb] text-gold">
                  <Icon name={stat.icon} size={20} />
                </span>
                <div className={stat.label === "Published" ? "space-y-3" : "space-y-1.5"}>
                  <p className="font-display text-2xl font-semibold leading-6">{stat.value}</p>
                  <p className={`text-gray-500 ${stat.label.length > 16 ? "text-xs leading-4" : "text-base"}`}>{stat.label}</p>
                </div>
              </article>
            ))}
          </section>
          
          <section className="rounded border border-line bg-white p-5 sm:p-7" aria-label="Articles">
            <div className="overflow-x-auto rounded border border-line">
              <div className="min-w-[1040px]">
                <div className="grid h-14 grid-cols-5 bg-[#0f1f3a] text-base text-white">
                  <span className="grid place-items-center">Articles</span>
                  <span className="grid place-items-center">Author</span>
                  <span className="grid place-items-center">Publish Date</span>
                  <span className="grid place-items-center">Status</span>
                  <span className="grid place-items-center">Action</span>
                </div>
                <div>
                  {loading ? (
                    <div className="p-10 text-center text-gray-500">Loading articles...</div>
                  ) : articles.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">No articles found. Create one!</div>
                  ) : (
                    articles.map((article) => (
                      <article key={article._id} className="grid min-h-[96px] grid-cols-5 items-center border-b border-line last:border-b-0">
                        <div className="flex items-center justify-center gap-3 p-6">
                          <Image src={article.featureImage || "https://placeholder.com/64x48"} alt="" width={64} height={48} className="h-12 w-16 shrink-0 rounded object-cover" />
                          <h2 className="text-sm font-semibold leading-5 text-left">{article.title}</h2>
                        </div>
                        <span className="grid place-items-center p-6 text-base text-stone-500">{article.authorName}</span>
                        <span className="grid place-items-center p-6 text-base">{new Date(article.publishDate).toLocaleDateString()}</span>
                        <span className="grid place-items-center p-6">
                          <span className="rounded-full bg-green-600/10 px-3 py-1 text-xs font-semibold tracking-wide text-green-600">PUBLISHED</span>
                        </span>
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setViewArticle(article)} aria-label={`View ${article.title}`} className="grid size-8 place-items-center text-[#c9a227] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                            <Icon name="eye" size={18} />
                          </button>
                          <Link href={`/insights/${article._id}/edit`} aria-label={`Edit ${article.title}`} className="grid size-8 place-items-center text-[#c9a227] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                            <Icon name="edit" size={18} />
                          </Link>
                          <button onClick={() => handleDelete(article._id)} aria-label={`Delete ${article.title}`} className="grid size-8 place-items-center text-red-500 transition-opacity hover:opacity-70 focus-visible:outline-none">
                            <Icon name="trash" size={18} />
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* View Modal */}
      {viewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <header className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="text-xl font-bold font-display">View Article</h2>
              <button onClick={() => setViewArticle(null)} className="grid size-8 place-items-center rounded-full hover:bg-gray-100 transition-colors">
                <Icon name="x" size={20} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {viewArticle.featureImage && (
                <Image src={viewArticle.featureImage} alt={viewArticle.title} width={600} height={400} className="w-full h-64 object-cover rounded-md" />
              )}
              <div>
                <h1 className="text-3xl font-display font-bold text-ink">{viewArticle.title}</h1>
                <p className="text-sm text-muted mt-2">By {viewArticle.authorName} • {new Date(viewArticle.publishDate).toLocaleDateString()}</p>
              </div>
              <div className="prose max-w-none text-ink/80" dangerouslySetInnerHTML={{ __html: viewArticle.articleContent }} />
            </div>
            <footer className="border-t border-line px-6 py-4 flex justify-end">
              <button onClick={() => setViewArticle(null)} className="rounded border border-line px-6 py-2 font-semibold text-ink hover:bg-gray-50">Close</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
