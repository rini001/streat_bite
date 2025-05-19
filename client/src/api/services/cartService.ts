import  api  from '../axios'; // assuming you have an axios instance configured
import { CartData } from '../../types/cart.types'; // adjust the path as needed

export const cartService = {
 addCart: async (cartData: CartData): Promise<any> => {
  try {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('businessName', cartData.businessName);
    formData.append('address', cartData.address);
    formData.append('city', cartData.city);
    formData.append('state', cartData.state);
    formData.append('zipCode', cartData.zipCode);
    formData.append('description', cartData.description);
    
    if (cartData.menuImage) {
      formData.append('menuImage', cartData.menuImage);
    }

    const response = await api.post('/vendors', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // ⚠️ Do NOT set 'Content-Type' manually here — let axios/browser handle it
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
