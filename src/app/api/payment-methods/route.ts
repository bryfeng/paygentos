import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Try to access the payment_methods table
    // If it doesn't exist, we'll get an error but continue anyway
    // The table needs to be created through the Supabase interface or using migrations
    const { error: checkTableError } = await supabase
      .from('payment_methods')
      .select('id')
      .limit(1);
      
    if (checkTableError) {
      // Log the error but continue with the request
      console.warn('Warning accessing payment_methods table:', checkTableError.message);
      // Don't return an error response, as the table might exist with a different structure
      // or we might not have permission to access it yet but can still write to it
    }
    
    // Query all payment methods
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching payment methods:', error);
      return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error fetching payment methods:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('Received payment method creation request');
    const supabase = createClient();
    const paymentMethod = await request.json();
    
    console.log('Payment method data received:', JSON.stringify(paymentMethod, null, 2));
    
    // Validate required fields
    if (!paymentMethod.type || !paymentMethod.name) {
      console.error('Missing required fields:', { type: paymentMethod.type, name: paymentMethod.name });
      return NextResponse.json({ 
        error: 'Missing required fields', 
        details: 'Payment method type and name are required' 
      }, { status: 400 });
    }
    
    // Add created timestamp if not provided
    const newPaymentMethod = {
      ...paymentMethod,
      created_at: paymentMethod.created_at || new Date().toISOString(),
      updated_at: paymentMethod.updated_at || new Date().toISOString()
    };
    
    // Remove any customerId or customer_id if present since we don't need them
    delete newPaymentMethod.customerId;
    delete newPaymentMethod.customer_id;
    
    // Ensure details is an object
    if (!newPaymentMethod.details) {
      newPaymentMethod.details = {};
    }
    
    // For credit/debit cards, mask the number for storage
    if (newPaymentMethod.type === 'credit_card' || newPaymentMethod.type === 'debit_card') {
      if (newPaymentMethod.details?.cardNumber) {
        const cardNumber = newPaymentMethod.details.cardNumber.replace(/\s/g, '');
        const last4 = cardNumber.slice(-4);
        newPaymentMethod.details.maskedCardNumber = `•••• •••• •••• ${last4}`;
        // Don't store the full card number
        delete newPaymentMethod.details.cardNumber;
      }
    }
    
    // For bank accounts, mask the account number
    if (newPaymentMethod.type === 'bank_account') {
      if (newPaymentMethod.details?.accountNumber) {
        const accountNumber = newPaymentMethod.details.accountNumber;
        const last4 = accountNumber.slice(-4);
        newPaymentMethod.details.maskedAccountNumber = `••••${last4}`;
        // Don't store the full account number
        delete newPaymentMethod.details.accountNumber;
      }
    }
    
    console.log('Processed payment method for storage:', JSON.stringify(newPaymentMethod, null, 2));
    
    // Remove unwanted fields
    delete newPaymentMethod.isDefault;
    delete newPaymentMethod.is_default;
    
    // Remove empty ID field to let PostgreSQL generate one with gen_random_uuid()
    if (!newPaymentMethod.id || newPaymentMethod.id === '') {
      delete newPaymentMethod.id;
    }
    
    // Insert the payment method using the Supabase client
    console.log('Inserting payment method into database...');
    const { data, error } = await supabase
      .from('payment_methods')
      .insert([newPaymentMethod])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating payment method:', error);
      return NextResponse.json({ 
        error: 'Failed to create payment method', 
        details: error.message,
        code: error.code
      }, { status: 500 });
    }
    
    console.log('Successfully created payment method:', data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Server error creating payment method:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: error.message 
    }, { status: 500 });
  }
}
