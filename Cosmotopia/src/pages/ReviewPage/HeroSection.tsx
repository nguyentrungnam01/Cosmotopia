import { Search, Play } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import HeroImage from "@/assets/kol/hero-section.png"

export default function HeroSection() {
  return (
    <section
      className="
        relative
        w-full
        bg-gradient-to-r from-pink-100 via-purple-100 to-pink-200
        overflow-hidden
        py-24      /* padding top/bottom 6rem */
      "
    >
      <div className="relative z-10 mx-auto px-4 max-w-7xl">
        {/* Animated Text */}
        <div className="text-center mb-12">
          <h1
            className="mx-auto text-5xl font-bold leading-tight"
            style={{
              fontFamily: "Montserrat, sans-serif",
              background:
                "linear-gradient(270deg, #511BEA 17.27%, #AC3258 34.26%, #FF850B 54.35%, #C628A3 71.73%, #9425D9 91.43%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Mua Sắm Thông Minh
            <br />
            Xem Review, Chọn Sản Phẩm Phù Hợp
          </h1>
        </div>

        {/* Hero Video/Image */}
        <div className="flex justify-center mb-12">
          <div className="relative group cursor-pointer w-full max-w-3xl overflow-hidden rounded-2xl shadow-xl">
            <img
              src={HeroImage}
              alt="Black Rouge Beauty Products Review"
              className="w-full h-auto object-cover"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/20" />
            {/* Play Button */}
            <button className="absolute inset-0 flex items-center justify-center">
              <Button
                className="w-16 h-16 rounded-full bg-white/90 hover:bg-white shadow-lg transition-transform duration-200 group-hover:scale-110"
                size="icon"
              >
                <Play className="w-8 h-8 text-gray-800" />
              </Button>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md bg-[#F0F0F0] rounded-full shadow-sm">
            <div className="flex items-center h-12 px-4 gap-3">
              <Search className="w-6 h-6 text-black/40 flex-shrink-0" />
              <Input
                placeholder="Tìm kiếm video"
                className="w-full border-0 bg-transparent text-base placeholder:text-black/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "16px",
                  lineHeight: "20px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
