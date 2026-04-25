"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setLoading(false);

    if (data.success) {
      alert("Upload berhasil!");
      setFile(null);
      setPreview(null);
    } else {
      alert(data.error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Image</h2>

      <input type="file" onChange={handleChange} />

      {preview && (
        <img src={preview} alt="preview" style={{ width: 200 }} />
      )}

      <br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}