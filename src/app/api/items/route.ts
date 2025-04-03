import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// Get all items
export async function GET(request: NextRequest) {
  try {
    // Get search params
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const groupId = searchParams.get('group_id');
    
    // Build query
    let query = supabase.from('items').select('*');
    
    // Apply filters if provided
    if (category) {
      query = query.eq('category', category);
    }
    
    if (groupId) {
      query = query.eq('group_id', groupId);
    }
    
    // Execute query
    const { data: items, error } = await query.order('name');
    
    if (error) {
      console.error('Error fetching items:', error);
      return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
    }
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// Create a new item
export async function POST(request: NextRequest) {
  try {
    const itemData = await request.json();
    
    // Basic validation
    if (!itemData.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    // Prepare item data to match the database schema
    const itemToInsert = {
      name: itemData.name,
      description: itemData.description || null,
      category: itemData.type || itemData.category || 'general', // Map type to category
      status: itemData.status || 'active',
      group_id: itemData.group_id || null,
      // Store any additional properties as JSON
      properties: {}
    };
    
    // Add any vendor information to properties
    if (itemData.vendor_id || itemData.vendor_name) {
      itemToInsert.properties = {
        ...itemToInsert.properties,
        vendor: {
          id: itemData.vendor_id,
          name: itemData.vendor_name
        }
      };
    }
    
    // Insert new item
    const { data: item, error } = await supabase
      .from('items')
      .insert([itemToInsert])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating item:', error);
      return NextResponse.json({ error: 'Failed to create item: ' + error.message }, { status: 500 });
    }
    
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
