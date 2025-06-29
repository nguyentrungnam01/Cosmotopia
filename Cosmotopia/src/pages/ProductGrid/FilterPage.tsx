import { FilterAccordion, FilterItem } from "@/components/shared/filter-accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useGetAllBrands } from "@/queries/brand.query";
import { useGetAllCategories } from "@/queries/category.query";
import { useGetTopSellingProducts } from "@/queries/product.query";
import { BadgeCheck } from 'lucide-react';
import { AlignJustify } from 'lucide-react';
import { BadgeDollarSign } from 'lucide-react';
import { Star } from 'lucide-react';
import { cn } from "@/lib/utils";
// import { CircleCheck } from 'lucide-react';
type FiltersPageProps = {
  filters: {
    categories: string[];
    brands: string[];
    prices: string[];
    topSelling: string[];
    search: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      categories: string[];
      brands: string[];
      prices: string[];
      topSelling: string[];
      search: string;
    }>
  >;
};

export default function FiltersPage({ filters, setFilters }: FiltersPageProps) {
  // Fetch brands
  const { data: brandData, isLoading: isLoadingBrands, error: brandError } = useGetAllBrands();
  const brandItems = brandData?.brands || [];

  // Fetch categories
  const { data: categoryData, isLoading: isLoadingCategories, error: categoryError } = useGetAllCategories();
  const categoryItems = categoryData?.categories || [];

  // Fetch top selling products
  const { data: topSellingData, isLoading: loadingTop, error: errTop } = useGetTopSellingProducts();
  const topItems = topSellingData?.data ?? [];
  console.log("Top Product",topItems);
  if (isLoadingBrands || isLoadingCategories) return <p>Đang tải bộ lọc...</p>;
  if (brandError || categoryError) return <p>Không thể tải bộ lọc</p>;

  const isTopActive = filters.topSelling.length > 0

  const handleTopClick = () => {
    if (isTopActive) {
      // tắt filter bán chạy
      setFilters(prev => ({ ...prev, topSelling: [] }))
    } else {
      // bật filter bán chạy, đồng thời clear các filter khác
      setFilters(prev => ({
        ...prev,
        categories: [],
        brands: [],
        prices: [],
        topSelling: topItems.map(p => p.productId)
      }))
    }
  }

  const handleCategoryChange = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((item) => item !== id)
        : [...prev.categories, id],
    }));
  };

  const handleBrandChange = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(id)
        ? prev.brands.filter((item) => item !== id)
        : [...prev.brands, id],
    }));
  };

  const handlePriceChange = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      prices: prev.prices.includes(id) ? [] : [id],
    }));
  };

  console.log(filters);



  const filterItems: FilterItem[] = [
    {
      id: "topSelling",
      title: "Bán chạy",
      icon: Star,
      content: (
        <div className="px-4 py-2">
          <button
            onClick={handleTopClick}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2 rounded-full font-montserrat font-medium transition",
              isTopActive
                ? "bg-gray-100 text-gray-700 shadow"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:from-purple-600 hover:to-pink-600"
            )}
          >
            <Star className={cn("w-4 h-4", isTopActive ? "text-gray-700" : "text-white")} />
            {isTopActive ? "Tắt bộ lọc" : "Xem top bán chạy"}
          </button>
        </div>
      )
    },
    {
      id: "category",
      title: "Danh mục",
      icon: AlignJustify,
      content: (
        <div className="flex flex-col gap-3">
          {categoryItems.map((category) => {
            const isSelected = filters.categories.includes(category.categoryId)
            return (
              <div key={category.categoryId} className="flex items-center space-x-2">
                {/* custom checkbox */}
                <div
                  className={cn(
                    "relative w-5 h-5 rounded flex items-center justify-center",
                    isSelected
                      ? "bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] border-transparent"
                      : "bg-white border border-gray-300"
                  )}
                >
                  <Checkbox
                    id={category.categoryId}
                    checked={isSelected}
                    onCheckedChange={() => handleCategoryChange(category.categoryId)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <Label
                  htmlFor={category.categoryId}
                  className={cn(
                    "cursor-pointer",
                    isSelected
                      ? "bg-clip-text text-transparent bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF]"
                      : "text-gray-700"
                  )}
                >
                  {category.name}
                </Label>
              </div>
            )
          })}
        </div>
      ),
    },
    {
      id: "brand",
      title: "Thương hiệu",
      icon: BadgeCheck,
      content: (
        <div className="flex flex-col gap-3">
          {brandItems.map((brand) => {
            const isSelected = filters.brands.includes(brand.brandId)
            return (
              <div key={brand.brandId} className="flex items-center space-x-2">
                <div
                  className={cn(
                    "relative w-5 h-5 rounded flex items-center justify-center",
                    isSelected
                      ? "bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] border-transparent"
                      : "bg-white border border-gray-300 text-gray-700 hover:text-purple-600"
                  )}
                >
                  <Checkbox
                    id={brand.brandId}
                    checked={isSelected}
                    onCheckedChange={() => handleBrandChange(brand.brandId)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <Label
                  htmlFor={brand.brandId}
                  className={cn(
                    "cursor-pointer",
                    isSelected
                      ? "bg-clip-text text-transparent bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF]"
                      : "text-gray-700"
                  )}
                >
                  {brand.name}
                </Label>
              </div>
            )
          })}
        </div>
      ),
    },
    {
      id: "price",
      title: "Giá",
      icon: BadgeDollarSign,
      content: (
        <div className="flex flex-col gap-3">
          {[
            { id: "a", label: "Tăng dần" },
            { id: "d", label: "Giảm dần" },
          ].map(({ id, label }) => {
            const isSelected = filters.prices.includes(id)
            return (
              <div key={id} className="flex items-center space-x-2">
                <div
                  className={cn(
                    "relative w-5 h-5 rounded-full flex items-center justify-center",
                    isSelected
                      ? "bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] border-transparent"
                      : "bg-white border border-gray-300"
                  )}
                >
                  <Checkbox
                    id={id}
                    checked={isSelected}
                    onCheckedChange={() => handlePriceChange(id)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <Label
                  htmlFor={id}
                  className={cn(
                    "cursor-pointer",
                    isSelected
                      ? "bg-clip-text text-transparent bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF]"
                      : "text-gray-700"
                  )}
                >
                  {label}
                </Label>
              </div>
            )
          })}
        </div>
      ),
    },
  ]


  return (
    <div className="mx-auto max-w-md space-y-6 p-4">
      <FilterAccordion items={filterItems} />
    </div>
  );
}