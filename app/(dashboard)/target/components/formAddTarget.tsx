"use client";
import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, Plus, X, Target, Calendar, DollarSign, ArrowUpCircle, ArrowDownCircle, Type } from "lucide-react";

interface Account {
  idAccount: string;
  nama_akun: string;
  nama_asset: string;
  saldo_awal: number;
}

export default function FormAddTarget() {
  const [isOpen, setIsOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [formData, setFormData] = useState({
    nama_target: "",
    tanggal_target: "",
    jumlah_target: "" as string,
    idAccount: "",
    prioritas: "biasa_saja",
    description: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAccounts();
    }
  }, [isOpen]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/account-card");
      const data = await response.json();
      if (data.success) {
        setAccounts(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    }
  };
// Format Rupiah (Modern & Typed)
  const formatRupiah = (angka: string): string => {
    const numberString = angka.replace(/[^0-9]/g, "");
    if (!numberString) return "";
    const parsed = parseInt(numberString, 10);
    return new Intl.NumberFormat("id-ID").format(parsed);
  };

  const handleRupiahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      jumlah_target: formatRupiah(value),
    }));
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

    // Gunakan cara yang lebih aman untuk mengambil angka murni
    const rawValue = String(formData.jumlah_target).replace(/[^0-9]/g, "");
    const cleanData = {
      ...formData,
      jumlah_target: parseInt(rawValue, 10) || 0,
    };

    try {
      const response = await fetch("/api/target", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: data.message || "Target berhasil disimpan!",
        });
        setFormData({
          nama_target: "",
          tanggal_target: "",
          jumlah_target: "",
          idAccount: "",
          prioritas: "biasa_saja",
          description: "",
        });
        // Optional: close modal after success
        setTimeout(() => setIsOpen(false), 3000);
        setTimeout(() => window.location.reload(), 3500);
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
        className="flex items-center gap-3 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black px-8 py-4 rounded-full font-bold transition-all transform active:scale-95 shadow-2xl group border border-white/5 dark:border-black/5"
      >
        <div className="relative">
          <Target className="w-5 h-5 text-blue-400" />
          <Plus
            className="w-3 h-3 absolute -bottom-1 -right-1 bg-black dark:bg-white rounded-full border border-black dark:border-white text-white dark:text-black"
            strokeWidth={4}
          />
        </div>
        <span className="text-sm tracking-tight text-white dark:text-black">Buat Target Baru</span>
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
          <div className="relative bg-white dark:bg-neutral-900 w-full max-w-lg rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300 border border-white/5">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black dark:text-white">Target Baru</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tentukan impian finansial Anda</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
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
                  <label htmlFor="nama_target" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Type className="w-3.5 h-3.5" /> Nama Target
                  </label>
                  <input
                    required
                    type="text"
                    name="nama_target"
                    id="nama_target"
                    placeholder="Contoh: Tabungan Mobil"
                    className="w-full p-4 rounded-2xl border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 dark:bg-black text-black dark:text-white font-semibold placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    value={formData.nama_target}
                    onChange={handleChange}
                  />
                </div>

                {/* Grid Tanggal & Jumlah */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="tanggal_target" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> Tanggal Target
                    </label>
                    <input
                      required
                      type="date"
                      name="tanggal_target"
                      id="tanggal_target"
                      className="w-full p-4 rounded-2xl border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 dark:bg-black text-black dark:text-white font-semibold"
                      value={formData.tanggal_target}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="jumlah_target" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      Rp Nominal Goal
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                      <input
                        required
                        type="text"
                        name="jumlah_target"
                        id="jumlah_target"
                        placeholder="0"
                        className="w-full p-4 pl-11 rounded-2xl border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 dark:bg-black text-black dark:text-white font-bold placeholder:text-gray-300 dark:placeholder:text-gray-600"
                        value={formData.jumlah_target}
                        onChange={handleRupiahChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Pilih Akun & Prioritas Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="status_prioritas" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      Prioritas Target
                    </label>
                    <select
                      required
                      name="prioritas"
                      id="status_prioritas"
                      className="w-full p-4 rounded-2xl border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 dark:bg-black text-black dark:text-white font-semibold"
                      value={formData.prioritas}
                      onChange={handleChange}
                    >
                      <option value="penting">Penting</option>
                      <option value="sedang">Sedang</option>
                      <option value="biasa_saja">Biasa Saja</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="idAccount" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      Akun Terhubung
                    </label>
                    <select
                      required
                      name="idAccount"
                      id="idAccount"
                      className="w-full p-4 rounded-2xl border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 dark:bg-black text-black dark:text-white font-semibold"
                      value={formData.idAccount}
                      onChange={handleChange}
                    >
                      <option value="">Pilih Akun</option>
                      {accounts.map((acc) => (
                        <option key={acc.idAccount} value={acc.idAccount}>
                          {acc.nama_asset} - {acc.nama_akun}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="description" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Keterangan (Opsional)</label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    placeholder="Catatan kecil untuk target ini..."
                    className="w-full p-4 rounded-2xl border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 dark:bg-black text-black dark:text-white font-medium placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-none"
                    value={formData.description}
                    onChange={handleChange}
                  />
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
                  className="w-full bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white dark:text-black font-bold py-5 px-4 rounded-[24px] shadow-xl transition-all transform active:scale-[0.98] mt-2 flex items-center justify-center gap-3"
                >
                  {loading ? "Menyimpan..." : "Simpan Target"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

