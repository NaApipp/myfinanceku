"use client";

import { useState, useEffect, useMemo } from "react";

import { TemplateChips } from "./components/TemplateChips";
import { TemplateId, EMAIL_TEMPLATE } from "@/app/lib/TemplateEmailService";

type Mode = "broadcast" | "targeted";

interface Subscription {
  plan: string;
  status: string;
}

interface User {
  idUser: string;
  full_name: string;
  email: string;
  username: string;
  level: string;
  subscription: Subscription;
}

interface SendSummary {
  total: number;
  succeeded: number;
  failed: number;
}

type SendResult = { success: true; summary: SendSummary } | { error: string };

export default function AdminSendEmailPage() {
  const [mode, setMode] = useState<Mode>("broadcast");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [result, setResult] = useState<SendResult | null>(null);

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(
    null,
  );

  useEffect(() => {
    if (mode === "targeted" && users.length === 0) {
      fetchUsers();
    }
  }, [mode]);

  //   Fetching User
  async function fetchUsers(): Promise<void> {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/user_cust");
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch {
      // tabel kosong sudah cukup sebagai feedback
    } finally {
      setLoadingUsers(false);
    }
  }

  // Handle Select Template
  const handleSelectTemplate = (id: TemplateId) => {
    const tpl = EMAIL_TEMPLATE.find((t) => t.idTemplate === id)!;
    setSelectedTemplate(id);
    setSubject(tpl.subject);
    setMessage(tpl.message);
  };

  const filteredUsers = useMemo<User[]>(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.full_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q),
    );
  }, [users, searchQuery]);

  function toggleUser(idUser: string): void {
    setSelectedIds((prev) =>
      prev.includes(idUser)
        ? prev.filter((id) => id !== idUser)
        : [...prev, idUser],
    );
  }

  function toggleAll(): void {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUsers.map((u) => u.idUser));
    }
  }

  //   Hndle Submit Email
  async function handleSend(): Promise<void> {
    if (!subject.trim() || !message.trim()) return;
    if (mode === "targeted" && selectedIds.length === 0) return;

    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/send_mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          userIds: mode === "targeted" ? selectedIds : undefined,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({ error: data.error || "Terjadi kesalahan." });
      } else {
        setResult({ success: true, summary: data.summary });
        setSubject("");
        setMessage("");
        setSelectedIds([]);
      }
    } catch {
      setResult({ error: "Gagal terhubung ke server." });
    } finally {
      setSending(false);
    }
  }

  const canSend: boolean =
    subject.trim().length > 0 &&
    message.trim().length > 0 &&
    (mode === "broadcast" || selectedIds.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Information Center
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Kirim pengumuman atau pemberitahuan kepada pengguna myfinance ku.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-1 flex gap-1">
          <button
            onClick={() => {
              setMode("broadcast");
              setResult(null);
            }}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              mode === "broadcast"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Broadcast — Semua User
          </button>
          <button
            onClick={() => {
              setMode("targeted");
              setResult(null);
            }}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              mode === "targeted"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Pilih User
          </button>
        </div>

        {/* Compose Form */}
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          <div className="flex justify-center my-8">
            <TemplateChips selected={selectedTemplate} onSelect={handleSelectTemplate} />
          </div>
          
          {/* Subject */}
          <div className="px-5 py-4">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Subjek
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Contoh: Pembaruan Fitur Terbaru myfinance ku"
              className="w-full text-sm text-gray-900 placeholder-gray-400 border-0 outline-none bg-transparent"
            />
          </div>

          {/* Message */}
          <div className="px-5 py-4">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Pesan
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              placeholder="Tulis pesan kamu di sini..."
              className="w-full text-sm text-gray-900 placeholder-gray-400 border-0 outline-none bg-transparent resize-none leading-relaxed"
            />
          </div>

          {/* Hint */}
          <div className="px-5 py-3 bg-gray-50 rounded-b-xl">
            <p className="text-xs text-gray-400">
              Nama penerima akan otomatis disapa sesuai data akun mereka.
            </p>
          </div>
        </div>

        {/* User Selector */}
        {mode === "targeted" && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Pilih Penerima
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {selectedIds.length} user dipilih
                </p>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, email, username..."
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 w-56 outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            {loadingUsers ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                Memuat daftar user...
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredUsers.length > 0 && (
                  <div
                    className="px-5 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={toggleAll}
                  >
                    <input
                      type="checkbox"
                      checked={
                        filteredUsers.length > 0 &&
                        filteredUsers.every((u) =>
                          selectedIds.includes(u.idUser),
                        )
                      }
                      onChange={toggleAll}
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Pilih semua ({filteredUsers.length} user)
                    </span>
                  </div>
                )}

                <div className="max-h-72 overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                    <p className="px-5 py-6 text-sm text-center text-gray-400">
                      {searchQuery
                        ? "Tidak ada user yang cocok."
                        : "Tidak ada user."}
                    </p>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.idUser}
                        className={`px-5 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedIds.includes(user.idUser) ? "bg-blue-50" : ""
                        }`}
                        onClick={() => toggleUser(user.idUser)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(user.idUser)}
                          onChange={() => toggleUser(user.idUser)}
                          className="rounded text-blue-600"
                        />
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold shrink-0">
                            {user.full_name?.charAt(0).toUpperCase() ?? "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.full_name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                            user.subscription?.plan === "premium"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {user.subscription?.plan ?? "basic"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Result Banner */}
        {result && (
          <div
            className={`rounded-xl px-5 py-4 text-sm ${
              "error" in result
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-green-50 border border-green-200 text-green-700"
            }`}
          >
            {"error" in result ? (
              <p>⚠ {result.error}</p>
            ) : (
              <div>
                <p className="font-medium">Email berhasil dikirim!</p>
                <p className="mt-1 text-green-600">
                  {result.summary.succeeded} dari {result.summary.total} email
                  terkirim
                  {result.summary.failed > 0 &&
                    ` · ${result.summary.failed} gagal`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Send Button */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {mode === "broadcast"
              ? "Email akan dikirim ke seluruh pengguna terdaftar."
              : selectedIds.length > 0
                ? `Email akan dikirim ke ${selectedIds.length} user yang dipilih.`
                : "Pilih minimal 1 user untuk melanjutkan."}
          </p>
          <button
            onClick={handleSend}
            disabled={!canSend || sending}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              canSend && !sending
                ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {sending ? "Mengirim..." : "Kirim Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
