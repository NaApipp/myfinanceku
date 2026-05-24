// app/pengaturan/panduan-penggunaan/tabs/index.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Tabs() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "PanduanPenggunaan";

  const tabs = [
    { name: "Panduan fitur", value: "PanduanPenggunaan" },
    { name: "FAQ", value: "Faq" },
  ];

  return (
    <div className="flex flex-row gap-6 w-full border-b border-gray-200 dark:border-gray-800/60 mt-6 transition-colors">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <Link
            key={tab.value}
            href={`/pengaturan/panduan-penggunaan?tab=${tab.value}`}
            className={`pb-3 text-sm font-medium transition-colors relative
                      ${isActive 
                        ? "text-indigo-600 dark:text-indigo-500" 
                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                      }`}
          >
            {tab.name}
            {isActive && (
              <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-indigo-600 dark:bg-indigo-500 rounded-t-md transition-colors" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
