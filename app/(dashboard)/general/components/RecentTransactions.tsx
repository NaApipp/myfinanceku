"use client";

import { useEffect, useState } from "react";
import { Calendar, Receipt, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

interface TransactionData {
  idTransaksi: string;
  type_transaksi: string;
  nominal_transaksi: string;
  tanggal_transaksi: string;
  kategori: string;
  nama_kategori?: string;
  idAccount: string;
  description: string;
}

export default function RecentTransactions() {
  const [transaksi, setTransaksi] = useState<TransactionData[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transResponse, catResponse] = await Promise.all([
          fetch("/api/transaksi?limit=5"),
          fetch("/api/kategori")
        ]);

        const [transData, catData] = await Promise.all([
          transResponse.json(),
          catResponse.json()
        ]);

        if (catData.success) {
          const catMap: { [key: string]: string } = {};
          catData.data.forEach((cat: any) => {
            catMap[cat.idKategori] = cat.nama_kategori;
          });
          setCategories(catMap);
        }

        if (transData.success) {
          setTransaksi(transData.data);
        }
      } catch (error) {
        console.error("Error fetching recent transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[32px] p-6 border border-gray-100 animate-pulse h-64">
        <div className="h-6 w-48 bg-gray-100 rounded mb-6"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
               <div className="flex flex-col gap-1">
                 <div className="h-4 w-24 bg-gray-100 rounded"></div>
                 <div className="h-3 w-32 bg-gray-100 rounded"></div>
               </div>
             </div>
             <div className="h-4 w-20 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-lg text-gray-900">Transaksi Terakhir</h3>
        <a href="/transaksi" className="text-sm font-bold text-blue-600 hover:text-blue-700">Lihat Semua</a>
      </div>
      
      <div className="flex-1">
        {transaksi.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-full">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <Receipt className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Belum ada transaksi</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 px-6">
            {transaksi.map((item) => (
              <div key={item.idTransaksi} className="py-4 flex items-center justify-between group transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    item.type_transaksi === 'pemasukan' 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-rose-50 text-rose-600'
                  }`}>
                    {item.type_transaksi === 'pemasukan' ? (
                      <ArrowDownCircle className="w-5 h-5" />
                    ) : (
                      <ArrowUpCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 capitalize flex items-center gap-2">
                      {categories[item.kategori] || (
                        <>
                          <span className="text-rose-500 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight">Terhapus</span>
                        </>
                      )}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{formatDate(item.tanggal_transaksi)} • {item.description || 'Tanpa keterangan'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${
                    item.type_transaksi === 'pemasukan' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {item.type_transaksi === 'pemasukan' ? '+' : '-'} {formatCurrency(item.nominal_transaksi)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
