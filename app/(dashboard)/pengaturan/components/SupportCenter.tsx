"use client";

import { DatabaseBackup, Headset, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SupportCenter() {
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [user, setUser] = useState({
    full_name: "",
    username: "",
  });

  // Get User Data
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to parse user data", error);
        }
      }
    }, []);

  // Download PDF Handler
  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const params = new URLSearchParams();
      const url = `/api/backup${params.toString() ? `?${params.toString()}` : ""}`;

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengunduh PDF");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Backup Data ${user.full_name}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      console.error("Error downloading PDF:", error);
      alert(error.message || "Terjadi kesalahan saat mengunduh PDF.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };
  return (
    <div className=" p-4 rounded-lg px-0">
      <h1 className="text-black dark:text-white font-bold text-2xl mb-6">
        Bantuan
      </h1>

      <div className="flex flex-col gap-4">
        {/* Backup Data */}
        <div className="text-black dark:text-white flex flex-row justify-between items-center bg-white dark:bg-neutral-900 rounded-[32px] shadow-md p-8 border border-gray-100 dark:border-white/5 transition-colors duration-300">
          {/* icon & text */}
          <div className="flex flex-row items-center gap-4">
            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
              <DatabaseBackup
                className="text-black dark:text-white"
                width={24}
                height={24}
              />
            </div>
            <div className="">
              <h2 className="text-lg font-semibold">Cadangkan Data</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cadangkan data Anda untuk mencegah kehilangan data.
              </p>
            </div>
          </div>
          <button
            title="Backup Seluruh Data Jika Terjadi Migrasi Data. "
            onClick={handleDownloadPdf}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-3xl transition-colors cursor-pointer"
          >
            {isDownloadingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Discord */}
        <div className="text-black dark:text-white flex flex-row justify-between items-center bg-white dark:bg-neutral-900 rounded-[32px] shadow-md p-8 border border-gray-100 dark:border-white/5 transition-colors duration-300">
          {/* icon & text */}
          <div className="flex flex-row items-center gap-4">
            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
              <Headset
                className="text-black dark:text-white"
                width={24}
                height={24}
              />
            </div>
            <div className="">
              <h2 className="text-lg font-semibold">Pusat Bantuan</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pusat bantuan untuk membantu Anda dalam menggunakan aplikasi.
              </p>
            </div>
          </div>
          <Link
            href="https://discord.gg/FUeeHJWU9c"
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-3xl transition-colors"
          >
            {/* <ChevronRight className="text-black dark:text-white" width={24} height={24} /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-black dark:fill-white"
            >
              <path d="M19.888 7.335a5.134 5.134 0 0 0-2.893-2.418a9.144 9.144 0 0 0-2.275-.508a9.963 9.963 0 0 0-.508 1.038a15.039 15.039 0 0 0-4.56 0a11.372 11.372 0 0 0-.519-1.038c-.752.082-1.493.249-2.208.497a5.123 5.123 0 0 0-2.904 2.44a16.176 16.176 0 0 0-1.91 9.717a16.562 16.562 0 0 0 4.98 2.528a4.339 4.339 0 0 0 1.104-1.777c-.54-.202-1.06-.45-1.557-.74c-.089-.122.254-.32.364-.354a11.826 11.826 0 0 0 10.037 0c.1 0 .453.232.364.354c-.441.342-1.424.585-1.59.828a7.4 7.4 0 0 0 1.105 1.69a16.628 16.628 0 0 0 4.99-2.53a16.232 16.232 0 0 0-2.02-9.727M8.669 14.7a1.943 1.943 0 0 1-1.92-1.955a1.943 1.943 0 0 1 1.92-1.91a1.942 1.942 0 0 1 1.933 1.965a1.943 1.943 0 0 1-1.933 1.9m6.625 0a1.943 1.943 0 0 1-1.932-1.944a1.932 1.932 0 1 1 3.865.034a1.932 1.932 0 0 1-1.933 1.899z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
