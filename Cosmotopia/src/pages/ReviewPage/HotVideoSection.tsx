import { useEffect, useState, useMemo } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import dayjs from "dayjs";
import { getAllVideosSystem } from "@/queries/affilate.api";
import type { KOLVideoDTO } from './types/video';
interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode?: number;
}

interface VideoHotSectionProps {
  onVideoSelect: (video: KOLVideoDTO) => void;
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

export default function VideoHotSection({ onVideoSelect }: VideoHotSectionProps) {
  const [videos, setVideos] = useState<KOLVideoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAllVideosSystem()
      .then((res: ApiEnvelope<KOLVideoDTO[]>) => {
        if (!mounted) return;
        if (res.success && Array.isArray(res.data)) {
          setVideos(res.data);
        } else {
          setError(res.message || "Không lấy được danh sách video");
        }
      })
      .catch(err => {
        console.error(err);
        if (mounted) setError("Lỗi tải video");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  // Lọc “review nổi bật”: bạn điều chỉnh logic tại đây
  const hotReviewVideos = useMemo(() => {
    return videos
      .filter(v => {
        const t = v.title.toLowerCase();
        return t.includes("review") || t.includes("swatch"); // điều kiện gợi ý
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [videos]);

  return (
    <section className="relative w-full max-w-[1440px] mx-auto pt-8" style={{ height: "529px" }}>
      <div className="flex justify-between items-center px-20 mb-12" style={{ height: "51px" }}>
        <h2
          className="text-[44px] font-bold leading-[50px] text-[#32294B]"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Video review nổi bật
        </h2>
        <div className="flex items-center gap-2 cursor-pointer">
          <span
            className="text-base font-normal leading-5 bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] bg-clip-text text-transparent"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Xem tất cả
          </span>
          <ArrowRight className="w-6 h-6 text-purple-600" />
        </div>
      </div>

      <div className="relative px-20" style={{ height: "433px" }}>
        {loading && (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            Đang tải video...
          </div>
        )}
        {!loading && error && (
          <div className="w-full h-full flex items-center justify-center text-red-500">
            {error}
          </div>
        )}
        {!loading && !error && hotReviewVideos.length === 0 && (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Chưa có video review nổi bật.
          </div>
        )}

        {!loading && !error && hotReviewVideos.length > 0 && (
          <Swiper
            spaceBetween={30}
            slidesPerView={3}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
          >
            {hotReviewVideos.map(video => {
              const thumb = getThumbFromVideoUrl(video.videoUrl);
              const created = dayjs(video.createdAt).format("DD-MM-YYYY");
              // Hiện tại không có creatorName trong DTO -> placeholder
              const creatorName = "Creator";
              return (
                <SwiperSlide key={video.videoId}>
                  <Card
                    className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => onVideoSelect(video)}
                  >
                    <div className="relative">
                      <div className="relative aspect-video w-full overflow-hidden">
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
                            <AvatarImage src={"/default-avatar.png"} alt={creatorName} />
                            <AvatarFallback className="bg-gray-200 text-gray-600">
                              {creatorName[0]}
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
        )}
      </div>
    </section>
  );
}
