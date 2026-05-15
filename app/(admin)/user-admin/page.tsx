import AddUser from "./components/AddUser";
import DataUser from "./components/DataUser";

export default function page() {
  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-start gap-6">
        <div className="w-full xl:w-[400px] sticky top-8">
          <AddUser />
        </div>
        <div className="flex-1 w-full">
          <DataUser />
        </div>
      </div>
    </div>
  )
}