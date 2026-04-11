"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";


export default function ResetPasswordForm() {
    const params = useSearchParams()
      const token = params.get('token')
    
      const [password, setPassword] = useState('')
    
      const handleReset = async () => {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ token, password }),
        })
    
        const data = await res.json()
        alert(data.message)
      }

      const [isLoading, setIsLoading] = useState(false)
  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8">
        <div>
        <form onSubmit={handleReset} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="myfinanceku@gmail.com"
            type="password"
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
            'Reset Password'
          )}
        </button>
      </form>
    </div>
    </div>
  )
}