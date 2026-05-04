import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import Features from "./components/sections/Features";
import Showcase from "./components/sections/Showcase";
import Benefits from "./components/sections/Benefits";
import Testimonials from "./components/sections/Testimonials";
import CTA from "./components/sections/CTA";

export default function Page() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen selection:bg-blue-500 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <Benefits />
        {/* <Testimonials /> */}
        <CTA />
      </main>
      <Footer />
    </div>
  )
}