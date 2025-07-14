export interface FaceAttributes {
    gender: { value: string };
    age: { value: number };
  }
  
  export interface FaceSkinStatus {
    dark_circle: number;
    stain: number;
    acne: number;
    health: number;
  }
  
  export interface FaceRectangle {
    width: number;
    top: number;
    left: number;
    height: number;
  }
  
  export interface FaceResult {
    faces: Array<{
      attributes: FaceAttributes & { skinstatus: FaceSkinStatus };
      face_rectangle: FaceRectangle;
      face_token: string;
    }>;
    request_id: string;
    time_used: number;
  }