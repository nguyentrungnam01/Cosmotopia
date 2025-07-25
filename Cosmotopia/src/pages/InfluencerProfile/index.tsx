import { useState, useEffect, useRef, useCallback } from 'react';
import BasePages from '@/components/shared/base-pages';
import InfluencerHeroSection from './InfluencerHeroSection';
import InstructionVideoSection from './InstructionVideoSection';
import VideoReviewSection from './ReviewVideoSection';
import type { InfluencerDTO } from './types/influencer';
// import { getInfluencerById } from '@/queries/influencer.api';
import { useParams } from 'react-router-dom';
import type { KOLVideoDTO } from './types/influencer';
// import ProfileCard from './ProfileCard';

export default function InfluencerProfilePage() {
  const { influencerId } = useParams();
  const [influencer, setInfluencer] = useState<InfluencerDTO | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<KOLVideoDTO | null>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  //   useEffect(() => {
  //     if (!influencerId) return;
  //     getInfluencerById(influencerId).then(setInfluencer);
  //   }, [influencerId]);


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
      <BasePages pageHead={influencer?.name || 'Influencer Profile'}>
        <InfluencerHeroSection affiliateProfileId={influencerId} video={selectedVideo} ref={heroSectionRef} />
        <InstructionVideoSection affiliateProfileId={influencerId} onVideoSelect={handleVideoSelect} />
        <VideoReviewSection affiliateProfileId={influencerId} onVideoSelect={handleVideoSelect} />
        {/* <ProfileCard /> */}
        {/* Chỉ hiển thị ProfileCard nếu influencer đã được tải */}
      </BasePages>
    </div>
  );
}
