import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// Get a specific vendor by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { data: vendor, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching vendor:', error);
      return NextResponse.json({ error: 'Failed to fetch vendor' }, { status: 500 });
    }
    
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }
    
    return NextResponse.json(vendor);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// Update a vendor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const vendorData = await request.json();
    
    // Basic validation
    if (!vendorData.name || !vendorData.type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
    }
    
    // Update vendor
    const { data: vendor, error } = await supabase
      .from('vendors')
      .update({
        name: vendorData.name,
        type: vendorData.type,
        contact_email: vendorData.contact_email || null,
        contact_phone: vendorData.contact_phone || null,
        website: vendorData.website || null,
        status: vendorData.status || 'active',
        metadata: vendorData.metadata || {},
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating vendor:', error);
      return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
    }
    
    return NextResponse.json(vendor);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// Delete a vendor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting vendor:', error);
      return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
