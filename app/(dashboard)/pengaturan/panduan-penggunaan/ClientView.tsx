// app/(dashboard)/pengaturan/panduan-penggunaan/ClientView.tsx

import dynamic from "next/dynamic";
import Tabs from "./tabs";

const PanduanPenggunaan = dynamic(() => import("./tabs/PanduanPenggunaan"));
const Faq = dynamic(() => import("./tabs/Faq"));

export default async function PanduanPenggunaanPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "PanduanPenggunaan" } = await searchParams;

  return (
    <div className="w-full text-gray-900 dark:text-white bg-white dark:bg-[#121212] min-h-screen p-6 md:p-8 transition-colors">
      <div className="flex flex-col gap-2 md:pt-4 pt-16 mb-2">
        <h1 className="text-2xl font-bold">
          Bantuan & panduan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Pilih topik yang ingin kamu pelajari
        </p>
      </div>

      <Tabs />

      <div className="mt-8">
        {tab === "Faq" && <Faq />}
        {tab === "PanduanPenggunaan" && <PanduanPenggunaan />}
      </div>
    </div>
  );
}
