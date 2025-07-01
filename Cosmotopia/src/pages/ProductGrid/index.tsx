import { useEffect, useState } from "react";
import FiltersPage from "./FilterPage";
import { ProductGrid } from "./ProductGrid";
import { useSearchParams } from "react-router-dom";

export default function Page() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    prices: [] as string[],
    topSelling: [] as string[],
    search: searchQuery,
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: searchQuery }));
  }, [searchQuery]);

  console.log(filters);

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[312px_1fr]">
          {/* Sidebar */}
          <div className="flex flex-col gap-3">
            <nav className="w-[342px] space-y-2 p-2">
              <FiltersPage filters={filters} setFilters={setFilters} />
            </nav>
          </div>
          {/* Product Grid */}
          <div className="space-y-6">
            <ProductGrid filters={filters} />
          </div>
        </div>
      </div>
    </main>
  );
}
