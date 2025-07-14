export interface CartItem {
    skuId: string;
    productId: string;
    skuName: string;
    image: string;
    quantity: number;
    selected: boolean;
    addedAt: string; 
    priceSnapshot: number;
    discountSnapshot: number;
    stockSnapshot: number;
  }
  