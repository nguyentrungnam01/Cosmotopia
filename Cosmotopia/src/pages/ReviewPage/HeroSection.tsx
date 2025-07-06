// src/pages/ReviewPage/HeroSection.tsx

import { forwardRef } from 'react';

interface HeroSectionProps {
  videoId: string;
}

const HeroSection = forwardRef<HTMLDivElement, HeroSectionProps>(({ videoId }, ref) => {
  const videoUrls: { [key: string]: string } = {
    "1": "https://www.youtube.com/embed/gds6Ty7TV_Y?si=s-507I11qKI244Tk?autoplay=1&controls=1&showinfo=0&rel=0", 
    "2": "https://www.youtube.com/embed/UY0Og8583jA?autoplay=1&controls=1&showinfo=0&rel=0",
    "3": "https://www.youtube.com/embed/a3YVSU0iR2I?si=QR9sPz-B7xocEloQ?autoplay=1&controls=1&showinfo=0&rel=0",
  };

  return (
    <section
      ref={ref}
      className="relative w-full bg-gradient-to-r from-pink-100 via-purple-100 to-pink-200 overflow-hidden py-24"
    >
      <div className="relative z-10 mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="mx-auto text-5xl font-bold leading-tight" style={{
            fontFamily: "Montserrat, sans-serif",
            background: "linear-gradient(270deg, #511BEA 17.27%, #AC3258 34.26%, #FF850B 54.35%, #C628A3 71.73%, #9425D9 91.43%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Mua Sắm Thông Minh
            <br />
            Xem Review, Chọn Sản Phẩm Phù Hợp
          </h1>
        </div>

        <div className="flex justify-center mb-12">
          <div className="relative group cursor-pointer w-full max-w-3xl overflow-hidden rounded-2xl shadow-xl">
            <iframe
              width="100%"
              height="auto"
              src={videoUrls[videoId] || "https://www.youtube.com/embed/UY0Og8583jA?autoplay=1&controls=1&showinfo=0&rel=0"}
              title="YouTube video"
              className="w-full h-[500px] object-cover"
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';  // Set displayName for React debugging

export default HeroSection;
