import { useAllOrder } from "@/tanstack/order";
import moment from "moment";

interface ChartPoint {
    date: string;
    orders: number;
}
export const useOrderChartData = () => {
    const { data, isLoading, error } = useAllOrder();

   
    const tempMap: Record<string, number> = {};

    if (data?.data) {
        const paidOrders = data.data.filter((order: any) => order.isPaid);

        for (const order of paidOrders) {
            const day = moment(order.createdAt).format("ddd");

            tempMap[day] = (tempMap[day] || 0) + 1;
        }
    }

   
    const chartData: ChartPoint[] = Object.entries(tempMap).map(
        ([date, rawCount]) => ({
            date,
            orders: Number.isFinite(rawCount) && rawCount >= 0 ? rawCount : 0,
        })
    );

   
    if (chartData.length === 0) {
        chartData.push({ date: "", orders: 0 });
    }

    return { data: chartData, isLoading, error };
};
