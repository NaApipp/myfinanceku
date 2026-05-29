import Navbar from "@/app/home/components/layout/Navbar";
import Footer from "@/app/home/components/layout/Footer";

import Card from "./components/Card";
import DetailLevel from "./components/DetailLevel";

export default function PricingPage() {
  return (
    <div>
      <Navbar />
      <h1 className="text-center mt-10 mb-10 text-3xl font-bold">
        Pilih Level yang tepat untuk Anda
      </h1>
      <p className="text-center mt-10 mb-10">
        Kendali penuh atas keuangan Anda dimulai dari sini. Pilih paket yang
        sesuai dengan kebutuhan manajemen aset dan tujuan finansial Anda.
      </p>
      <Card />
      <DetailLevel />
      <Footer />
    </div>
  );
}
