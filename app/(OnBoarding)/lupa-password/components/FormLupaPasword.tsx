"use client";

import Link from "next/link";
import { useState } from "react"

export default function FormResetPassword() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
      const handleSubmit = async () => {
        setIsLoading(true)
        await fetch('/api/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email }),
        })
    
        alert('Jika email terdaftar, link reset dikirim')
      } 

      
  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="myfinanceku@gmail.com"
            type="email"
            required
            className="text-black w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
          />
        </div>

        

        <button
          disabled={isLoading}
          className=" w-full h-12 mt-4 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Memproses...</span>
            </>
          ) : (
            'Kirim Link Reset Password'
          )}
        </button>

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Kembali ke Login
          </Link>
        </div>
      </form>
    </div>
  )
}