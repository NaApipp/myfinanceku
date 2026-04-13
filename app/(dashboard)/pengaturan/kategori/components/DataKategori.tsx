"use client";

import { List, Trash, Edit, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Kategori {
  idKategori: string;
  nama_kategori: string;
}

export default function DataKategori() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Kategori[]>([]);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await fetch("/api/kategori");
        const result = await response.json();
        if (result.success) {
          setData(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching kategori data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKategori();
  }, []);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [editingKategori, setEditingKategori] = useState<Kategori | null>(null);
  const [newNamaKategori, setNewNamaKategori] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // handleEditClick
  const handleEditClick = (item: Kategori) => {
    setEditingKategori(item);
    setNewNamaKategori(item.nama_kategori);
  };
  
  // handleDelete
  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/kategori/${deleteId}`, {
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

  // handleUpdate
  const handleUpdate = async () => {
    if (!editingKategori || !newNamaKategori.trim()) return;
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/kategori/${editingKategori.idKategori}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nama_kategori: newNamaKategori }),
      });
      const data = await response.json();
      
      if (data.success) {
        setEditingKategori(null);
        window.location.reload();
      } else {
        alert(data.message || "Gagal memperbarui kategori.");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Terjadi kesalahan koneksi saat memperbarui kategori.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 mt-8 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <List className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Belum ada kategori</h3>
        <p className="text-gray-500 text-sm mt-1">
          Mulai rencanakan impian finansial Anda sekarang.
        </p>
      </div>
    );
  }
  return (
    <div className="p-6">
      <div className="bg-white dark:bg-neutral-900 rounded-[32px] shadow-md p-8 border border-gray-100 dark:border-white/5 transition-colors duration-300">
        <h1 className="text-black dark:text-white font-bold text-2xl mb-6">
          Data Kategori
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Nama Kategori
                </th>
                <th className="px-4 py-2 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.idKategori || index}>
                  <td className="px-4 py-2 text-left text-sm font-semibold text-black dark:text-white">
                    {item.nama_kategori}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex">
                      <button
                        onClick={() => setDeleteId(item.idKategori)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEditClick(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Hapus Kategori</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Apakah anda yakin, ingin menghapus kategori ini?
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

      {/* Edit Category Modal */}
      {editingKategori && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingKategori(null)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Kategori</h3>
                <button onClick={() => setEditingKategori(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
             </div>

             <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Nama Kategori</label>
                  <input
                    type="text"
                    value={newNamaKategori}
                    onChange={(e) => setNewNamaKategori(e.target.value)}
                    className="w-full text-black dark:text-white px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    placeholder="Masukkan nama kategori..."
                    autoFocus
                  />
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={handleUpdate}
                    disabled={isUpdating || !newNamaKategori.trim()}
                    className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                  >
                    {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                  <button
                    onClick={() => setEditingKategori(null)}
                    disabled={isUpdating}
                    className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
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
