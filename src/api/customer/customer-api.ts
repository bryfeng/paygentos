// API client for customer endpoints
import { Customer } from '../../models/customer/customer';
import { supabase, safeQuery } from '../../utils/supabase';

// Table name in Supabase
const CUSTOMER_TABLE = 'customers';

// Mock data for development/fallback
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '555-123-4567',
    address: '123 Business Ave, Suite 100, New York, NY 10001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: '2',
    name: 'Globex Industries',
    email: 'info@globex.com',
    phone: '555-987-6543',
    address: '456 Corporate Blvd, Chicago, IL 60601',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: '3',
    name: 'Initech LLC',
    email: 'support@initech.com',
    phone: '555-456-7890',
    address: '789 Tech Park, San Francisco, CA 94105',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  }
];

export const CustomerAPI = {
  // Get all customers with fallback to mock data
  getCustomers: async (): Promise<Customer[]> => {
    try {
      const { data, error } = await supabase
        .from(CUSTOMER_TABLE)
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.warn('Error fetching customers from Supabase:', error.message);
        console.info('Using mock customer data instead');
        return MOCK_CUSTOMERS;
      }

      return data as Customer[] || [];
    } catch (error) {
      console.error('Error in getCustomers:', error);
      return MOCK_CUSTOMERS; // Fallback to mock data in case of error
    }
  },

  // Get customer by ID with fallback to mock data
  getCustomer: async (id: string): Promise<Customer | null> => {
    try {
      const { data, error } = await supabase
        .from(CUSTOMER_TABLE)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.warn(`Error fetching customer ${id}:`, error.message);
        // Try to find in mock data
        const mockCustomer = MOCK_CUSTOMERS.find(c => c.id === id);
        return mockCustomer || null;
      }

      return data as Customer;
    } catch (error) {
      console.error(`Error in getCustomer ${id}:`, error);
      const mockCustomer = MOCK_CUSTOMERS.find(c => c.id === id);
      return mockCustomer || null;
    }
  },

  // Create new customer
  createCustomer: async (customer: Partial<Customer>): Promise<Customer | null> => {
    try {
      // Add timestamps
      const now = new Date().toISOString();
      const newCustomer = {
        ...customer,
        createdAt: now,
        updatedAt: now
      };

      const { data, error } = await supabase
        .from(CUSTOMER_TABLE)
        .insert([newCustomer])
        .select()
        .single();

      if (error) {
        console.error('Error creating customer:', error.message);
        throw error;
      }

      return data as Customer;
    } catch (error) {
      console.error('Error in createCustomer:', error);
      return null;
    }
  },

  // Update customer
  updateCustomer: async (id: string, customer: Partial<Customer>): Promise<Customer | null> => {
    try {
      // Add updated timestamp
      const updatedCustomer = {
        ...customer,
        updatedAt: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from(CUSTOMER_TABLE)
        .update(updatedCustomer)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating customer ${id}:`, error.message);
        throw error;
      }

      return data as Customer;
    } catch (error) {
      console.error(`Error in updateCustomer ${id}:`, error);
      return null;
    }
  },

  // Delete customer
  deleteCustomer: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from(CUSTOMER_TABLE)
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Error deleting customer ${id}:`, error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error in deleteCustomer ${id}:`, error);
      return false;
    }
  }
};
