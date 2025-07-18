import { getAllAddress } from '@/services/address';
import { useQuery } from '@tanstack/react-query';

export const useAddressesQuery = () => {
    return useQuery({
        queryKey: ['addresses'],
        queryFn: () => getAllAddress(),
    });
};
