"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";

interface CategoryData {
  kategori: string;
  total: number;
}

const COLORS = [
  "#34D399", // emerald-400
  "#818CF8", // indigo-400
  "#F9A8D4", // pink-300
  "#FCD34D", // amber-300
  "#60A5FA", // blue-400
  "#F87171", // red-400
];

export default function ExpanseCategory() {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/transaksi/expanse-by-category");
        const result = await response.json();
        if (result.success) {
          setData(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching expanse by category:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalExpense = data.reduce((acc, curr) => acc + curr.total, 0);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1).replace(/\.0$/, "")}jt`;
    } else if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(1).replace(/\.0$/, "")}rb`;
    }
    return `Rp ${amount}`;
  };

  if (loading) {
    return (
      <div className="bg-neutral-900 rounded-[32px] p-6 border border-white/5 animate-pulse h-[360px]">
        <div className="flex justify-between items-center mb-8">
          <div className="h-6 w-48 bg-white/5 rounded"></div>
          <div className="h-6 w-6 bg-white/5 rounded"></div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-48 h-48 rounded-full bg-white/5"></div>
          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 bg-white/5 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate SVG Chart Segments
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="bg-[#1C1C1E] dark:bg-[#111111] rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm p-6 relative overflow-hidden h-full">
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h3 className="text-xl font-bold text-white tracking-tight">
          Pengeluaran per Kategori
        </h3>
        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {data.length > 0 ? (
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          {/* Chart */}
          <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#333"
                strokeWidth="20"
              />
              {/* Segments */}
              {data.map((item, index) => {
                const percentage = item.total / totalExpense;
                const strokeLength = percentage * circumference;
                const strokeDasharray = `${strokeLength} ${circumference}`;
                const strokeDashoffset = -currentOffset;
                currentOffset += strokeLength;

                return (
                  <circle
                    key={index}
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth="20"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out origin-center"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-medium text-gray-400">Total</span>
              <span className="text-lg font-bold text-white mt-1">
                {formatCurrency(totalExpense)}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 w-full grid grid-cols-2 gap-y-6 gap-x-4">
            {data.map((item, index) => {
              const percentage = Math.round((item.total / totalExpense) * 100);
              return (
                <div key={index} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                      {item.kategori}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <p>Belum ada pengeluaran bulan ini</p>
        </div>
      )}
    </div>
  );
}