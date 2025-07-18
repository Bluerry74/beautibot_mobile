export type PaymentMethod = "Stripe" | "COD" | "Banking" | string;
export type OrderStatus = "Pending" | "Cancelled" | "Shipped" | "Delivered" | string;
export type PaymentStatus = "Paid" | "Unpaid" | "Failed" | string;
export type DeliveryStatus ='pending' | 'assigned' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'failed'
export const deliveryStatusMap: Record<
  DeliveryStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: 'Chờ xử lý', color: '#6b7280', bg: '#f3f4f6' },            // gray
  assigned: { label: 'Đã phân công', color: '#1e3a8a', bg: '#dbeafe' },        // blue
  out_for_delivery: { label: 'Đang giao', color: '#b45309', bg: '#fef3c7' },   // amber
  delivered: { label: 'Đã giao', color: '#15803d', bg: '#dcfce7' },            // green
  cancelled: { label: 'Đã hủy', color: '#b91c1c', bg: '#fee2e2' },             // red
  failed: { label: 'Thất bại', color: '#7c3aed', bg: '#ede9fe' }               // purple
};

export interface IOrderItem {
    skuId: string;
    productId: string;
    skuName: string;
    quantity: number;
    priceSnapshot: number;
    discountSnapshot: number;
    stockSnapshot: number;
    image?: string;
}
export interface IDelivery {
    _id: string;
    customerId: string;
    orderId: string;
    status: DeliveryStatus;
    trackingNumber: string;
    assignedTo?: string;
    estimatedDeliveryDate?: string;
    createdAt: string;
    updatedAt: string;
  }
export interface IOrder {
    _id: string;
    userId: string;
    addressId: string;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    isPaid: boolean;
    paidAt: string; // ISO string
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    isRefunded: boolean;
    items: IOrderItem[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    delivery?: IDelivery;
}

export interface IOrderResponse {
    data: IOrder[];
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}
export interface IOrderDetailDialogProps {
  order: IOrder | null;
  isOpen: boolean;
  onClose: () => void;
}