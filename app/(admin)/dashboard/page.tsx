import TotalUser from "./components/TotalUser";
import TotalTransaksi from "./components/TotalTransaksi";
import MiniTransaksi from "./components/MiniTransaksi";

export default function page() {    
  return (
    <>
    <div className="space-y-4 p-3">
        <div className="flex flex-row gap-4">
            <TotalUser />
            <TotalTransaksi />
        </div>
      <MiniTransaksi />
    </div>
    </>
  )
}