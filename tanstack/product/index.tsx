import { getAllProducts, getProductDetail } from "@/services/product";
import { useQuery } from "@tanstack/react-query";

export function useProductsQuery(filters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getAllProducts(filters),
  });
}

export function useProductDetailQuery(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductDetail(id),
    enabled: !!id,
  });
}

