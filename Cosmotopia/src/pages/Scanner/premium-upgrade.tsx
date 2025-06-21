"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ArrowLeft, Crown, Sparkles, Star } from "lucide-react"

interface PremiumUpgradeProps {
  onBack: () => void
}

export function PremiumUpgrade({ onBack }: PremiumUpgradeProps) {
  const pricingTiers = [
    {
      name: "Nâng cấp",
      price: "399,000",
      period: "/tháng",
      description:
        "Truy cập không giới hạn Personal Color và nhận những phân tích chuyên sâu về màu sắc phù hợp với chuyên gia",
      features: [
        "Phân tích không giới hạn",
        "Gợi ý chính xác cao",
        "Bảng phân tích chi tiết",
        "Gửi ra sản phẩm gợi ý và thứ nghiệm đặt hàng",
        "Lưu và theo dõi kết quả",
      ],
      gradient: "from-purple-500 to-pink-500",
      popular: false,
    },
    {
      name: "Nâng cấp",
      price: "1,409,000",
      period: "/3 tháng",
      description:
        "Truy cập không giới hạn Personal Color và nhận những phân tích chuyên sâu về màu sắc phù hợp với chuyên gia",
      features: [
        "Phân tích không giới hạn",
        "Gợi ý chính xác cao",
        "Bảng phân tích chi tiết",
        "Gửi ra sản phẩm gợi ý và thứ nghiệm đặt hàng",
        "Lưu và theo dõi kết quả",
      ],
      gradient: "from-purple-600 to-orange-500",
      popular: true,
    },
    {
      name: "Nâng cấp",
      price: "3,119,000",
      period: "/năm",
      description:
        "Truy cập không giới hạn Personal Color và nhận những phân tích chuyên sâu về màu sắc phù hợp với chuyên gia",
      features: [
        "Phân tích không giới hạn",
        "Gợi ý chính xác cao",
        "Bảng phân tích chi tiết",
        "Gửi ra sản phẩm gợi ý và thứ nghiệm đặt hàng",
        "Lưu và theo dõi kết quả",
      ],
      gradient: "from-orange-500 to-pink-500",
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mr-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-purple-600 mr-2" />
            <h1 className="text-2xl md:text-3xl font-bold text-purple-600">Đăng ký Cosmo cao cấp</h1>
          </div>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Nâng cấp gói thành viên bạn sẽ nhận được vô vàn lợi ích từ ứng dụng để trở thành phiên bản Cosmo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {pricingTiers.map((tier, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 duration-200`}
            >
              {tier.popular && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-purple-800 px-4 py-1 rounded-full text-xs font-bold flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Phổ biến nhất
                </div>
              )}

              <CardContent className="p-6 pt-8">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold mb-3">{tier.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-2xl md:text-3xl font-bold">{tier.price}</span>
                    <span className="text-sm opacity-90 ml-1">{tier.period}</span>
                  </div>
                  <p className="text-xs opacity-90 leading-relaxed">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm">
                      <Check className="w-4 h-4 text-white mr-2 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Nâng cấp ngay
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Lợi ích khi nâng cấp Cosmo cao cấp</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Phân tích chuyên sâu</h3>
              <p className="text-sm text-gray-600">
                Nhận được phân tích chi tiết về màu sắc phù hợp với tông da của bạn
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Tư vấn cao cấp</h3>
              <p className="text-sm text-gray-600">Được tư vấn trực tiếp từ các chuyên gia về màu sắc và thời trang</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Ưu tiên hỗ trợ</h3>
              <p className="text-sm text-gray-600">Nhận được hỗ trợ ưu tiên và cập nhật tính năng mới sớm nhất</p>
            </div>
          </div>
        </div>

        <div className="text-center bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6">
          <h3 className="font-bold text-gray-800 mb-2">Đảm bảo hoàn tiền 100%</h3>
          <p className="text-sm text-gray-600">
            Nếu không hài lòng với dịch vụ, chúng tôi sẽ hoàn tiền trong vòng 30 ngày đầu tiên.
          </p>
        </div>
      </div>
    </div>
  )
}
