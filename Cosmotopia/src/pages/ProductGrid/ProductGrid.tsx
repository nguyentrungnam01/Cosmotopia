import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ProductCard } from "@/components/shared/product-card";
import { useRouter } from "@/routes/hooks";
import { useGetListProductsByPaging } from "@/queries/product.query";
import { Pagination } from "antd";
import { useState, useMemo } from "react";

type Filters = {
  categories: string[];
  brands: string[];
  prices: string[];
  search: string;
};

type ProductGridProps = {
  filters: Filters;
};

export function ProductGrid({ filters }: ProductGridProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const { data, isPending, isError } = useGetListProductsByPaging({
    page: currentPage,
    pageSize,
    search: filters.search,
    filters: {
      categories: filters.categories,
      brands: filters.brands,
      prices: filters.prices,
    },
  });

  // Chỉ lọc sản phẩm active 1 lần
  const activeProducts = useMemo(
    () => (data?.products || []).filter((product: any) => product.isActive),
    [data?.products]
  );

  // Lấy total từ API
  const totalProducts = data?.totalCount || 0;
  console.log("Total Products:", data);
  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError || activeProducts.length === 0) {
    return (
      <p className="mt-2 flex items-center justify-center font-montserrat text-xl font-bold text-[#4E4663]">
        Không có sản phẩm nào
      </p>
    );
  }

  return (
    <div>
      {/* Grid sản phẩm */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {activeProducts.map((product: any) => (
          <TooltipProvider key={product.productId}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={() => router.push(`/product/${product.productId}`)}
                  className="cursor-pointer"
                >
                  <ProductCard
                    title={product.name}
                    description={product.description}
                    price={`${new Intl.NumberFormat("vi-VN").format(product.price)} VND`}
                    image={product.imageUrls?.[0] || ""}
                    isNew={product.isActive}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm text-gray-200">
                  {product.description || "Không có mô tả"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-6 mr-8">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalProducts}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
          rootClassName="custom-pagination"
        />
      </div>
    </div>
  );
}
