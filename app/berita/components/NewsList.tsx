"use client";

import { useState, useTransition } from "react";
import { BlogPost } from "@/app/types/blog";
import { Pagination } from "@/app/types/blog";
import NewsCard from "./NewsCard";

interface Props {
  initialPosts: BlogPost[];
  initialPagination: Pagination;
}

export default function NewsList({ initialPosts, initialPagination }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [pagination, setPagination] = useState(initialPagination);
  const [isPending, startTransition] = useTransition();

  const hasMore = pagination.page < pagination.totalPages;

  const loadMore = () => {
    startTransition(async () => {
      const nextPage = pagination.page + 1;
      const res = await fetch(
        `/api/berita-proxy?page=${nextPage}&limit=${pagination.limit}`
      );
      const json = await res.json();
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const newPosts = (json.data as typeof prev).filter(
          (p) => !existingIds.has(p._id)
        );
        const merged = [...prev, ...newPosts];
        return merged.sort(
          (a, b) =>
            new Date(b.times.createdAt).getTime() -
            new Date(a.times.createdAt).getTime()
        );
      });
      setPagination(json.pagination);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-center mt-3 mb-2">
        <h2 className="text-xl font-bold text-center">Latest Intelligence</h2>
      </div>
      <div className="flex flex-col md:flex-row md:justify-center gap-6 p-6">
        {posts.map((post) => (
          <NewsCard key={post._id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="px-6 py-2 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50"
          >
            {isPending ? "Memuat..." : "Muat Lebih Banyak"}
          </button>
        </div>
      )}
    </div>
  );
}