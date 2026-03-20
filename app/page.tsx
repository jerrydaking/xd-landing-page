import Hero from "../components/Hero";
import StatsBar from "../components/StatsBar";
import GameGrid from "../components/GameGrid";
import PromoSection from "../components/PromoSection";
import WhyChooseUs from "../components/WhyChooseUs";
import NewsSection from "../components/NewsSection";
import FaqSection from "../components/FaqSection";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0F1115] text-[#F5F7FA]">
      <Hero />
      <StatsBar />
      <GameGrid />
      <PromoSection />
      <WhyChooseUs />
      <NewsSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
