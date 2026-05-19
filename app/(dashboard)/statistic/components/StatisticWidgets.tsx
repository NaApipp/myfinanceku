"use client";

import { useEffect, useState } from "react";
import { Lightbulb, CalendarDays, ShoppingBag } from "lucide-react";

interface WidgetData {
  topCategory: { name: string; total: number } | null;
  largestTransaction: {
    name: string;
    category: string;
    date: string;
    amount: number;
  } | null;
  dayTotals: number[];
}

export default function StatisticWidgets() {
  const [data, setData] = useState<WidgetData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/transaksi/statistic-widgets");
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching widget data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount).replace("Rp", "Rp ");
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(d);
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-neutral-900 rounded-[20px] p-6 border border-white/5 animate-pulse h-32"></div>
        ))}
      </div>
    );
  }

  const { topCategory, largestTransaction, dayTotals } = data;
  
  // Calculate max day for chart
  const maxDayIndex = dayTotals.indexOf(Math.max(...dayTotals));
  const maxDayAmount = dayTotals[maxDayIndex];
  const days = ["S", "S", "R", "K", "J", "S", "M"];
  const dayNames = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const highestDayName = maxDayAmount > 0 ? dayNames[maxDayIndex] : "-";

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Widget 1: Kategori Terboros */}
      <div className="bg-[#1C1C1E] dark:bg-[#111111] rounded-[24px] border border-gray-100 dark:border-white/5 shadow-sm p-6 flex flex-col justify-between transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-white text-lg tracking-tight">Kategori Terboros</h3>
        </div>
        
        {topCategory ? (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400 font-medium">{topCategory.name}</span>
              <span className="font-bold text-white">{formatCurrency(topCategory.total)}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2">
              <div className="bg-emerald-400 h-2 rounded-full w-[80%]"></div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Belum ada data pengweluaran</p>
        )}
      </div>

      {/* Widget 2: Transaksi Terbesar */}
      <div className="bg-[#1C1C1E] dark:bg-[#111111] rounded-[24px] border border-gray-100 dark:border-white/5 shadow-sm p-6 relative overflow-hidden transition-colors">
        {/* Decorative left bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 rounded-l-full"></div>
        
        <h3 className="font-bold text-white text-lg tracking-tight mb-5">Transaksi Terbesar</h3>
        
        {largestTransaction ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm md:text-base line-clamp-1">{largestTransaction.name}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                  {formatDate(largestTransaction.date)} • {largestTransaction.category}
                </p>
              </div>
            </div>
            <span className="font-bold text-white text-sm md:text-base whitespace-nowrap pl-2">
              {formatCurrency(largestTransaction.amount)}
            </span>
          </div>
        ) : (
          <p className="text-gray-500">Belum ada data transaksi</p>
        )}
      </div>
    </div>
  );
}
