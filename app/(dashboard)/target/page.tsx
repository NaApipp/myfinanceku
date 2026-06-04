"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import FormAddTarget from "./components/formAddTarget";
import DataTarget from "./components/DataTarget";
import LockedFeature from "@/app/components/LockedFeature";

export default function TargetPage() {
  const [userLevel, setUserLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.level) {
          setUserLevel(parsed.level);
        } else {
          setUserLevel("Basic");
        }
      } catch (e) {
        setUserLevel("Basic");
      }
    } else {
      setUserLevel("Basic");
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // Only Medium & Advanced users can access Target Menabung (Basic cannot)
  if (userLevel?.toLowerCase() === "basic") {
    return (
      <LockedFeature 
        requiredLevel="Medium" 
        featureName="Target Menabung" 
        description="Wujudkan impian finansial Anda dengan alokasi tabungan disiplin terarah per target keinginan."
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-black transition-colors duration-300 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="uppercase text-gray-900 dark:text-gray-400 font-bold text-sm">
              Perencanaan Keuangan
            </p>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-black dark:text-white tracking-tight">
                Target Menabung
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-sm tracking-wide">
              Wujudkan impian Anda dengan alokasi dana yang terukur dan disiplin
              finansial yang dikurasi.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <FormAddTarget />
          </div>
        </div>

        {/* Data Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-black dark:text-white tracking-tight">
              Daftar Target
            </h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 rounded-full border border-gray-100 dark:border-white/5 shadow-sm transition-colors duration-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Live Sync Enabled
              </span>
            </div>
          </div>
          <DataTarget />
        </div>
      </div>
    </div>
  );
}
