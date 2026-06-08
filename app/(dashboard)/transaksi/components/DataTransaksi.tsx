"use client";

import { useEffect, useState } from "react";
import { Trash, Calendar, Wallet, Receipt, ArrowDownCircle, ArrowUpCircle, Filter, X, FileDown, Loader2, ChevronDown, DollarSign, Tag } from "lucide-react";

interface TransactionData {
  _id?: string;
  idTransaksi: string;
  type_transaksi: string;
  nominal_transaksi: string;
  tanggal_transaksi: string;
  kategori: string;
  nama_kategori?: string; // New field for permanent record
  idAccount: string;
  nama_asset?: string; // New field for permanent record
  description: string;
  transferId?: string;
  transferDirection?: string;
}

interface Account {
  idAccount: string;
  nama_asset: string;
  nama_akun: string;
}

export default function DataTransaksi() {
  const [transaksi, setTransaksi] = useState<TransactionData[]>([]);
  const [accounts, setAccounts] = useState<{ [key: string]: string }>({});
  const [categories, setCategories] = useState<{ [key: string]: string }>({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingTransactions, setIsFetchingTransactions] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [transferId, setTransferId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  // Filter state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterSumberDana, setFilterSumberDana] = useState("");
  const [filterMinNominal, setFilterMinNominal] = useState("");
  const [filterMaxNominal, setFilterMaxNominal] = useState("");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [accountList, setAccountList] = useState<{ idAccount: string; nama_asset: string; nama_akun: string }[]>([]);

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

  // handleDelete transfer
  const handleDeleteTF =  async () => {
    if (!transferId) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/transfer/${transferId}`, {
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
      console.error("Error deleting transfer:", error);
      alert("Terjadi kesalahan koneksi saat menghapus transfer.");
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  }

  // Fetch Accounts and Categories once on mount
  useEffect(() => {
    const fetchConstants = async () => {
      try {
        const [accResponse, catResponse] = await Promise.all([
          fetch("/api/account-card"),
          fetch("/api/kategori")
        ]);

        const [accData, catData] = await Promise.all([
          accResponse.json(),
          catResponse.json()
        ]);

        if (accData.success) {
          const accMap: { [key: string]: string } = {};
          accData.data.forEach((acc: Account) => {
            accMap[acc.idAccount] = `${acc.nama_asset} - ${acc.nama_akun}`;
          });
          setAccounts(accMap);
          setAccountList(accData.data);
        }

        if (catData.success) {
          const catMap: { [key: string]: string } = {};
          catData.data.forEach((cat: any) => {
            catMap[cat.idKategori] = cat.nama_kategori;
          });
          setCategories(catMap);
        }
      } catch (error) {
        console.error("Error fetching constants:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchConstants();
  }, []);

  // Fetching Data Transaksi
  const fetchTransactions = async (currentPage: number) => {
    setIsFetchingTransactions(true);
    try {
      let url = `/api/transaksi?page=${currentPage}&limit=${limit}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      if (filterType) url += `&typeTransaksi=${filterType}`;
      if (filterSumberDana) url += `&sumberDana=${filterSumberDana}`;
      if (filterMinNominal) url += `&minNominal=${filterMinNominal}`;
      if (filterMaxNominal) url += `&maxNominal=${filterMaxNominal}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Gagal mengambil data Transaksi");
      const data = await response.json();
      if (data.success) {
        setTransaksi(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.totalItems);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsFetchingTransactions(false);
    }
  };

  useEffect(() => {
    if (!isInitialLoading) {
      fetchTransactions(page);
    }
  }, [page, startDate, endDate, filterType, filterSumberDana, filterMinNominal, filterMaxNominal, isInitialLoading]);

  const handleResetFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilterType("");
    setFilterSumberDana("");
    setFilterMinNominal("");
    setFilterMaxNominal("");
    setPage(1);
  };

  const hasActiveFilter = startDate || endDate || filterType || filterSumberDana || filterMinNominal || filterMaxNominal;

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (filterType) params.append("typeTransaksi", filterType);
      if (filterSumberDana) params.append("sumberDana", filterSumberDana);
      if (filterMinNominal) params.append("minNominal", filterMinNominal);
      if (filterMaxNominal) params.append("maxNominal", filterMaxNominal);
      
      const url = `/api/transaksi/pdf${params.toString() ? `?${params.toString()}` : ""}`;

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengunduh PDF");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Laporan-Transaksi-${startDate || "30-Hari-Terakhir"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      console.error("Error downloading PDF:", error);
      alert(error.message || "Terjadi kesalahan saat mengunduh PDF.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };


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
      return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20";
    } else if (type_transaksi === "pengeluaran") {
      return "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20";
    } else if (type_transaksi === "transfer") {
      return "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20";
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-700">
      {/* Filter Section */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Filter Transaksi</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Filter data transaksi</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
            title="Cetak Riwayat Transaksi 30 Hari Kebelakang"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf || transaksi.length === 0}
              className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-white/10 text-white text-xs font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              {isDownloadingPdf ? "Memproses..." : "Cetak PDF"}
            </button>
          </div>
          
          {/* Toggle Advanced Filter */}
          <button
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl transition-all border ${
              showAdvancedFilter || hasActiveFilter
                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-white/10 hover:border-blue-200 dark:hover:border-blue-500/20'
            }`}
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAdvancedFilter ? 'rotate-180' : ''}`} />
            {hasActiveFilter ? 'Filter Aktif' : 'Filter Lanjutan'}
            {hasActiveFilter && (
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            )}
          </button>

          {hasActiveFilter && (
            <button
              onClick={handleResetFilter}
              className="p-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all group"
              title="Reset Semua Filter"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          )}
        </div>

        {/* Advanced Filter Panel */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showAdvancedFilter ? 'max-h-[500px] opacity-100 mt-5' : 'max-h-0 opacity-0'}`}>
          <div className="p-5 bg-gray-50/50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5 space-y-4">
            {/* Row 1: Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <label htmlFor="startDate" className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white mb-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  Dari Tanggal
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                />
              </div>
              <div className="relative">
                <label htmlFor="endDate" className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white mb-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  Sampai Tanggal
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                />
              </div>

              {/* Tipe Transaksi */}
              <div className="relative">
                <label htmlFor="filterType" className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white mb-2">
                  <Tag className="w-3.5 h-3.5 text-violet-500" />
                  Tipe Transaksi
                </label>
                <div className="relative">
                  <select
                    id="filterType"
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      setPage(1);
                    }}
                    className="w-full appearance-none bg-white dark:bg-neutral-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white pr-10 cursor-pointer"
                  >
                    <option value="" className="bg-white text-slate-900 dark:bg-neutral-800 dark:text-white">Semua Tipe</option>
                    <option value="pemasukan" className="bg-white text-slate-900 dark:bg-neutral-800 dark:text-white">Pemasukan</option>
                    <option value="pengeluaran" className="bg-white text-slate-900 dark:bg-neutral-800 dark:text-white">Pengeluaran</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Sumber Dana */}
              <div className="relative">
                <label htmlFor="filterSumberDana" className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white mb-2">
                  <Wallet className="w-3.5 h-3.5 text-amber-500" />
                  Sumber Dana
                </label>
                <div className="relative">
                  <select
                    id="filterSumberDana"
                    value={filterSumberDana}
                    onChange={(e) => {
                      setFilterSumberDana(e.target.value);
                      setPage(1);
                    }}
                    className="w-full appearance-none bg-white dark:bg-neutral-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white pr-10 cursor-pointer"
                  >
                    <option value="" className="bg-white text-slate-900 dark:bg-neutral-800 dark:text-white">Semua Sumber</option>
                    {accountList.map((acc) => (
                      <option key={acc.idAccount} value={acc.idAccount} className="bg-white text-slate-900 dark:bg-neutral-800 dark:text-white">
                        {acc.nama_asset} - {acc.nama_akun}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2: Nominal Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <label htmlFor="filterMinNominal" className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white mb-2">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  Nominal Minimum
                </label>
                <input
                  id="filterMinNominal"
                  type="number"
                  value={filterMinNominal}
                  onChange={(e) => {
                    setFilterMinNominal(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                  placeholder="Min. nominal"
                  min="0"
                />
              </div>
              <div className="relative">
                <label htmlFor="filterMaxNominal" className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white mb-2">
                  <DollarSign className="w-3.5 h-3.5 text-rose-500" />
                  Nominal Maksimum
                </label>
                <input
                  id="filterMaxNominal"
                  type="number"
                  value={filterMaxNominal}
                  onChange={(e) => {
                    setFilterMaxNominal(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                  placeholder="Max. nominal"
                  min="0"
                />
              </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilter && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Aktif:</span>
                {startDate && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-bold">
                    <Calendar className="w-3 h-3" /> Dari: {startDate}
                    <button onClick={() => { setStartDate(''); setPage(1); }} className="ml-0.5 hover:text-blue-800 dark:hover:text-blue-200"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {endDate && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-bold">
                    <Calendar className="w-3 h-3" /> Sampai: {endDate}
                    <button onClick={() => { setEndDate(''); setPage(1); }} className="ml-0.5 hover:text-blue-800 dark:hover:text-blue-200"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {filterType && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-lg text-[10px] font-bold capitalize">
                    <Tag className="w-3 h-3" /> {filterType}
                    <button onClick={() => { setFilterType(''); setPage(1); }} className="ml-0.5 hover:text-violet-800 dark:hover:text-violet-200"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {filterSumberDana && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-[10px] font-bold">
                    <Wallet className="w-3 h-3" /> {accounts[filterSumberDana] || filterSumberDana}
                    <button onClick={() => { setFilterSumberDana(''); setPage(1); }} className="ml-0.5 hover:text-amber-800 dark:hover:text-amber-200"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {filterMinNominal && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-bold">
                    <DollarSign className="w-3 h-3" /> Min: {Number(filterMinNominal).toLocaleString('id-ID')}
                    <button onClick={() => { setFilterMinNominal(''); setPage(1); }} className="ml-0.5 hover:text-emerald-800 dark:hover:text-emerald-200"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {filterMaxNominal && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg text-[10px] font-bold">
                    <DollarSign className="w-3 h-3" /> Max: {Number(filterMaxNominal).toLocaleString('id-ID')}
                    <button onClick={() => { setFilterMaxNominal(''); setPage(1); }} className="ml-0.5 hover:text-rose-800 dark:hover:text-rose-200"><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isInitialLoading || isFetchingTransactions ? (
        <div className="flex justify-center items-center p-20 bg-white dark:bg-neutral-900 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : transaksi.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-gray-50/50 dark:bg-neutral-900/50 rounded-[32px] border-2 border-dashed border-gray-200 dark:border-white/10">
          <div className="p-4 bg-white dark:bg-white/5 rounded-full shadow-sm mb-4">
            <Receipt className="w-10 h-10 text-gray-300 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {hasActiveFilter ? "Tidak ada transaksi yang cocok" : "Belum ada transaksi"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {hasActiveFilter ? "Coba sesuaikan filter Anda." : "Mulai catat transaksi harian Anda di sini."}
          </p>
          {hasActiveFilter && (
            <button 
              onClick={handleResetFilter}
              className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-95 transition-all text-sm"
            >
              Reset Filter
            </button>
          )}
        </div>
      ) : (
        <div className="w-full overflow-hidden bg-white dark:bg-neutral-900 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 dark:border-white/5">
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Deskripsi</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-center">Tipe</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Sumber Dana</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">Nominal</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {transaksi.map((item, index) => (
                  <tr key={item.idTransaksi || item._id || index} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{formatDate(item.tanggal_transaksi)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-left">
                        <span className="text-sm text-black dark:text-white font-medium capitalize">
                          {item.type_transaksi === "transfer" ? (
                            "Transfer"
                          ) : (
                            categories[item.kategori] || (
                              <div className="flex flex-col gap-1">
                                 <div className="flex items-center gap-2">
                                   <span className="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 px-2 py-0.5 rounded-md text-[10px] whitespace-nowrap">
                                     Kategori Telah Terhapus
                                   </span>
                                 </div>
                              </div>
                            )
                          )}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{item.description}</span>
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
                        <Wallet className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-tight">
                          {accounts[item.idAccount] || (
                            <div className="flex flex-col gap-1">
                              <span className="text-rose-400 text-[10px] italic border border-rose-100 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md w-fit">
                                Akun / Card di Hapus
                              </span>
                              {item.nama_asset && (
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 lowercase italic font-normal">
                                  Sebelumnya menggunakan: {item.nama_asset}
                                </span>
                              )}
                            </div>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-bold tracking-tight ${item.type_transaksi === 'pemasukan' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {item.type_transaksi === 'pemasukan' ? '+' : '-'} {formatCurrency(item.nominal_transaksi)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => {
                            setDeleteId(item.idTransaksi || item._id || null);
                            if (item.type_transaksi === "transfer") {
                              setTransferId(item.transferId || null);
                            } else {
                              setTransferId(null);
                            }
                          }}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-50 dark:border-white/5 bg-gray-50/30 dark:bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Menampilkan <span className="text-gray-900 dark:text-white">{(page - 1) * limit + 1}</span> - <span className="text-gray-900 dark:text-white">{Math.min(page * limit, totalItems)}</span> dari <span className="text-gray-900 dark:text-white">{totalItems}</span> transaksi
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-gray-200 dark:hover:border-white/10 rounded-lg transition-all disabled:opacity-30 disabled:pointer-events-none"
                >
                  Sebelumnya
                </button>
                
                <div className="flex items-center">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${
                            page === pageNum
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                              : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10 hover:border-gray-200 dark:hover:border-white/10 border border-transparent"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return <span key={pageNum} className="px-1 text-gray-300 dark:text-gray-600">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-gray-200 dark:hover:border-white/10 rounded-lg transition-all disabled:opacity-30 disabled:pointer-events-none"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white dark:bg-neutral-900 w-full max-w-sm rounded-[32px] shadow-2xl p-8 animate-in fade-in zoom-in duration-200 border border-white/5">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mb-6">
                <Trash className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Hapus Riwayat Transaksi</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Apakah anda yakin, ingin menghapus riwayat ini?
              </p>
              <div className="flex flex-col gap-3 w-full">
                {transferId ? (
                  <button
                    onClick={handleDeleteTF}
                    disabled={isDeleting}
                    className="w-full py-3 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isDeleting ? "Menghapus..." : "Ya, Hapus Data"}
                  </button>
                ) : (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full py-3 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isDeleting ? "Menghapus..." : "Ya, Hapus Data"}
                  </button>
                )}
                <button
                  onClick={() => {
                    setDeleteId(null);
                    setTransferId(null);
                  }}
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
