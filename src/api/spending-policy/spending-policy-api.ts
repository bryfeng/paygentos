import axios from 'axios';

const API_BASE_URL = '/api';

export interface SpendingPolicy {
  id?: string;
  name: string;
  description?: string;
  budget_amount: number;
  budget_interval: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'one_time';
  budget_start_date?: string;
  budget_end_date?: string;
  status: 'active' | 'inactive' | 'draft';
  allowed_payment_types: string[];
  require_approval: boolean;
  approval_threshold?: number;
  item_groups: string[];
  customer_groups: string[];
  event_groups: string[];
  payment_methods: string[];
  vendors: string[];
  created_at?: string;
  updated_at?: string;
}

export const SpendingPolicyAPI = {
  // Get all spending policies
  getAllPolicies: async (): Promise<SpendingPolicy[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/spending-policies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching spending policies:', error);
      throw error;
    }
  },
  
  // Get a specific spending policy by ID
  getPolicy: async (policyId: string): Promise<SpendingPolicy> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/spending-policies/${policyId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching spending policy ${policyId}:`, error);
      throw error;
    }
  },
  
  // Create a new spending policy
  createPolicy: async (policy: SpendingPolicy): Promise<SpendingPolicy> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/spending-policies`, policy);
      return response.data;
    } catch (error) {
      console.error('Error creating spending policy:', error);
      throw error;
    }
  },
  
  // Update an existing spending policy
  updatePolicy: async (policyId: string, policy: Partial<SpendingPolicy>): Promise<SpendingPolicy> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/spending-policies/${policyId}`, policy);
      return response.data;
    } catch (error) {
      console.error(`Error updating spending policy ${policyId}:`, error);
      throw error;
    }
  },
  
  // Delete a spending policy
  deletePolicy: async (policyId: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/spending-policies/${policyId}`);
    } catch (error) {
      console.error(`Error deleting spending policy ${policyId}:`, error);
      throw error;
    }
  }
};
