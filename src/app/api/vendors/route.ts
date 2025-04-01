import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';

// Get all vendors
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get search params
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    
    // Build query
    let query = supabase.from('vendors').select('*');
    
    // Apply filters if provided
    if (type) {
      query = query.eq('type', type);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    // Execute query
    const { data: vendors, error } = await query.order('name');
    
    if (error) {
      console.error('Error fetching vendors:', error);
      return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
    }
    
    return NextResponse.json(vendors);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// Create a new vendor
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const vendorData = await request.json();
    
    // Basic validation
    if (!vendorData.name || !vendorData.type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
    }
    
    // Insert new vendor
    const { data: vendor, error } = await supabase
      .from('vendors')
      .insert([
        {
          name: vendorData.name,
          type: vendorData.type,
          contact_email: vendorData.contact_email || null,
          contact_phone: vendorData.contact_phone || null,
          website: vendorData.website || null,
          status: vendorData.status || 'active',
          metadata: vendorData.metadata || {}
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating vendor:', error);
      return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 });
    }
    
    return NextResponse.json(vendor, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
