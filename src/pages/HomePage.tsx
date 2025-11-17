import { useState } from "react";
import HeroSection from "./HeroSection";
import FeaturedWinesSection from "../components/FeaturedWinesSection";
import AboutSection from "../components/AboutSection";
import QuickViewModal from "../components/QuickViewModal";
import type { Wine } from "../components/WineCard";

const HomePage = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Wine | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#d4d4d4] font-['Oswald'] antialiased">
      <HeroSection />
      <FeaturedWinesSection setQuickViewProduct={setQuickViewProduct} />
      <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8 lg:py-10 bg-[#d4d4d4] -mt-6 sm:mt-0 md:-mt-4 lg:-mt-6">
        <AboutSection />
      </div>
      {quickViewProduct && (
        <QuickViewModal
          quickViewProduct={quickViewProduct}
          setQuickViewProduct={setQuickViewProduct}
        />
      )}
    </div>
  );
};

export default HomePage;