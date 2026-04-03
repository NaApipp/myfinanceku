import FormAkunKartu from "./components/FormAkunKartu";
import DataAccoundCard from "./components/DataAccoundCard";
import SummaryCard from "./components/SummaryCard";

export default function AccountCardPage() {
  return (
    <div className="min-h-screen p-4 bg-[#F5F5F5]">
      <div className="">
        <p className="uppercase text-[#777777] font-bold">Manajemen Aset</p>
        <div className="flex justify-between">
          <h1 className="text-black font-bold text-[50px] mt-3">
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
