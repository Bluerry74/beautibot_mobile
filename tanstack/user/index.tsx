import { getAllUserPagination } from "@/services/user";
import { GetAllUserPagiParams } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const getAllUserPaginationQuerry = (params: GetAllUserPagiParams) => {
    return useQuery({
        queryKey: ["allUser", params],
        queryFn: () => getAllUserPagination(params),
    });
};