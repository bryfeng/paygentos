// Script to migrate mock customer data to the Supabase database
const { createClient } = require('@supabase/supabase-js');

// Get environment variables from a .env file or environment
require('dotenv').config();

// Create supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Customer interface
interface Customer {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  [key: string]: any;
}

// Mock data from customer-api.ts
const MOCK_CUSTOMERS = [
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

// Table name in Supabase
const CUSTOMER_TABLE = 'customers';

// Function to migrate mock data to the database
async function migrateMockCustomers() {
  // Check if customers already exist to avoid duplicates
  console.log('Checking existing customers...');
  const { data: existingCustomers, error: fetchError } = await supabase
    .from('customers')
    .select('id');

  if (fetchError) {
    console.error('Error checking existing customers:', fetchError.message);
    return;
  }

  if (existingCustomers && existingCustomers.length > 0) {
    console.log(`Found ${existingCustomers.length} existing customers, skipping migration.`);
    console.log('To force migration, delete existing records first.');
    return;
  }

  // Proceed with migration if no existing customers
  try {
    console.log('Starting migration of mock customers to database...');

    // Convert string IDs to UUIDs
    const customersWithUuids = MOCK_CUSTOMERS.map(customer => ({
      ...customer,
      // Use proper UUID format for Supabase - this is assuming the mock IDs can be converted to UUIDs
      // In a real scenario, you might want to generate new UUIDs
      id: customer.id === '1' ? '00000000-0000-0000-0000-000000000001' : 
         customer.id === '2' ? '00000000-0000-0000-0000-000000000002' : 
         '00000000-0000-0000-0000-000000000003'
    }));

    const { data, error } = await supabase
      .from('customers')
      .insert(customersWithUuids)
      .select();

    if (error) {
      console.error('Error migrating mock customers:', error.message);
      return;
    }

    console.log(`Successfully migrated ${data.length} mock customers to the database.`);
  } catch (error) {
    console.error('Unexpected error during migration:', error);
  }
}

// Execute the migration
migrateMockCustomers()
  .then(() => {
    console.log('Migration script completed.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });
