import BaseRequest from "@/config/axios.config"

export interface AnalysisResult {
  season: string
  confidence: number
  analysisTime: number
  recommendations: {
    makeup: string[]
    clothing: string[]
    accessories: string[]
  }
  description: string
  aiResponse?: string
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  brand: string
  rating?: number
  description?: string
  stock?: number
}

export interface ChatMessage {
  message: string
  imageData?: string
  context?: string
  userId?: string
  sessionId?: string
}

export class ScannerService {
  private static instance: ScannerService

  private constructor() {}

  public static getInstance(): ScannerService {
    if (!ScannerService.instance) {
      ScannerService.instance = new ScannerService()
    }
    return ScannerService.instance
  }

  /**
   * Analyze image for personal color using AI
   */
  async analyzeImage(imageBase64: string): Promise<AnalysisResult> {
    try {
      const startTime = Date.now()
      
      const response = await BaseRequest.Post("api/Chat", {
        message: "Phân tích màu sắc personal color từ ảnh này và đưa ra lời khuyên cụ thể về mùa màu sắc phù hợp",
        imageData: imageBase64,
        context: "Personal Color Analysis - Vietnamese language",
        userId: "user_" + Date.now(),
        sessionId: localStorage.getItem("chat-session-id") || "session_" + Date.now(),
      })

      const analysisTime = (Date.now() - startTime) / 1000
      
      return this.parseAnalysisResponse(response, analysisTime)
    } catch (error) {
      console.error("Error analyzing image:", error)
      throw new Error("Không thể phân tích ảnh. Vui lòng thử lại sau.")
    }
  }

  /**
   * Send chat message to AI
   */
  async sendChatMessage(message: ChatMessage): Promise<any> {
    try {
      console.log('ScannerService.sendChatMessage - Sending message:', message);
      const response = await BaseRequest.PostWithOutResponse("api/Chat", message);
      console.log('ScannerService.sendChatMessage - Response received:', response);
      
      // Kiểm tra response có hợp lệ không
      if (!response) {
        console.error('ScannerService.sendChatMessage - Response is null/undefined');
        throw new Error("Không nhận được phản hồi từ server");
      }
      
      return response;
    } catch (error) {
      console.error("ScannerService.sendChatMessage - Error occurred:", error);
      throw new Error("Không thể gửi tin nhắn. Vui lòng thử lại sau.");
    }
  }

