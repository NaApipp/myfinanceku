"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OfflineHandler() {
  const router = useRouter();

  useEffect(() => {
    function handleOffline() {
      router.push("/offline");
    }

    if (typeof window !== "undefined" && !navigator.onLine) {
      router.push("/offline");
    }

    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("offline", handleOffline);
    };
  }, [router]);

  return null;
}
