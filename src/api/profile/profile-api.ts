// API client for customer profile endpoints
import axios from 'axios';
import { CustomerProfile } from '../../models/profile/profile';

const API_BASE_URL = '/api';

export const ProfileAPI = {
  // Get all profiles
  getProfiles: async (): Promise<CustomerProfile[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profiles`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
  },

  // Get profiles by customer ID
  getProfilesByCustomer: async (customerId: string): Promise<CustomerProfile[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/${customerId}/profiles`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching profiles for customer ${customerId}:`, error);
      throw error;
    }
  },

  // Get profiles by item type
  getProfilesByItemType: async (itemTypeId: string): Promise<CustomerProfile[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/item-types/${itemTypeId}/profiles`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching profiles for item type ${itemTypeId}:`, error);
      throw error;
    }
  },

  // Get profile by ID
  getProfile: async (id: string): Promise<CustomerProfile> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profiles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching profile ${id}:`, error);
      throw error;
    }
  },

  // Create new profile
  createProfile: async (profile: Partial<CustomerProfile>): Promise<CustomerProfile> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/profiles`, profile);
      return response.data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (id: string, profile: Partial<CustomerProfile>): Promise<CustomerProfile> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/profiles/${id}`, profile);
      return response.data;
    } catch (error) {
      console.error(`Error updating profile ${id}:`, error);
      throw error;
    }
  },

  // Delete profile
  deleteProfile: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/profiles/${id}`);
    } catch (error) {
      console.error(`Error deleting profile ${id}:`, error);
      throw error;
    }
  }
};
