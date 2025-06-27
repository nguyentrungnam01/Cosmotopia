import { getUserDetail } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const useGetUserDetail = (userId) => {
  return useQuery({
    queryKey: ['user-detail'],
    queryFn: async () => getUserDetail(userId)
  });
};

