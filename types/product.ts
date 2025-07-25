// Dimensions for SKU
export interface IDimensions {
  length: number;
  width: number;
  height: number;
}

// SKU Structure
export interface ISku {
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
  images: any[];
  weight: number;
  dimensions: IDimensions;
  internalNotes?: string;
  createdAt: string;
  returnedStock?: any;
  updatedAt: string;
  __v?: number;
}

// Basic product (used for list, form, etc.)
export interface IProduct {
  _id?: string | undefined;
  name?: string | any;
  code?: string | undefined;
  rating?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
  suitableForSkinTypes?: string[];
  skinConcerns?: string[];
  ingredients?: string[];
  brand?: string;
  description?: string;
  quantity?: number;
  image?: any;
  skus?: ISku[] | any;
}

// Full detail product (used for detail page)
export interface IProductDetail {
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
  skus: ISku[];
  image: string;
  rating?: number;
  vendor?: string;
  oldPrice?: number;
  availability?: string;
  size?: string;
}

// API response for product list
export interface IProductResponse {
  data: IProduct[];
  metadata: {
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
    limit?: number;
  };
};


// Product card UI props
export interface ProductCardTypes {
  items?: IProduct[];
  fields?: any;
  loading?: boolean;
  col?: number;
  path?: string;
}

export interface IProductCreatePayload {
  name: string;
  brand: string;
  description: string;
  ingredients: string[];
  skinConcerns: string[];
  isActive?: boolean;
  suitableForSkinType?: any;
  suitableForSkinTypes: string[];
}

// Cart item interface
export interface CartItem {
  skuId: string;
  skuName: string;
  quantity: number;
  priceSnapshot: number;
  selected: boolean;
  image?: string;
  productId?: string;
}

// Address interface
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

// Checkout response interface
export interface CheckoutResponse {
  url: string;
  message?: string;
}