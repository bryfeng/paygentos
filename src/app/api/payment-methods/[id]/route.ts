import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const supabase = createClient();
    
    // Query the specific payment method using the Supabase client
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching payment method ${id}:`, error);
      return NextResponse.json({ error: 'Failed to fetch payment method' }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error fetching payment method:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const supabase = createClient();
    const paymentMethod = await request.json();
    
    // Add updated timestamp
    const updatedPaymentMethod = {
      ...paymentMethod,
      updated_at: new Date().toISOString()
    };
    
    // Make sure we don't try to update the ID
    delete updatedPaymentMethod.id;
    
    // Update the payment method using the Supabase client
    const { data, error } = await supabase
      .from('payment_methods')
      .update(updatedPaymentMethod)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating payment method ${id}:`, error);
      return NextResponse.json({ error: 'Failed to update payment method' }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error updating payment method:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const supabase = createClient();
    
    // Delete the payment method using the Supabase client
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting payment method ${id}:`, error);
      return NextResponse.json({ error: 'Failed to delete payment method' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error deleting payment method:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
