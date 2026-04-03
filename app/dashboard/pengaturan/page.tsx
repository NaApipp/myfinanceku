import ProfilPengguna from "./components/ProfilPengguna";
import Tampilan from "./components/Tampilan";
import Keamanan from "./components/Keamanan"

export default function page() {
  return (
    <div className="bg-[#F5F5F5] dark:bg-black min-h-screen p-4 flex flex-col gap-4">
        <ProfilPengguna />
        <Tampilan />
        <Keamanan />
    </div>
  )
}