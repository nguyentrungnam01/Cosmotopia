import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/shared/product-card';
import { useRouter } from '@/routes/hooks';
import { useGetListProductsByPaging } from '@/queries/product.query';
import { useGetAllCategories } from '@/queries/category.query'; // Import API lấy danh mục

export function ProductListing() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 6;

  // Lấy danh mục từ API
  const {
    data: categoriesData,
    isPending: isCategoriesLoading,
    isError: isCategoriesError
  } = useGetAllCategories();

  // Xử lý danh mục (Thêm "Tất cả" vào danh sách)
  const categories = [
    { categoryId: 'all', name: 'Tất cả' },
    ...(categoriesData?.categories || [])
  ];
  console.log(categories);
  // Nếu danh mục chưa có dữ liệu, mặc định "Tất cả"
  const [activeCategoryId, setActiveCategoryId] = React.useState('all');

  // Lấy danh sách sản phẩm theo danh mục
  const { data, isPending, isError } = useGetListProductsByPaging({
    page: currentPage,
    pageSize: pageSize,
    filters:
      activeCategoryId !== 'all'
        ? { categories: [activeCategoryId] }
        : undefined // Nếu chọn "Tất cả" thì không lọc
  });
  const products = data?.products || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 py-2 lg:grid-cols-[312px_1fr]">
        {/* Sidebar */}
        <div className="flex flex-col gap-3 py-12">
          <nav className="w-[312px] space-y-2 p-2">
            {isCategoriesLoading ? (
              <p>Đang tải danh mục...</p>
            ) : isCategoriesError ? (
              <p>Lỗi khi tải danh mục</p>
            ) : (
              categories.map((category) => (
                <TooltipProvider key={category.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setActiveCategoryId(category.categoryId)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-xl bg-white p-3 text-left shadow-lg transition-all hover:bg-purple-50',
                          activeCategoryId === category.categoryId
                            ? 'text-purple-600'
                            : 'text-gray-700 hover:text-purple-600'
                        )}
                      >
                        <span className="font-montserrat text-base font-normal">
                          {category.name}
                        </span>
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 transition-colors',
                            activeCategoryId === category.id
                              ? 'text-purple-600'
                              : 'text-gray-400'
                          )}
                        />
                      </button>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
              ))
            )}
          </nav>
        </div>

        {/* Product Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-[#2D2D2D] font-montserrat">
              Sản phẩm nổi bật
            </h2>
            <Button
              onClick={() => router.push('/productGrid')}
              variant="link"
              className="text-purple-600 font-montserrat"
            >
              Xem tất cả
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() =>
                        router.push(`/product/${product.productId}`)
                      }
                      className="cursor-pointer"
                    >
                      <ProductCard
                        title={product.name}
                        description={product.description}
                        price={`${new Intl.NumberFormat('vi-VN').format(product.price)} VND`}
                        rating={product.rating}
                        image={product.imageUrls[0]}
                        isNew={product.isNew}
                      />
                    </div>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
