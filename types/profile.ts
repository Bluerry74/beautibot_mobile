export interface IUserProfile {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin' | 'shelter';
    isVerified: boolean;
    isBanned: boolean;
    isDeleted: boolean;
    wishlist: string[];
    coupons: string[];
    points: number;
    deviceTokens: string[];
    createdAt: string;
    updatedAt: string;
    phone?: string;
    skinType?: string;
  }
  

  export interface UpdateUserPayload {
    name?: string;
    phone?: string;
    skinType?: string;
  }
  