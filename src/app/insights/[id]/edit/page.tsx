"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { OverviewSidebar } from "@/features/overview/components/OverviewSidebar";
import { useState, FormEvent, useEffect, use } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Dynamically import react-quill-new to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const inputClass = "h-[54px] w-full rounded border border-line px-[17px] text-base text-ink outline-none transition-shadow placeholder:text-[#9b9b9b] focus:ring-2 focus:ring-gold/30";

export default function EditArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [featureImage, setFeatureImage] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${id}`);
        const data = await res.json();
        if (data.success && data.data) {
          const article = data.data;
          setTitle(article.title);
          setAuthorName(article.authorName);
          // Format date for date input (YYYY-MM-DD)
          const date = new Date(article.publishDate);
          setPublishDate(date.toISOString().split("T")[0]);
          setArticleContent(article.articleContent);
          setFeatureImage(article.featureImage);
        }
      } catch (err) {
        console.error(err);
        setMessage("Failed to load article details.");
      } finally {
        setFetching(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    
    try {
      setFeatureImage(URL.createObjectURL(file)); 
    } catch (err) {
      console.error(err);
    }
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        title,
        authorName,
        publishDate: new Date(publishDate).toISOString(),
        articleContent,
        featureImage
      };

      const res = await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Article updated successfully!");
        setTimeout(() => router.push("/insights"), 1000);
      } else {
        setMessage(data.message || "Failed to update article");
      }
    } catch (err: any) {
      setMessage(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="min-h-dvh bg-white text-ink lg:flex">
        <OverviewSidebar active="Insights" />
        <div className="flex-1 grid place-items-center"><p className="text-gray-500">Loading article...</p></div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white text-ink lg:flex">
      <OverviewSidebar active="Insights" />
      <div className="min-w-0 flex-1">
        <header className="flex min-h-[89px] items-center justify-between border-b border-line bg-white/90 px-5 py-4 backdrop-blur-md sm:px-8">
          <div>
            <h1 className="font-inter text-2xl leading-7">Edit Article</h1>
            <p className="mt-2 text-base text-muted">Manage all market intelligence articles.</p>
          </div>
          <Link href="/insights" className="rounded border-2 border-gold px-5 py-2.5 font-inter text-sm font-semibold text-gold transition-colors hover:bg-[#fffaf0]">
            Back to Articles
          </Link>
        </header>
        <main className="px-6 py-10 lg:px-6">
          <form onSubmit={submit} className="mx-auto max-w-[1532px] space-y-6">
            <section className="overflow-hidden rounded bg-white border border-line">
              <header className="px-7 py-6">
                <h2 className="font-display text-2xl font-bold leading-[1.2]">Article Information</h2>
                <p className="mt-0.5 text-base text-muted">Core metadata and publish status</p>
              </header>
              <div className="border-t border-[#e7e5e4] px-6 pb-7 pt-[29px]">
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="space-y-2">
                    <span className="font-inter text-base font-semibold">Article Title</span>
                    <input required value={title} onChange={e => setTitle(e.target.value)} className={inputClass} placeholder="Enter article title" />
                  </label>
                  <label className="space-y-2">
                    <span className="font-inter text-base font-semibold">Author Name</span>
                    <input required type="text" value={authorName} onChange={e => setAuthorName(e.target.value)} className={inputClass} placeholder="Type author name" />
                  </label>
                  <label className="space-y-2">
                    <span className="font-inter text-base font-semibold">Publish Date</span>
                    <input required type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} className={inputClass} />
                  </label>
                </div>
              </div>
            </section>
            
            <section className="rounded border border-line bg-white p-7">
              <h2 className="font-display text-2xl font-bold">Article Cover</h2>
              <p className="mt-1 text-base text-muted">Upload an image used across article listings and social previews.</p>
              <div className="mt-6 flex flex-col gap-6 md:flex-row">
                {featureImage ? (
                  <Image src={featureImage} alt="Article cover preview" width={240} height={160} className="h-40 w-60 rounded object-cover" />
                ) : (
                  <div className="h-40 w-60 rounded bg-gray-100 grid place-items-center text-gray-400">No image</div>
                )}
                <label className="flex min-h-40 flex-1 cursor-pointer flex-col items-center justify-center rounded border border-dashed border-line p-6 text-center text-muted">
                  <Icon name="plus" size={20} />
                  <span className="mt-2 font-inter font-semibold text-ink">Change cover image</span>
                  <span className="mt-1 text-sm">PNG, JPG or WebP</span>
                  <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageUpload} />
                </label>
              </div>
            </section>
            
            <section className="rounded border border-line bg-white p-7">
              <label className="block space-y-4">
                <div>
                  <span className="font-display text-2xl font-bold block">Article Content</span>
                  <span className="block text-base text-muted">Write the story that readers will see.</span>
                </div>
                <div className="h-[400px] pb-10">
                  <ReactQuill theme="snow" value={articleContent} onChange={setArticleContent} className="h-full" />
                </div>
              </label>
            </section>
            
            {message && <p className={`text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
            
            <footer className="flex justify-end gap-4 pb-10">
              <Link href="/insights" className="rounded border-2 border-gold px-8 py-4 font-inter font-semibold text-gold">
                Cancel
              </Link>
              <button disabled={loading} type="submit" className="rounded bg-gold px-8 py-4 font-inter font-semibold text-white transition-colors hover:bg-[#ad8a20] disabled:opacity-50">
                {loading ? "Updating..." : "Update Article"}
              </button>
            </footer>
          </form>
        </main>
      </div>
    </div>
  );
}
