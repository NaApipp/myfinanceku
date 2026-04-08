"use client";
import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, Plus, X, Target, Calendar, Type, ChartPie } from "lucide-react";

interface Kategori {
    idKategori: string,
    nama_kategori: string,
}

export default function FormAddAnggaran() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<Kategori[]>([]);
  const [formData, setFormData] = useState({
    nama_anggaran: "",
    kategori_anggaran: "",
    limit_anggaran: 0,
    periode_anggaran: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/kategori");
      const data = await response.json();
      if (data.success) {
        setCategory(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/anggaran", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: data.message || "Target berhasil disimpan!",
        });
        setFormData({
          nama_anggaran: "",
          kategori_anggaran: "",
          limit_anggaran: 0,
          periode_anggaran: "",
        });
        // Optional: close modal after success
        // setTimeout(() => setIsOpen(false), 2000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Gagal menyimpan target.",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Terjadi kesalahan koneksi.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 bg-black hover:bg-neutral-800 text-white px-8 py-4 rounded-full font-bold transition-all transform active:scale-95 shadow-2xl group border border-white/5"
      >
        <div className="relative">
          <ChartPie className="w-5 h-5 text-blue-400" />
          <Plus
            className="w-3 h-3 absolute -bottom-1 -right-1 bg-black rounded-full border border-black"
            strokeWidth={4}
          />
        </div>
        <span className="text-sm tracking-tight">Buat Anggaran Baru</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">Anggaran Baru</h2>
                  <p className="text-xs text-gray-500 font-medium">Tentukan impian finansial Anda</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Scrollable Form Area */}
            <div className="overflow-y-auto p-6 custom-scrollbar">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
              >
                {/* Nama Target */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="nama_anggaran" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Type className="w-3.5 h-3.5" /> Nama Anggaran
                  </label>
                  <input
                    required
                    type="text"
                    name="nama_anggaran"
                    id="nama_anggaran"
                    placeholder="Contoh: Tabungan Mobil"
                    className="w-full p-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 text-black font-semibold placeholder:text-gray-300"
                    value={formData.nama_anggaran}
                    onChange={handleChange}
                  />
                </div>

                {/* Grid Tanggal & Jumlah */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="periode_anggaran" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> Periode Anggaran
                    </label>
                    <input
                      required
                      type="date"
                      name="periode_anggaran"
                      id="periode_anggaran"
                      className="w-full p-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 text-black font-semibold"
                      value={formData.periode_anggaran}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="limit_anggaran" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      Nominal Limit
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                      <input
                        required
                        type="number"
                        name="limit_anggaran"
                        id="limit_anggaran"
                        placeholder="0"
                        className="w-full p-4 pl-11 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 text-black font-bold placeholder:text-gray-300"
                        value={formData.limit_anggaran || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Pilih Akun & Prioritas Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="kategori_anggaran" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      Kategori Anggaran
                    </label>
                    <select
                      required
                      name="kategori_anggaran"
                      id="kategori_anggaran"
                      className="w-full p-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 text-black font-semibold"
                      value={formData.kategori_anggaran}
                      onChange={handleChange}
                    >
                      <option value="">Pilih Kategori</option>
                      {category.map((item) => (
                        <option key={item.idKategori} value={item.idKategori}>
                          {item.nama_kategori}
                        </option>
                      ))}
                    </select>
                    {category.length === 0 && (
                        <p className="text-[10px] text-red-500 font-medium mt-1">
                          ⚠️ Kategori belum tersedia. Tambah di Pengaturan.
                        </p>
                      )}
                  </div>
                </div>

                {message.text && (
                  <div
                    className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in slide-in-from-top-2 duration-300 ${
                      message.type === "error"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-green-50 text-green-600 border border-green-100"
                    }`}
                  >
                    {message.type === "error" ? (
                      <AlertCircle className="w-5 h-5 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                    )}
                    {message.text}
                  </div>
                )}

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-800 disabled:bg-gray-400 text-white font-bold py-5 px-4 rounded-[24px] shadow-xl transition-all transform active:scale-[0.98] mt-2 flex items-center justify-center gap-3"
                >
                  {loading ? "Menyimpan..." : "Simpan Anggaran"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

