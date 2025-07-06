import { ArrowRight, Download } from "lucide-react";
import { useState } from "react";

export default function KOLDealsSection() {
  const allDeals = [
    { id: 1, discount: "15%", description: "Giảm tối đa 50k đơn từ 300k", isActive: true },
    { id: 2, discount: "10%", description: "Giảm tối đa 30k đơn từ 200k", isActive: false },
    { id: 3, discount: "20%", description: "Giảm tối đa 100k đơn từ 500k", isActive: true },
    { id: 4, discount: "5%", description: "Giảm tối đa 15k đơn từ 100k", isActive: true },
    { id: 5, discount: "25%", description: "Giảm tối đa 50k đơn từ 400k", isActive: true },
    { id: 6, discount: "30%", description: "Giảm tối đa 80k đơn từ 600k", isActive: true },
    { id: 7, discount: "10%", description: "Giảm tối đa 20k đơn từ 150k", isActive: true },
    { id: 8, discount: "15%", description: "Giảm tối đa 50k đơn từ 300k", isActive: false },
    { id: 9, discount: "20%", description: "Giảm tối đa 60k đơn từ 350k", isActive: true },
    { id: 10, discount: "5%", description: "Giảm tối đa 10k đơn từ 50k", isActive: false },
  ];

  const itemsPerPage = 4; 
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allDeals.length / itemsPerPage);

  const currentDeals = allDeals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
        {currentDeals.map((deal) => (
          <div key={deal.id} className="relative">
            {/* Coupon Card */}
            <div
              className={`relative w-full h-[104px] rounded-lg shadow-lg ${
                deal.isActive ? "bg-white hover:shadow-2xl hover:scale-105 transition-all duration-300" : "bg-gray-300 opacity-60"
              }`}
              style={{
                filter: "drop-shadow(0px 2px 12px #F8ACC9)",
                boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.25)",
              }}
            >
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
                  <Download className={`w-6 h-6 text-black ${deal.isActive ? "cursor-pointer" : "disabled text-gray-400"}`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;
          return (
            <div
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-6 h-2 rounded-full cursor-pointer ${currentPage === page ? "bg-purple-600" : "bg-purple-200"}`}
            />
          );
        })}
      </div>
    </section>
  );
}
