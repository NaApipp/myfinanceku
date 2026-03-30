"use client";

export default function Tampilan() {
  return (
    <div className=" p-4 rounded-lg">
      <h1 className="text-black font-bold text-[20px] mb-4">Tampilan</h1>

      <div className="text-black flex flex-row justify-between bg-white rounded-3xl shadow-md p-7">
        <div className="flex flex-col gap-2">
          <h2 className="text-[16px] font-semibold">Mode Gelap</h2>
          <p className="text-[12px] text-[#737373]">
            Optimalkan kenyamanan mata di lingkungan cahaya rendah.
          </p>
        </div>
        <ToogleTheme />
      </div>
    </div>
  );
}

import { useState } from "react";

function ToogleTheme() {
  const [enabled, setEnabled] = useState(false);
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-14 h-8 flex items-center rounded-full p-1 transition ${
        enabled ? "bg-black" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition ${
          enabled ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}
