"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User, Minimize2, ImageIcon, Trash2 } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  type?: "text" | "image"
  imageUrl?: string
}

interface QuickReply {
  id: string
  text: string
  message: string
}

const quickReplies: QuickReply[] = [
  {
    id: "color-analysis",
    text: "Phân tích màu sắc",
    message: "Tôi muốn biết cách phân tích màu sắc phù hợp với tông da của mình",
  },
  {
    id: "makeup-tips",
    text: "Tư vấn trang điểm",
    message: "Bạn có thể tư vấn cách trang điểm phù hợp với màu da của tôi không?",
  },
  {
    id: "fashion-advice",
    text: "Gợi ý thời trang",
    message: "Tôi cần lời khuyên về màu sắc trang phục phù hợp",
  },
  {
    id: "seasonal-colors",
    text: "Màu theo mùa",
    message: "Làm thế nào để biết tôi thuộc nhóm màu nào (Xuân, Hạ, Thu, Đông)?",
  },
]

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
        "Xin chào! 👋 Tôi là AI Assistant của cosmotopia. Tôi có thể giúp bạn:\n\n• Phân tích màu sắc phù hợp với tông da\n• Tư vấn trang điểm và thời trang\n• Gợi ý màu son và phụ kiện\n• Hướng dẫn sử dụng ứng dụng\n\nBạn cần hỗ trợ gì hôm nay? 😊",
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
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) 

      const response = await fetch("https://localhost:7191/api/Chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors", 
        credentials: "omit", 
        signal: controller.signal,
        body: JSON.stringify({
          message: textToSend,
          context: "Personal Color Scanner AI Assistant - Vietnamese language",
          userId: "user_" + Date.now(),
          sessionId: localStorage.getItem("chat-session-id") || "session_" + Date.now(),
        }),
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response || data.message || "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này. 😔",
          role: "assistant",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])

        
        if (!isOpen) {
          setUnreadCount((prev) => prev + 1)
        }
      }, 1500)
    } catch (error) {
      console.error("Error sending message:", error)

      let errorMessage = "Xin lỗi, có lỗi xảy ra khi kết nối với server. 😞\n\n"

      if (error instanceof Error) {
        if (error.name === "AbortError") {
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

  
    simulateTyping(2000)

 
    setTimeout(() => {
      let response = "Cảm ơn bạn đã hỏi! 😊\n\n"
      const lowerMessage = textToSend.toLowerCase()

      if (lowerMessage.includes("màu sắc") || lowerMessage.includes("phân tích")) {
        response +=
          "Để phân tích màu sắc phù hợp:\n• Chụp ảnh trong ánh sáng tự nhiên\n• Không trang điểm đậm\n• Sử dụng tính năng 'Thử nghiệm' trên trang chủ\n\nBạn sẽ nhận được kết quả thuộc 1 trong 4 nhóm: Xuân, Hạ, Thu, Đông! ✨"
      } else if (lowerMessage.includes("trang điểm") || lowerMessage.includes("son")) {
        response +=
          "Gợi ý trang điểm theo màu da:\n• Da ấm: Son cam, đỏ gạch, nâu\n• Da lạnh: Son hồng, đỏ cherry, tím\n• Da trung tính: Hầu hết các màu đều phù hợp\n\nHãy thử tính năng phân tích để biết chính xác nhé! 💄"
      } else if (lowerMessage.includes("thời trang") || lowerMessage.includes("trang phục")) {
        response +=
          "Lời khuyên về màu sắc trang phục:\n• Chọn màu làm nổi bật làn da\n• Tránh màu làm da xanh xao\n• Kết hợp màu cơ bản với màu nhấn\n\nSử dụng ứng dụng để có gợi ý cụ thể! 👗"
      } else if (lowerMessage.includes("giá") || lowerMessage.includes("phí")) {
        response +=
          "Bảng giá dịch vụ:\n• Gói miễn phí: Phân tích cơ bản\n• Gói nâng cấp: 399,000₫\n  - Phân tích không giới hạn\n  - Tư vấn chi tiết\n  - Lưu kết quả\n\nĐăng ký ngay để nhận ưu đãi! 💎"
      } else {
        response +=
          "Tôi có thể giúp bạn về:\n• Phân tích màu sắc Personal Color\n• Tư vấn trang điểm phù hợp\n• Gợi ý thời trang và phụ kiện\n• Hướng dẫn sử dụng ứng dụng\n\nBạn muốn biết thêm về chủ đề nào? 🤔"
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
    if (demoMode) {
      sendDemoMessage(messageText)
    } else {
      sendMessage(messageText)
    }
  }

  const handleQuickReply = (reply: QuickReply) => {
    handleSendMessage(reply.message)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        const imageMessage: Message = {
          id: Date.now().toString(),
          content: "Tôi đã gửi một hình ảnh để phân tích màu sắc",
          role: "user",
          timestamp: new Date(),
          type: "image",
          imageUrl: imageUrl,
        }

        setMessages((prev) => [...prev, imageMessage])

        
        setTimeout(() => {
          const analysisMessage: Message = {
            id: (Date.now() + 1).toString(),
            content:
              "Cảm ơn bạn đã gửi hình ảnh! 📸\n\nTôi đã phân tích ảnh của bạn và nhận thấy:\n• Tông da: Ấm/Lạnh\n• Màu sắc phù hợp: [Danh sách màu]\n• Gợi ý trang điểm: [Chi tiết]\n\nĐể có kết quả chính xác hơn, bạn có thể sử dụng tính năng 'Phân tích màu sắc' trong ứng dụng! ✨",
            role: "assistant",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, analysisMessage])
        }, 2000)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        content:
          "Xin chào! 👋 Tôi là AI Assistant của Personal Color Scanner. Tôi có thể giúp bạn:\n\n• Phân tích màu sắc phù hợp với tông da\n• Tư vấn trang điểm và thời trang\n• Gợi ý màu son và phụ kiện\n• Hướng dẫn sử dụng ứng dụng\n\nBạn cần hỗ trợ gì hôm nay? 😊",
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
                    <h3 className="font-semibold text-sm">AI Color Assistant</h3>
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
                            <p className="text-sm leading-relaxed">{formatMessageContent(message.content)}</p>
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
