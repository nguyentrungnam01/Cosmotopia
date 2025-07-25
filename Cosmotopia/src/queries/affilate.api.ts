import { api } from '@/config/axios.config';

export const getAffiliateProfile = () => api.get('api/Affiliate/profile');

export const registerAffiliate = (model) =>
  api.post('api/Affiliate/register', model);
export const generalLink = (productID) =>
  api.post(`api/Affiliate/generate-link`, { productId: productID });
export const trackClick = (ref) =>
  api.get(`api/Affiliate/track-click`, { params: { referralCode: ref } });
export const getAllWithDrawSelf = () => api.get(`/api/Affiliate/withdrawals`);
export const getAllWithDrawManager = () =>
  api.get(`/api/Affiliate/manager/withdrawals`);
export const withDraw = (model) => api.post(`/api/Affiliate/withdraw`, model);
export const conFirmWithDraw = (id, model?) =>
  api.put(`/api/Affiliate/withdraw/${id}/status`, model);
export const getAllLinkAffiliate = () => api.get(`/api/Affiliate/links`);
export const getTop5Link = () => api.get(`/api/Affiliate`);

export const getEarningSummary = () =>
  api.get(`/api/Affiliate/earnings/summary`);

export const generateVideo = (videoData) => {
  try {
    console.log('Generating video with data:', videoData);
    const formData = new FormData();
    formData.append('Title', videoData.Title);
    formData.append('Description', videoData.Description);
    formData.append('VideoFile', videoData.VideoFile);  
    formData.append('ProductId', videoData.ProductId);

    return api.post('/api/KOLVideo/upload', formData)
      .then(response => {
        if (response.status === 200) {
          return response.data;
        }
      })
      .catch(error => {
        console.error('Error uploading video:', error);
        throw new Error('Video upload failed');
      });
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
};


export const getAllVideos = () => {
  return api.get('/api/KOLVideo/myVideos')
    .then(response => response)  
    .catch(error => {
      console.error('Error fetching videos:', error);
      throw error;  
    });
};

export const getDetailProduct = (productId) => {
  return api.get(`api/Product/GetProductBy/${productId}`)
    .then(response => response)  
    .catch(error => {
      console.error('Error fetching product details:', error);
      throw error;  
    });
}

export const updateVideo = (videoId: string, videoData: any) => {
  const formData = new FormData();
  formData.append('Title', videoData.Title);
  formData.append('Description', videoData.Description);
  formData.append('IsActive', videoData.IsActive); 
  formData.append('ProductId', videoData.ProductId); 

  return api.put(`/api/KOLVideo/${videoId}`, formData)
    .then(response => {
      return response.data;  
    })
    .catch(error => {
      console.error('Error updating video:', error);
      throw error;  
    });
};

export const deleteVideo = (id: string) => {
  return api.delete(`/api/KOLVideo/${id}`)
    .then(response => response.data)  
    .catch(error => {
      console.error('Error deleting video:', error);
      throw error;  
    });
};

export const getAllVideosSystem = () => {
  return api
    .get('/api/KOLVideo/getAllVideos')
    .then(res => res)              
    .catch(error => {
      console.error('Error fetching all system videos:', error);
      throw error;
    });
};

export const getAllVideosByAffiliateId = (affiliateId) => {
  return api
    .get(`/api/KOLVideo/getAllVideosByAffiliate/${affiliateId}`)
    .then(res => res) 
    .catch(error => {
      console.error('Error fetching videos by affiliateId:', error);
      throw error;
    });
};