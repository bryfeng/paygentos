// API client for customer endpoints
import { 
  Customer, 
  ContactType, 
  IdDocumentType, 
  ContactInfo, 
  IdDocument 
} from '../../models/customer/customer';
import { supabase, safeQuery } from '../../utils/supabase';

// Table name in Supabase
const CUSTOMER_TABLE = 'customers';

// Helper function to convert snake_case to camelCase (for API responses)
function toCamelCase(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  
  return Object.keys(obj).reduce((result, key) => {
    // Convert snake_case to camelCase
    const camelKey = key.replace(/(_[a-z])/g, (group) => group.toUpperCase().replace('_', ''));
    
    // Recursively convert nested objects/arrays
    const value = typeof obj[key] === 'object' ? toCamelCase(obj[key]) : obj[key];
    
    result[camelKey] = value;
    return result;
  }, {} as any);
}

// Helper function to convert camelCase to snake_case (for database operations)
function toSnakeCase(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  }
  
  return Object.keys(obj).reduce((result, key) => {
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    
    // Recursively convert nested objects/arrays
    const value = typeof obj[key] === 'object' ? toSnakeCase(obj[key]) : obj[key];
    
    result[snakeKey] = value;
    return result;
  }, {} as any);
}

export const CustomerAPI = {
  // Get all customers from the database
  getCustomers: async (): Promise<Customer[]> => {
    try {
      console.log('Fetching customers from database...');
      
      // Use created_at (snake_case) for the database query
      const { data, error } = await supabase
        .from(CUSTOMER_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers from Supabase:', error.message);
        throw new Error(`Failed to fetch customers: ${error.message}`);
      }

      // Return actual database results, even if empty array
      console.log(`Retrieved ${data?.length || 0} customers from database`);
      
      // Convert snake_case properties to camelCase
      return (data || []).map(customer => toCamelCase(customer)) as Customer[];
    } catch (error) {
      console.error('Error in getCustomers:', error);
      throw error; // Re-throw to let component handle the error
    }
  },

  // Get customer by ID from database
  getCustomer: async (id: string): Promise<Customer | null> => {
    try {
      console.log(`Fetching customer ${id} from database...`);
      
      const { data, error } = await supabase
        .from(CUSTOMER_TABLE)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.warn(`Error fetching customer ${id}:`, error.message);
        if (error.code === 'PGRST116') { // record not found
          return null;
        }
        throw new Error(`Failed to fetch customer: ${error.message}`);
      }

      console.log(`Successfully retrieved customer ${id} from database`);
      // Convert snake_case properties to camelCase
      return toCamelCase(data) as Customer;
    } catch (error) {
      console.error(`Error in getCustomer(${id}):`, error);
      throw error; // Re-throw to let component handle the error
    }
  },

  // Create new customer
  createCustomer: async (customer: Partial<Customer>): Promise<Customer | null> => {
    try {
      // Find primary contact for logging
      const primaryContact = customer.contacts?.find(c => c.isPrimary);
      const contactInfo = primaryContact ? `${primaryContact.type}: ${primaryContact.value}` : 'No primary contact';
      
      console.log('Creating new customer via API route:', { 
        name: customer.fullName || `${customer.firstName} ${customer.lastName}`,
        contact: contactInfo,
        document_count: customer.idDocuments?.length || 0
      });
      
      // Call our Next.js API route instead of Supabase directly
      // This avoids CORS issues since the API route runs server-side
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from API:', errorData);
        throw new Error(errorData.error || 'Failed to create customer');
      }

      const data = await response.json();
      console.log('Successfully created customer with ID:', data.id);
      // The API route already converts the response to camelCase
      return data as Customer;
    } catch (error: any) {
      console.error('Error in createCustomer:', error);
      throw error; // Re-throw to allow proper error handling in UI
    }
  },

  // Update customer
  updateCustomer: async (id: string, customer: Partial<Customer>): Promise<Customer | null> => {
    try {
      // First get the existing customer to ensure we don't lose data
      const { data: existingCustomer, error: fetchError } = await supabase
        .from(CUSTOMER_TABLE)
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error(`Error fetching existing customer ${id}:`, fetchError.message);
        throw fetchError;
      }

      // Generate full name if first or last name is being updated
      let fullName = customer.fullName;
      const firstName = customer.firstName ?? existingCustomer.firstName;
      const lastName = customer.lastName ?? existingCustomer.lastName;
      
      if (!fullName && firstName && lastName) {
        fullName = `${firstName} ${lastName}`;
      }

      // Handle contacts array merging if provided
      let contacts = existingCustomer.contacts || [];
      if (customer.contacts) {
        contacts = customer.contacts;
        
        // Ensure at least one contact is primary if there are contacts
        if (contacts.length > 0 && !contacts.some(c => c.isPrimary)) {
          contacts[0].isPrimary = true;
        }
      }

      // Handle ID documents array merging if provided
      const idDocuments = customer.idDocuments ?? (existingCustomer.idDocuments || []);

      // Prepare the updated customer object
      const updatedCustomer = {
        ...existingCustomer,
        ...customer,
        fullName: fullName || existingCustomer.fullName,
        contacts,
        idDocuments,
        updatedAt: new Date().toISOString()
      };

      // Find primary contact for logging
      const primaryContact = contacts.find(c => c.isPrimary);
      const contactInfo = primaryContact 
        ? `${primaryContact.type}: ${primaryContact.value}` 
        : 'No primary contact';

      console.log(`Updating customer ${id}:`, {
        name: updatedCustomer.fullName,
        contact: contactInfo,
        document_count: idDocuments.length
      });

      // Convert to snake_case for database
      const dbCustomer = toSnakeCase(updatedCustomer);

      const { data, error } = await supabase
        .from(CUSTOMER_TABLE)
        .update(dbCustomer)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating customer ${id}:`, error.message);
        throw error;
      }

      console.log(`Successfully updated customer ${id}`);
      // Convert back to camelCase for the application
      return toCamelCase(data) as Customer;
    } catch (error) {
      console.error(`Error in updateCustomer ${id}:`, error);
      throw error; // Re-throw to allow proper error handling in UI
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
