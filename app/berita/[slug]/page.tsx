import { notFound } from "next/navigation";
import Link from "next/link";
import { getBeritaBySlug } from "@/app/lib/api/blog";
import type { Metadata } from "next";
import { ArrowLeft, Clock, User, Calendar, Tag } from "lucide-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBeritaBySlug(slug);

  if (!post) return { title: "Berita tidak ditemukan" };

  return {
    title: post.meta.title || post.title,
    description: post.meta.description || post.summary,
    keywords: post.meta.keyword,
    openGraph: {
      title: post.meta.title || post.title,
      description: post.meta.description || post.summary,
      images: post.meta.image ? [post.meta.image] : [post.img_thunmnail],
    },
  };
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBeritaBySlug(slug);

  if (!post) {
    notFound();
    return null;
  }

  const tags = [
    ...new Set(
      (post.relation.tags ?? [])
        .map((t: string) => t.trim())
        .filter((t): t is string => t.length > 0)
    ),
  ] as string[];

  const readTime = estimateReadTime(post.content);
  const initials = getInitials(post.relation.author || "?");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      {post.img_thunmnail && (
        <div className="relative w-full h-[420px] md:h-[540px] overflow-hidden">
          <img
            src={post.img_thunmnail}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />

          {/* Back button */}
          <div className="absolute top-6 left-6">
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all duration-200"
            >
              <ArrowLeft size={15} />
              Kembali
            </Link>
          </div>

          {/* Category badge */}
          <div className="absolute top-6 right-6">
            <span className="px-3 py-1.5 rounded-full bg-blue-500/80 backdrop-blur-md border border-blue-400/30 text-white text-xs font-semibold uppercase tracking-wider">
              {post.type}
            </span>
          </div>

          {/* Title + meta overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-10 md:px-12">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  <span>{formatDate(post.times.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} />
                  <span>{readTime} menit baca</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* No-image fallback header */}
        {!post.img_thunmnail && (
          <div className="mb-8">
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors mb-6"
            >
              <ArrowLeft size={15} />
              Kembali ke Berita
            </Link>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-3 py-1 rounded-full mb-4">
              {post.type}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-gray-900 dark:text-white">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar size={13} />
                <span>{formatDate(post.times.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} />
                <span>{readTime} menit baca</span>
              </div>
            </div>
          </div>
        )}

        {/* Author card */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 backdrop-blur-sm mb-8 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-100">
              <User size={13} className="text-gray-400" />
              {post.relation.author}
            </div>
            <p className="text-xs text-gray-400">Penulis</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-gray-200 dark:border-gray-800 mb-8" />

        {/* Article content */}
        <article className="prose prose-neutral dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-[15px] whitespace-pre-line">
          {post.content}
        </article>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <Tag size={13} />
              Topik
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back to list */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={15} />
            Lihat Berita Lainnya
          </Link>
        </div>
      </main>
    </div>
  );
}