import { Plus, X } from "lucide-react";
import { useState } from "react";

export default function TambahTransaksi() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex mb-2 w-full h-10 items-center gap-2 justify-center rounded-lg px-2 py-1.5 text-sm bg-black text-white cursor-pointer hover:bg-black/70 hover:text-white transition-all"
      >
        <Plus width={18} height={18} />
        <span className="text-sm font-bold"> Tambah Transaksi </span>
      </button>

      {/* Modal Tambah Transaksi */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-black">Tambah Transaksi</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
