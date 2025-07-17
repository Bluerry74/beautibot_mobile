
import { get } from "@/httpservices/httpService";
import { getAllOrder } from "@/services/order";
import { useQuery } from "@tanstack/react-query";

export const useAllOrder = (params: Record<string, any> = {}) => {
    return useQuery({
        queryKey: ["allOrder", params],
        queryFn: () => getAllOrder(params),
    });
};

export const useAnalytics = () => {
    return useQuery<any>({
        queryKey: ["order-analytics"],
        queryFn: async () => {
            const res = await get<any>("/order/admin/analytics");
            return res.data;
        },
    });
};
