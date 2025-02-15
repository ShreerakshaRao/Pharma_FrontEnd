import { Item1 } from '@/types/ItemData';
import api from '@/utils/api';
import { AxiosError } from 'axios';

export const createItem = async (formData: Item1): Promise<Item1> => {
    try {
      const response = await api.post<{ data: Item1; message: string; status: string }>(
        'pharma/item/save',
        formData
      );
      console.log("API Response:", response.data); // Debug response
    //   toast.success(response.data.message);
      return response.data.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || 'An error occurred while creating the Item.';
        // toast.error(message);
        throw new Error(message);
      } else {
        throw new Error('An unknown error occurred.');
      }
    }
  };


  export const getItem = async () => {
    try {
        const response = await api.get('pharma/item/getAll');
        return response.data;
    } catch (error: unknown) {
        console.error('Error fetching Item:', error);
        if (error instanceof Error) {
            throw new Error(`Error fetching Item: ${error.message}`);
        } else {
            throw new Error('An unknown error occurred while fetching Item.');
        }
    }
  };


  export const getItemById = async (itemId: number) => {
    try {
        const response = await api.get(`pharma/item/getById/${itemId}`);
        return response.data;
    } catch (error: unknown) {
        console.error('Error fetching Item:', error);
        if (error instanceof Error) {
            throw new Error(`Error fetching Item: ${error.message}`);
        } else {
            throw new Error('An unknown error occurred while Item.');
        }
    }
  };


  export const updateItem = async (itemId: number, itemData: Item1) => {
    try {
        const response = await api.put(`pharma/item/update/${itemId}`, itemData);
        return response.data;
    } catch (error: unknown) {
        console.error('Error updating Item:', error);
        if (error instanceof Error) {
            throw new Error(`Error updating Item: ${error.message}`);
        } else {
            throw new Error('An unknown error occurred while updating Item.');
        }
    }
};



export const itemDelete = async (itemId: number) => {
    try {
        const response = await api.delete(`pharma/item/delete/${itemId}`);
        return response.data;
    } catch (error: unknown) {
        console.error('Error deleting Item:', error);
        if (error instanceof Error) {
            throw new Error(`Error deleting Item: ${error.message}`);
        } else {
            throw new Error('An unknown error occurred while deleting Item.');
        }
    }
}