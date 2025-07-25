import { useState, useRef, useCallback } from 'react';
import BasePages from '@/components/shared/base-pages';
import VideoHotSection from './HotVideoSection';
import VideoTutorialsSection from './VideoCard';
import HeroSection from './HeroSection';
import TopKOLSection from './TopKOLSection';
import KOLDealsSection from './CouponCard';
import MakeupTones from '@/components/shared/style';
import type { KOLVideoDTO } from './types/video';

export default function ReviewPage() {
  const [selectedVideo, setSelectedVideo] = useState<KOLVideoDTO | null>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  const handleVideoSelect = useCallback((video: KOLVideoDTO) => {
    setSelectedVideo(video);
    if (heroSectionRef.current) {
      window.scrollTo({
        top: heroSectionRef.current.offsetTop,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <div className="bg-white">
      <BasePages pageHead="Review">
        <HeroSection video={selectedVideo} ref={heroSectionRef} />
        <VideoHotSection onVideoSelect={handleVideoSelect} />
        <VideoTutorialsSection onVideoSelect={handleVideoSelect} />
        <TopKOLSection />
        <KOLDealsSection />
        <MakeupTones />
      </BasePages>
    </div>
  );
}
