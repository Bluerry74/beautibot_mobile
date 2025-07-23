import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await axios.get('/profile');
      return res.data; // phải return res.data
    },
  });
};
