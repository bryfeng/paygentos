// API client for wallet endpoints
import axios from 'axios';
import { Wallet, PaymentMethod } from '../../models/wallet/wallet';

const API_BASE_URL = '/api';

export const WalletAPI = {
  // Get all wallets
  getWallets: async (): Promise<Wallet[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/wallets`);
      return response.data;
    } catch (error) {
      console.error('Error fetching wallets:', error);
      throw error;
    }
  },

  // Get wallets by customer ID
  getWalletsByCustomer: async (customerId: string): Promise<Wallet[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/${customerId}/wallets`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching wallets for customer ${customerId}:`, error);
      throw error;
    }
  },

  // Get wallet by ID
  getWallet: async (id: string): Promise<Wallet> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/wallets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching wallet ${id}:`, error);
      throw error;
    }
  },

  // Create new wallet
  createWallet: async (wallet: Partial<Wallet>): Promise<Wallet> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/wallets`, wallet);
      return response.data;
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  },

  // Update wallet
  updateWallet: async (id: string, wallet: Partial<Wallet>): Promise<Wallet> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/wallets/${id}`, wallet);
      return response.data;
    } catch (error) {
      console.error(`Error updating wallet ${id}:`, error);
      throw error;
    }
  },

  // Delete wallet
  deleteWallet: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/wallets/${id}`);
    } catch (error) {
      console.error(`Error deleting wallet ${id}:`, error);
      throw error;
    }
  },

  // Get payment methods for wallet
  getPaymentMethods: async (walletId: string): Promise<PaymentMethod[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/wallets/${walletId}/payment-methods`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payment methods for wallet ${walletId}:`, error);
      throw error;
    }
  },

  // Add payment method to wallet
  addPaymentMethod: async (walletId: string, paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/wallets/${walletId}/payment-methods`, paymentMethod);
      return response.data;
    } catch (error) {
      console.error(`Error adding payment method to wallet ${walletId}:`, error);
      throw error;
    }
  },

  // Update payment method
  updatePaymentMethod: async (walletId: string, paymentMethodId: string, paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/wallets/${walletId}/payment-methods/${paymentMethodId}`, paymentMethod);
      return response.data;
    } catch (error) {
      console.error(`Error updating payment method ${paymentMethodId} for wallet ${walletId}:`, error);
      throw error;
    }
  },

  // Delete payment method
  deletePaymentMethod: async (walletId: string, paymentMethodId: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/wallets/${walletId}/payment-methods/${paymentMethodId}`);
    } catch (error) {
      console.error(`Error deleting payment method ${paymentMethodId} for wallet ${walletId}:`, error);
      throw error;
    }
  }
};
