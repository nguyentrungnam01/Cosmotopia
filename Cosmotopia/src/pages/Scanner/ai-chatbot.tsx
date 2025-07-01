"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User, Minimize2, ImageIcon, Trash2 } from "lucide-react"
import { scannerService } from "./scanner-service"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  type?: "text" | "image" | "skin-analysis"
  imageUrl?: string
  skinResult?: SkinAnalysisResult
}

interface QuickReply {
  id: string
  text: string
  message: string
}

interface SkinAnalysisResult {
  acne: string
  wrinkles: string
  freckles: string
  oiliness: string
  elasticity: string
  tone: string
  texture: string
  skinType: string
  aiResponse?: string
  products?: Array<{ name: string; link: string; image?: string; price?: string; source: 'internal' | 'google' | 'shopee' }>
}

const quickReplies: QuickReply[] = [
  {
    id: "skin-analysis",
    text: "Phân tích da",
    message: "Tôi muốn được phân tích tình trạng da và nhận lời khuyên chuyên môn",
  },
  {
    id: "product-recommendations",
    text: "Gợi ý sản phẩm",
    message: "Bạn có thể gợi ý sản phẩm mỹ phẩm phù hợp với loại da của tôi không?",
  },
  {
    id: "skincare-routine",
    text: "Quy trình chăm sóc",
    message: "Tôi cần tư vấn về quy trình chăm sóc da hàng ngày phù hợp",
  },
  {
    id: "ingredient-advice",
    text: "Tư vấn thành phần",
    message: "Bạn có thể giải thích về các thành phần trong mỹ phẩm và cách chọn sản phẩm phù hợp không?",
  },
]

const mockSkinResult: SkinAnalysisResult = {
  acne: "Da khá sạch,trắng mịn",
  wrinkles: "Không có nếp nhăn rõ rệt",
  freckles: "Có dấu hiệu xạm nắng",
  oiliness: "các khu vực nhờn và khô, thường nhờn trong vùng T (trán, mũi và cằm) và khô trên má.",
  elasticity: "Độ đàn hồi tốt, da săn chắc",
  tone: "Sáng vừa, hơi ngả vàng",
  texture: "Mịn, lỗ chân lông nhỏ",
  skinType: "Da nhạy cảm: Phản ứng dễ dàng với các sản phẩm hoặc các yếu tố môi trường, gây kích ứng, đỏ hoặc ngứa.",
  aiResponse: "Da bạn thuộc loại Sensitive Skin, cần chú ý dưỡng ẩm vùng má và kiểm soát dầu vùng trán, mũi.",
  products: []
}

const googleProducts: SkinAnalysisResult['products'] = [
  {
    name: "Kem dưỡng ẩm CeraVe Moisturizing Cream",
    link: "https://nhathuoclongchau.com.vn/duoc-my-pham/kem-duong-am-danh-cho-da-kho-cerave-moisturising-cream-mb112202-340g-36477.html",
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/kem_duong_am_danh_cho_da_kho_cerave_moisturizing_cream_50_ml_1_d0050ef0cc.jpg",
    price: "445.000đ",
    source: 'google' as const
  },
  {
    name: "Sữa rửa mặt La Roche-Posay Effaclar",
    link: "https://nhathuoclongchau.com.vn/duoc-my-pham/kem-ho-tro-dieu-tri-mun-la-roche-posay-effaclar-duo-m-40-ml.html",
    image: "https://pos.nvncdn.com/82e158-40396/ps/20190108_bdEFP3iusVtETiqLR5CJf4ob.jpg",
    price: "399.200đ",
    source: 'google' as const
  }
]

