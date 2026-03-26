"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import Sidebar from "./components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (!user) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex h-screen bg-gray-50/50 dark:bg-gray-950">
      {/* <Sidebar /> */}
      <main className="flex-1 ml-64 overflow-y-auto">{children}</main>
    </div>
  );
}