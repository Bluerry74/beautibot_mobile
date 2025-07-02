import { get } from "@/httpservices/httpService";
import { User } from "@/types/auth";

export const getMe = async ({
    accessToken,
}: {
    accessToken: string;
}): Promise<User> => {
    const res = await get<User>("user/profile", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};
