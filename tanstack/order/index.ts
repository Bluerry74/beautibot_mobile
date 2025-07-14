import { getAllOrder } from "@/services/order";
import { useQuery } from "@tanstack/react-query";

export const useAllOrder = (params: Record<string, any> = {}) => {
    return useQuery({
        queryKey: ["allOrder", params],
        queryFn: () => getAllOrder(params),
    });
};

