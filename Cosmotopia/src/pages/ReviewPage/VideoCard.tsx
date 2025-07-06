import { ArrowRight, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DiepleImage from '@/assets/kol/Dieple-image.png';
import DiepleAvatar from '@/assets/kol/Dieple-avatar.png';
import VohalinhImage from '@/assets/kol/vohalinh-image.png';
import VohalinhAvatar from '@/assets/kol/vohalinh-avatar.png';
import ChangImage from '@/assets/kol/chang-image.png';
import ChangAvatar from '@/assets/kol/chang-avatar.png';

// Swiper Import
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import Swiper styles

export default function VideoTutorialsSection({ onVideoSelect }: { onVideoSelect: (videoId: string) => void }) {
  const videos = [
    {
      id: "1",
      title: "Deal Ngon Tutorial",
      thumbnail: DiepleImage,
      creator: {
        name: "Trinh Meow",
        avatar: DiepleAvatar,
        date: "01-02-2025",
      },
    },
    {
      id: "2",
      title: "Swatch & Review",
      thumbnail: VohalinhImage,
      creator: {
        name: "Vũ Hà Linh",
        avatar: VohalinhAvatar,
        date: "02-03-2024",
      },
    },
    {
      id: "3",
      title: "Which Red Tutorial",
      thumbnail: ChangImage,
      creator: {
        name: "Chang Makeup",
        avatar: ChangAvatar,
        date: "09-05-2024",
      },
    },
    {
      id: "4",
      title: "New Video Tutorial",
      thumbnail: DiepleImage,
      creator: {
        name: "Trinh Meow",
        avatar: DiepleAvatar,
        date: "01-02-2026",
      },
    },
    {
      id: "5",
      title: "Review & Tips",
      thumbnail: VohalinhImage,
      creator: {
        name: "Vũ Hà Linh",
        avatar: VohalinhAvatar,
        date: "02-03-2023",
      },
    },
    {
      id: "6",
      title: "Trending Products",
      thumbnail: ChangImage,
      creator: {
        name: "Chang Makeup",
        avatar: ChangAvatar,
        date: "09-05-2025",
      },
    },
  ];

  return (
    <section className="relative w-full max-w-[1440px] mx-auto pt-8" style={{ height: "529px" }}>
      <div className="flex justify-between items-center px-20 mb-12" style={{ height: "51px" }}>
        <h2 className="text-[44px] font-bold leading-[50px] text-[#32294B]" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Video hướng dẫn nổi bật
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-base font-normal leading-5 bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] bg-clip-text text-transparent" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Xem tất cả
          </span>
          <ArrowRight className="w-6 h-6 text-purple-600" />
        </div>
      </div>

      <div className="relative px-20" style={{ height: "433px" }}>
        <Swiper
          spaceBetween={30} 
          slidesPerView={3} 
          navigation 
          //loop 
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {videos.map((video) => (
            <SwiperSlide key={video.id}>
              <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onVideoSelect(video.id)}>
                <div className="relative">
                  <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-gray-800 ml-1" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4 bg-white">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={video.creator.avatar || "/placeholder.svg"} alt={video.creator.name} />
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                          {video.creator.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">{video.creator.name}</h3>
                        <p className="text-xs text-gray-500">{video.creator.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
