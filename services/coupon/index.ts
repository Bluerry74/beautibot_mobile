import { put, remove } from "@/httpservices/httpService";
import { useAuthStore } from "@/store/auth";
import axios from "axios";

const API = "https://be-wdp.onrender.com";

const getAuthHeader = () => {
    const token = useAuthStore.getState().accessToken;
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Admin APIs
export const getAllCoupons = (filters?: any) => {
    return axios
        .get("/coupon/admin/all", { params: filters })
        .then((res) => res.data);
};

export const updateCoupon = ({ id, payload }: { id: string; payload: any }) => {
    return put(`/coupon/admin/${id}`, payload).then((res) => res.data);
};

export const deleteCoupon = (id: string) => {
    return remove(`/coupon/admin/${id}`).then((res) => res.data);
};
// User APIs
export const getMyCoupons = async () =>
    await axios.get(`${API}/coupon/my-coupons`, getAuthHeader());

export const getMyCouponById = async (id: string) =>
    await axios.get(`${API}/coupon/my-coupons/${id}`, getAuthHeader());

export const deleteMyCoupon = async (id: string) =>
    await axios.delete(`${API}/coupon/my-coupons/${id}`, getAuthHeader());

// Points & Exchange
export const getMyPoints = async () =>
    await axios.get(`${API}/coupon/my-points`, getAuthHeader());

export const exchangePoints = async (points: number) =>
    await axios.post(`${API}/coupon/exchange/${points}`, {}, getAuthHeader());

// Validate coupon for checkout
export const validateCoupon = async (code: string) =>
    await axios.post(`${API}/coupon/validate/${code}`, {}, getAuthHeader());
