export interface Dimensions {
    length: number;
    width: number;
    height: number;
  }
  
  export interface Sku {
    _id: string;
    productId: string;
    variantName: string;
    price: number;
    stock: number;
    reservedStock: number;
    batchCode: string;
    manufacturedAt: string;
    expiredAt: string;
    shelfLifeMonths: number;
    formulationType: string;
    returnable: boolean;
    returnCount: number;
    status: string;
    discount: number;
    images: string;
    weight: number;
    dimensions: Dimensions;
    internalNotes: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface Product {
    _id: string;
    name: string;
    brand: string;
    description: string;
    ingredients: string[];
    skinConcerns: string[];
    suitableForSkinTypes: string[];
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    skus: Sku[];
  }
  export interface CartItem {
    skuId: string;
    skuName: string;
    quantity: number;
    priceSnapshot: number;
    selected: boolean;
    image?: string;
    productId?: string;
  }
  
  // Thêm interface IAddress ngay đây
  export interface IAddress {
    _id: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
    createdAt?: string;
    updatedAt?: string;
  }