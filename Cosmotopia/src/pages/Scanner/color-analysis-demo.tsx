"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Sparkles } from "lucide-react"
import { ColorPalette } from "./color-palette"

const colorSeasons = [
  {
    season: "Mùa Xuân",
    colors: ["#FFB6C1", "#98FB98", "#F0E68C", "#DDA0DD", "#87CEEB"],
    description: "Màu sắc tươi sáng, ấm áp phù hợp với tông da vàng",
  },
  {
    season: "Mùa Hè",
    colors: ["#E6E6FA", "#B0E0E6", "#F5DEB3", "#DDA0DD", "#FFB6C1"],
    description: "Màu sắc nhẹ nhàng, mát mẻ cho tông da hồng",
  },
  {
    season: "Mùa Thu",
    colors: ["#D2691E", "#CD853F", "#B22222", "#DAA520", "#8B4513"],
    description: "Màu sắc ấm, đậm đà phù hợp với tông da vàng đậm",
  },
  {
    season: "Mùa Đông",
    colors: ["#000080", "#8B0000", "#2F4F4F", "#800080", "#000000"],
    description: "Màu sắc tương phản mạnh cho tông da lạnh",
  },
]

export function ColorAnalysisDemo() {
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setSelectedSeason("Mùa Xuân")
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-purple-100">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Thử nghiệm phân tích màu sắc</h3>

        <div className="border-2 border-dashed border-purple-200 rounded-lg p-8 text-center mb-6">
          <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Tải ảnh lên để phân tích Personal Color</p>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Đang phân tích...
              </>
            ) : (
              "Phân tích ngay"
            )}
          </Button>
        </div>

        {selectedSeason && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
              <h4 className="font-bold text-purple-600 mb-2">Kết quả phân tích</h4>
              <p className="text-sm text-gray-700">
                Bạn thuộc nhóm màu <strong>{selectedSeason}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colorSeasons.map((season, index) => (
                <ColorPalette
                  key={index}
                  colors={season.colors}
                  title={season.season}
                  description={season.description}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
