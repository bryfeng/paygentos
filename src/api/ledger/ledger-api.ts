// API client for ledger endpoints
import axios from 'axios';
import { Ledger } from '../../models/ledger/ledger';

const API_BASE_URL = '/api';

export const LedgerAPI = {
  // Get all ledger entries
  getLedgerEntries: async (): Promise<Ledger[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ledger`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ledger entries:', error);
      throw error;
    }
  },

  // Get ledger entries by customer ID
  getLedgerEntriesByCustomer: async (customerId: string): Promise<Ledger[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/${customerId}/ledger`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ledger entries for customer ${customerId}:`, error);
      throw error;
    }
  },

  // Get ledger entries by event ID
  getLedgerEntriesByEvent: async (eventId: string): Promise<Ledger[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${eventId}/ledger`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ledger entries for event ${eventId}:`, error);
      throw error;
    }
  },

  // Get ledger entries by wallet ID
  getLedgerEntriesByWallet: async (walletId: string): Promise<Ledger[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/wallets/${walletId}/ledger`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ledger entries for wallet ${walletId}:`, error);
      throw error;
    }
  },

  // Get ledger entry by ID
  getLedgerEntry: async (id: string): Promise<Ledger> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ledger/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ledger entry ${id}:`, error);
      throw error;
    }
  },

  // Create new ledger entry
  createLedgerEntry: async (ledger: Partial<Ledger>): Promise<Ledger> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ledger`, ledger);
      return response.data;
    } catch (error) {
      console.error('Error creating ledger entry:', error);
      throw error;
    }
  },

  // Update ledger entry
  updateLedgerEntry: async (id: string, ledger: Partial<Ledger>): Promise<Ledger> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/ledger/${id}`, ledger);
      return response.data;
    } catch (error) {
      console.error(`Error updating ledger entry ${id}:`, error);
      throw error;
    }
  },

  // Delete ledger entry
  deleteLedgerEntry: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/ledger/${id}`);
    } catch (error) {
      console.error(`Error deleting ledger entry ${id}:`, error);
      throw error;
    }
  }
};
