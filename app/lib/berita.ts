import { BlogResponse } from "@/app/types/blog";

const BASE_URL = "https://cms-myfinance.vercel.app/api/berita";

export async function getBerita(
  page: number = 1,
  limit: number = 12
): Promise<BlogResponse> {
  const res = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`, {
    // ISR: revalidate tiap 60 detik, sesuaikan kebutuhan
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Gagal fetch berita: ${res.status}`);
  }

  return res.json();
}
