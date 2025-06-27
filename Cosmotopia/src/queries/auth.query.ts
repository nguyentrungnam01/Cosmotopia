import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery } from '@tanstack/react-query';

const SUB_URL = `api/User`;

export const useLogin = () => {
  return useMutation({
    mutationKey: ['get_advisor'],
    mutationFn: async (model: any) => {
      return BaseRequest.Post(`/${SUB_URL}/login`, model);
    }
  });
};

export const useLogout = () => {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async (model: any) => {
      return BaseRequest.Post(`/logout`, model);
    }
  });
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['get_profile'],
    queryFn: async () => {
      return BaseRequest.Get(`/api/User/GetCurrentUser`);
    },
    retry: 1
  });
};

export const useEditProfile = () => {
  return useMutation({
    mutationKey: ['edit_profile'],
    mutationFn: async (model: any) => {
      return await BaseRequest.Put(`/api/User/EditSelf`, model);
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (model: any) => {
      return BaseRequest.PostWithOutResponse(
        `/${SUB_URL}/registerwithotp`,
        model
      );
    }
  });
};

export const useOTP = () => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (model: any) => {
      return BaseRequest.PostWithOutResponse(`/${SUB_URL}/verifyotp`, model);
    }
  });
};

export const useUpdateAddress = () => {
  return useMutation({
    mutationKey: ['update_address'],
    mutationFn: async (model: any) => {
      return await BaseRequest.Put(`/api/User/UpdateAddress`, model);
    }
  });
};

// export const useForgotPassWord = () => {
//   return useMutation({
//     mutationKey: ['register'],
//     mutationFn: async (model: any) => {
//       return BaseRequest.PostWithOutResponse(
//         `/${SUB_URL}/forgotpassword`,
//         model
//       );
//     }
//   });
// };
// export const useForgotPassWord = () => {
//   return useMutation({
//     mutationKey: ['register'],
//     mutationFn: async (model: any) => {
//       return BaseRequest.PostWithOutResponse(`/${SUB_URL}/verifyotp`, model);
//     }
//   });
// };
// // export const useGetInfoUser = () => {
//   return useQuery({
//     queryKey: ['get_info_user'],
//     queryFn: async () => {
//       return BaseRequest.Post(`/${SUB_URL}/get-info-user`);
//     },
//     staleTime: 3600000
//   });
// };
