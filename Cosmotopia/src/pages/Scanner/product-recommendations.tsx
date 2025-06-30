"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Star, ExternalLink, Heart } from "lucide-react"
import BaseRequest from "@/config/axios.config"

interface Product {
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

interface ProductRecommendationsProps {
  season?: string
  category?: string
  limit?: number
  showTitle?: boolean
}

export function ProductRecommendations({ 
  season, 
  category, 
  limit = 6, 
  showTitle = true 
}: ProductRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const seasonKeywords = {
    "Mùa Xuân": ["coral", "peach", "pastel", "warm", "spring", "xuân"],
    "Mùa Hè": ["rose", "berry", "cool", "summer", "light", "hè"],
    "Mùa Thu": ["brick", "orange", "autumn", "warm", "deep", "thu"],
    "Mùa Đông": ["deep", "plum", "winter", "cool", "dark", "đông"]
  }

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await BaseRequest.Get("api/Product/GetAllProduct")
      
      if (response && response.data) {
        let allProducts: Product[] = response.data
        
        // Filter by category if specified
        if (category) {
          allProducts = allProducts.filter(product => 
            product.category.toLowerCase().includes(category.toLowerCase())
          )
        }
        
        // Filter by season keywords if specified
        if (season) {
          const keywords = seasonKeywords[season as keyof typeof seasonKeywords] || []
          allProducts = allProducts.filter(product => 
            keywords.some(keyword => 
              product.name.toLowerCase().includes(keyword) ||
              product.description?.toLowerCase().includes(keyword) ||
              product.category.toLowerCase().includes(keyword) ||
              product.brand.toLowerCase().includes(keyword)
            )
          )
        }
        
        // Sort by rating and limit results
        const sortedProducts = allProducts
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, limit)
        
        setProducts(sortedProducts)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Không thể tải sản phẩm. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [season, category, limit])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const handleProductClick = (product: Product) => {
    // Navigate to product detail page
    window.open(`/product/${product.id}`, '_blank')
  }

  const handleAddToWishlist = (product: Product) => {
    // Add to wishlist functionality
    console.log("Added to wishlist:", product.name)
    // You can implement wishlist functionality here
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
        {showTitle && (
          <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-green-600" />
            Sản phẩm phù hợp với bạn
          </h5>
        )}
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Đang tìm sản phẩm phù hợp...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4">
        {showTitle && (
          <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-red-600" />
            Sản phẩm phù hợp với bạn
          </h5>
        )}
        <div className="text-center py-4">
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <Button 
            onClick={fetchProducts}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4">
        {showTitle && (
          <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-gray-600" />
            Sản phẩm phù hợp với bạn
          </h5>
        )}
        <div className="text-center py-8">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">
            {season ? `Không tìm thấy sản phẩm phù hợp với ${season}` : "Không tìm thấy sản phẩm"}
          </p>
          <p className="text-xs text-gray-500">Vui lòng thử lại sau hoặc thay đổi bộ lọc</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
      {showTitle && (
        <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
          <ShoppingBag className="w-5 h-5 mr-2 text-green-600" />
          Sản phẩm phù hợp với bạn
          {season && <span className="text-sm text-gray-600 ml-2">({season})</span>}
        </h5>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="bg-white hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-3">
              <div className="relative">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-gray-400 text-xs text-center">No Image</div>
                  )}
                  
                  {/* Wishlist button */}
                  <button
                    onClick={() => handleAddToWishlist(product)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                  </button>
                </div>
                
                <h6 className="font-medium text-sm text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h6>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-600 font-semibold text-sm">
                    {formatPrice(product.price)}
                  </span>
                  {product.rating && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                      {product.rating}
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mb-3">{product.brand}</p>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleProductClick(product)}
                    size="sm"
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-xs"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Xem chi tiết
                  </Button>
                </div>
                
                {product.stock !== undefined && (
                  <p className="text-xs text-gray-500 mt-2">
                    Còn lại: {product.stock} sản phẩm
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {products.length > 0 && (
        <div className="text-center mt-4">
          <Button
            onClick={() => window.open('/products', '_blank')}
            variant="outline"
            size="sm"
            className="border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            Xem tất cả sản phẩm
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
} 