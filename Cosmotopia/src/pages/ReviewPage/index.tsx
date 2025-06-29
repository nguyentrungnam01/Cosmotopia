// src/pages/ReviewPage/index.tsx
import { ChevronRight } from 'lucide-react';
// import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

// Shared components
import BasePages from '@/components/shared/base-pages';
import VideoTutorialsSection from './VideoCard';
import KOLDealsSection from './CouponCard';
import MakeupTones from '@/components/shared/style';
// import { useRouter } from '@/routes/hooks';
import TopKOLSection from './TopKOLSection';
import VideoHotSection from './HotVideoSection';
import HeroSection from './HeroSection';
export default function ReviewPage() {
  // const router = useRouter();

  return (
    <div className="bg-white">
      <BasePages pageHead="Review">
        {/* Hero Video */}
        <HeroSection/>
        {/* Hot Review Videos */}
        <VideoHotSection/>
        {/* Tutorial Videos */}
        <VideoTutorialsSection />
        {/*Top KOL*/}
        <TopKOLSection />
        {/* Coupons */}
        <KOLDealsSection />
        {/* Makeup Tones */}
        <MakeupTones />
      </BasePages>
    </div>
  );
}
