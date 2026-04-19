import { X, ShieldCheck, CheckCircle2, Lock, Eye, Users, Cookie, Info } from "lucide-react"
import { useState } from "react"

export default function PrivacyPolicy() {
    const [open, setOpen] = useState(false)
    
    return (
        <>
            <button 
                type="button"
                onClick={() => setOpen(true)} 
                className="cursor-pointer text-blue-600 hover:text-blue-700 hover:underline ml-1 font-semibold transition-colors"
            >
                Kebijakan Privasi
            </button>

            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-8">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300" 
                        onClick={() => setOpen(false)} 
                    />
                    
                    {/* Modal Content */}
                    <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[24px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 leading-none">Kebijakan Privasi</h2>
                                    <p className="text-xs text-slate-500 mt-1">Terakhir diperbarui: 15 April 2026</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setOpen(false)} 
                                className="p-2 hover:bg-slate-100 rounded-full transition-all active:scale-90"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {/* Body - Scrollable Area */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth custom-scrollbar">
                            <section>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    Kebijakan Privasi ini menjelaskan bagaimana <span className="font-bold text-slate-900">MyFinanceKu</span> mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi pengguna. Dengan menggunakan layanan kami, Anda menyetujui praktik yang dijelaskan dalam Kebijakan Privasi ini.
                                </p>
                            </section>

                            <div className="space-y-8">
                                {/* 1. Informasi yang Kami Kumpulkan */}
                                <section className="space-y-4">
                                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[10px]">01</span>
                                        Informasi yang Kami Kumpulkan
                                    </h3>
                                    <div className="pl-8 space-y-4">
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">A. Informasi Pribadi</p>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {['Username', 'Nama Lengkap', 'Email', 'Nomor HP', 'Kata Sandi (Hashed)'].map((item, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">B. Data Keuangan</p>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {['Pemasukan & Pengeluaran', 'Data Anggaran', 'Target / Tabungan', 'Data Akun / Kartu'].map((item, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* 2. Cara Kami Menggunakan Data */}
                                <section className="space-y-4">
                                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[10px]">02</span>
                                        Cara Kami Menggunakan Data
                                    </h3>
                                    <div className="pl-8 space-y-2 text-sm text-slate-600">
                                        <p>Data yang dikumpulkan digunakan untuk:</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Menyediakan dan menjalankan layanan</li>
                                            <li>Mengelola akun pengguna</li>
                                            <li>Mengembangkan dan meningkatkan fitur</li>
                                            <li>Analisis internal</li>
                                            <li>Informasi, pembaruan, atau promosi melalui email</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* 3. Penyimpanan dan Keamanan Data */}
                                <section className="space-y-4">
                                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[10px]">03</span>
                                        Penyimpanan dan Keamanan Data
                                    </h3>
                                    <div className="pl-8 space-y-3">
                                        <p className="text-sm text-slate-600">Kami berupaya melindungi data dengan langkah keamanan yang wajar:</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-100 flex items-center gap-1.5">
                                                <Lock className="w-3 h-3" /> Kata sandi dalam bentuk hash
                                            </span>
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-100 flex items-center gap-1.5">
                                                <Users className="w-3 h-3" /> Pembatasan akses data
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 italic">Kami tidak dapat menjamin keamanan data secara absolut.</p>
                                    </div>
                                </section>

                                {/* 4. Akses dan Penghapusan Data */}
                                <section className="space-y-4">
                                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[10px]">04</span>
                                        Akses dan Penghapusan Data
                                    </h3>
                                    <div className="pl-8 space-y-3 text-sm text-slate-600">
                                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                            <div className="flex gap-3">
                                                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                                <div className="space-y-1">
                                                    <p className="font-bold text-amber-900">Penting:</p>
                                                    <p className="text-amber-800 text-xs">Pengguna dapat mengakses data melalui akun masing-masing, namun <span className="font-bold underline">tidak dapat menghapus data secara mandiri</span> melalui sistem saat ini.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p>Permintaan terkait data dapat diajukan melalui Support Center.</p>
                                    </div>
                                </section>

                                {/* 5. Penggunaan Data untuk Analitik dan Promosi */}
                                <section className="space-y-4">
                                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[10px]">05</span>
                                        Analitik dan Promosi
                                    </h3>
                                    <div className="pl-8 text-sm text-slate-600">
                                        <p>Kami dapat menggunakan data untuk analisis perilaku penggunaan, pengembangan produk, dan pengiriman promosi melalui email.</p>
                                    </div>
                                </section>

                                {/* 6. Pembagian Data kepada Pihak Ketiga */}
                                <section className="space-y-4">
                                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[10px]">06</span>
                                        Pembagian Data
                                    </h3>
                                    <div className="pl-8 space-y-2 text-sm text-slate-600">
                                        <p className="font-bold text-slate-900">Kami tidak menjual data pribadi pengguna.</p>
                                        <p>Data hanya dibagikan jika diperlukan untuk operasional layanan atau diwajibkan oleh hukum.</p>
                                    </div>
                                </section>

                                {/* 7-10. Lainnya */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                                            <Cookie className="w-4 h-4" /> Cookie
                                        </div>
                                        <p className="text-xs text-slate-500">Website menggunakan cookie untuk meningkatkan pengalaman pengguna.</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                                            <Eye className="w-4 h-4" /> Perubahan
                                        </div>
                                        <p className="text-xs text-slate-500">Kebijakan dapat diperbarui sewaktu-waktu dan akan diinformasikan melalui website.</p>
                                    </div>
                                </div>
                            </div>

                            <section className="pt-8 border-t border-slate-100">
                                <p className="text-slate-500 text-xs italic text-center leading-relaxed">
                                    Kebijakan ini diatur oleh hukum Republik Indonesia. Dengan menggunakan MyFinanceKu, Anda dianggap telah membaca dan menyetujui Kebijakan Privasi ini.
                                </p>
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                            <button 
                                onClick={() => setOpen(false)} 
                                className="cursor-pointer px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                            >
                                Saya Setuju
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </>
    )
}