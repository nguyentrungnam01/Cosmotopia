"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Sparkles, X, Camera} from "lucide-react"
import { ColorPalette } from "./color-palette"
// import Image from "next/image"

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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleAnalyze = () => {
    if (!uploadedImage) {
      alert("Vui lòng tải ảnh lên trước khi phân tích!")
      return
    }

    setIsAnalyzing(true)
   
    setTimeout(() => {
      const seasons = ["Mùa Xuân", "Mùa Hè", "Mùa Thu", "Mùa Đông"]
      const randomSeason = seasons[Math.floor(Math.random() * seasons.length)]
      setSelectedSeason(randomSeason)
      setIsAnalyzing(false)
    }, 3000)
  }

  const removeImage = () => {
    setUploadedImage(null)
    setSelectedSeason(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-purple-100">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Thử nghiệm phân tích màu sắc</h3>

       
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
            dragActive
              ? "border-purple-400 bg-purple-50"
              : uploadedImage
                ? "border-green-300 bg-green-50"
                : "border-purple-200 hover:border-purple-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />

          {uploadedImage ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <image
                  src={uploadedImage || "/placeholder.svg"}
                  // src={uploadedImage}
                  alt="Uploaded image"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover mx-auto"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-green-600 font-medium">Ảnh đã được tải lên thành công!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Tải ảnh lên để phân tích Personal Color</p>
                <p className="text-sm text-gray-500 mb-4">Kéo thả ảnh vào đây hoặc click để chọn file</p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="border-purple-300 text-purple-600 hover:bg-purple-50"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Chọn ảnh
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-400">Hỗ trợ: JPG, PNG, GIF (tối đa 10MB)</p>
            </div>
          )}
        </div>

        <div className="text-center mb-6">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !uploadedImage}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Đang phân tích...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Phân tích ngay
              </>
            )}
          </Button>
        </div>

       
        {selectedSeason && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
              <h4 className="font-bold text-purple-600 mb-2">🎉 Kết quả phân tích</h4>
              <p className="text-sm text-gray-700">
                Bạn thuộc nhóm màu <strong>{selectedSeason}</strong>
              </p>
              <p className="text-xs text-gray-600 mt-1">Độ chính xác: 94% • Thời gian phân tích: 2.8s</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colorSeasons.map((season, index) => (
                <div
                  key={index}
                  className={`${season.season === selectedSeason ? "ring-2 ring-purple-400 ring-offset-2" : ""}`}
                >
                  <ColorPalette colors={season.colors} title={season.season} description={season.description} />
                </div>
              ))}
            </div>

         
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mt-4">
              <h5 className="font-semibold text-gray-800 mb-2">💡 Gợi ý cho bạn:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • Màu son phù hợp:{" "}
                  {selectedSeason === "Mùa Xuân"
                    ? "Coral, Peach"
                    : selectedSeason === "Mùa Hè"
                      ? "Rose, Berry"
                      : selectedSeason === "Mùa Thu"
                        ? "Brick Red, Orange"
                        : "Deep Red, Plum"}
                </li>
                <li>• Trang phục: Chọn màu từ bảng màu {selectedSeason.toLowerCase()}</li>
                <li>
                  • Phụ kiện: {selectedSeason === "Mùa Xuân" || selectedSeason === "Mùa Thu" ? "Vàng" : "Bạc"} sẽ làm
                  bạn nổi bật hơn
                </li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
