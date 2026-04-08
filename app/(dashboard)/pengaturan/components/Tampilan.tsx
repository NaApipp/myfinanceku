"use client";

export default function Tampilan() {
  return (
    <div className=" p-4 rounded-lg px-0">
      <h1 className="text-black dark:text-white font-bold text-2xl mb-6">Tampilan</h1>

      <div className="text-black dark:text-white flex flex-row justify-between bg-white dark:bg-neutral-900 rounded-3xl shadow-md p-7 border border-gray-100 dark:border-white/5 transition-colors duration-300">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Mode Gelap</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Optimalkan kenyamanan mata di lingkungan cahaya rendah.
          </p>
        </div>
        <ToggleTheme />
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

function ToggleTheme() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Check initial theme or system preference
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setEnabled(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  
  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    const newTheme = newState ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
        enabled ? "bg-black" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
          enabled ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}
