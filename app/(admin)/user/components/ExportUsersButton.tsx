"use client";

import { useState } from "react";

type ExportFormat = "xlsx" | "csv";

export default function ExportUsersButton() {
  const [loading, setLoading] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setLoading(format);
    try {
      const res = await fetch(`/api/admin/export-user?format=${format}`);

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Export gagal.");
        return;
      }

      // Trigger download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const timestamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `myfinanceku_export_users_${timestamp}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Terjadi kesalahan saat export.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport("xlsx")}
        disabled={loading !== null}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading === "xlsx" ? "Mengekspor..." : "Export XLSX"}
      </button>
    </div>
  );
}