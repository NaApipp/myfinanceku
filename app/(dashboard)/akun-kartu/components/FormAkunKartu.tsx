"use client";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Plus, X, CreditCard } from "lucide-react";

export default function FormAkunKartu() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    type_asset: "",
    saldo_awal: 0,
    nama_asset: "",
    nama_akun: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/account-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message || "Asset berhasil disimpan!" });
        setFormData({
          type_asset: "",
          saldo_awal: 0,
          nama_asset: "",
          nama_akun: "",
        });
      } else {
        setMessage({ type: "error", text: data.message || "Gagal menyimpan asset." });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Terjadi kesalahan koneksi." });
    }
  };

  const assetChoices = {
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

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black px-8 py-4 rounded-full font-bold transition-all transform active:scale-95 shadow-2xl group border border-white/5 dark:border-white/10"
      >
        <div className="relative">
          <CreditCard className="w-5 h-5 text-blue-400" />
          <Plus className="w-3 h-3 absolute -bottom-1 -right-1 bg-black dark:bg-white rounded-full border border-black dark:border-white text-white dark:text-black" strokeWidth={4} />
        </div>
        <span className="text-sm tracking-tight text-white dark:text-black">Tambah Akun Baru</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white dark:bg-neutral-900 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/5">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-xl font-bold text-black dark:text-white">Tambah Asset Baru</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Scrollable Form Area */}
            <div className="max-height-[80vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-6 w-full">
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
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 dark:bg-black text-black dark:text-white font-reguler"
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Masukkan nominal saldo saat ini sesuai catatan terakhir.
                    </p>
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
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 dark:bg-black text-black dark:text-white font-reguler"
                    disabled={!formData.type_asset}
                    value={formData.nama_asset}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Nama Asset</option>
                    {formData.type_asset === "bank" &&
                      assetChoices.bank.map((name) => (
                        <option key={name} value={name.toLowerCase().replace(/\s/g, "-")}>
                          {name}
                        </option>
                      ))}
                    {formData.type_asset === "e-wallet" &&
                      assetChoices["e-wallet"].map((name) => (
                        <option key={name} value={name.toLowerCase().replace(/\s/g, "-")}>
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
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 dark:bg-black text-black dark:text-white font-reguler placeholder:text-gray-400 dark:placeholder:text-gray-600"
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
                    className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-2 duration-300 ${
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
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
