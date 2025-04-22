// app/page.js
import HeroSection from '@/components/home/HeroSection';
import FeaturedCars from '@/components/home/FeaturedCars';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';

export default function Home() {
  return (
    <div className="space-y-16 py-8">
      <HeroSection />
      <FeaturedCars />
      <HowItWorks />
      <Testimonials />
    </div>
  );
}