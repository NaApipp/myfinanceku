import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface AccountData {
  idAccount: string;
  nama_asset: string;
}

export default function TambahTransaksi() {
  const [data, setData] = useState<AccountData[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    type_transaksi: "",
    nominal_transaksi: "",
    tanggal_transaksi: new Date().toISOString().split("T")[0],
    kategori: "",
    sumberdana: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fetching API
  useEffect(() => {
    setMounted(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi sederhana sebelum konfirmasi
    if (!formData.type_transaksi || !formData.nominal_transaksi || !formData.kategori || !formData.sumberdana) {
      setMessage({ type: "error", text: "Mohon isi semua field yang wajib." });
      return;
    }

    setIsConfirming(true);
  };

  const processTransaction = async () => {
    setIsConfirming(false);
    setMessage({ type: "", text: "" });
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/transaksi", {
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
          text: data.message || "Transaksi berhasil disimpan!",
        });
        setFormData({
          type_transaksi: "",
          nominal_transaksi: "",
          tanggal_transaksi: "",
          kategori: "",
          sumberdana: "",
          description: "",
        });
        // Close modal after a short delay to show success message
        setTimeout(() => {
          setIsOpen(false);
          setMessage({ type: "", text: "" });
          window.location.reload();
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Gagal menyimpan transaksi.",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Terjadi kesalahan koneksi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex mb-2 w-full h-10 items-center gap-2 justify-center rounded-lg px-2 py-1.5 text-sm bg-black dark:bg-white text-white dark:text-black cursor-pointer hover:bg-black/70 dark:hover:bg-white/70 hover:text-white dark:hover:text-black transition-all "
      >
        <Plus width={18} height={18} />
        <span className="text-sm font-bold"> Tambah Transaksi </span>
      </button>

      {/* Modal Tambah Transaksi */}
      {mounted && isOpen && createPortal(
        <>
          <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl animate-in fade-in zoom-in duration-300">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-black">Tambah Transaksi</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              {/* Modal Content */}
              <div className="p-3 space-y-4">
                {/* Message Alert */}
                {message.text && (
                  <div
                    className={`p-4 rounded-2xl text-sm font-medium ${
                      message.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-red-50 text-red-700 border border-red-100"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                {/* Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Input Nama Transaksi */}
                  <div className="space-y-2">
                    <label
                      htmlFor="type_transaksi"
                      className="text-sm font-semibold text-gray-700 uppercase"
                    >
                      Pilih Tipe Transaksi
                    </label>

                    <select
                      id="type_transaksi"
                      name="type_transaksi"
                      value={formData.type_transaksi}
                      onChange={handleChange}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 text-black font-reguler"
                      required
                    >
                      <option value="">Pilih Tipe Transaksi</option>
                      <option value="pemasukan">Pemasukan</option>
                      <option value="pengeluaran">Pengeluaran</option>
                    </select>
                  </div>
                  {/* Input Jumlah Transaksi */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="nominal_transaksi"
                        className="text-sm font-semibold text-gray-700 uppercase"
                      >
                        Nominal Transaksi (rp)
                      </label>
                      <div className="flex items-center gap-2">
                        <h1 className="text-black font-bold text-[24px]">Rp</h1>
                        <input
                          type="number"
                          name="nominal_transaksi"
                          id="nominal_transaksi"
                          className="w-full bg-transparent placeholder:text-gray-400 text-black px-1 py-2 text-2xl font-bold focus:outline-none"
                          placeholder="0"
                          value={formData.nominal_transaksi}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {/* Input Tanggal Transaksi */}
                    <div className="space-y-2 flex-1">
                      <label
                        htmlFor="tanggal_transaksi"
                        className="text-sm font-semibold text-gray-700 uppercase"
                      >
                        Tanggal Transaksi
                      </label>
                      <input
                        name="tanggal_transaksi"
                        id="tanggal_transaksi"
                        value={formData.tanggal_transaksi}
                        onChange={handleChange}
                        type="date"
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 text-black font-reguler placeholder:text-gray-400"
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    {/* Input Kategori */}
                    <div className="space-y-2 flex-1">
                      <label
                        htmlFor="kategori"
                        className="text-sm font-semibold text-gray-700 uppercase"
                      >
                        Kategori
                      </label>

                      <select
                        id="kategori"
                        name="kategori"
                        value={formData.kategori}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 text-black font-reguler"
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        <option value="makanan">Makanan</option>
                        <option value="transportasi">Transportasi</option>
                        <option value="pembayaran">Pembayaran</option>
                        <option value="pendapatan">Pendapatan</option>
                        <option value="transfer">Transfer</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  {/* Input Sumber Dana */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Sumber Dana
                    </label>
                    <select
                      name="sumberdana"
                      id="sumberdana"
                      value={formData.sumberdana}
                      onChange={handleChange}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 text-black font-reguler"
                      required
                    >
                      <option value="">Pilih Sumber Dana</option>
                      {data.map((item) => (
                        <option
                          key={item.idAccount}
                          value={item.idAccount}
                          className="uppercase"
                        >
                          {item.nama_asset}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Input Keterangan Transaksi */}
                  <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Deskripsi Transaksi
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-15 text-black placeholder:text-gray-400"
                      placeholder="Masukkan Deskripsi Transaksi"
                    />
                  </div>
                  {/* Tombol Simpan */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-black hover:bg-black/90 text-white font-bold py-2 px-4 rounded-2xl shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Custom Confirmation Modal */}
          {isConfirming && (
            <div className="fixed inset-0 z-1100 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setIsConfirming(false)}
              />
              <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
                    <Plus className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Simpan Transaksi
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">
                    Apakah anda yakin, ingin menyimpan riwayat transaksi ini?
                  </p>
                  <div className="flex flex-col gap-3 w-full">
                    <button
                      onClick={processTransaction}
                      className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      Ya
                    </button>
                    <button
                      onClick={() => setIsConfirming(false)}
                      className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                    >
                      Tidak
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>,
        document.body
      )}
    </>
  );
}
