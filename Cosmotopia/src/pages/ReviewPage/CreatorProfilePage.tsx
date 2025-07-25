import { useEffect, useState, useMemo } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import dayjs from "dayjs";
import { getAllVideosByAffiliateId } from "@/queries/affilate.api";
import type { KOLVideoDTO } from './types/video';
import { useParams } from "react-router-dom";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode?: number;
}

const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const embedMatch = url.match(/embed\/([^?&]+)/);
  if (embedMatch) return embedMatch[1];
  const watchMatch = url.match(/[?&]v=([^?&]+)/);
  if (watchMatch) return watchMatch[1];
  return null;
};

const getThumbFromVideoUrl = (url: string) => {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "/placeholder-video.png";
};

const VideoSwiperSection = ({
  videos,
  title,
}: {
  videos: KOLVideoDTO[];
  title: string;
}) => (
  <section className="mb-16">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-4xl font-bold text-[#32294B]">{title}</h2>
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="text-base font-normal leading-5 bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] bg-clip-text text-transparent" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Xem tất cả
        </span>
        <ArrowRight className="w-6 h-6 text-purple-600" />
      </div>
    </div>
    <Swiper
      spaceBetween={30}
      slidesPerView={3}
      breakpoints={{
        320: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
    >
      {videos.map(video => {
        const thumb = getThumbFromVideoUrl(video.videoUrl);
        const created = dayjs(video.createdAt).format("DD-MM-YYYY");
        const creatorName = video.authorName || "Influencer";
        const avatar = video.authorAvatarUrl || "/default-avatar.png";
        return (
          <SwiperSlide key={video.videoId}>
            <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                  <img
                    src={thumb}
                    alt={video.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-800 ml-1" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 bg-white">
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={avatar} alt={creatorName} />
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        {creatorName[0] || "I"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium text-gray-700">{creatorName}</p>
                      <p className="text-[10px] text-gray-500">{created}</p>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </SwiperSlide>
        );
      })}
    </Swiper>
  </section>
);

const InfluencerProfilePage = () => {
  // Lấy affiliateId từ URL
  const { affiliateId } = useParams<{ affiliateId: string }>();
  console.log("Affiliate ID:", affiliateId);
  const [videos, setVideos] = useState<KOLVideoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Có thể customize nếu muốn truyền qua params query
  const influencerName = "Võ Hà Linh";
  const avatarUrl = "https://i.imgur.com/k9bTf3W.png";
  const coverUrl = "https://i.imgur.com/k9bTf3W.png";

  useEffect(() => {
    if (!affiliateId) return;
    let mounted = true;
    setLoading(true);
    getAllVideosByAffiliateId(affiliateId)
      .then((res: ApiEnvelope<KOLVideoDTO[]>) => {
        console.log("Videos fetched:", res);
        if (!mounted) return;
        if (Array.isArray(res.data)) setVideos(res.data);
        else setVideos([]);
      })
      .catch(() => {
        setError("Lỗi tải video");
        setVideos([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [affiliateId]);

  // Lọc loại video (title có "review", "swatch", "hướng dẫn", "tutorial")
  const reviewVideos = useMemo(
    () =>
      videos.filter(
        v =>
          v.title?.toLowerCase().includes("review") ||
          v.title?.toLowerCase().includes("swatch")
      ),
    [videos]
  );
  const tutorialVideos = useMemo(
    () =>
      videos.filter(
        v =>
          v.title?.toLowerCase().includes("hướng dẫn") ||
          v.title?.toLowerCase().includes("tutorial")
      ),
    [videos]
  );

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Banner & avatar */}
      <div className="relative max-w-[1440px] mx-auto">
        <header className="relative h-[650px]">
          <div className="absolute top-0 left-0 w-full h-[440px] bg-gradient-to-b from-purple-200 to-white" />
          <img src={coverUrl} alt="Banner" className="absolute top-0 w-full h-[329px] object-cover object-center" />
          <div className="absolute top-[200px] left-0 w-full h-[370px]">
            <div className="w-full h-full bg-[#DAA4FA]" style={{ clipPath: 'path("M0,100 C250,200,500,0,720,0 S1190,200,1440,100 V370 H0 Z")' }} />
          </div>
          <img src={avatarUrl} alt={influencerName} className="absolute top-[185px] left-[37px] w-[254px] h-[254px] rounded-full border-4 border-white object-cover shadow-lg" />
          <div className="absolute top-[268px] left-[320px] bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 w-[336px]">
            <h1 className="text-[40px] font-bold bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] bg-clip-text text-transparent leading-none">{influencerName}</h1>
            <p className="text-sm text-[#837D92]">{videos.length} video</p>
          </div>
        </header>
        {/* Main Content */}
        <main className="px-[80px] py-10 space-y-16">
          {/* Loading/error/empty */}
          {loading ? (
            <div className="w-full h-72 flex items-center justify-center text-lg text-gray-500">Đang tải video...</div>
          ) : error ? (
            <div className="w-full h-72 flex items-center justify-center text-lg text-red-500">{error}</div>
          ) : (
            <>
              <VideoSwiperSection title="Video review" videos={reviewVideos} />
              <hr className="border-t border-gray-200" />
              <VideoSwiperSection title="Video hướng dẫn" videos={tutorialVideos} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default InfluencerProfilePage;
