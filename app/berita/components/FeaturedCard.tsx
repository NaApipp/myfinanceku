import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/app/types/blog";
import { ArrowRight } from "lucide-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <section className="text-center max-w-3xl mx-auto py-12 border-b border-gray-200">
      <span className="inline-block text-xs font-semibold tracking-wide text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-4 uppercase">
        Newest Article
      </span>
      <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
        {post.title}
      </h1>
      <p className="text-gray-600 mb-6">{post.summary}</p>
      <Link href={`/berita/${post.slug}`}>
        <button className="inline-flex items-center gap-1 text-sm font-bold bg-white p-2 rounded-xl text-black hover:bg-white/60 transition-colors">
          Baca Selengkapnya
          <ArrowRight size={20} />
        </button>
      </Link>
      <p className="text-xs text-gray-400 mt-4">
        {post.relation.author} · {formatDate(post.times.createdAt)}
      </p>
    </section>
  );
}