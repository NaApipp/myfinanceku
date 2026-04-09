"use client";

import { useEffect, useState } from "react";
import { PieChart, AlertCircle } from "lucide-react";

interface AnggaranData {
  idAnggaran: string;
  kategori_anggaran: string;
  limit_anggaran: number;
  nama_anggaran: string;
}

export default function BudgetsOverview() {
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<AnggaranData[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: string }>({});
  const [spentMap, setSpentMap] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [angResponse, catResponse, transResponse] = await Promise.all([
          fetch("/api/anggaran"),
          fetch("/api/kategori"),
          fetch("/api/transaksi?limit=100") // Fetch more for calculation
        ]);

        const [angData, catData, transData] = await Promise.all([
          angResponse.json(),
          catResponse.json(),
          transResponse.json()
        ]);

        if (catData.success) {
          const catMap: { [key: string]: string } = {};
          catData.data.forEach((cat: any) => {
            catMap[cat.idKategori] = cat.nama_kategori;
          });
          setCategories(catMap);
        }

        if (angData.success) {
          setBudgets(angData.data || []);
        }

        if (transData.success) {
          const spent: { [key: string]: number } = {};
          transData.data.forEach((t: any) => {
            if (t.type_transaksi === "pengeluaran") {
              const nominal = Number(t.nominal_transaksi);
              spent[t.kategori] = (spent[t.kategori] || 0) + nominal;
            }
          });
          setSpentMap(spent);
        }
      } catch (error) {
        console.error("Error fetching budgets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[32px] p-6 border border-gray-100 animate-pulse h-64">
        <div className="h-6 w-32 bg-gray-100 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full bg-gray-50 rounded"></div>
              <div className="h-2 w-full bg-gray-100 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-gray-900">Anggaran</h3>
        <a href="/anggaran" className="text-sm font-bold text-blue-600 hover:text-blue-700">Lihat Semua</a>
      </div>

      <div className="space-y-6 flex-1">
        {budgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
             <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-gray-300">
               <PieChart className="w-6 h-6" />
             </div>
             <p className="text-sm text-gray-500 font-medium">Belum ada anggaran diatur</p>
          </div>
        ) : (
          budgets.slice(0, 3).map((item) => {
            const limit = Number(item.limit_anggaran);
            const spent = spentMap[item.kategori_anggaran] || 0;
            const percentage = Math.min(Math.round((spent / limit) * 100), 100);
            const isCritical = percentage > 90;

            return (
              <div key={item.idAnggaran} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">
                      {item.nama_anggaran}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      {categories[item.kategori_anggaran] || "Kategori Umum"} • {formatCurrency(spent)} / {formatCurrency(limit)}
                    </span>
                  </div>
                  <span className={`text-xs font-black ${isCritical ? 'text-rose-600' : 'text-blue-600'}`}>
                    {percentage}%
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${isCritical ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-blue-500'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