const shopeeProducts: SkinAnalysisResult['products'] = [
  {
    name: "Kem chống nắng Anessa SPF50+ PA++++ 60ml",
    link: "https://shopee.vn/ANESSA-Perfect-UV-Mild-Milk-NA-60mL-SPF50-PA-Night-Sun-Care-Serum-c%E1%BB%A1-nh%E1%BB%8F-D%C3%A0nh-cho-da-nh%E1%BA%A1y-c%E1%BA%A3m-tr%E1%BA%BB-s%C6%A1-sinh-Kh%C3%B4ng-ch%E1%BB%A9a-ph%E1%BB%A5-gia-Kh%C3%B4ng-ch%E1%BB%A9a-h%C6%B0%C6%A1ng-li%E1%BB%87u-Kem-ch%E1%BB%91ng-n%E1%BA%AFng-D%C3%B9ng-cho-m%E1%BA%B7t-v%C3%A0-to%C3%A0n-th%C3%A2n-Kem-l%C3%B3t-trang-%C4%91i%E1%BB%83m-Kh%C3%B4ng-th%E1%BA%A5m-n%C6%B0%E1%BB%9Bc-i.1550420460.43854272835?sp_atk=14e31ef7-a1fe-4a26-9bb7-bbd5729f130f&xptdk=14e31ef7-a1fe-4a26-9bb7-bbd5729f130f",
    image: "https://product.hstatic.net/200000773671/product/d06c862084a043dbbd480152c13f207d_6f0fb3edacea49dc80e41e7d963f11d3_master.jpeg",
    price: "649.000đ",
    source: 'shopee' as const
  },
  {
    name: "Sữa rửa mặt Senka Perfect Whip 120g",
    link: "https://shopee.vn/S%E1%BB%AFa-R%E1%BB%ADa-M%E1%BA%B7t-Senka-Perfect-Whip-120g-Nh%E1%BA%ADt-B%E1%BA%A3n-i.403116788.9579848515?sp_atk=c8607aba-e677-4398-a2b1-8e7791e9d847&xptdk=c8607aba-e677-4398-a2b1-8e7791e9d847",
    image: "https://concung.com/2021/10/44629-75514-large_mobile/sua-rua-mat-tao-bot-senka-perfect-whip-120g.jpg",
    price: "95.000đ",
    source: 'shopee' as const
  },
  {
    name: "Serum Vitamin C Melano CC 20ml",
    link: "https://shopee.vn/Tinh-Ch%E1%BA%A5t-Vitamin-C-Melano-CC-Premium-Whitening-Essence-20ml-i.152872415.28803068372?sp_atk=1c6bdb47-c6df-42a7-9e6c-ad7d197afd3b&xptdk=1c6bdb47-c6df-42a7-9e6c-ad7d197afd3b",
    image: "https://down-vn.img.susercontent.com/file/vn-11134201-7ra0g-m7fv2o544nli0f.webp",
    price: "304.000đ",
    source: 'shopee' as const
  }
]

// Helper function to map skin type to product category
const getSkinTypeCategory = (skinType: string): string => {
  const lowerType = skinType.toLowerCase()
  if (lowerType.includes("combination") || lowerType.includes("hỗn hợp")) return "Combination"
  if (lowerType.includes("dry") || lowerType.includes("khô")) return "Dry"
  if (lowerType.includes("oily") || lowerType.includes("dầu")) return "Oily"
  if (lowerType.includes("sensitive") || lowerType.includes("nhạy cảm")) return "Sensitive"
  return "Combination" // default
}

