// Import Components
import RegistrasiForm from "./components/RegistrasiForm";
import SplashScreen from "@/app/components/SplashScreen";

export default function RegistrasiPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 min-h-screen lg:h-screen lg:overflow-hidden">
      {/* Left Side (Hidden on mobile, 2/5 width on desktop) */}
      <SplashScreen />

      {/* Right Side (Full width on mobile, 3/5 width on desktop) */}
      <div className="col-span-1 lg:col-span-3 bg-white flex flex-col justify-center overflow-y-auto custom-scrollbar">
        <RegistrasiForm />
      </div>
    </div>
  );
}
