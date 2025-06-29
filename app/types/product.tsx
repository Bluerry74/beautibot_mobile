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
    image: string;
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
  