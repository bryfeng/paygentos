import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';

export async function GET() {
  try {
    console.log('Testing payment methods API...');
    const supabase = createClient();

    // First, let's test if the payment_methods table exists
    let response: any = { tableStatus: {}, testInsert: {}, testData: [] };

    // Step 1: Check if table exists by trying to query it
    const { data: tableData, error: tableError } = await supabase
      .from('payment_methods')
      .select('id')
      .limit(1);

    if (tableError) {
      response.tableStatus = {
        exists: false,
        error: tableError.message
      };

      // Table doesn't exist or we don't have access, create it
      console.log('Creating payment_methods table...');
      const createQuery = `
        -- Drop the table if it exists to avoid column mismatch issues
        DROP TABLE IF EXISTS payment_methods;
        
        -- Create the table without customer_id and is_default fields
        CREATE TABLE payment_methods (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          type TEXT NOT NULL CHECK (type IN ('credit_card', 'debit_card', 'bank_account', 'digital_wallet', 'corporate_account', 'other')),
          name TEXT NOT NULL,
          details JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Add table comment
        COMMENT ON TABLE payment_methods IS 'Stores payment method details with masked sensitive information';
      `;

      const { error: createError } = await supabase.rpc('execute_sql', { query: createQuery });
      
      if (createError) {
        response.tableStatus.createAttempt = {
          success: false,
          error: createError.message
        };
      } else {
        response.tableStatus.createAttempt = {
          success: true
        };
      }
    } else {
      response.tableStatus = {
        exists: true,
        data: tableData
      };
    }

    // Step 2: Try inserting a test payment method
    const testMethod = {
      type: 'credit_card',
      name: 'Test Credit Card',
      details: {
        maskedCardNumber: '•••• •••• •••• 1234',
        cardholderName: 'Test User',
        expiryMonth: 12,
        expiryYear: 2030
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Ensure unwanted fields are not present
    delete (testMethod as any).customer_id;
    delete (testMethod as any).customerId;
    delete (testMethod as any).is_default;
    delete (testMethod as any).isDefault;

    const { data: insertData, error: insertError } = await supabase
      .from('payment_methods')
      .insert([testMethod])
      .select();

    if (insertError) {
      response.testInsert = {
        success: false,
        error: insertError.message,
        code: insertError.code,
        details: insertError.details
      };
    } else {
      response.testInsert = {
        success: true,
        data: insertData
      };
    }

    // Step 3: Try to fetch all payment methods
    const { data: allData, error: fetchError } = await supabase
      .from('payment_methods')
      .select('*');

    if (fetchError) {
      response.testData = {
        success: false,
        error: fetchError.message
      };
    } else {
      response.testData = {
        success: true,
        count: allData.length,
        data: allData
      };
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error in payment methods test:', error);
    return NextResponse.json({ 
      error: 'Test failed', 
      message: error.message 
    }, { status: 500 });
  }
}
