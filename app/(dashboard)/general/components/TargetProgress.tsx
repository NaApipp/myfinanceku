"use client";

import { useEffect, useState } from "react";
import { Target, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";

interface TargetData {
  idTarget: string;
  nama_target: string;
  tanggal_target: string;
  jumlah_target: number;
  target_now: number;
  prioritas: string;
}

export default function TargetProgress() {
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<TargetData | null>(null);

  useEffect(() => {
    const fetchTarget = async () => {
      try {
        const response = await fetch("/api/target");
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          // Get the most prioritized target or just the first one
          setTarget(result.data[0]);
        }
      } catch (error) {
        console.error("Error fetching target:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTarget();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-black dark:bg-neutral-900 rounded-[40px] p-8 border border-white/10 animate-pulse h-full min-h-[220px]">
        <div className="h-6 w-32 bg-white/10 rounded mb-6"></div>
        <div className="h-10 w-48 bg-white/10 rounded mb-4"></div>
        <div className="h-2 w-full bg-white/10 rounded-full"></div>
      </div>
    );
  }

  if (!target) {
    return (
      <div className="bg-black dark:bg-neutral-900 rounded-[40px] p-8 text-white h-full flex flex-col justify-center items-center text-center relative overflow-hidden group">
        <Target className="w-12 h-12 text-white/20 mb-4 group-hover:scale-110 transition-transform duration-500" />
        <h3 className="text-xl font-bold mb-2">Mulai Tabungan</h3>
        <p className="text-white/50 text-sm mb-6 max-w-[200px]">Atur target impian Anda dan mulai kumpulkan dana sekarang.</p>
        <Link href="/target" className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition-transform">
          Buat Target
        </Link>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
      </div>
    );
  }

  const percentage = Math.min(Math.round((target.target_now / target.jumlah_target) * 100), 100);

  return (
    <div className="bg-black dark:bg-neutral-900 border border-white/5 rounded-[40px] p-8 text-white h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8">
        <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:rotate-12 transition-transform duration-500">
          <Target className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div>
           <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
            Target Utama: {target.prioritas}
          </p>
          <h3 className="text-2xl font-black tracking-tight mb-2 truncate pr-16">{target.nama_target}</h3>
          
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-3xl font-black">{percentage}%</span>
            <span className="text-white/40 text-xs font-medium">Tercapai</span>
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
              <span className="text-white/40">Progress</span>
              <span>{formatCurrency(target.target_now)} / {formatCurrency(target.jumlah_target)}</span>
            </div>
            <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[10px] text-white/60 font-medium">Progress sangat baik!</span>
            </div>
            <Link href="/target" className="flex items-center gap-1 text-[10px] font-bold text-white/80 hover:text-white transition-colors">
              Detail <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-30" />
    </div>
  );
}
