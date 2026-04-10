"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CreditCard,
  Building2,
  Smartphone,
  Trash,
  Edit,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

interface AccountData {
  idAccount: string;
  type_asset: string;
  nama_asset: string;
  saldo_awal: string;
  nama_akun: string;
}

export default function DataAccoundCard() {
  const [data, setData] = useState<AccountData[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountData | null>(
    null,
  );
  const [formData, setFormData] = useState({
    type_asset: "",
    saldo_awal: 0,
    nama_asset: "",
    nama_akun: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  // Confirmation States
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const assetChoices: { [key: string]: string[] } = {
    bank: [
      "BCA",
      "BNI",
      "BRI",
      "Mandiri",
      "BSI",
      "Cimb",
      "Permata",
      "Maybank",
      "Btn",
      "Bank Lainnya",
    ],
    "e-wallet": ["GoPay", "OVO", "DANA", "ShopeePay", "LinkAja", "Flip"],
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("/api/account-card");
        const result = await response.json();
        if (result.success) {
          setData(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  const handleDelete = async () => {
    if (!accountToDelete) return;

    setIsActionLoading(true);
    try {
      const response = await fetch(`/api/account-card/${accountToDelete}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setData((prev) =>
          prev.filter((item) => item.idAccount !== accountToDelete),
        );
        setIsDeleteConfirmOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const confirmDelete = (idAccount: string) => {
    setAccountToDelete(idAccount);
    setIsDeleteConfirmOpen(true);
  };

  const handleEditClick = (item: AccountData) => {
    setSelectedAccount(item);
    setFormData({
      type_asset: item.type_asset,
      saldo_awal: Number(item.saldo_awal),
      nama_asset: item.nama_asset,
      nama_akun: item.nama_akun,
    });
    setIsEditOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!selectedAccount) return;

    setIsActionLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await fetch(
        `/api/account-card/${selectedAccount.idAccount}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const result = await response.json();
      if (result.success) {
        setMessage({ type: "success", text: "Asset berhasil diperbarui!" });
        setIsUpdateConfirmOpen(false);
        setTimeout(() => {
          setIsEditOpen(false);
          window.location.reload();
        }, 1000);
      } else {
        setMessage({
          type: "error",
          text: result.message || "Gagal memperbarui asset.",
        });
      }
    } catch (error) {
      console.error("Error updating account:", error);
      setMessage({ type: "error", text: "Terjadi kesalahan koneksi." });
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 bg-gray-100 animate-pulse rounded-[32px] border border-gray-200"
          />
        ))}
      </div>
    );
  }
  if (data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 mt-8 bg-gray-50 dark:bg-neutral-900/50 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-white/10">
          <div className="w-20 h-20 bg-white dark:bg-white/5 rounded-full flex items-center justify-center shadow-sm mb-4">
            <CreditCard className="w-10 h-10 text-gray-300 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Belum ada Akun Kartu / Wallet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Mulai rencanakan impian finansial Anda sekarang.
          </p>
        </div>
      );
    }

  return (
    <div className="flex flex-col gap-8 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <div
            key={item.idAccount}
            className="group relative bg-white dark:bg-neutral-900 p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-white/5 shadow-sm ${item.type_asset === "bank" ? "bg-blue-50 dark:bg-blue-500/10" : "bg-purple-50 dark:bg-purple-500/10"}`}
              >
                {item.type_asset === "bank" ? (
                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Smartphone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => confirmDelete(item.idAccount)}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-800 dark:hover:text-red-400 transition-colors"
                >
                  <Trash className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEditClick(item)}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-800 dark:hover:text-blue-400 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-black dark:text-white text-xl font-extrabold uppercase tracking-widest">
                {item.nama_asset}
              </p>
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 truncate">
                {item.nama_akun}
              </h3>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50 dark:border-white/5 flex items-end justify-between">
              <div>
                <p className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-bold tracking-tight mb-1">
                  Saldo Tersedia
                </p>
                <p className="text-2xl font-black text-black dark:text-white tracking-tight">
                  {formatCurrency(item.saldo_awal)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Rendered outside the grid to avoid stacking issues */}
      {isEditOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsEditOpen(false)}
          />

          <div className="relative bg-white dark:bg-neutral-900 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/5">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-xl font-bold text-black dark:text-white">Ubah Asset</h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsUpdateConfirmOpen(true);
                }}
                className="p-4 flex flex-col gap-6 w-full"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="type_asset"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase"
                  >
                    Pilih Tipe Aset
                  </label>
                  <select
                    id="type_asset"
                    name="type_asset"
                    value={formData.type_asset}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 dark:bg-black text-black dark:text-white"
                  >
                    <option value="">Pilih Tipe Asset</option>
                    <option value="bank">Bank</option>
                    <option value="e-wallet">E-Wallet</option>
                  </select>
                </div>

                <div className="bg-gray-50 dark:bg-black p-6 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col gap-4 w-full">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="saldo_awal"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase"
                    >
                      saldo awal (rp)
                    </label>
                    <div className="flex items-center gap-2">
                      <h1 className="text-black dark:text-white font-bold text-[24px]">Rp</h1>
                      <input
                        type="number"
                        name="saldo_awal"
                        id="saldo_awal"
                        className="w-full bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-600 text-black dark:text-white px-1 py-2 text-2xl font-bold focus:outline-none"
                        placeholder="0"
                        value={formData.saldo_awal}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="h-[2px] bg-black dark:bg-white w-full" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="nama_asset"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase"
                  >
                    Pilih Nama Asset
                  </label>
                  <select
                    name="nama_asset"
                    id="nama_asset"
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 dark:bg-black text-black dark:text-white"
                    disabled={!formData.type_asset}
                    value={formData.nama_asset}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Nama Asset</option>
                    {formData.type_asset &&
                      assetChoices[formData.type_asset]?.map((name) => (
                        <option
                          key={name}
                          value={name.toLowerCase().replace(/\s/g, "-")}
                        >
                          {name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="nama_akun"
                    className="uppercase text-gray-700 dark:text-gray-300 font-semibold text-sm"
                  >
                    nama akun /Kartu
                  </label>
                  <input
                    type="text"
                    name="nama_akun"
                    id="nama_akun"
                    placeholder="Contoh: Tabungan utama"
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 dark:bg-black text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    value={formData.nama_akun}
                    onChange={handleChange}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-white/90 text-white dark:text-black font-bold py-2 px-4 rounded-2xl shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    Simpan Asset
                  </button>
                </div>

                {message.text && (
                  <div
                    className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
                      message.type === "error"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-green-50 text-green-600 border border-green-100"
                    }`}
                  >
                    {message.type === "error" ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                    {message.text}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsDeleteConfirmOpen(false)}
          />
          <div className="relative bg-white dark:bg-neutral-900 w-full max-w-sm rounded-[32px] shadow-2xl p-8 animate-in fade-in zoom-in duration-200 border border-white/5">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
                <Trash className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Apakah Anda yakin ingin menghapus akun / kartu ini?
              </h3>
              <span className="text-gray-800 dark:text-gray-400 text-sm mb-4">
                Target dan anggaran yang terkait akan ikut terhapus
              </span>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={handleDelete}
                  disabled={isActionLoading}
                  className="w-full py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isActionLoading ? "Menghapus..." : "Ya"}
                </button>
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  disabled={isActionLoading}
                  className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Tidak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Confirmation Modal */}
      {isUpdateConfirmOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsUpdateConfirmOpen(false)}
          />
          <div className="relative bg-white dark:bg-neutral-900 w-full max-w-sm rounded-[32px] shadow-2xl p-8 animate-in fade-in zoom-in duration-200 border border-white/5">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Simpan Perubahan?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Apakah anda yakin, ingin menyimpan perubahan aset ini?
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={handleUpdate}
                  disabled={isActionLoading}
                  className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isActionLoading ? "Menyimpan..." : "Ya"}
                </button>
                <button
                  onClick={() => setIsUpdateConfirmOpen(false)}
                  disabled={isActionLoading}
                  className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Tidak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
