import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// Constants
const EVENTS_TABLE = 'events';

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

// GET a single event by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Extract id to avoid Next.js warning about sync access to params
  const { id } = params;
  
  try {
    
    const { data, error } = await supabase
      .from(EVENTS_TABLE)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // Record not found
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      console.error(`Error fetching event ${id}:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Extract custom fields from metadata
    const metadata = data.metadata || {};
    
    // Transform database data to our frontend model format
    const transformedEvent = {
      id: data.id,
      name: data.title,
      description: data.description,
      startDate: data.start_time,
      endDate: data.end_time,
      location: data.location,
      purpose: metadata.purpose,
      requiresApproval: metadata.requiresApproval !== false,
      approvalStatus: data.status || 'scheduled',
      customerIds: data.customer_ids || [],
      isActive: data.is_active !== false,
      budget: metadata.budget || { amount: 0, currency: 'USD' },
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      metadata: metadata
    };
    
    return NextResponse.json(transformedEvent);
  } catch (error: any) {
    console.error('Server error fetching event:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

// PUT/PATCH to update an event
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Extract id to avoid Next.js warning about sync access to params
  const { id } = params;
  
  try {
    const updates = await request.json();
    
    // First, get the current event to preserve metadata we're not updating
    const { data: currentEvent, error: fetchError } = await supabase
      .from(EVENTS_TABLE)
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error(`Error fetching current event ${id}:`, fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }
    
    // Get current metadata or initialize empty object
    const currentMetadata = currentEvent.metadata || {};
    
    // Prepare new metadata by updating only the fields that changed
    const newMetadata = {
      ...currentMetadata,
      // Update metadata fields if provided in updates
      ...(updates.purpose !== undefined && { purpose: updates.purpose }),
      // Remove customerIds and isActive from metadata as they now have dedicated columns
      ...(updates.requiresApproval !== undefined && { requiresApproval: updates.requiresApproval }),
      ...(updates.budget !== undefined && { budget: updates.budget })
    };
    
    // Remove customerIds and isActive from metadata if they exist
    if (newMetadata.customerIds) delete newMetadata.customerIds;
    if (newMetadata.isActive) delete newMetadata.isActive;
    
    // Map our model fields to the actual database schema
    const updatedData = {
      ...(updates.name !== undefined && { title: updates.name }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.startDate !== undefined && { start_time: updates.startDate }),
      ...(updates.endDate !== undefined && { end_time: updates.endDate }),
      ...(updates.location !== undefined && { location: updates.location }),
      // Only apply valid status values: 'scheduled', 'in_progress', 'completed', 'cancelled'
      ...(updates.approvalStatus !== undefined && { status: updates.approvalStatus }),
      // Update dedicated columns for customerIds and isActive
      ...(updates.customerIds !== undefined && { customer_ids: updates.customerIds }),
      ...(updates.isActive !== undefined && { is_active: updates.isActive }),
      metadata: newMetadata,
      updated_at: new Date().toISOString()
    };
    
    console.log(`Updating event ${id} with:`, updatedData);
    
    const { data, error } = await supabase
      .from(EVENTS_TABLE)
      .update(updatedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating event ${id}:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Transform the response to match our frontend model
    const metadata = data.metadata || {};
    
    // Transform database data to our frontend model format
    const transformedEvent = {
      id: data.id,
      name: data.title,
      description: data.description,
      startDate: data.start_time,
      endDate: data.end_time,
      location: data.location,
      purpose: metadata.purpose,
      requiresApproval: metadata.requiresApproval !== false,
      approvalStatus: data.status || 'scheduled',
      customerIds: data.customer_ids || [],
      isActive: data.is_active !== false,
      budget: metadata.budget || { amount: 0, currency: 'USD' },
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      metadata: metadata
    };
    
    return NextResponse.json(transformedEvent);
  } catch (error: any) {
    console.error('Server error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE an event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Extract id to avoid Next.js warning about sync access to params
  const { id } = params;
  
  try {
    
    const { error } = await supabase
      .from(EVENTS_TABLE)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting event ${id}:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Server error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