function splitMessage(content: string, maxLength = 500): string[] {
  const parts: string[] = [];
  let current = content;
  while (current.length > maxLength) {
    let splitAt = current.lastIndexOf('\n', maxLength);
    if (splitAt === -1) splitAt = maxLength;
    parts.push(current.slice(0, splitAt));
    current = current.slice(splitAt);
  }
  if (current.trim()) parts.push(current);
  return parts;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [unreadCount, setUnreadCount] = useState(1)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [demoMode, setDemoMode] = useState(false)

  
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      content:
        "Xin chào! 👋 Tôi là AI Chuyên gia Chăm sóc Da của Cosmotopia. Tôi có thể giúp bạn:\n\n• Phân tích tình trạng da và đưa ra lời khuyên chuyên môn\n• Gợi ý sản phẩm mỹ phẩm phù hợp với loại da\n• Tư vấn quy trình chăm sóc da hàng ngày\n• Giải đáp thắc mắc về thành phần và cách sử dụng sản phẩm\n• Phân tích màu sắc phù hợp với tông da\n\nBạn cần tư vấn gì về chăm sóc da hôm nay? 😊",
      role: "assistant",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])

    
    const savedMessages = localStorage.getItem("chatbot-messages")
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages([welcomeMessage, ...parsedMessages])
      } catch (error) {
        console.error("Error loading chat history:", error)
      }
    }
  }, [])

 
  useEffect(() => {
    if (messages.length > 1) {
   
      const messagesToSave = messages.slice(1)
      localStorage.setItem("chatbot-messages", JSON.stringify(messagesToSave))
    }
  }, [messages])


  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const simulateTyping = (duration = 2000) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
    }, duration)
  }

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage
    if (!textToSend.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    setShowQuickReplies(false)

    simulateTyping(1500)

    try {
      // Use scanner service to send chat message
      console.log("[AIChatbot] Sending message to API:", textToSend)
      const response = await scannerService.sendChatMessage({
        message: textToSend,
        context: "Personal Color Scanner AI Assistant - Vietnamese language",
        userId: "user_" + Date.now(),
        sessionId: localStorage.getItem("chat-session-id") || "session_" + Date.now(),
      })
      console.log("[AIChatbot] API chat response:", response)

      setTimeout(() => {
        let content = "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này. 😔"
        
        if (response) {
          if (response.response) {
            content = response.response
          } else if (response.message) {
            content = response.message
          } else if (typeof response === 'string') {
            content = response
          } else {
            console.log("[AIChatbot] Response structure:", JSON.stringify(response, null, 2))
            content = "Tôi đã nhận được phản hồi nhưng không thể hiển thị đúng cách."
          }
        } else {
          console.error("[AIChatbot] Response is null/undefined")
        }
        
        console.log("[AIChatbot] Final content to display:", content)
        const parts = splitMessage(content, 500);
        sendAssistantMessagesSequentially(parts);
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error)

      let errorMessage = "Xin lỗi, có lỗi xảy ra khi kết nối với server. 😞\n\n"

      if (error instanceof Error) {
        if (error.message.includes("timeout")) {
          errorMessage += "• Kết nối bị timeout (quá 10 giây)\n• Vui lòng thử lại"
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage +=
            "• Không thể kết nối đến server\n• Kiểm tra xem server có đang chạy tại https://localhost:7191\n• Đảm bảo CORS được cấu hình đúng trên server"
        } else if (error.message.includes("Server error")) {
          errorMessage += `• Lỗi server: ${error.message}\n• Vui lòng thử lại sau`
        } else {
          errorMessage += `• Chi tiết lỗi: ${error.message}\n• Vui lòng liên hệ hỗ trợ`
        }
      } else {
        errorMessage += "• Lỗi không xác định\n• Vui lòng thử lại sau"
      }

      setTimeout(() => {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          content: errorMessage,
          role: "assistant",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, errorMsg])
      }, 1500)
    } finally {
      setIsLoading(false)
    }
  }

  const sendDemoMessage = (messageText?: string) => {
    const textToSend = messageText || inputMessage
    if (!textToSend.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    setShowQuickReplies(false)

    // Simulate AI thinking
    simulateTyping(2000)

    // Generate expert skincare response
    setTimeout(() => {
      let response = "Cảm ơn bạn đã hỏi! 😊\n\n"
      const lowerMessage = textToSend.toLowerCase()

      if (lowerMessage.includes("phân tích") || lowerMessage.includes("tình trạng") || lowerMessage.includes("da")) {
        response +=
          "Để phân tích tình trạng da chính xác:\n\n" +
          "🔬 **Quy trình phân tích:**\n" +
          "• Chụp ảnh trong ánh sáng tự nhiên\n" +
          "• Không trang điểm đậm\n" +
          "• Sử dụng tính năng 'Thử nghiệm' trên trang chủ\n\n" +
          "📊 **Các chỉ số được đánh giá:**\n" +
          "• Loại da (Khô, Dầu, Hỗn hợp, Nhạy cảm)\n" +
          "• Tình trạng mụn và viêm\n" +
          "• Độ ẩm và độ dầu\n" +
          "• Nếp nhăn và độ đàn hồi\n" +
          "• Sắc tố và tàn nhang\n\n" +
          "💡 **Lời khuyên chuyên môn:**\n" +
          "Dựa trên kết quả phân tích, tôi sẽ đưa ra:\n" +
          "• Quy trình chăm sóc phù hợp\n" +
          "• Sản phẩm được khuyến nghị\n" +
          "• Thành phần nên tránh\n\n" +
          "Hãy thử ngay để nhận tư vấn cá nhân hóa! ✨"
      } else if (lowerMessage.includes("sản phẩm") || lowerMessage.includes("mỹ phẩm") || lowerMessage.includes("gợi ý")) {
        response +=
          "Tôi sẽ gợi ý sản phẩm dựa trên loại da của bạn:\n\n" +
          "🧴 **Cho da khô:**\n" +
          "• Kem dưỡng ẩm giàu Ceramide\n" +
          "• Sữa rửa mặt dịu nhẹ\n" +
          "• Serum chứa Hyaluronic Acid\n\n" +
          "🛢️ **Cho da dầu:**\n" +
          "• Gel rửa mặt kiểm soát dầu\n" +
          "• Kem dưỡng ẩm không gây nhờn\n" +
          "• Serum chứa Niacinamide\n\n" +
          "⚖️ **Cho da hỗn hợp:**\n" +
          "• Sản phẩm cân bằng\n" +
          "• Dưỡng ẩm vùng khô\n" +
          "• Kiểm soát dầu vùng chữ T\n\n" +
          "🌸 **Cho da nhạy cảm:**\n" +
          "• Sản phẩm không chứa hương liệu\n" +
          "• Thành phần lành tính\n" +
          "• Test patch trước khi dùng\n\n" +
          "📱 **Tính năng gợi ý sản phẩm:**\n" +
          "Sau khi phân tích da, tôi sẽ đề xuất:\n" +
          "• Sản phẩm từ Cosmotopia\n" +
          "• Thương hiệu uy tín\n" +
          "• Giá cả phù hợp\n\n" +
          "Hãy gửi ảnh để nhận gợi ý cụ thể! 💄"
      } else if (lowerMessage.includes("quy trình") || lowerMessage.includes("chăm sóc") || lowerMessage.includes("routine")) {
        response +=
          "Quy trình chăm sóc da cơ bản cho mọi loại da:\n\n" +
          "🌅 **Buổi sáng:**\n" +
          "1. Rửa mặt với sữa rửa mặt dịu nhẹ\n" +
          "2. Toner cân bằng pH\n" +
          "3. Serum chống oxy hóa (Vitamin C)\n" +
          "4. Kem dưỡng ẩm\n" +
          "5. Kem chống nắng SPF 30+ (BẮT BUỘC)\n\n" +
          "🌙 **Buổi tối:**\n" +
          "1. Tẩy trang (nếu trang điểm)\n" +
          "2. Rửa mặt với sữa rửa mặt\n" +
          "3. Toner\n" +
          "4. Serum điều trị (Retinol, BHA, AHA)\n" +
          "5. Kem dưỡng ẩm\n\n" +
          "📋 **Lưu ý quan trọng:**\n" +
          "• Thứ tự: Mỏng → Dày\n" +
          "• Chờ 1-2 phút giữa các bước\n" +
          "• Không dùng quá nhiều sản phẩm cùng lúc\n" +
          "• Test patch trước khi dùng sản phẩm mới\n\n" +
          "🎯 **Tùy chỉnh theo loại da:**\n" +
          "Tôi sẽ điều chỉnh quy trình dựa trên kết quả phân tích da của bạn!\n\n" +
          "Hãy gửi ảnh để nhận quy trình cá nhân hóa! ✨"
      } else if (lowerMessage.includes("thành phần") || lowerMessage.includes("ingredient") || lowerMessage.includes("chọn")) {
        response +=
          "Hướng dẫn chọn sản phẩm theo thành phần:\n\n" +
          "🌟 **Thành phần tốt cho da khô:**\n" +
          "• Hyaluronic Acid: Giữ ẩm\n" +
          "• Ceramides: Tái tạo hàng rào bảo vệ\n" +
          "• Glycerin: Dưỡng ẩm\n" +
          "• Shea Butter: Nuôi dưỡng sâu\n\n" +
          "⚡ **Thành phần tốt cho da dầu:**\n" +
          "• Niacinamide: Kiểm soát dầu\n" +
          "• Salicylic Acid: Thông thoáng lỗ chân lông\n" +
          "• Zinc PCA: Giảm tiết bã nhờn\n" +
          "• Tea Tree Oil: Kháng khuẩn\n\n" +
          "🔬 **Thành phần chống lão hóa:**\n" +
          "• Retinol: Tái tạo tế bào\n" +
          "• Vitamin C: Chống oxy hóa\n" +
          "• Peptides: Tăng collagen\n" +
          "• Alpha Hydroxy Acids: Tẩy tế bào chết\n\n" +
          "⚠️ **Thành phần cần tránh:**\n" +
          "• Parabens: Chất bảo quản\n" +
          "• Sulfates: Gây khô da\n" +
          "• Alcohol: Làm khô da\n" +
          "• Fragrance: Gây kích ứng\n\n" +
          "📖 **Cách đọc nhãn sản phẩm:**\n" +
          "• Thành phần đầu danh sách = Nồng độ cao nhất\n" +
          "• Tìm thành phần chính trong top 5\n" +
          "• Tránh sản phẩm có quá nhiều thành phần\n\n" +
          "Hãy gửi ảnh để tôi phân tích và gợi ý sản phẩm phù hợp! 🔍"
      } else if (lowerMessage.includes("giá") || lowerMessage.includes("phí") || lowerMessage.includes("bao nhiêu")) {
        response +=
          "Bảng giá dịch vụ tư vấn chăm sóc da:\n\n" +
          "🆓 **Gói miễn phí:**\n" +
          "• Phân tích da cơ bản\n" +
          "• Gợi ý sản phẩm tổng quát\n" +
          "• Tư vấn quy trình cơ bản\n\n" +
          "💵 **Gói Premium (399,000₫):**\n" +
          "• Phân tích da chi tiết không giới hạn\n" +
          "• Tư vấn chuyên môn cá nhân hóa\n" +
          "• Gợi ý sản phẩm cụ thể theo budget\n" +
          "• Lưu trữ lịch sử phân tích\n" +
          "• Theo dõi tiến trình cải thiện da\n" +
          "• Hỗ trợ 24/7 từ chuyên gia\n\n" +
          "🎁 **Ưu đãi đặc biệt:**\n" +
          "• Giảm 20% cho khách hàng mới\n" +
          "• Tặng voucher mua sản phẩm\n" +
          "• Tư vấn miễn phí trong 30 ngày\n\n" +
          "Đăng ký ngay để nhận tư vấn chuyên nghiệp! 💎"
      } else {
        response +=
          "Là chuyên gia chăm sóc da, tôi có thể giúp bạn:\n\n" +
          "🔬 **Phân tích chuyên môn:**\n" +
          "• Đánh giá tình trạng da\n" +
          "• Xác định loại da chính xác\n" +
          "• Phát hiện vấn đề cần cải thiện\n\n" +
          "💡 **Tư vấn sản phẩm:**\n" +
          "• Gợi ý sản phẩm phù hợp\n" +
          "• Giải thích thành phần\n" +
          "• Hướng dẫn cách sử dụng\n\n" +
          "📋 **Quy trình chăm sóc:**\n" +
          "• Xây dựng routine cá nhân hóa\n" +
          "• Điều chỉnh theo mùa\n" +
          "• Theo dõi tiến trình\n\n" +
          "🎨 **Phân tích màu sắc:**\n" +
          "• Xác định undertone\n" +
          "• Gợi ý màu trang điểm\n" +
          "• Tư vấn thời trang\n\n" +
          "Bạn muốn tư vấn về chủ đề nào? 🤔"
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (!isOpen) {
        setUnreadCount((prev) => prev + 1)
      }
    }, 2000)

    setIsLoading(false)
  }

  const handleSendMessage = (messageText?: string) => {
    // Luôn sử dụng API thật, không dùng demo mode
    sendMessage(messageText)
  }

  const handleQuickReply = (reply: QuickReply) => {
    handleSendMessage(reply.message)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const imageUrl = event.target?.result as string
        const imageMessage: Message = {
          id: Date.now().toString(),
          content: "Tôi đã gửi một hình ảnh để phân tích da",
          role: "user",
          timestamp: new Date(),
          type: "image",
          imageUrl: imageUrl,
        }
        setMessages((prev) => [...prev, imageMessage])
        setIsLoading(true)
        setShowQuickReplies(false)
        try {
          // 1. Phân tích da (mock)
          const skinResult: SkinAnalysisResult = { ...mockSkinResult }
          // 2. Lấy sản phẩm nội bộ
          const internalProducts = await scannerService.getAllProducts()
          const mappedInternalProducts = (internalProducts || []).slice(0, 3).map(p => ({
            name: p.name,
            link: `/product/${p.id}`,
            image: p.image ? (p.image.startsWith('http') ? p.image : `https://localhost:7191${p.image}`) : undefined,
            price: p.price ? scannerService.formatPrice(p.price) : undefined,
            source: 'internal' as const
          }))
          
          // 3. Lấy thêm sản phẩm random từ database
          const allProducts = await scannerService.getAllProducts()
          const randomProducts = allProducts ? 
            [...allProducts]
              .sort(() => 0.5 - Math.random())
              .slice(0, 2)
              .map(p => ({
                name: p.name,
                link: `/product/${p.id}`,
                image: p.image ? (p.image.startsWith('http') ? p.image : `https://localhost:7191${p.image}`) : undefined,
                price: p.price ? scannerService.formatPrice(p.price) : undefined,
                source: 'internal' as const
              })) : []
          
          // 4. Kết hợp sản phẩm
          skinResult.products = [
            ...mappedInternalProducts,
            ...randomProducts,
            ...(googleProducts || []),
            ...(shopeeProducts || [])
          ]
          // 5. Hiển thị kết quả trong chat
          simulateTyping(2000)
          setTimeout(() => {
            const analysisMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: '', // content sẽ render custom
              role: "assistant",
              timestamp: new Date(),
              type: "skin-analysis",
              imageUrl: undefined,
              skinResult: skinResult
            }
            setMessages((prev) => [...prev, analysisMessage])
            if (!isOpen) {
              setUnreadCount((prev) => prev + 1)
            }
          }, 2000)
        } catch (error) {
          setTimeout(() => {
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: "Xin lỗi, có lỗi xảy ra khi phân tích ảnh.",
              role: "assistant",
              timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
          }, 2000)
        } finally {
          setIsLoading(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        content:
          "Xin chào! 👋 Tôi là AI Chuyên gia Chăm sóc Da của Cosmotopia. Tôi có thể giúp bạn:\n\n• Phân tích tình trạng da và đưa ra lời khuyên chuyên môn\n• Gợi ý sản phẩm mỹ phẩm phù hợp với loại da\n• Tư vấn quy trình chăm sóc da hàng ngày\n• Giải đáp thắc mắc về thành phần và cách sử dụng sản phẩm\n• Phân tích màu sắc phù hợp với tông da\n\nBạn cần tư vấn gì về chăm sóc da hôm nay? 😊",
        role: "assistant",
        timestamp: new Date(),
      },
    ])
    setShowQuickReplies(true)
    localStorage.removeItem("chatbot-messages")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatMessageContent = (content: string) => {
    return content.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  const renderSkinAnalysis = (result: SkinAnalysisResult) => (
    <div>
      <div className="font-bold text-purple-700 mb-2">🔬 Kết quả phân tích da</div>
      <table className="w-full text-xs text-left mb-2">
        <tbody>
          <tr><td className="font-semibold pr-2">Mụn:</td><td>{result.acne}</td></tr>
          <tr><td className="font-semibold pr-2">Nếp nhăn:</td><td>{result.wrinkles}</td></tr>
          <tr><td className="font-semibold pr-2">Tàn nhang, nám:</td><td>{result.freckles}</td></tr>
          <tr><td className="font-semibold pr-2">Độ dầu:</td><td>{result.oiliness}</td></tr>
          <tr><td className="font-semibold pr-2">Độ đàn hồi:</td><td>{result.elasticity}</td></tr>
          <tr><td className="font-semibold pr-2">Tone da:</td><td>{result.tone}</td></tr>
          <tr><td className="font-semibold pr-2">Kết cấu da:</td><td>{result.texture}</td></tr>
          <tr><td className="font-semibold pr-2">Loại da:</td><td className="font-bold text-purple-700">{result.skinType}</td></tr>
        </tbody>
      </table>
      {result.aiResponse && (
        <div className="mb-2 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700">{result.aiResponse}</div>
      )}
    </div>
  )

  const renderProductSuggestions = (products: SkinAnalysisResult['products']) => {
    if (!products || products.length === 0) return null;
    const internal = products.filter(p => p.source === 'internal');
    const google = products.filter(p => p.source === 'google');
    const shopee = products.filter(p => p.source === 'shopee');
    return (
      <div className="mt-2">
        {internal.length > 0 && (
          <div className="mb-2">
            <div className="font-semibold text-green-700 mb-1">Sản phẩm gợi ý từ Cosmotopia:</div>
            <div className="grid grid-cols-1 gap-2">
              {internal.map((p, i) => (
                <a key={i} href={p.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-white border rounded hover:shadow">
                  {p.image
                    ? <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded" />
                    : <img src="/placeholder.png" alt="No image" className="w-10 h-10 object-cover rounded" />
                  }
                  <div className="flex-1">
                    <div className="font-medium text-sm">{p.name}</div>
                    {p.price && <div className="text-xs text-gray-500">{p.price}</div>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        {google.length > 0 && (
          <div className="mb-2">
            <div className="font-semibold text-blue-700 mb-1">Sản phẩm tham khảo từ Google:</div>
            <div className="grid grid-cols-1 gap-2">
              {google.map((p, i) => (
                <a key={i} href={p.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-white border rounded hover:shadow">
                  {p.image
                    ? <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded" />
                    : <img src="/placeholder.png" alt="No image" className="w-10 h-10 object-cover rounded" />
                  }
                  <div className="flex-1">
                    <div className="font-medium text-sm">{p.name}</div>
                    {p.price && <div className="text-xs text-gray-500">{p.price}</div>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        {shopee.length > 0 && (
          <div>
            <div className="font-semibold text-yellow-700 mb-1">Sản phẩm tham khảo từ Shopee:</div>
            <div className="grid grid-cols-1 gap-2">
              {shopee.map((p, i) => (
                <a key={i} href={p.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-white border rounded hover:shadow">
                  {p.image
                    ? <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded" />
                    : <img src="/placeholder.png" alt="No image" className="w-10 h-10 object-cover rounded" />
                  }
                  <div className="flex-1">
                    <div className="font-medium text-sm">{p.name}</div>
                    {p.price && <div className="text-xs text-gray-500">{p.price}</div>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Thêm hàm gửi từng đoạn với hiệu ứng typing
  async function sendAssistantMessagesSequentially(parts: string[]) {
    for (let i = 0; i < parts.length; i++) {
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 1200)); // hiệu ứng typing 1.2s
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + i + 1).toString(),
          content: parts[i],
          role: "assistant" as const,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      // Nghỉ 0.4s giữa các đoạn (nếu chưa phải đoạn cuối)
      if (i < parts.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }
    if (!isOpen) {
      setUnreadCount((prev) => prev + 1);
    }
  }

  return (
    <>
      {/* Chat Bubble Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
          {/* Notification Badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xs text-white font-bold">{unreadCount > 9 ? "9+" : unreadCount}</span>
            </div>
          )}
        </div>
      )}

      
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96">
          <Card className="shadow-2xl border-0 overflow-hidden">
          
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">AI Skincare Expert</h3>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-xs opacity-90">Đang hoạt động</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="text-white hover:bg-white/20 p-1 h-auto"
                    title="Xóa lịch sử chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDemoMode(!demoMode)}
                    className={`text-white hover:bg-white/20 p-1 h-auto ${demoMode ? "bg-white/20" : ""}`}
                    title={demoMode ? "Chế độ Demo (Bật)" : "Chế độ Demo (Tắt)"}
                  >
                    <Bot className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white hover:bg-white/20 p-1 h-auto"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 p-1 h-auto"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

           
            {!isMinimized && (
              <CardContent className="p-0">
                <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === "assistant" && (
                            <Bot className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
                          )}
                          {message.role === "user" && <User className="w-4 h-4 mt-0.5 text-white flex-shrink-0" />}
                          <div className="flex-1">
                            {message.type === "image" && message.imageUrl && (
                              <div className="mb-2">
                                <img
                                  src={message.imageUrl || "/placeholder.svg"}
                                  alt="Uploaded image"
                                  className="max-w-full h-32 object-cover rounded border"
                                />
                              </div>
                            )}
                            {message.type === "skin-analysis" && message.skinResult ? (
                              <div>
                                {renderSkinAnalysis(message.skinResult)}
                                {renderProductSuggestions(message.skinResult.products)}
                              </div>
                            ) : (
                              <div className="prose max-w-full text-base break-words whitespace-pre-line">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                              </div>
                            )}
                            <p
                              className={`text-xs mt-1 ${message.role === "user" ? "text-white/70" : "text-gray-500"}`}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-purple-500" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">AI đang soạn tin...</span>
                        </div>
                      </div>
                    </div>
                  )}

                
                  {showQuickReplies && messages.length <= 1 && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 text-center">Câu hỏi gợi ý:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {quickReplies.map((reply) => (
                          <Button
                            key={reply.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickReply(reply)}
                            className="text-xs h-auto py-2 px-3 border-purple-200 text-purple-600 hover:bg-purple-50"
                          >
                            {reply.text}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

               
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Nhập câu hỏi của bạn..."
                      className="flex-1 border-gray-300 focus:border-purple-400 focus:ring-purple-400"
                      disabled={isLoading}
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                      disabled={isLoading}
                    >
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Nhấn Enter để gửi • Có thể gửi ảnh để phân tích • AI có thể mắc lỗi
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
