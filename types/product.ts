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
  images: string;
  weight: number;
  dimensions: IDimensions;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Basic product (used for list, form, etc.)
export interface IProduct {
  _id?: string;
  name?: string;
  code?: string;
  rating?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
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