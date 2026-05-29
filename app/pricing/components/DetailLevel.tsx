import { Check, X } from 'lucide-react';

export default function DetailLevel() {
  return (
    <section className="py-16 px-5 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Bandingkan Fitur Secara Detail
        </h2>
      </div>

      <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="p-5 text-sm font-semibold text-slate-900 dark:text-white w-2/5">
                  Fitur
                </th>
                <th className="p-5 text-sm font-semibold text-slate-900 dark:text-white text-center w-1/5">
                  Basic
                </th>
                <th className="p-5 text-sm font-semibold text-slate-900 dark:text-white text-center w-1/5">
                  Medium
                </th>
                <th className="p-5 text-sm font-semibold text-slate-900 dark:text-white text-center w-1/5">
                  Advanced
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {/* Feature 1 */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors duration-150">
                <td className="p-5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tambah Transaksi
                </td>
                <td className="p-5 text-center">
                  <div className="flex justify-center">
                    <div className="p-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                </td>
                <td className="p-5 text-center">
                  <div className="flex justify-center">
                    <div className="p-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                </td>
                <td className="p-5 text-center">
                  <div className="flex justify-center">
                    <div className="p-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                </td>
              </tr>
              {/* Feature 2 */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors duration-150">
                <td className="p-5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Buat Target
                </td>
                <td className="p-5 text-center">
                  <div className="flex justify-center">
                    <X className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                  </div>
                </td>
                <td className="p-5 text-center">
                  <div className="flex justify-center">
                    <div className="p-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                </td>
                <td className="p-5 text-center">
                  <div className="flex justify-center">
                    <div className="p-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                </td>
              </tr>             
              {/* Feature 3 */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors duration-150">
                <td className="p-5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Lihat Statistik
                </td>
                <td className="p-5 text-center">
                  <div className="flex justify-center">
                    <X className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                  </div>
                </td>
                <td className="p-5 text-center">
                  <div className="flex justify-center">
                    <div className="p-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                </td>
                <td className="p-5 text-center">
                  <div className="flex justify-center">
                    <div className="p-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                </td>
              </tr>             
              {/* Feature 4 */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors duration-150">
                <td className="p-5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Buat Anggaran
                </td>
                <td className="p-5 text-center">
                  <div className="flex justify-center">
                    <X className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                  </div>
                </td>
                <td className="p-5 text-center">
                  <div className="flex justify-center">
                    <X className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                  </div>
                </td>
                <td className="p-5 text-center">
                  <div className="flex justify-center">
                    <div className="p-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                </td>
              </tr>             
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
