import axios from 'axios';
import helpers from '../helpers';
import { toast } from '@/components/ui/use-toast';
import __helpers from '../helpers';
import { message } from 'antd';

// const baseURL =
  // 'https://cosmetics20250328083913-ajfsa0cegrdggzej.southeastasia-01.azurewebsites.net/';
const baseURL = 'https://localhost:7191/';
const token = helpers.cookie_get('AT');
// const refreshToken = helpers.cookie_get('RT');

const onRequestSuccess = (config: any) => {
  config.headers['Authorization'] = `Bearer ${helpers.cookie_get('AT')}`;
  return config;
};
const onRequestError = (error: any) => {
  return Promise.reject(error);
};
const onResponseSuccess = (response: any) => {
  return response.data;
};
const onResponseError = (error: any) => {
  if (error.response) {
    if (error.response.status === 401) {
      // const res = await BaseRequest.Post(`/renew-token`, {
      //   accessToken: token,
      //   refreshToken: refreshToken
      // });
      // if (res) {
      //   helpers.cookie_set('RT', res.refreshToken);
      //   helpers.cookie_set('AT', res.accessToken);
      // } else {
      helpers.cookie_delete('RT');
      helpers.cookie_delete('AT');
      window.location.href = '/login';
      // }
    }
    if (error.response.data.data) {
      toast({
        variant: 'destructive',
        title: 'Có lỗi xảy ra!',
        description: `${error.response.data.data}.`,
        duration: 3000
      });
    }
    return Promise.reject(error.response.data);
  }
  return Promise.reject(error);
};
axios.interceptors.request.use(onRequestSuccess, onRequestError);
axios.interceptors.response.use(onResponseSuccess, onResponseError);
axios.defaults.baseURL = baseURL;
export const api = axios;
const BaseRequest = {
  Get: async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      console.log('err', err);
    }
  },
  Get2: async (url: string) => {
    try {
      const response = await axios.get(url);
      return response;
    } catch (err) {
      console.log('err', err);
    }
  },
  Post: async (url: string, data?: any) => {
    try {
      const response = await axios.post<any>(url, data);
      return response.data;
    } catch (err) {
      console.log('err', err);
    }
  },
  PostWithOutResponse: async (url: string, data?: any) => {
    try {
      const response = await axios.post<any>(url, data);
      console.log('response', response);
      return response;
    } catch (err) {
      message;
    }
  },
  PostWithoutCatch: async (url: string, data?: any) => {
    const response = await axios.post<any>(url, data);
    return response.data;
  },
  PostWithImage: async (url: string, data?: any) => {
    try {
      const headers = { 'Content-Type': 'multipart/form-data' };
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (err) {
      console.log('err', err);
    }
  },
  Put: async (url: string, data: any) => {
    try {
      const response = await axios.put<any>(url, data);
      return response.data;
    } catch (err) {
      console.log('err', err);
    }
  },
  PutWithoutCatch: async (url: string, data: any) => {
    const response = await axios.put<any>(url, data);
    return response.data;
  },
  Delete: async (url: string) => {
    try {
      const response = await axios.delete(url);
      return response.data;
    } catch (err) {
      console.log('err', err);
    }
  },
  DeleteWithoutCatch: async (url: string) => {
    const response = await axios.delete(url);
    return response;
  },
  UploadStockPhoto: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(
        'api/Image/upload-customize-photo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            client: 'tfu_admin',
            ...(token ? { Authorization: `Bearer ${token}` } : {}) // Chỉ thêm Authorization nếu có token
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading stock photo:', error);
      throw error; // Bắn lỗi ra ngoài để xử lý tại nơi sử dụng
    }
  },
  DownloadFile: async (url: string, name: string) => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob'
      });
      const fileName = __helpers.getFileName(name);

      //@ts-expect-error: response có thể không đúng kiểu Blob, bỏ qua lỗi này để tạo Blob
      const blob = new Blob([response], { type: 'application/pdf' });
      const urlBlob = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = urlBlob;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);

      return { success: true, message: 'File downloaded successfully' };
    } catch (error) {
      console.error('Error while downloading the file:', error);
      return { success: false, message: 'Failed to download file' };
    }
  },
  OpenFileInNewTab: async (url: string) => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob'
      });

      //@ts-expect-error: response có thể không đúng kiểu Blob, bỏ qua lỗi này để tạo Blob
      const blob = new Blob([response], { type: 'application/pdf' });
      const urlBlob = URL.createObjectURL(blob);

      window.open(urlBlob, '_blank');

      return { success: true, message: 'File opened in new tab successfully' };
    } catch (error) {
      console.error('Error while opening the file in new tab:', error);
      return { success: false, message: 'Failed to open file in new tab' };
    }
  }
};

export default BaseRequest;
