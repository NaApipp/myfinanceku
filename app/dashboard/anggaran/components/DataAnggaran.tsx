"use client";

import { useEffect, useState } from "react";
import {
  Target,
  Trash2,
  AlertCircle,
  Calendar,
  Wallet,
  Loader2,
  Edit,
} from "lucide-react";

interface Anggaran {
  _id: string;
  idAnggaran: string;
  nama_anggaran: string;
  kategori_anggaran: string;
  limit_anggaran: number;
  periode_anggaran: string;
}

interface Category {
  idKategori: string;
  nama_kategori: string;
}

export default function DataAnggaran() {
  const [anggarans, setAnggarans] = useState<Anggaran[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [resAnggaran, resCategories] = await Promise.all([
        fetch("/api/anggaran"),
        fetch("/api/kategori"),
      ]);

      const dataAnggaran = await resAnggaran.json();
      const dataCategories = await resCategories.json();

      if (dataAnggaran.success) {
        setAnggarans(dataAnggaran.data);
      }

      if (dataCategories.success) {
        const catMap: Record<string, string> = {};
        dataCategories.data.forEach((cat: Category) => {
          catMap[cat.idKategori] = cat.nama_kategori;
        });
        setCategories(catMap);
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

  // Delete Confirmation State
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    const id = deleteConfirmId;

    setDeleteConfirmId(null);
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/anggaran/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setAnggarans(anggarans.filter((a) => a.idAnggaran !== id));
      }
    } catch (error) {
      console.error("Error deleting anggaran:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Update State
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Anggaran | null>(null);

  const handleEditClick = (item: Anggaran) => {
    setEditFormData(item);
    setIsUpdateModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;

    const id = editFormData.idAnggaran;
    setIsUpdateModalOpen(false);
    setIsUpdating(id);

    try {
      const response = await fetch(`/api/anggaran/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_anggaran: editFormData.nama_anggaran,
          limit_anggaran: Number(editFormData.limit_anggaran),
          periode_anggaran: editFormData.periode_anggaran,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAnggarans(
          anggarans.map((a) =>
            a.idAnggaran === id ? { ...a, ...editFormData } : a,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating anggaran:", error);
    } finally {
      setIsUpdating(null);
      setEditFormData(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-[32px] p-8 border border-gray-100 animate-pulse h-48"
          />
        ))}
      </div>
    );
  }

  if (anggarans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
        <div className="p-4 bg-gray-50 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-black">Belum ada anggaran</h3>
        <p className="text-gray-500 text-sm">
          Mulai atur keuangan Anda dengan membuat anggaran baru.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {anggarans.map((item) => (
        <div
          key={item.idAnggaran}
          className="group relative bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="">
              <button
                onClick={() => setDeleteConfirmId(item.idAnggaran)}
                disabled={isDeleting === item.idAnggaran}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                {isDeleting === item.idAnggaran ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => handleEditClick(item)}
                disabled={isUpdating === item.idAnggaran}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
              >
                {isUpdating === item.idAnggaran ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Edit className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">
                {categories[item.kategori_anggaran] || "Kategori Umum"}
              </p>
              <h3 className="text-xl font-black text-black leading-tight">
                {item.nama_anggaran}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              {/* <Calendar className="w-4 h-4" /> */}
              <p className="text-sm font-bold">Periode Anggaran:</p>
              <span className="text-sm font-bold">
                {new Date(item.periode_anggaran).toLocaleDateString("id-ID", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                Sisa Anggaran
              </p>
              <h4 className="text-2xl font-black text-black">
                Rp {item.limit_anggaran.toLocaleString("id-ID")}
              </h4>
            </div>
          </div>
        </div>
      ))}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setDeleteConfirmId(null)}
          />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Hapus Anggaran
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Apakah anda yakin ingin menghapus anggaran ini? Tindakan ini
                tidak dapat dipulihkan.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={handleDelete}
                  className="w-full py-3 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 active:scale-[0.98] transition-all"
                >
                  Ya, Hapus
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isUpdateModalOpen && editFormData && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsUpdateModalOpen(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[32px] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-black dark:text-white">
                Edit Anggaran
              </h3>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <AlertCircle className="w-6 h-6 text-gray-400 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Nama Anggaran
                </label>
                <input
                  type="text"
                  value={editFormData.nama_anggaran}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      nama_anggaran: e.target.value,
                    })
                  }
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Limit Anggaran (Rp)
                </label>
                <input
                  type="number"
                  value={editFormData.limit_anggaran}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      limit_anggaran: Number(e.target.value),
                    })
                  }
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-black font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Periode Anggaran
                </label>
                <input
                  type="date"
                  value={editFormData.periode_anggaran}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      periode_anggaran: e.target.value,
                    })
                  }
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-black text-white font-bold rounded-2xl hover:bg-neutral-800 transition-all uppercase text-sm tracking-widest"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
