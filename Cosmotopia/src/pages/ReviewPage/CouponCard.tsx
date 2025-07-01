import { ArrowRight, Download } from "lucide-react"

export default function KOLDealsSection() {
  const deals = [
    {
      id: 1,
      discount: "15%",
      description: "Giảm tối đa 50k đơn từ 300k",
      isActive: true,
    },
    {
      id: 2,
      discount: "15%",
      description: "Giảm tối đa 50k đơn từ 300k",
      isActive: true,
    },
    {
      id: 3,
      discount: "15%",
      description: "Giảm tối đa 50k đơn từ 300k",
      isActive: false,
    },
    {
      id: 4,
      discount: "15%",
      description: "Giảm tối đa 50k đơn từ 300k",
      isActive: false,
    },
  ]

  return (
    <section className="w-full max-w-[1440px] mx-auto px-20 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 h-[50px]">
        <h2
          className="text-[44px] font-bold leading-[50px] text-[#32294B]"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Ưu đãi từ KOL
        </h2>
        <div className="flex items-center gap-2">
          <span
            className="text-base font-normal leading-5 bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] bg-clip-text text-transparent"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Xem tất cả
          </span>
          <ArrowRight className="w-6 h-6 text-purple-600" />
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {deals.map((deal) => (
          <div key={deal.id} className="relative">
            {/* Coupon Card */}
            <div
              className={`relative w-full h-[104px] rounded-lg shadow-lg ${deal.isActive ? "bg-white" : "bg-gray-300"}`}
              style={{
                filter: "drop-shadow(0px 2px 12px #F8ACC9)",
                boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* Left Semi-circle Cutout */}
              {/* <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-300 rounded-lg" /> */}

              {/* Right Semi-circle Cutout */}
              {/* <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-300 rounded-lg" /> */}

              {/* Dashed Divider Line */}
              <div className="absolute left-[245px] top-2 h-[85px] border-l-2 border-dashed border-gray-300 opacity-20" />

              {/* Content */}
              <div className="flex items-center justify-between h-full px-6">
                <div className="flex-1">
                  {/* Discount Percentage */}
                  <div
                    className="text-2xl font-semibold leading-7 text-black mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {deal.discount}
                  </div>

                  {/* Description */}
                  <div className="text-xs leading-6 text-[#4A5568]" style={{ fontFamily: "Inter, sans-serif" }}>
                    {deal.description}
                  </div>
                </div>

                {/* Download Icon */}
                <div className="ml-4">
                  <Download className="w-6 h-6 text-black" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2">
        <div className="w-6 h-2 bg-purple-600 rounded-full" />
        <div className="w-2 h-2 bg-purple-200 rounded-full" />
        <div className="w-2 h-2 bg-purple-200 rounded-full" />
      </div>
    </section>
  )
}