  /**
   * Get all products from API
   */
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await BaseRequest.Get("api/Product/GetAllProduct")
      return response?.data || []
    } catch (error) {
      console.error("Error fetching products:", error)
      throw new Error("Không thể tải sản phẩm. Vui lòng thử lại sau.")
    }
  }

  /**
   * Get recommended products based on season
   */
  async getRecommendedProducts(season: string, limit: number = 6): Promise<Product[]> {
    try {
      const allProducts = await this.getAllProducts()
      
      // Filter products based on season (simplified approach)
      const filteredProducts = allProducts.filter(product => {
        const productText = `${product.name} ${product.description || ''} ${product.category} ${product.brand}`.toLowerCase()
        
        // Simple season matching
        if (season === "Mùa Xuân" && (productText.includes("coral") || productText.includes("peach") || productText.includes("pastel"))) {
          return true
        } else if (season === "Mùa Hè" && (productText.includes("rose") || productText.includes("berry") || productText.includes("cool"))) {
          return true
        } else if (season === "Mùa Thu" && (productText.includes("brick") || productText.includes("orange") || productText.includes("autumn"))) {
          return true
        } else if (season === "Mùa Đông" && (productText.includes("deep") || productText.includes("plum") || productText.includes("winter"))) {
          return true
        }
        
        return false
      })
      
      // Sort by rating and limit results
      return filteredProducts
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit)
    } catch (error) {
      console.error("Error getting recommended products:", error)
      return []
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string, limit: number = 6): Promise<Product[]> {
    try {
      const allProducts = await this.getAllProducts()
      
      const filteredProducts = allProducts.filter(product => 
        product.category.toLowerCase().includes(category.toLowerCase())
      )
      
      return filteredProducts
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit)
    } catch (error) {
      console.error("Error getting products by category:", error)
      return []
    }
  }

  /**
   * Parse AI response to extract season and confidence
   */
  private parseAnalysisResponse(aiResponse: any, analysisTime: number): AnalysisResult {
    let detectedSeason = "Mùa Xuân" // Default fallback
    let confidence = 85
    let aiResponseText = ""
    
    if (aiResponse && aiResponse.response) {
      aiResponseText = aiResponse.response
      const responseText = aiResponse.response.toLowerCase()
      
      // Detect season from response
      if (responseText.includes("xuân") || responseText.includes("spring")) {
        detectedSeason = "Mùa Xuân"
      } else if (responseText.includes("hè") || responseText.includes("summer")) {
        detectedSeason = "Mùa Hè"
      } else if (responseText.includes("thu") || responseText.includes("autumn")) {
        detectedSeason = "Mùa Thu"
      } else if (responseText.includes("đông") || responseText.includes("winter")) {
        detectedSeason = "Mùa Đông"
      }
      
      // Extract confidence if available
      const confidenceMatch = responseText.match(/(\d+)%/)
      if (confidenceMatch) {
        confidence = parseInt(confidenceMatch[1])
      }
    }
    
    // Generate recommendations based on season
    const recommendations = this.generateRecommendations(detectedSeason)
    
    return {
      season: detectedSeason,
      confidence,
      analysisTime,
      recommendations,
      description: this.getSeasonDescription(detectedSeason),
      aiResponse: aiResponseText
    }
  }

  /**
   * Generate recommendations based on season
   */
  private generateRecommendations(season: string) {
    const recommendations = {
      "Mùa Xuân": {
        makeup: ["Coral", "Peach", "Hồng cam", "Vàng nhạt"],
        clothing: ["Màu sắc mùa xuân", "Pastel", "Tươi sáng"],
        accessories: ["Vàng", "Đồng", "Màu ấm"]
      },
      "Mùa Hè": {
        makeup: ["Rose", "Berry", "Hồng mát", "Tím nhạt"],
        clothing: ["Màu sắc mùa hè", "Nhẹ nhàng", "Mát mẻ"],
        accessories: ["Bạc", "Trắng", "Màu lạnh"]
      },
      "Mùa Thu": {
        makeup: ["Brick Red", "Orange", "Đỏ gạch", "Cam đất"],
        clothing: ["Màu sắc mùa thu", "Ấm áp", "Đậm đà"],
        accessories: ["Vàng", "Đồng", "Màu ấm"]
      },
      "Mùa Đông": {
        makeup: ["Deep Red", "Plum", "Đỏ đậm", "Tím đậm"],
        clothing: ["Màu sắc mùa đông", "Tương phản", "Đậm"],
        accessories: ["Bạc", "Trắng", "Màu lạnh"]
      }
    }
    
    return recommendations[season as keyof typeof recommendations] || recommendations["Mùa Xuân"]
  }

  /**
   * Get season description
   */
  private getSeasonDescription(season: string): string {
    const descriptions = {
      "Mùa Xuân": "Màu sắc tươi sáng, ấm áp phù hợp với tông da vàng",
      "Mùa Hè": "Màu sắc nhẹ nhàng, mát mẻ cho tông da hồng",
      "Mùa Thu": "Màu sắc ấm, đậm đà phù hợp với tông da vàng đậm",
      "Mùa Đông": "Màu sắc tương phản mạnh cho tông da lạnh"
    }
    
    return descriptions[season as keyof typeof descriptions] || descriptions["Mùa Xuân"]
  }

  /**
   * Format price to Vietnamese currency
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  /**
   * Save analysis result to localStorage
   */
  saveAnalysisResult(result: AnalysisResult): void {
    try {
      const savedResults = this.getSavedAnalysisResults()
      savedResults.unshift({
        ...result,
        timestamp: new Date().toISOString()
      })
      
      // Keep only last 10 results
      if (savedResults.length > 10) {
        savedResults.splice(10)
      }
      
      localStorage.setItem('scanner-analysis-results', JSON.stringify(savedResults))
    } catch (error) {
      console.error("Error saving analysis result:", error)
    }
  }

  /**
   * Get saved analysis results from localStorage
   */
  getSavedAnalysisResults(): Array<AnalysisResult & { timestamp: string }> {
    try {
      const saved = localStorage.getItem('scanner-analysis-results')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error("Error getting saved analysis results:", error)
      return []
    }
  }

  /**
   * Clear saved analysis results
   */
  clearSavedAnalysisResults(): void {
    localStorage.removeItem('scanner-analysis-results')
  }
}

// Export singleton instance
export const scannerService = ScannerService.getInstance() 