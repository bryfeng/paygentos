import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { Customer } from '@/models/customer/customer';

// Convert camelCase to snake_case for DB compatibility
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

// Convert snake_case back to camelCase for client compatibility
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

export async function POST(request: NextRequest) {
  try {
    const customerData = await request.json();
    
    // Add timestamps
    const now = new Date().toISOString();
    
    // Generate full name if not provided
    let fullName = customerData.fullName;
    if (!fullName && customerData.firstName && customerData.lastName) {
      fullName = `${customerData.firstName} ${customerData.lastName}`;
    }
    
    // Ensure contacts and idDocuments are arrays
    const contacts = customerData.contacts || [];
    const idDocuments = customerData.idDocuments || [];
    
    // Make sure at least one contact is marked as primary
    if (contacts.length > 0 && !contacts.some((c: any) => c.isPrimary)) {
      contacts[0].isPrimary = true;
    }
    
    // Prepare customer data in JavaScript camelCase
    const camelCaseCustomer = {
      ...customerData,
      fullName,
      contacts,
      idDocuments,
      createdAt: now,
      updatedAt: now
    };
    
    // Convert to snake_case for database
    const newCustomer = toSnakeCase(camelCaseCustomer);
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('customers')
      .insert([newCustomer])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating customer:', error.message);
      
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'A customer with this profile already exists' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    // Convert back to camelCase for client
    const camelCaseData = toCamelCase(data);
    
    return NextResponse.json(camelCaseData);
  } catch (error: any) {
    console.error('Server error in customer creation:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    // Convert from snake_case to camelCase
    const camelCaseData = data ? data.map(toCamelCase) : [];
    
    return NextResponse.json(camelCaseData);
  } catch (error: any) {
    console.error('Server error fetching customers:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
