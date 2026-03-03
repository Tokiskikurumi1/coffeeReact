import HeroSection from "../components/home/HeroSection";
import IntroSection from "../components/home/IntroSection";
import ProductSection from "../components/home/ProductSection";
import FeedbackSection from "../components/home/FeedbackSection";
import "./Home.css";
export default function Home() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <ProductSection />
      <FeedbackSection />
    </>
  );
}
