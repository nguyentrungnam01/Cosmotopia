import { Card, CardContent } from "@/components/ui/card"
import Avatar from '@/assets/kol/vohalinh-avatar.png';
import { Image } from "antd";

export default function ProfileCard() {
  return (
    <div className="relative w-fit">
      {/* Profile Image - positioned to overlap the card */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <Image
            src= {Avatar}
            alt="Profile"
            width={254}
            height={254}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Card Content */}
      <Card className="ml-32 w-[336px] h-[114px] shadow-lg border-0">
        <CardContent className="flex flex-col justify-center h-full pl-[120px] pr-6 py-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-[28px] font-bold leading-7 bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] bg-clip-text text-transparent font-['Montserrat']">
              Võ Hà Linh
            </h2>
            <p className="text-sm text-[#837D92] font-['Montserrat']">34 video reviews</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
