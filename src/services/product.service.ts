import axiosInstance from '@/lib/axios';

export const getProducts = async () => {
  // Axios melakukan request
  const response = await axiosInstance.get('/products');
  return response.data;
};