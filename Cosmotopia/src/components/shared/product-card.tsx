import * as React from "react"
import { Star, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  title: string
  description: string
  price: string
  rating: number
  image: string
  isNew?: boolean
}

export function ProductCard({
  title,
  description,
  price,
  rating,
  image = "/placeholder.svg",
  isNew = false,
}: ProductCardProps) {
  const [isBookmarked, setIsBookmarked] = React.useState(false)

  return (
    <div className="flex w-[288px] h-[370px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0px_2px_12px_rgba(20,20,43,0.08)]">
      {/* Image Section */}
      <div className="relative h-[198px] w-full bg-[#EAEAEA]">
        <img src={image || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
        {/* Badges */}
        <div className="absolute left-4 right-4 top-4 flex justify-between">
          {isNew && (
            <Badge variant="secondary" className="rounded-full bg-white px-3 py-1 text-purple-600">
              New
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white p-0"
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark
              className={cn(
                "h-4 w-4 transition-colors",
                isBookmarked ? "fill-purple-600 text-purple-600" : "text-gray-400",
              )}
            />
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-2 p-4">
        {/* Title and Description */}
        <div className="space-y-1">
          <h3 className="font-montserrat text-base font-bold text-gray-900">{title}</h3>
          <p className="font-openSans text-xs text-gray-500">{description}</p>
        </div>
        {/* Push price to the bottom */}
        <div className="flex-grow"></div>
        {/* Price */}
        <div className="mt-auto font-montserrat text-base font-normal text-purple-600">{price}</div>

        {/* Rating */}
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(rating)
                    ? "fill-[#FFC500] text-[#FFC500]"
                    : i < rating
                      ? "fill-[#FFC500] text-[#FFC500] [clip-path:inset(0_50%_0_0)]"
                      : "fill-[#E0E8F1] text-[#E0E8F1]",
                )}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-gray-900">{rating}/5</span>
        </div> */}
      </div>
    </div>
  )
}

