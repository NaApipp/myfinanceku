"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SidebarAdmin from "./components/SidebarAdmin";
import Footer from "@/app/components/Footer";

export default function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("user-admin");
    if (!user) {
      router.push("/login-admin");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; // Bisa ditambahkan loading spinner di sini
  }

  return (
    <div className="flex h-screen bg-gray-50/50 dark:bg-gray-950">
      <SidebarAdmin />
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <footer className="mt-auto">
          <Footer />
        </footer>
      </main>
    </div>
  );
}
