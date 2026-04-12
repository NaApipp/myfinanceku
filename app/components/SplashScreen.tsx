export default function SplashScreen() {
  return (
    <div className="hidden lg:block lg:col-span-2 bg-white border-r relative overflow-hidden">
      {/* Decorative elements for the dark side */}
      <div
        className="absolute inset-0 bg-cover bg-gray-200"
      />
      

      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" /> */}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center p-12">
        <div className="border mb-4 border-2 w-20  border-black rounded-full"></div>
        <h1 className="text-4xl font-bold text-black mb-4 tracking-tight font-poppins ">
          Kurasi <br /> Masa Depan <br /> Finansial Anda.
        </h1>
        <p className="text-slate-400 font-medium text-lg max-w-sm">
          Gunakan manajemen keuangan yang di rancang untuk presisi dan
          pertumbuhan yang berkelanjutan.
        </p>
      </div>
    </div>
  );
}
