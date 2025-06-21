// components/shared/HeroSection.tsx
import React, { FC } from 'react'
import BannerImage from '@/assets/banner/hero.png'
import { useRouter } from '@/routes/hooks';


const HeroSection: FC = () => {
    const router = useRouter();
    return (
        <section className="relative overflow-hidden">
            <img
                src={BannerImage}
                alt="Hero background"
                className="w-full block max-h-[70vh]"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-pink-200 opacity-70" />

            <div className="absolute inset-0 z-10 container mx-auto px-4 flex flex-col lg:flex-row items-center h-full">
                <div className="text-center lg:text-left">
                    <h1
                        className="font-extrabold text-3xl lg:text-5xl py-2 leading-tight bg-gradient-to-r from-purple-500 to-pink-500 
                        bg-clip-text text-transparent transition-all duration-300">
                        Trang điểm chuẩn cá tính
                    </h1>
                    <p
                        className="font-extrabold text-3xl lg:text-5xl py-2 leading-tight bg-gradient-to-r from-purple-500 to-pink-500 
                        bg-clip-text text-transparent transition-all duration-300">
                        Rạng ngời sắc màu riêng bạn!
                    </p>
                    <p className="lg:w-[60%] mt-2 text-gray-700 font-montserrat">
                        Chúng tôi giúp bạn chọn sản phẩm make up chuẩn tone da, màu mắt, màu tóc – theo hệ thống Personal Color khoa học
                    </p>
                    <button
                        onClick={() =>
                            router.push(`/scanner`)
                        }
                        className="mt-8 inline-block px-32 py-3 font-semibold text-white rounded-full
                             bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg
                             hover:from-purple-600 hover:to-pink-600 transition">
                        Khám phá
                    </button>

                    {/* <div className="mt-6 flex items-center justify-center lg:justify-start">
            <div className="flex -space-x-3">
              {[avatar1, avatar2, avatar3].map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`User ${idx+1}`}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              ))}
              <div className="w-10 h-10 flex items-center justify-center text-xs font-medium
                              bg-pink-400 text-white rounded-full border-2 border-white">
                +99
              </div>
            </div>
            <span className="ml-4 text-gray-700">đã tham gia</span>
          </div> */}
                </div>
            </div>
        </section>
    )
}

export default HeroSection
