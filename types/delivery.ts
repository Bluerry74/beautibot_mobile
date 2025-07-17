

export interface IShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
  _id: string;
}

export interface IDelivery {
  _id: string;
  orderId: string;
  customerId: string;
  shippingAddress: IShippingAddress;
  deliveryFee: number;
  status: 'pending' | 'assigned' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'failed';
  trackingNumber: string;
  requiresSignature: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  deliveryPersonnelId?: string;
  proofOfDeliveryUrl?: string;
  deliveryDate?: string;
}

export interface ICreateDelivery {
  orderId: string;
  customerId: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  deliveryFee: number;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  requiresSignature: boolean;
} 