// API client for item endpoints
import axios from 'axios';
import { Item } from '../../models/item/item';
import { ItemProperty } from '../../models/item/item-property';

const API_BASE_URL = '/api';

export const ItemAPI = {
  // Get all items
  getItems: async (): Promise<Item[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/items`);
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  },

  // Get items by event ID
  getItemsByEvent: async (eventId: string): Promise<Item[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${eventId}/items`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching items for event ${eventId}:`, error);
      throw error;
    }
  },

  // Get items by customer ID
  getItemsByCustomer: async (customerId: string): Promise<Item[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/${customerId}/items`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching items for customer ${customerId}:`, error);
      throw error;
    }
  },

  // Get item by ID
  getItem: async (id: string): Promise<Item> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/items/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching item ${id}:`, error);
      throw error;
    }
  },

  // Create new item
  createItem: async (item: Partial<Item>): Promise<Item> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/items`, item);
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  // Update item
  updateItem: async (id: string, item: Partial<Item>): Promise<Item> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/items/${id}`, item);
      return response.data;
    } catch (error) {
      console.error(`Error updating item ${id}:`, error);
      throw error;
    }
  },

  // Delete item
  deleteItem: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/items/${id}`);
    } catch (error) {
      console.error(`Error deleting item ${id}:`, error);
      throw error;
    }
  },

  // Get item properties
  getItemProperties: async (itemId: string): Promise<ItemProperty[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/items/${itemId}/properties`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching properties for item ${itemId}:`, error);
      throw error;
    }
  },

  // Add item property
  addItemProperty: async (itemId: string, property: Partial<ItemProperty>): Promise<ItemProperty> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/items/${itemId}/properties`, property);
      return response.data;
    } catch (error) {
      console.error(`Error adding property to item ${itemId}:`, error);
      throw error;
    }
  },

  // Update item property
  updateItemProperty: async (itemId: string, propertyId: string, property: Partial<ItemProperty>): Promise<ItemProperty> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/items/${itemId}/properties/${propertyId}`, property);
      return response.data;
    } catch (error) {
      console.error(`Error updating property ${propertyId} for item ${itemId}:`, error);
      throw error;
    }
  },

  // Delete item property
  deleteItemProperty: async (itemId: string, propertyId: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/items/${itemId}/properties/${propertyId}`);
    } catch (error) {
      console.error(`Error deleting property ${propertyId} for item ${itemId}:`, error);
      throw error;
    }
  }
};
