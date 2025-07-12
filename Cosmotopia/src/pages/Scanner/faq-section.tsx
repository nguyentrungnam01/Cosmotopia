"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "Personal Color là gì?",
    answer:
      "Personal Color là phương pháp phân tích màu sắc dựa trên tông da, màu mắt và màu tóc tự nhiên của bạn để tìm ra những màu sắc làm bạn trông tươi tắn và nổi bật nhất.",
  },
  {
    question: "Làm thế nào để có kết quả chính xác nhất?",
    answer:
      "Để có kết quả tốt nhất, hãy chụp ảnh trong ánh sáng tự nhiên, không trang điểm đậm, và đảm bảo khuôn mặt được chiếu sáng đều.",
  },
  {
    question: "Tôi có thể sử dụng kết quả như thế nào?",
    answer:
      "Bạn có thể áp dụng kết quả để chọn màu son, trang phục, phụ kiện và thậm chí là màu tóc phù hợp với tông da của mình.",
  },
  {
    question: "Ứng dụng có lưu trữ ảnh của tôi không?",
    answer:
      "Chúng tôi cam kết bảo mật thông tin. Ảnh chỉ được sử dụng để phân tích và sẽ được xóa sau khi hoàn thành quá trình.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center text-gray-800 mb-6">Câu hỏi thường gặp</h3>
      {faqs.map((faq, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm border border-purple-100">
          <CardContent className="p-0">
            <button
              className="w-full p-4 text-left flex justify-between items-center hover:bg-purple-50 transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-semibold text-gray-800">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-purple-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-purple-500" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4">
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}