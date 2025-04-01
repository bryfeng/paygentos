import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = '/api';

// Type definition for vendor
export interface Vendor {
  id?: string;
  name: string;
  type: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

/**
 * Service for interacting with the vendors API
 */
export class VendorAPI {
  /**
   * Get all vendors with optional filtering
   */
  static async getVendors(params?: { type?: string; status?: string }) {
    const queryParams = new URLSearchParams();
    
    if (params?.type) {
      queryParams.append('type', params.type);
    }
    
    if (params?.status) {
      queryParams.append('status', params.status);
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await axios.get(`${API_BASE_URL}/vendors${queryString}`);
    return response.data;
  }
  
  /**
   * Get a single vendor by ID
   */
  static async getVendor(id: string) {
    const response = await axios.get(`${API_BASE_URL}/vendors/${id}`);
    return response.data;
  }
  
  /**
   * Create a new vendor
   */
  static async createVendor(vendor: Vendor) {
    const response = await axios.post(`${API_BASE_URL}/vendors`, vendor);
    return response.data;
  }
  
  /**
   * Update an existing vendor
   */
  static async updateVendor(id: string, vendor: Vendor) {
    const response = await axios.put(`${API_BASE_URL}/vendors/${id}`, vendor);
    return response.data;
  }
  
  /**
   * Delete a vendor
   */
  static async deleteVendor(id: string) {
    const response = await axios.delete(`${API_BASE_URL}/vendors/${id}`);
    return response.data;
  }
}
