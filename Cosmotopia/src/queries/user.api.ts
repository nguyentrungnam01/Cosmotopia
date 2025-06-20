import { api } from '@/config/axios.config';
import BaseRequest from '@/config/axios.config';
import { useMutation } from '@tanstack/react-query';

export const forgotPassword = (email) =>
  api.post('api/User/forgotpassword', { email: email });
export const resetPassword = (model) => api.post('api/User/newPass', model);
export const changePassword = (model) =>
  api.post('api/User/ChangePassword', model);
export const getAccountSelf = () => api.get('api/User/GetCurrentUser');
export const getAllOrder = (page, size) =>
  api.get(`api/Order/user/orders?page=${page}&pageSize=${size}`);
// export const getAllAddress = () =>
//   api.get(`https://provinces.open-api.vn/api/?depth=2`);

export const postOrder = (model) => api.post(`/api/Order`, model);

// payment
export const postPayment = (model) =>
  api.post(`/api/Payment/create-payment`, model);
export const getTransactions = (id) => api.get(`/api/Payment/payment/${id}`);
export const handleTransactions = (id, status) =>
  api.put(`/api/Payment/update-payment-status/${id}?newStatus=${status}`);
interface OrderPayload {
  orderDetails: { productId: string; quantity: number }[];
  address: string;
  paymentMethod: string;
}

export function usePostOrder() {
  return useMutation({
    mutationKey: ['post_order'],
    mutationFn: async (data: OrderPayload) => {
      return BaseRequest.PostWithOutResponse('/api/Order', data);
    }
  });
}

interface PaymentLinkPayload {
  orderId: string;
  amount: number;
  returnUrl: string;
  paymentMethod: string;
}

export function useCreatePaymentLink() {
  return useMutation({
    mutationKey: ['create_payment_link'],
    mutationFn: async (data: PaymentLinkPayload) => {
      return BaseRequest.PostWithOutResponse('/api/Payment/create-payment-link', data);
    }
  });
}

