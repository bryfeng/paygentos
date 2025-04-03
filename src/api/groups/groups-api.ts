import axios from 'axios';

const API_BASE_URL = '/api';

export interface Group {
  id: string;
  name: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
}

export interface Item {
  id: string;
  name: string;
  description?: string;
}

export interface Event {
  id: string;
  name: string;
  date?: string;
}

export interface Vendor {
  id: string;
  name: string;
  contact?: string;
}

export const GroupsAPI = {
  // Get all customer records
  getAllCustomers: async (): Promise<Customer[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },
  
  // Get all items/products
  getAllItems: async (): Promise<Item[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/items`);
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  },
  
  // Get all events
  getAllEvents: async (): Promise<Event[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },
  
  // Get all vendors
  getAllVendors: async (): Promise<Vendor[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vendors`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  }
};
