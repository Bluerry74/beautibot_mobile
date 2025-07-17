import { useAuthStore } from "@/store/auth";
import { IUserProfile, UpdateUserPayload } from "@/types/profile";
import axios from "axios";

const API = process.env.EXPO_PUBLIC_API_URL || "https://be-wdp.onrender.com";

export const useProfileActions = () => {
  const token = useAuthStore.getState().accessToken;
  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getProfile = async (): Promise<IUserProfile> => {
    const res = await axios.get(`${API}/user/profile`, authHeader);
    console.log("📥 /profile response:", res.data);
    return res.data;
  };

  const updateProfile = async (
    payload: UpdateUserPayload
  ): Promise<IUserProfile> => {
    const res = await axios.patch(`${API}/user/profile`, payload, authHeader);
    return res.data.data;
  };

  return {
    getProfile,
    updateProfile,
  };
};
