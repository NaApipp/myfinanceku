import { getBerita } from "@/app/lib/berita";
import FeaturedCard from "./components/FeaturedCard";
import NewsList from "./components/NewsList";

import Navbar from "../home/components/layout/Navbar";
import Footer from "../home/components/layout/Footer";

export default async function BlogPage() {
  const { data, pagination } = await getBerita(1, 12);

  if (data.length === 0) {
    return <p className="text-center py-20">Belum ada berita.</p>;
  }

  const sorted = [...data].sort(
    (a, b) =>
      new Date(b.times.createdAt).getTime() -
      new Date(a.times.createdAt).getTime()
  );
  const [featured, ...rest] = sorted;

  return (
    <div className="">
      <Navbar />
      <main className="py-8 px-4">
        <FeaturedCard post={featured} />
        <NewsList initialPosts={rest} initialPagination={pagination} />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
