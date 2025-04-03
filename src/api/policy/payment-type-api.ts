import axios from 'axios';
import { PaymentType, PaymentPolicy } from '../../models/policy/payment-type';
import { defaultPaymentTypes } from '../../models/policy/payment-type';

const API_BASE_URL = '/api';

export class PaymentTypeAPI {
  /**
   * Get all payment types
   * @returns Promise<PaymentType[]>
   */
  static async getPaymentTypes(): Promise<PaymentType[]> {
    try {
      // In a production app, this would call the actual API
      // const response = await axios.get(`${API_BASE_URL}/payment-types`);
      // return response.data;
      
      // For now, return the mock data
      return defaultPaymentTypes;
    } catch (error) {
      console.error('Error fetching payment types:', error);
      throw error;
    }
  }

  /**
   * Get payment types for a specific policy
   * @param policyId - ID of the policy
   * @returns Promise<PaymentType[]>
   */
  static async getPaymentTypesForPolicy(policyId: number): Promise<PaymentType[]> {
    try {
      // In a production app, this would call the actual API
      // const response = await axios.get(`${API_BASE_URL}/policies/${policyId}/payment-types`);
      // return response.data;
      
      // For now, return mock data (randomly select some payment types)
      const mockPolicyPaymentTypes = defaultPaymentTypes.filter(() => Math.random() > 0.3);
      return mockPolicyPaymentTypes;
    } catch (error) {
      console.error(`Error fetching payment types for policy ${policyId}:`, error);
      throw error;
    }
  }

  /**
   * Assign payment types to a policy
   * @param policyId - ID of the policy
   * @param paymentTypeIds - Array of payment type IDs to assign
   * @returns Promise<void>
   */
  static async assignPaymentTypesToPolicy(policyId: number, paymentTypeIds: number[]): Promise<void> {
    try {
      // In a production app, this would call the actual API
      // await axios.post(`${API_BASE_URL}/policies/${policyId}/payment-types`, { paymentTypeIds });
      
      // For now, just log the action
      console.log(`Assigned payment types ${paymentTypeIds.join(', ')} to policy ${policyId}`);
    } catch (error) {
      console.error(`Error assigning payment types to policy ${policyId}:`, error);
      throw error;
    }
  }

  /**
   * Remove payment types from a policy
   * @param policyId - ID of the policy
   * @param paymentTypeIds - Array of payment type IDs to remove
   * @returns Promise<void>
   */
  static async removePaymentTypesFromPolicy(policyId: number, paymentTypeIds: number[]): Promise<void> {
    try {
      // In a production app, this would call the actual API
      // await axios.delete(`${API_BASE_URL}/policies/${policyId}/payment-types`, { data: { paymentTypeIds } });
      
      // For now, just log the action
      console.log(`Removed payment types ${paymentTypeIds.join(', ')} from policy ${policyId}`);
    } catch (error) {
      console.error(`Error removing payment types from policy ${policyId}:`, error);
      throw error;
    }
  }
}
