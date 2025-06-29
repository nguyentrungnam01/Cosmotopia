import { ArrowRight, Facebook, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import KolAvatar from '@/assets/kol/kol-avatar.png';

// TikTok icon component since it's not in Lucide
const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

export default function TopKOLSection() {
  const kolData = [
    {
      id: 1,
      name: "Vũ Hà Linh",
      videoCount: "34 video reviews",
      description:
        "Bà Vũ Hà Linh được biết đến là một trong số KOL (người có sức ảnh hưởng) dẫn đầu doanh số bán hàng livestream tại Việt Nam.",
      avatar: KolAvatar,
    },
    {
      id: 2,
      name: "Vũ Hà Linh",
      videoCount: "34 video reviews",
      description:
        "Bà Vũ Hà Linh được biết đến là một trong số KOL (người có sức ảnh hưởng) dẫn đầu doanh số bán hàng livestream tại Việt Nam.",
      avatar: KolAvatar,
    },
    {
      id: 3,
      name: "Vũ Hà Linh",
      videoCount: "34 video reviews",
      description:
        "Bà Vũ Hà Linh được biết đến là một trong số KOL (người có sức ảnh hưởng) dẫn đầu doanh số bán hàng livestream tại Việt Nam.",
      avatar: KolAvatar,
    },
    {
      id: 4,
      name: "Vũ Hà",
      videoCount: "34 video reviews",
      description:
        "Bà Vũ Hà Linh được biết đến là một trong số KOL (người có sức ảnh hưởng) dẫn đầu doanh số bán hàng livestream tại Việt Nam.",
      avatar: KolAvatar,
    },
  ]

  return (
    <section
      className="relative w-full max-w-[1440px] mx-auto px-6 py-12"
      style={{
        height: "533px",
        background: "#FBEFF2",
        borderRadius: "25px",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Top KOL</h2>
        <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
          Xem tất cả
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* KOL Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kolData.map((kol) => (
          <Card key={kol.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              {/* Profile Section */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={kol.avatar || "/placeholder.svg"} alt={kol.name} />
                  <AvatarFallback className="bg-gray-200 text-gray-600">
                    {kol.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{kol.name}</h3>
                  <p className="text-sm text-gray-500">{kol.videoCount}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed mb-6">{kol.description}</p>

              {/* Social Media Icons */}
              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-8 h-8 p-0 border-purple-200 hover:border-purple-300 hover:bg-purple-50 bg-transparent"
                >
                  <Facebook className="w-4 h-4 text-purple-600" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-8 h-8 p-0 border-purple-200 hover:border-purple-300 hover:bg-purple-50 bg-transparent"
                >
                  <TikTokIcon />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-8 h-8 p-0 border-purple-200 hover:border-purple-300 hover:bg-purple-50 bg-transparent"
                >
                  <Instagram className="w-4 h-4 text-purple-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
