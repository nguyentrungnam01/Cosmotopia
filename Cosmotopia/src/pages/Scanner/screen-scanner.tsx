import { useState } from "react"
// import Image from "next/image"
import { Image } from "antd"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Star, ArrowRight, Users, Award, Zap } from "lucide-react"
import { FeatureShowcase } from "./feature-showcase"
import { ColorAnalysisDemo } from "./color-analysis-demo"
import { FAQSection } from "./faq-section"
import { PremiumUpgrade } from "./premium-upgrade"
import ColorTestImage from "@/assets/color-test-1.png";
import { AIChatbot } from "./ai-chatbot"
import { EllipseBackground } from "./ellipse-backgrounds";

export default function ScreenScanner() {
  const [activeTab, setActiveTab] = useState("demo")
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false)

  const testimonials = [
    {
      name: "Nguyễn Anh",
      rating: 5,
      text: "Ứng dụng rất hay, có thể phân tích màu sắc phù hợp với tôn da một cách chính xác. Tôi rất hài lòng với kết quả.",
      avatar: "NA",
    },
    {
      name: "Trần Bảo Ngọc",
      rating: 5,
      text: "Sau khi dùng Scanner AI thì tôi biết được màu sắc phù hợp với mình. Rất tiện lợi và dễ sử dụng.",
      avatar: "TBN",
    },
    {
      name: "Trịnh Phương",
      rating: 5,
      text: "Mình rất thích ứng dụng này. Giúp tôi tìm được những màu son phù hợp với làn da của mình.",
      avatar: "TP",
    },
    {
      name: "Tina T.",
      rating: 5,
      text: "App rất hay, mình đã tìm được màu sắc phù hợp với mình. Cảm ơn team đã tạo ra ứng dụng tuyệt vời này.",
      avatar: "TT",
    },
  ]

  const freeFeatures = ["Phân tích màu sắc cơ bản", "Tư vấn màu tóc", "Gợi ý trang phục"]

  const premiumFeatures = [
    "Phân tích không giới hạn",
    "Tư vấn màu son chi tiết",
    "Gợi ý phụ kiện thời trang",
    "Phân tích chi tiết gam màu phù hợp với bạn",
    "Lưu kết quả phân tích",
    "Tư vấn 1-1 với chuyên gia",
  ]

  const stats = [
    { icon: Users, number: "50,000+", label: "Người dùng tin tưởng" },
    { icon: Award, number: "98%", label: "Độ chính xác" },
    { icon: Zap, number: "< 30s", label: "Thời gian phân tích" },
  ]

  if (showPremiumUpgrade) {
    return <PremiumUpgrade onBack={() => setShowPremiumUpgrade(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      <EllipseBackground />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-4">
            Phân tích Personal Color bằng công nghệ
            <br />
            <span className="text-orange-500">Scanner AI</span>
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto mb-8">
            Personal Color là kỹ thuật phân tích màu sắc phù hợp với tông da của bạn để tìm ra những màu sắc làm bạn
            trông tươi tắn và nổi bật nhất
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="font-bold text-lg text-purple-600">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Tại sao chọn Scanner AI?</h2>
          <FeatureShowcase />
        </div>

        {/* Interactive Demo Section */}
        <div className="mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 border border-purple-200">
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "demo" ? "bg-purple-500 text-white" : "text-purple-600 hover:bg-purple-50"
                  }`}
                onClick={() => setActiveTab("demo")}
              >
                Thử nghiệm
              </button>
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "pricing" ? "bg-purple-500 text-white" : "text-purple-600 hover:bg-purple-50"
                  }`}
                onClick={() => setActiveTab("pricing")}
              >
                Bảng giá
              </button>
            </div>
          </div>

          {activeTab === "demo" && <ColorAnalysisDemo />}

          {activeTab === "pricing" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Free Plan */}
              <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-purple-200">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-purple-600 mb-2">Gói Thường</h3>
                    <div className="text-3xl font-bold text-purple-600 mb-1">Miễn phí</div>
                    <p className="text-sm text-gray-500">Dùng thử miễn phí</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {freeFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-full">Thử ngay</Button>
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-orange-400 text-white border-0">
                <div className="absolute top-4 right-4 bg-yellow-400 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
                  Phổ biến
                </div>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">Nâng cấp</h3>
                    <div className="text-3xl font-bold mb-1">399,000₫</div>
                    <p className="text-sm opacity-90">
                      Truy cập đầy đủ tính năng Personal Color và nhận được những phân tích chuyên sâu nhất về màu sắc
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {premiumFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-white mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-full border-0"
                    onClick={() => setShowPremiumUpgrade(true)}
                  >
                    Nâng cấp ngay
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Khách hàng nói gì về chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-purple-100 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-800">{testimonial.name}</div>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <FAQSection />
        </div>

        {/* App Demo Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <Image
                src={ColorTestImage}
                alt="Color Scanner App Demo"
                width={300}
                height={400}
                className="rounded-2xl shadow-lg mx-auto"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800">Ảnh của bạn Personal Color</h3>
              <p className="text-gray-600">Phân tích tông da của bạn với công nghệ AI tiên tiến</p>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Tải ảnh lên để phân tích màu sắc phù hợp</p>
                <p>• AI sẽ phân tích tông da và đưa ra gợi ý màu sắc</p>
                <p>• Nhận được báo cáo chi tiết về Personal Color của bạn</p>
                <p>• Gợi ý màu son, trang phục và phụ kiện phù hợp</p>
                <p>• Lưu kết quả để tham khảo sau này</p>
              </div>
              <a href="/app-release.apk" download className="inline-block">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Tải ứng dụng ngay
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* <AIChatbot /> */}
    </div>
  )
}