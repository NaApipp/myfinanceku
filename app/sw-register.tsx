"use client";

import { useEffect } from "react";

export default function SWRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("registered"))
        .catch((err) => console.log("SW failed", err));
    }
  }, []);

  return null;
}