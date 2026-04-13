"use client";

import { useEffect, useState } from "react";
import {
  Target,
  Trash,
  CheckCircle2,
  Notebook,
  Edit,
  AlertCircle,
  X,
  Calendar,
} from "lucide-react";

interface TargetData {
  idTarget: string;
  nama_target: string;
  tanggal_target: string;
  jumlah_target: number;
  target_now: number;
  idAccount: string;
  prioritas: string;
  type_target: string;
  description: string;
}

export default function DataTarget() {
  const [data, setData] = useState<TargetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [targetToDelete, setTargetToDelete] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<TargetData | null>(null);
  const [formData, setFormData] = useState({
    nama_target: "",
    tanggal_target: "",
    jumlah_target: 0,
    prioritas: "",
    description: "",
  });
 

  const fetchTargets = async () => {
    try {
      const response = await fetch("/api/target");
      const result = await response.json();
      if (result.success) {
        setData(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching targets:", error);
    } finally {
      setLoading(false);
    }
  };
   useEffect(() => {
    fetchTargets();
  }, []);

  const handleDelete = async () => {
    if (!targetToDelete) return;

    setIsActionLoading(true);
    try {
      const response = await fetch(`/api/target/${targetToDelete}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setData((prev) =>
          prev.filter((item) => item.idTarget !== targetToDelete),
        );
        setIsDeleteConfirmOpen(false);
        // Refresh to sync if needed, though state update is enough for UI
      }
    } catch (error) {
      console.error("Error deleting target:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (now: number, goal: number) => {
    const percentage = (now / goal) * 100;
    return Math.min(Math.max(percentage, 0), 100).toFixed(1);
  };

  const [message, setMessage] = useState({ type: "", text: "" });
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Confirmation States
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleUpdate = async () => {
    if (!selectedTarget) return;

    setIsActionLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await fetch(`/api/target/${selectedTarget.idTarget}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
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
  const handleEditClick = (item: TargetData) => {
    setSelectedTarget(item);
    setFormData({
      nama_target: item.nama_target,
      tanggal_target: item.tanggal_target,
      jumlah_target: item.jumlah_target,
      prioritas: item.prioritas,
      description: item.description,
    });
    setIsEditOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-64 bg-gray-50 animate-pulse rounded-[32px] border border-gray-100"
          />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 mt-8 bg-gray-50 dark:bg-white/5 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-white/10">
        <div className="w-20 h-20 bg-white dark:bg-neutral-900 rounded-full flex items-center justify-center shadow-sm mb-4">
          <Target className="w-10 h-10 text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Belum ada target</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Mulai rencanakan impian finansial Anda sekarang.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 mt-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => {
          const progress = calculateProgress(
            item.target_now,
            item.jumlah_target,
          );
          const isCompleted = Number(progress) >= 100;

          return (
            <div
              key={item.idTarget}
              className="group relative bg-white dark:bg-neutral-900 p-8 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`p-4 rounded-2xl ${isCompleted ? "bg-green-50 dark:bg-green-500/10" : "bg-blue-50 dark:bg-blue-500/10"}`}
                >
                  <Target
                    className={`w-6 h-6 ${isCompleted ? "text-green-600" : "text-blue-600"}`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="">
                    <button
                      onClick={() => {
                        setTargetToDelete(item.idTarget);
                        setIsDeleteConfirmOpen(true);
                      }}
                      className="p-3 text-gray-300 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-3 text-gray-300 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-2xl transition-all"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2 mb-8">
                <h3 className="text-xl font-black text-black dark:text-white leading-tight tracking-tight">
                  {item.nama_target}
                </h3>
                <div className="flex items-center gap-2 text-gray-400">
                  <Notebook className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{item.description}</span>
                </div>
              </div>

              {/* Progress Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">
                      Terkumpul
                    </p>
                    <p className="text-lg font-black text-black dark:text-white tracking-tight">
                      {formatCurrency(item.target_now)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">
                      Target
                    </p>
                    <p className="text-sm font-bold text-gray-500">
                      {formatCurrency(item.jumlah_target)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-4 bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden border border-gray-100 dark:border-white/5">
                  <div
                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${
                      isCompleted ? "bg-green-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute top-0 right-0 h-full w-8 bg-white/20 skew-x-[-20deg] animate-pulse" />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs font-black tracking-widest uppercase ${isCompleted ? "text-green-600" : "text-blue-600"}`}
                  >
                    {progress}% Tercapai
                  </span>
                  {isCompleted && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-black tracking-widest uppercase">
                        Goal Hit!
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center m-7">
                <div className="w-full rounded border border-gray-500 dark:border-gray-600"></div>
              </div>
              {item.prioritas && (
                <div className="flex justify-between mt-3">
                  <div className="flex flex-col gap-2 items-center">
                    <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">
                      Priority
                    </p>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                        item.prioritas === "penting"
                          ? "bg-orange-100 text-orange-600"
                          : item.prioritas === "sedang"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.prioritas?.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-col items-center">
                    <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">
                      Tanggal Target
                    </p>
                    <span className="text-xs font-bold text-gray-500">
                      {item.tanggal_target}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsDeleteConfirmOpen(false)}
          />
          <div className="relative bg-white dark:bg-neutral-900 w-full max-w-sm rounded-[40px] shadow-2xl p-10 animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-3xl flex items-center justify-center mb-6 rotate-12 group-hover:rotate-0 transition-transform">
                <Trash className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-black dark:text-white mb-2 tracking-tight">
                Hapus Target?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 px-4 font-medium leading-relaxed">
                Tindakan ini tidak dapat dibatalkan dan saldo akun Anda mungkin
                terpengaruh.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={handleDelete}
                  disabled={isActionLoading}
                  className="w-full py-5 bg-red-600 text-white font-black rounded-3xl hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-red-500/20"
                >
                  {isActionLoading ? "Menghapus..." : "Ya, Hapus"}
                </button>
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  disabled={isActionLoading}
                  className="w-full py-5 bg-gray-50 dark:bg-white/5 text-gray-400 font-black rounded-3xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-[0.98]"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Rendered outside the grid to avoid stacking issues */}
      {isEditOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsEditOpen(false)}
          />

          <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-black">Ubah Asset</h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
                    htmlFor="nama_target"
                    className="uppercase text-gray-700 font-semibold text-sm"
                  >
                    Nama Target
                  </label>
                  <input
                    type="text"
                    name="nama_target"
                    id="nama_target"
                    placeholder="Contoh: Tabungan utama"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 text-black placeholder:text-gray-400"
                    value={formData.nama_target}
                    onChange={handleChange}
                  />
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-4 w-full">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="jumlah_target"
                      className="text-sm font-semibold text-gray-700 uppercase"
                    >
                      Nominal Goal
                    </label>
                    <div className="flex items-center gap-2">
                      <h1 className="text-black font-bold text-[24px]">Rp</h1>
                      <input
                        type="number"
                        name="jumlah_target"
                        id="jumlah_target"
                        className="w-full bg-transparent placeholder:text-gray-400 text-black px-1 py-2 text-2xl font-bold focus:outline-none"
                        placeholder="0"
                        value={formData.jumlah_target}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="h-[2px] bg-black w-full" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="tanggal_target"
                    className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Tanggal Target
                  </label>
                  <input
                    required
                    type="date"
                    name="tanggal_target"
                    id="tanggal_target"
                    className="w-full p-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 text-black font-semibold"
                    value={formData.tanggal_target}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="prioritas"
                    className="text-sm font-semibold text-gray-700 uppercase"
                  >
                    Pilih Nama Asset
                  </label>
                  <select
                    required
                    name="prioritas"
                    id="status_prioritas"
                    className="w-full p-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 text-black font-semibold"
                    value={formData.prioritas}
                    onChange={handleChange}
                  >
                    <option value="penting">Penting</option>
                    <option value="sedang">Sedang</option>
                    <option value="biasa_saja">Biasa Saja</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="description"
                    className="uppercase text-gray-700 font-semibold text-sm"
                  >
                    Deskripsi
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Contoh: Tabungan utama"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 text-black placeholder:text-gray-400"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-black hover:bg-black/90 text-white font-bold py-2 px-4 rounded-2xl shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
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

                {/* Update Confirmation Modal */}
                {isUpdateConfirmOpen && (
                  <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
                    <div
                      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                      onClick={() => setIsUpdateConfirmOpen(false)}
                    />
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                          Simpan Perubahan?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">
                          Apakah anda yakin, ingin menyimpan perubahan target ini?
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
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
