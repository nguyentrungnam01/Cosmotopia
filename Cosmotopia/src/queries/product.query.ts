import { useMutation, useQuery } from "@tanstack/react-query";
import BaseRequest from "@/config/axios.config";

const SUB_URL = `api/Product`;

interface ProductPagingParams {
  page: number;
  pageSize: number;
  search?: string;
  filters?: {
    categories?: string[];
    brands?: string[];
    prices?: string[];
  };
}

export const useGetListProductsByPaging = ({ page, pageSize, search, filters }: ProductPagingParams) => {
  return useQuery({
    queryKey: ["get_products", page, pageSize, search, filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      // Nếu có từ khóa tìm kiếm, thêm vào query
      if (search) {
        queryParams.append("search", search);
      }

      // Nếu có filter, nối chúng thành chuỗi query
      if (filters) {
        if (filters.categories?.length) {
          queryParams.append("categoryId", filters.categories.join(","));
        }
        if (filters.brands?.length) {
          queryParams.append("brandId", filters.brands.join(","));
        }
        if (filters.prices?.length) {
          queryParams.append("sortBy", filters.prices.join(","));
        }
      }
      console.log("Query: ", queryParams.toString());
      const url = `/${SUB_URL}/GetAllProduct?${queryParams.toString()}`;
      return await BaseRequest.Get2(url);
    },
    staleTime: 1000 * 60 * 5, // Giữ dữ liệu cache trong 5 phút
  });
};

export const useGetDetailProduct = (id?: string) => {
  return useQuery({
    queryKey: ['get_detail_product'], // Thêm id để quản lý cache riêng biệt
    queryFn: async () => {
      return await BaseRequest.Get(`/${SUB_URL}/GetProductBy/${id}`);
    },
  });
};

export const useGetTopSellingProducts = () => {
  return useQuery({
    queryKey: ['get_top_selling_product'],
    queryFn: async () => {
      return BaseRequest.Get2(`/${SUB_URL}/GetTopSellingProducts?top=6`);
    }
  })
}