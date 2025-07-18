// services/tracking.ts
import { useAuthStore } from '@/store/auth'
import { ITrackingData } from '@/types/tracking'
import axios from 'axios'

const API_BASE = 'https://be-wdp.onrender.com'

export const getTrackingData = async (
  trackingNumber: string,
  email: string
): Promise<ITrackingData | null> => {
  const token = useAuthStore.getState().accessToken
  if (!token) throw new Error('No token found')

  const headers = { Authorization: `Bearer ${token}` }

  const [deliveryRes, orderRes, addressRes] = await Promise.all([
    axios.get(`${API_BASE}/delivery/customer`, { headers }),
    axios.get(`${API_BASE}/order/me/all?email=${email}`, { headers }),
    axios.get(`${API_BASE}/address`, { headers }),
  ])

  const delivery = deliveryRes.data.data.find(
    (d: any) => d.trackingNumber === trackingNumber
  )
  if (!delivery) return null

  const order = orderRes.data.data.find((o: any) => o._id === delivery.orderId)
  if (!order) return null

  const address = addressRes.data.find((a: any) => a._id === order.addressId)
  if (!address) return null

  return { delivery, order, address }
}

// 👉 HÀM MỚI: lấy toàn bộ tracking data
export const getAllTrackingData = async (
  email: string
): Promise<ITrackingData[]> => {
  const token = useAuthStore.getState().accessToken
  if (!token) throw new Error('No token found')

  const headers = { Authorization: `Bearer ${token}` }

  const [deliveryRes, orderRes, addressRes] = await Promise.all([
    axios.get(`${API_BASE}/delivery/customer`, { headers }),
    axios.get(`${API_BASE}/order/me/all?email=${email}`, { headers }),
    axios.get(`${API_BASE}/address`, { headers }),
  ])

  const deliveries = deliveryRes.data.data
  const orders = orderRes.data.data
  const addresses = addressRes.data

  // map lại thành danh sách ITrackingData[]
  const result: ITrackingData[] = deliveries.map((delivery: any) => {
    const order = orders.find((o: any) => o._id === delivery.orderId)
    const address = addresses.find((a: any) => a._id === order?.addressId)

    if (order && address) {
      return { delivery, order, address }
    }

    return null
  }).filter(Boolean) // loại bỏ phần tử null

  return result
}
