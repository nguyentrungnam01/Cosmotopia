import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
// import ColorTest1

export default function ColorTest() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="relative w-full max-w-[1604px] mx-auto p-8 rounded-[32px] bg-white shadow-[0px_8px_60px_rgba(157,18,223,0.15)]">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Images */}
          <div className="relative">
            <div className="relative w-full max-w-[450px] aspect-[450/587] rounded-[24px] overflow-hidden shadow-[0px_24px_65px_rgba(20,20,43,0.16)]">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%2040181-yP6LFqNYB5GYDu8nGlT5eIJs9J2ren.png"
                alt="Color consultation"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -right-4 top-1/3 w-[239px] bg-white p-3 rounded-2xl shadow-lg">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WzSyCZL31Io8QCjXmyLFrUa2YYb56i.png"
                alt="AI makeup preview"
                className="w-full rounded-xl"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex flex-col gap-12 max-w-[500px]">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-[#2D2D2D]">Personal color test</h2>
              <p className="text-lg text-gray-600">
                Với công nghệ AI tiên tiến, bạn có thể xác định được tone makeup và mỹ phẩm phù hợp với bạn
              </p>
            </div>
            <Button className="w-fit text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-full shadow-lg hover:scale-105 transition font-montserrat rounded-full px-8 py-6 text-lg font-semibold">
              Bắt đầu test →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

