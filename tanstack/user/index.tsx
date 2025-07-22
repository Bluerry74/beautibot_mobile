import { sendVerifiedToken } from "@/services/auth/login";
import { getAllUserPagination, sendVerifyEmail } from "@/services/user";
import { GetAllUserPagiParams } from "@/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";

export const getAllUserPaginationQuerry = (params: GetAllUserPagiParams) => {
    return useQuery({
        queryKey: ["allUser", params],
        queryFn: () => getAllUserPagination(params),
    });
};

export const useSendVerifyEmailMutation = () => {
    return useMutation({
        mutationFn: sendVerifyEmail,
    });
};

export const useSendVerifiedTokenMutation = () => {
    return useMutation({
        mutationFn: (token: string) => sendVerifiedToken(token),
    });
};