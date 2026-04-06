"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes warning
const FINAL_TIMEOUT = 35 * 60 * 1000; // 35 minutes logout

export default function SessionTimeoutHandler() {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Skip inactivity check on public pages
  const isPublicPage = ["/", "/login", "/register"].includes(pathname);

  const logout = useCallback(async () => {
    try {
      // Clear session via API
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login?expired=true");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback redirect
      window.location.href = "/login?expired=true";
    }
  }, [router]);

  const resetTimers = useCallback(() => {
    if (isPublicPage || isExpired) return;

    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

    setIsWarningOpen(false);

    // Set warning timer
    warningTimerRef.current = setTimeout(() => {
      setIsWarningOpen(true);
    }, INACTIVITY_TIMEOUT);

    // Set final logout timer
    logoutTimerRef.current = setTimeout(() => {
      setIsExpired(true);
      logout();
    }, FINAL_TIMEOUT);
  }, [isPublicPage, isExpired, logout]);

  useEffect(() => {
    if (isPublicPage) return;

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    
    // Initial setup
    resetTimers();

    const handleActivity = () => {
      if (!isWarningOpen) {
        resetTimers();
      }
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isPublicPage, isWarningOpen, resetTimers]);

  if (isPublicPage) return null;

  return (
    <>
      {isWarningOpen && !isExpired && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 transition-all transform scale-100 opacity-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sesi Hampir Berakhir</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Anda sudah tidak aktif selama beberapa waktu. Sesi akan berakhir otomatis dalam 5 menit demi keamanan data Anda.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={resetTimers}
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-indigo-500/20"
                >
                  Tetap Masuk
                </button>
                <button
                  onClick={logout}
                  className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors duration-200"
                >
                  Keluar Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isExpired && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-center">
             <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sesi Kedaluwarsa</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Sesi Anda telah berakhir. Anda akan segera diarahkan ke halaman login.
            </p>
            <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      )}
    </>
  );
}
