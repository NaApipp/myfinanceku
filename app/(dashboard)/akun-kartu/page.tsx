import FormAkunKartu from "./components/FormAkunKartu";
import DataAccoundCard from "./components/DataAccoundCard";
import SummaryCard from "./components/SummaryCard";

export default function AccountCardPage() {
  return (
    <div className="min-h-screen p-4 bg-[#F5F5F5] dark:bg-black transition-colors duration-300">
      <div className="">
        <p className="uppercase text-[#777777] dark:text-gray-400 font-bold md:text-sm text-xs">Manajemen Aset</p>
        <div className="flex justify-between">
          <h1 className="text-black dark:text-white font-black md:text-4xl text-2xl mt-2 tracking-tight">
            Akun & Kartu
          </h1>
          <FormAkunKartu />
        </div>
      </div>
      <div className="mt-3">
        <SummaryCard />
        <DataAccoundCard />
      </div>
    </div>
  );
}
