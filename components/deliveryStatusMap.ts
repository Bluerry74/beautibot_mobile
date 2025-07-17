import { DeliveryStatus } from '@/types/order'


interface TrackingStep {
  key: DeliveryStatus
  title: string
  description: string
}

export const deliverySteps: TrackingStep[] = [
  {
    key: 'assigned',
    title: 'Đã phân công',
    description: 'Đơn hàng đã được phân công cho nhân viên giao hàng.',
  },
  {
    key: 'out_for_delivery',
    title: 'Đang vận chuyển',
    description: 'Đơn hàng đang được giao đến người nhận.',
  },
  {
    key: 'delivered',
    title: 'Đã giao',
    description: 'Đơn hàng đã được giao thành công.',
  },
  {
    key: 'cancelled',
    title: 'Đã hủy',
    description: 'Đơn hàng đã bị hủy.',
  },
]
