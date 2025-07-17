import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await axios.get('/profile');
      console.log("📥 /profile response:", res.data); // cái này đúng rồi
      return res.data; // phải return res.data
    },
  });
};
