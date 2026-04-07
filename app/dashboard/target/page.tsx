import FormAddTarget from "./components/formAddTarget";
import DataTarget from "./components/DataTarget";

export default function TargetPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="uppercase text-gray-900 font-bold text-sm">
              Perencanaan Keuanan
            </p>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-black tracking-tight">
                Target Menabung
              </h1>
            </div>
            <p className="text-gray-500 font-bold text-sm tracking-wide">
              Wujudkan impian Anda dengan alokasi dana yang terukur dan disiplin
              finansial yang dikurasi.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <FormAddTarget />
          </div>
        </div>

        {/* Data Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-black tracking-tight">
              Daftar Target
            </h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Live Sync Enabled
              </span>
            </div>
          </div>
          <DataTarget />
        </div>
      </div>
    </div>
  );
}
