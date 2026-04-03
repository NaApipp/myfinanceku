"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // STEP 1: REQUEST OTP
  const handleRequestOtp = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      setMessage(data.message);
      setStep(2);
    } catch (err) {
      setMessage("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: RESET PASSWORD
  const handleResetPassword = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email,
          phone,
          otp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error);
        return;
      }

      setMessage("Password berhasil direset");
    } catch (err) {
      setMessage("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Forgot Password</h2>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={handleRequestOtp} disabled={loading}>
            {loading ? "Loading..." : "Kirim OTP"}
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <input
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password baru"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button onClick={handleResetPassword} disabled={loading}>
            {loading ? "Loading..." : "Reset Password"}
          </button>
        </>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}