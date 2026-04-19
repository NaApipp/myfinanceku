import { X, FileText, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export default function TermOnService() {
    const [open, setOpen] = useState(false)
    
    return (
        <>
            <button 
                type="button"
                onClick={() => setOpen(true)} 
                className="cursor-pointer text-blue-600 hover:text-blue-700 hover:underline ml-1 font-semibold transition-colors"
            >
                Syarat dan Ketentuan
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
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 leading-none">Syarat & Ketentuan</h2>
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
                                <p className="text-slate-600 leading-relaxed">
                                    Selamat datang di <span className="font-bold text-slate-900">MyFinanceKu</span>. Dengan mengakses atau menggunakan platform kami, Anda setuju untuk terikat oleh Syarat & Ketentuan berikut. Harap baca dengan seksama sebelum menggunakan layanan kami.
                                </p>
                            </section>

                            <div className="space-y-8">
                                <section className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[10px]">01</span>
                                        Definisi Layanan
                                    </h3>
                                    <div className="pl-8 space-y-3">
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            MyFinanceKu adalah platform pencatatan keuangan pribadi yang memungkinkan pengguna untuk mencatat transaksi, mengelola anggaran, dan melacak target keuangan.
                                        </p>
                                        <ul className="space-y-2">
                                            {['Mencatat pemasukan dan pengeluaran', 'Membuat anggaran periode tertentu', 'Melacak target tabungan & kantong dana', 'Simulasi akun/kartu sumber dana'].map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[10px]">02</span>
                                        Akun Pengguna
                                    </h3>
                                    <div className="pl-8 space-y-3">
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Pengguna bertanggung jawab penuh atas keamanan akun dan kerahasiaan kata sandi. Anda setuju untuk memberikan informasi yang akurat dan benar saat pendaftaran.
                                        </p>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[10px]">03</span>
                                        Data & Privasi
                                    </h3>
                                    <div className="pl-8 space-y-3 text-sm text-slate-600 leading-relaxed">
                                        <p>Kami menyimpan data transaksi dan informasi profil Anda (nama, email, no HP) dengan enkripsi keamanan. Data tidak akan dijual ke pihak ketiga tanpa izin Anda.</p>
                                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                            <p className="text-amber-800 text-xs font-medium">Informasi Penting:</p>
                                            <p className="text-amber-700 text-xs mt-1 italic">Saat ini sistem belum mendukung penghapusan data secara mandiri oleh pengguna.</p>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[10px]">04</span>
                                        Batasan Tanggung Jawab
                                    </h3>
                                    <div className="pl-8 space-y-3 text-sm text-slate-600 leading-relaxed">
                                        <p>MyFinanceKu bukan alat akuntansi profesional. Kami tidak bertanggung jawab atas kerugian finansial atau keputusan yang diambil berdasarkan data dari platform ini.</p>
                                    </div>
                                </section>
                            </div>

                            <section className="pt-4 border-t border-slate-100">
                                <p className="text-slate-500 text-xs italic text-center">
                                    Dengan terus menggunakan layanan ini, Anda dianggap telah membaca dan menyetujui seluruh ketentuan di atas.
                                </p>
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                            <button 
                                onClick={() => setOpen(false)} 
                                className="cursor-pointer px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                            >
                                Saya Mengerti
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