import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Camera, Palette, Heart } from "lucide-react"

const features = [
  {
    icon: Camera,
    title: "Chụp ảnh AI",
    description: "Chỉ cần chụp một bức ảnh, AI sẽ phân tích tông da của bạn",
  },
  {
    icon: Palette,
    title: "Phân tích màu sắc",
    description: "Xác định chính xác gam màu phù hợp với làn da của bạn",
  },
  {
    icon: Sparkles,
    title: "Gợi ý cá nhân",
    description: "Nhận được lời khuyên về trang phục và trang điểm",
  },
  {
    icon: Heart,
    title: "Tự tin hơn",
    description: "Tỏa sáng với những màu sắc làm bạn đẹp nhất",
  },
]

export function FeatureShowcase() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {features.map((feature, index) => (
        <Card
          key={index}
          className="bg-white/80 backdrop-blur-sm border border-purple-100 hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-sm text-gray-800 mb-2">{feature.title}</h4>
            <p className="text-xs text-gray-600">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
