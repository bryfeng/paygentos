import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// Get a specific item by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { data: item, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }
      console.error(`Error fetching item ${id}:`, error);
      return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
    }
    
    return NextResponse.json(item);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// Update a specific item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const itemData = await request.json();
    
    // Basic validation
    if (!itemData.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    // Prepare item data to match the database schema
    const itemToUpdate: {
      name: string;
      description: string | null;
      category: string;
      status: string;
      group_id: string | null;
      updated_at: string;
      properties?: any;
    } = {
      name: itemData.name,
      description: itemData.description || null,
      category: itemData.type || itemData.category || 'general', // Map type to category
      status: itemData.status || 'active',
      group_id: itemData.group_id || null,
      updated_at: new Date().toISOString()
    };
    
    // Check if we need to update properties
    if (itemData.vendor_id || itemData.vendor_name) {
      // First fetch existing properties to merge
      const { data: existingItem } = await supabase
        .from('items')
        .select('properties')
        .eq('id', id)
        .single();
      
      const existingProperties = existingItem?.properties || {};
      
      // Update vendor info in properties
      itemToUpdate.properties = {
        ...existingProperties,
        vendor: {
          id: itemData.vendor_id,
          name: itemData.vendor_name
        }
      };
    }
    
    // Update the item
    const { data: item, error } = await supabase
      .from('items')
      .update(itemToUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating item ${id}:`, error);
      return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
    }
    
    return NextResponse.json(item);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// Delete a specific item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting item ${id}:`, error);
      return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
