import Link from "next/link";
import { BlogPost } from "@/app/types/blog";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NewsCard({ post }: { post: BlogPost }) {
  return (
    <div className="max-w-sm relative p-[1px] rounded-2xl bg-gradient-to-br from-white/50 to-white/10 dark:from-white/10 dark:to-white/5 overflow-hidden shadow-xl">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-lime-400/30 dark:bg-lime-500/20 rounded-full blur-3xl"></div>

      <div className="relative h-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-[15px] p-6">
        <div className="h-40 rounded-xl overflow-hidden mb-5 relative group">
          <img
            src={post.img_thunmnail || post.meta.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 px-2 py-1 bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-md text-xs uppercase font-medium text-gray-900 dark:text-white border border-white/30 dark:border-white/10">
            {post.type}
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
         {post.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {post.summary}
        </p>
        <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
            {post.relation.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/60 text-white border border-blue-200/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
            <span className="bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 p-1.5 rounded-2xl text-xs text-gray-500 dark:text-gray-400">{formatDate(post.times.createdAt)}</span>
            <Link href={`/berita/${post.slug}`}>
            <button className="cursor-pointer px-4 py-2 bg-white text-black  hover:bg-blue-500 hover:text-white text-sm font-medium rounded-lg transition-colors border border-gray-200/50 dark:border-gray-700/50">
              Read
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
