import { useAllOrder } from "@/tanstack/order";
import dayjs from "dayjs";

interface ChartPoint {
    date: string;
    orders: number;
}

export const useOrderChartData = () => {
    const { data, isLoading, error } = useAllOrder();

    const chartData: ChartPoint[] = [];

    if (data?.data) {
        const paidOrders = data.data.filter((order: any) => order.isPaid);

        for (const order of paidOrders) {
            const day = dayjs(order.createdAt).format("ddd"); // Mon, Tue, ...

            const existing = chartData.find((item) => item.date === day);
            if (existing) {
                existing.orders += 1;
            } else {
                chartData.push({ date: day, orders: Number(1) });
            }
        }
    }

    return {
        data: chartData.map((point) => ({
            date: point.date,
            orders: Number.isFinite(point.orders) ? point.orders : 0,
        })),
        isLoading,
        error,
    };
};
