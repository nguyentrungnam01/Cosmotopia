// src/pages/ReviewPage/index.tsx

import { useState, useRef } from 'react';
import BasePages from '@/components/shared/base-pages';
import VideoHotSection from './HotVideoSection';
import HeroSection from './HeroSection';
import VideoTutorialsSection from './VideoCard';
import TopKOLSection from './TopKOLSection';
import KOLDealsSection from './CouponCard';
import MakeupTones from '@/components/shared/style';

export default function ReviewPage() {
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");
  const heroSectionRef = useRef<HTMLDivElement>(null);

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId);
    
    if (heroSectionRef.current) {
      window.scrollTo({
        top: heroSectionRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-white">
      <BasePages pageHead="Review">
        <HeroSection videoId={selectedVideoId} ref={heroSectionRef}/>
        <VideoHotSection onVideoSelect={handleVideoSelect} />
        <VideoTutorialsSection onVideoSelect={handleVideoSelect}/>
        <TopKOLSection />
        <KOLDealsSection />
        <MakeupTones />
      </BasePages>
    </div>
  );
}
