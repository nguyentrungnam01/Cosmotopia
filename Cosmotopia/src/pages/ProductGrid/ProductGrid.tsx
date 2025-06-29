import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ProductCard } from "@/components/shared/product-card";
import { useRouter } from "@/routes/hooks";
import { useGetListProductsByPaging } from "@/queries/product.query";
import { Pagination } from "antd";
import { useState } from "react";

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

  console.log(filters.search);
  const { data, isPending, isError } = useGetListProductsByPaging({
    page: currentPage,
    pageSize: pageSize,
    search: filters.search,
    // Giả sử API nhận tham số filter có tên là filters, hoặc bạn có thể truyền từng thuộc tính riêng:
    filters: {
      categories: filters.categories,
      brands: filters.brands,
      prices: filters.prices,
    },
  });

  console.log(data);

  const products = data?.products || [];
  const totalProducts = data?.products?.filter((product: any) => product.isActive).length || 0;


  if (isPending) return <p>Loading...</p>;
  if (isError) return <p className="mt-2 flex items-center justify-center font-montserrat text-xl font-bold text-[#4E4663]">Không có sản phẩm nào</p>;

  return (
    <div>
      {/* Grid sản phẩm */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products
          .filter((product: any) => product.isActive) // Chỉ lấy những sản phẩm có isActive === true
          .map((product: any, i: number) => (
            <TooltipProvider key={product.productId || i}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => router.push(`/product/${product.productId}`)}
                    className="cursor-pointer"
                  >
                    <ProductCard
                      title={product.name}
                      description={product.description}
                      price={`${new Intl.NumberFormat('vi-VN').format(product.price)} VND`}
                      rating={product.commissionRate}
                      image={product.imageUrls?.[0] || ""}
                      isNew={product.isActive}
                    />
                  </div>
                </TooltipTrigger>
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
