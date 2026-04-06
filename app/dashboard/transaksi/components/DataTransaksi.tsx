"use client";

import { useEffect, useState } from "react";
import { Trash, Calendar, Wallet, Receipt, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

interface TransactionData {
  idTransaksi: string;
  type_transaksi: string;
  nominal_transaksi: string;
  tanggal_transaksi: string;
  kategori: string;
  idAccount: string;
  nama_asset?: string; // New field for permanent record
  description: string;
}

interface Account {
  idAccount: string;
  nama_asset: string;
  nama_akun: string;
}

export default function DataTransaksi() {
  const [transaksi, setTransaksi] = useState<TransactionData[]>([]);
  const [accounts, setAccounts] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // handleDelete
  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/transaksi/${deleteId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      
      if (data.success) {
        setDeleteId(null);
        window.location.reload();
      } else {
        alert(data.message || "Gagal menghapus transaksi.");
        setDeleteId(null);
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Terjadi kesalahan koneksi saat menghapus transaksi.");
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Fetching Data Transaksi & Accounts
  const fetchData = async () => {
    try {
      // Fetch Accounts first for mapping
      const accResponse = await fetch("/api/account-card");
      const accData = await accResponse.json();
      if (accData.success) {
        const accMap: { [key: string]: string } = {};
        accData.data.forEach((acc: Account) => {
          accMap[acc.idAccount] = `${acc.nama_asset} - ${acc.nama_akun}`;
        });
        setAccounts(accMap);
      }

      const response = await fetch("/api/transaksi");
      if (!response.ok) throw new Error("Gagal mengambil data Transaksi");
      const data = await response.json();
      if (data.success) {
        setTransaksi(data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
      year: "numeric",
    }).format(date);
  };

  const getStyleKategori = (type_transaksi: string) => {
    if (type_transaksi === "pemasukan") {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    } else {
      return "bg-rose-50 text-rose-600 border-rose-100";
    }
  };

  if (transaksi.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-200 mt-6">
        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
          <Receipt className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Belum ada transaksi</h3>
        <p className="text-gray-500 text-sm mt-1">Mulai catat transaksi harian Anda di sini.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-white rounded-[32px] border border-gray-100 shadow-sm mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Deskripsi</th>
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Tipe</th>
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Sumber Dana</th>
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Nominal</th>
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transaksi.map((item, index) => (
              <tr key={item.idTransaksi || index} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{formatDate(item.tanggal_transaksi)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-left">
                    <span className="text-sm text-black font-medium capitalize">{item.kategori}</span>
                    <span className="text-xs text-gray-400">{item.description}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1.5 ${getStyleKategori(item.type_transaksi)}`}>
                      {item.type_transaksi === 'pemasukan' ? (
                        <ArrowDownCircle className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpCircle className="w-3.5 h-3.5" />
                      )}
                      {item.type_transaksi}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-tight">
                      {accounts[item.idAccount] || (
                        <div className="flex flex-col gap-1">
                          <span className="text-rose-400 text-[10px] italic border border-rose-100 bg-rose-50 px-2 py-0.5 rounded-md w-fit">
                            Akun / Card di Hapus
                          </span>
                          {item.nama_asset && (
                            <span className="text-[10px] text-gray-400 lowercase italic font-normal">
                              Sebelumnya menggunakan: {item.nama_asset}
                            </span>
                          )}
                        </div>
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`text-sm font-bold tracking-tight ${item.type_transaksi === 'pemasukan' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.type_transaksi === 'pemasukan' ? '+' : '-'} {formatCurrency(item.nominal_transaksi)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button 
                      onClick={() => setDeleteId(item.idTransaksi)}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mb-6">
                <Trash className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Hapus Riwayat Transaksi</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Apakah anda yakin, ingin menghapus riwayat ini?
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full py-3 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isDeleting ? "Menghapus..." : "Ya, Hapus Data"}
                </button>
                <button
                  onClick={() => setDeleteId(null)}
                  disabled={isDeleting}
                  className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
