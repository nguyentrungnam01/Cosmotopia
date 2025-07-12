"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Upload, Sparkles, X, Camera } from "lucide-react"
import { ProductRecommendations } from "./product-recommendations"
import { scannerService } from "./scanner-service"

// Define the skin analysis result type
interface SkinAnalysisResult {
  acne: string // Mụn
  wrinkles: string // Nếp nhăn
  freckles: string // Tàn nhang, nám
  oiliness: string // Độ dầu
  elasticity: string // Độ đàn hồi
  tone: string // Tone da
  texture: string // Kết cấu da
  skinType: string // Loại da
  aiResponse?: string // Phân tích chi tiết từ AI (nếu có)
}

// Mock data in case API does not return
const mockSkinResult: SkinAnalysisResult = {
  acne: "Ít mụn, da khá sạch, có 1-2 mụn đầu đen nhỏ",
  wrinkles: "Có nếp nhăn nhẹ ở khóe mắt và trán, dấu hiệu lão hóa sớm",
  freckles: "Một vài đốm tàn nhang nhỏ ở gò má, không đáng kể",
  oiliness: "Da hỗn hợp, vùng chữ T hơi dầu, vùng má khô",
  elasticity: "Độ đàn hồi tốt, da săn chắc, collagen còn tốt",
  tone: "Sáng vừa, hơi ngả vàng, undertone ấm",
  texture: "Mịn, lỗ chân lông nhỏ, bề mặt da đều màu",
  skinType: "Combination (Da hỗn hợp)",
  aiResponse: "Dựa trên phân tích, da bạn thuộc loại hỗn hợp với xu hướng khô ở vùng má và dầu ở vùng chữ T. Cần chú ý dưỡng ẩm vùng má và kiểm soát dầu vùng trán, mũi. Nên sử dụng sản phẩm cân bằng, tránh sản phẩm quá khô hoặc quá dầu. Kem chống nắng là bắt buộc để ngăn chặn lão hóa sớm."
}

// Helper function to map skin type to product category
const getSkinTypeCategory = (skinType: string): string => {
  const lowerType = skinType.toLowerCase()
  if (lowerType.includes("combination") || lowerType.includes("hỗn hợp")) return "Combination"
  if (lowerType.includes("dry") || lowerType.includes("khô")) return "Dry"
  if (lowerType.includes("oily") || lowerType.includes("dầu")) return "Oily"
  if (lowerType.includes("sensitive") || lowerType.includes("nhạy cảm")) return "Sensitive"
  return "Combination" // default
}

export function ColorAnalysisDemo() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<SkinAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setError(null)
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

  const handleAnalyze = async () => {
    if (!uploadedImage) {
      setError("Vui lòng tải ảnh lên trước khi phân tích!")
      return
    }
    setIsAnalyzing(true)
    setAnalysisResult(null)
    setError(null)
    try {
      // Call your real API here. For now, we mock the result.
      // const result = await scannerService.analyzeSkin(uploadedImage)
      // setAnalysisResult(result)
      setTimeout(() => {
        setAnalysisResult(mockSkinResult)
        setIsAnalyzing(false)
      }, 2000)
    } catch (error) {
      setError("Có lỗi xảy ra khi phân tích ảnh")
      setIsAnalyzing(false)
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
    setAnalysisResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-purple-100">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Thử nghiệm phân tích da chuyên nghiệp</h3>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
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
                <img
                  src={uploadedImage || "/placeholder.svg"}
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
                <p className="text-gray-600 mb-2">Tải ảnh lên để phân tích da chuyên nghiệp</p>
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
        {analysisResult && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
              <h4 className="font-bold text-purple-600 mb-2">🔬 Kết quả phân tích da chuyên nghiệp</h4>
              <table className="w-full text-sm text-left mt-2">
                <tbody>
                  <tr><td className="font-semibold pr-2">Mụn:</td><td>{analysisResult.acne}</td></tr>
                  <tr><td className="font-semibold pr-2">Nếp nhăn:</td><td>{analysisResult.wrinkles}</td></tr>
                  <tr><td className="font-semibold pr-2">Tàn nhang, nám:</td><td>{analysisResult.freckles}</td></tr>
                  <tr><td className="font-semibold pr-2">Độ dầu:</td><td>{analysisResult.oiliness}</td></tr>
                  <tr><td className="font-semibold pr-2">Độ đàn hồi:</td><td>{analysisResult.elasticity}</td></tr>
                  <tr><td className="font-semibold pr-2">Tone da:</td><td>{analysisResult.tone}</td></tr>
                  <tr><td className="font-semibold pr-2">Kết cấu da:</td><td>{analysisResult.texture}</td></tr>
                  <tr><td className="font-semibold pr-2">Loại da:</td><td className="font-bold text-purple-700">{analysisResult.skinType}</td></tr>
                </tbody>
              </table>
              {analysisResult.aiResponse && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded">
                  <div className="font-semibold mb-1 text-blue-700">💡 Lời khuyên chuyên môn:</div>
                  <div className="text-sm text-gray-700 whitespace-pre-line">{analysisResult.aiResponse}</div>
                </div>
              )}
            </div>
            
            {/* Skincare Recommendations */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
              <h4 className="font-bold text-green-700 mb-3">🧴 Gợi ý quy trình chăm sóc da</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">🌅 Buổi sáng:</h5>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    <li>Sữa rửa mặt dịu nhẹ</li>
                    <li>Toner cân bằng pH</li>
                    <li>Serum Vitamin C</li>
                    <li>Kem dưỡng ẩm</li>
                    <li>Kem chống nắng SPF 30+</li>
                  </ol>
                </div>
                <div>
                  <h5 className="font-semibold text-blue-600 mb-2">🌙 Buổi tối:</h5>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    <li>Tẩy trang (nếu trang điểm)</li>
                    <li>Sữa rửa mặt</li>
                    <li>Toner</li>
                    <li>Serum điều trị</li>
                    <li>Kem dưỡng ẩm</li>
                  </ol>
                </div>
              </div>
            </div>
            
            {/* General Product Recommendations */}
            <ProductRecommendations 
              limit={6} 
              random={true}
              skinType={getSkinTypeCategory(analysisResult.skinType)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}