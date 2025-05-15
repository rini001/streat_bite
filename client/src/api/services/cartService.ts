import  api  from '../axios'; // assuming you have an axios instance configured
import { CartData } from '../../types/cart.types'; // adjust the path as needed

export const cartService = {
  addCart: async (cartData: CartData): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/vendors', cartData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getCartsById: async (id:string): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/vendors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
