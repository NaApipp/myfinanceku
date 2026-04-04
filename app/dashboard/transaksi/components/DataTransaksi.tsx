"use client";

import { useEffect, useState } from "react";
import { Trash } from "lucide-react";

interface TransactionData {
  idTransaksi: string;
  type_transaksi: string;
  nominal_transaksi: string;
  tanggal_transaksi: string;
  kategori: string;
  sumberdana: string;
  description: string;
}

export default function DataTransaksi() {
  const [transaksi, setTransaksi] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);

  // handleDelete
  const handleDelete = async (idTransaksi: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;

    try {
      const response = await fetch(`/api/transaksi/${idTransaksi}`, {
        method: "DELETE",
      });
      const data = await response.json();
      
      if (data.success) {
        alert(data.message || "Berhasil dihapus");
        window.location.reload();
      } else {
        alert(data.message || "Gagal menghapus transaksi.");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Terjadi kesalahan koneksi saat menghapus transaksi.");
    }
  };

  // Fetching Data Transaksi
  const fetchTransaksi = async () => {
    try {
      const response = await fetch("/api/transaksi");
      if (!response.ok) throw new Error("Gagal mengambil data Transaksi");
      const data = await response.json();
      if (data.success) {
        setTransaksi(data.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaksi();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getStyleKategori = (type_transaksi: string) => {
    if (type_transaksi === "pemasukan") {
      return "bg-green-500/40 text-white";
    } else {
      return "bg-red-500/40 text-white";
    }
  };

  return (
    <>
      <table className="w-full text-left border-collapse text-black">
        <thead>
          <tr className="border-b border-gray-200">
            <th>Tanggal Transaksi</th>
            <th>Deskripsi</th>
            <th>Kategori</th>
            <th>Sumberdana</th>
            <th>Nominal</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {transaksi.map((item, index) => (
            <tr key={index}>
              <td>{item.tanggal_transaksi}</td>
              <td>{item.description}</td>
              <td
                className={`px-2 py-1 rounded-full uppercase ${getStyleKategori(item.type_transaksi)}`}
              >
                {item.type_transaksi}
              </td>
              <td>{item.sumberdana}</td>
              <td>{item.nominal_transaksi}</td>
              <td>
                <button onClick={() => handleDelete(item.idTransaksi)}>
                  <Trash className="w-5 h-5 text-red-500 hover:text-red-800 transition-colors" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
