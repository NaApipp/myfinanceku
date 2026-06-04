"use client";

import { useState } from "react";
import { Lock, Crown, ChevronRight, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import UpgradePlanModal from "./UpgradePlanModal";

interface LockedFeatureProps {
  requiredLevel: "Medium" | "Advanced";
  featureName: string;
  description: string;
}

export default function LockedFeature({ requiredLevel, featureName, description }: LockedFeatureProps) {
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 md:p-12 transition-colors duration-300">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Locked Screen Card */}
      <div className="relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-gray-100 dark:border-white/5 w-full max-w-2xl rounded-[32px] p-8 sm:p-12 shadow-2xl text-center flex flex-col items-center">
        
        {/* Animated Lock Badge */}
        <div className="relative mb-8 group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-amber-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
          <div className="relative w-20 h-20 rounded-3xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <Lock className="w-8 h-8 text-blue-400 group-hover:hidden transition-all" />
            <Crown className="w-8 h-8 text-amber-500 hidden group-hover:block transition-all animate-bounce" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1 border-2 border-white dark:border-neutral-900 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Level Requirement Badge */}
        <span className="text-[10px] uppercase tracking-widest font-black px-4.5 py-1.5 bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300 rounded-full border border-amber-500/20 mb-6 flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5" /> Paket {requiredLevel} Diperlukan
        </span>

        {/* Text */}
        <h1 className="text-3xl sm:text-4xl font-black text-black dark:text-white tracking-tight mb-4 leading-none">
          Fitur {featureName} Terkunci
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md font-medium leading-relaxed mb-10">
          {description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link 
            href="/general"
            className="flex items-center justify-center gap-2 px-8 py-4.5 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 text-sm font-bold transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali Dashboard
          </Link>
          <a
            onClick={() => setIsUpgradeOpen(true)}
            // href="/upgrade"
            className="flex items-center justify-center gap-2 px-8 py-4.5 rounded-full bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black text-sm font-bold shadow-xl shadow-black/10 dark:shadow-white/10 transition-all active:scale-95 group"
          >
            Upgrade Level Sekarang <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Feature Preview Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-gray-100 dark:border-white/5 w-full text-left">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              Analisis grafik & statistik mendalam
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              Perencanaan anggaran yang terukur
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              Target impian keuangan terarah
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              Dukungan prioritas eksklusif
            </span>
          </div>
        </div>
      </div>

      <UpgradePlanModal 
        isOpen={isUpgradeOpen} 
        onClose={() => setIsUpgradeOpen(false)} 
      />
    </div>
  );
}
