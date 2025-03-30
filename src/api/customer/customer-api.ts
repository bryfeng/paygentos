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

// Mock data for development/fallback - now focused on individuals
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    fullName: 'John Smith',
    dob: '1985-06-15',
    address: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'USA',
    contacts: [
      { 
        type: ContactType.EMAIL, 
        value: 'john.smith@example.com', 
        isPrimary: true, 
        label: 'Personal' 
      },
      { 
        type: ContactType.PHONE, 
        value: '555-123-4567', 
        isPrimary: false, 
        label: 'Mobile' 
      },
      { 
        type: ContactType.TELEGRAM, 
        value: '@johnsmith', 
        isPrimary: false, 
        label: 'Telegram' 
      }
    ],
    preferredContactType: ContactType.EMAIL,
    idDocuments: [
      {
        type: IdDocumentType.DRIVERS_LICENSE,
        number: 'DL12345678',
        issuedBy: 'CA DMV',
        issuedDate: '2020-01-15',
        expiryDate: '2028-01-15',
        isVerified: true
      }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: 'Prefers to be contacted during evenings.'
  },
  {
    id: '2',
    firstName: 'Emily',
    lastName: 'Johnson',
    fullName: 'Emily Johnson',
    dob: '1990-08-22',
    address: '456 Oak Avenue',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'USA',
    contacts: [
      { 
        type: ContactType.EMAIL, 
        value: 'emily.j@example.com', 
        isPrimary: true, 
        label: 'Work' 
      },
      { 
        type: ContactType.PHONE, 
        value: '555-987-6543', 
        isPrimary: false, 
        label: 'Home' 
      },
      { 
        type: ContactType.DISCORD, 
        value: 'emilyjohnson#1234', 
        isPrimary: false, 
        label: 'Discord' 
      }
    ],
    preferredContactType: ContactType.DISCORD,
    idDocuments: [
      {
        type: IdDocumentType.PASSPORT,
        number: 'P12345678',
        issuedBy: 'U.S. Department of State',
        issuedDate: '2018-05-20',
        expiryDate: '2028-05-19',
        isVerified: true
      }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: 'Prefers Discord for quick communications.'
  },
  {
    id: '3',
    firstName: 'Miguel',
    lastName: 'Garcia',
    fullName: 'Miguel Garcia',
    dob: '1978-11-30',
    address: '789 Pine Street',
    city: 'Miami',
    state: 'FL',
    postalCode: '33101',
    country: 'USA',
    contacts: [
      { 
        type: ContactType.EMAIL, 
        value: 'miguel.g@example.com', 
        isPrimary: false, 
        label: 'Personal' 
      },
      { 
        type: ContactType.PHONE, 
        value: '555-456-7890', 
        isPrimary: true, 
        label: 'Mobile' 
      },
      { 
        type: ContactType.WHATSAPP, 
        value: '+1-555-456-7890', 
        isPrimary: false, 
        label: 'WhatsApp' 
      }
    ],
    preferredContactType: ContactType.PHONE,
    idDocuments: [
      {
        type: IdDocumentType.NATIONAL_ID,
        number: 'ID98765432',
        issuedBy: 'Florida Department of Safety',
        issuedDate: '2019-12-10',
        expiryDate: '2029-12-09',
        isVerified: true
      }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: 'Prefers phone calls over other communication methods.'
  }
];

export const CustomerAPI = {
  // Get all customers with fallback to mock data only if database fails
  getCustomers: async (): Promise<Customer[]> => {
    try {
      console.log('Fetching customers from database...');
      
      const { data, error } = await supabase
        .from(CUSTOMER_TABLE)
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.warn('Error fetching customers from Supabase:', error.message);
        console.info('Using mock customer data as fallback');
        return MOCK_CUSTOMERS;
      }

      // Return actual database results, even if empty array
      // This ensures new customers added through admin panel will be shown
      console.log(`Retrieved ${data?.length || 0} customers from database`);
      return data as Customer[] || [];
    } catch (error) {
      console.error('Error in getCustomers:', error);
      return MOCK_CUSTOMERS; // Fallback to mock data in case of error
    }
  },

  // Get customer by ID from database (fallback to mock data only if error)
  getCustomer: async (id: string): Promise<Customer | null> => {
    try {
      console.log(`Fetching customer ${id} from database...`);
      
      // Convert string ID to UUID format for database if needed
      let queryId = id;
      if (id.length === 1) {
        // This handles the case of mock data IDs ('1', '2', '3')
        // being used before migration to database
        queryId = `00000000-0000-0000-0000-00000000000${id}`;
        console.log(`Converting simple ID ${id} to UUID format: ${queryId}`);
      }
      
      const { data, error } = await supabase
        .from(CUSTOMER_TABLE)
        .select('*')
        .eq('id', queryId)
        .single();

      if (error) {
        console.warn(`Error fetching customer ${id}:`, error.message);
        // Only try to find in mock data if database query failed
        const mockCustomer = MOCK_CUSTOMERS.find(c => c.id === id);
        if (mockCustomer) {
          console.log(`Found customer ${id} in mock data`);
          return mockCustomer;
        }
        return null;
      }

      console.log(`Successfully retrieved customer ${id} from database`);
      return data as Customer;
    } catch (error) {
      console.error(`Error in getCustomer ${id}:`, error);
      // Last resort fallback to mock data
      const mockCustomer = MOCK_CUSTOMERS.find(c => c.id === id);
      return mockCustomer || null;
    }
  },

  // Create new customer
  createCustomer: async (customer: Partial<Customer>): Promise<Customer | null> => {
    try {
      // Add timestamps
      const now = new Date().toISOString();
      
      // Generate full name if not provided
      let fullName = customer.fullName;
      if (!fullName && customer.firstName && customer.lastName) {
        fullName = `${customer.firstName} ${customer.lastName}`;
      }
      
      // Ensure contacts and idDocuments are arrays
      const contacts = customer.contacts || [];
      const idDocuments = customer.idDocuments || [];
      
      // Make sure at least one contact is marked as primary
      if (contacts.length > 0 && !contacts.some(c => c.isPrimary)) {
        contacts[0].isPrimary = true;
      }
      
      const newCustomer = {
        ...customer,
        fullName,
        contacts,
        idDocuments,
        createdAt: now,
        updatedAt: now
      };

      // Find primary contact for logging
      const primaryContact = contacts.find(c => c.isPrimary);
      const contactInfo = primaryContact ? `${primaryContact.type}: ${primaryContact.value}` : 'No primary contact';
      
      console.log('Creating new customer in database:', { 
        name: fullName,
        contact: contactInfo,
        document_count: idDocuments.length
      });
      
      const { data, error } = await supabase
        .from(CUSTOMER_TABLE)
        .insert([newCustomer])
        .select()
        .single();

      if (error) {
        console.error('Error creating customer:', error.message);
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('A customer with this profile already exists');
        }
        throw error;
      }

      console.log('Successfully created customer with ID:', data.id);
      return data as Customer;
    } catch (error) {
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

      console.log(`Successfully updated customer ${id}`);
      return data as Customer;
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
