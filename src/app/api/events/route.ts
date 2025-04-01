import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { Event } from '@/models/event/event';

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

// GET all events
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from(EVENTS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Transform database data to our frontend model format
    const transformedEvents = data.map(event => {
      // Extract custom fields from metadata
      const metadata = event.metadata || {};
      
      return {
        id: event.id,
        name: event.title,
        description: event.description,
        startDate: event.start_time,
        endDate: event.end_time,
        location: event.location,
        purpose: metadata.purpose,
        requiresApproval: metadata.requiresApproval !== false,
        approvalStatus: event.status || 'scheduled',
        customerIds: event.customer_ids || [],
        isActive: event.is_active !== false,
        budget: metadata.budget || { amount: 0, currency: 'USD' },
        createdAt: event.created_at,
        updatedAt: event.updated_at,
        metadata: metadata
      };
    });
    
    return NextResponse.json(transformedEvents);
  } catch (error: any) {
    console.error('Server error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST (create) a new event
export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();
    
    // Add timestamps
    const now = new Date().toISOString();
    
    // Map our model fields to the actual database schema
    // Store remaining custom fields in the metadata JSON column
    const eventForDb = {
      title: eventData.name,
      description: eventData.description,
      start_time: eventData.startDate,
      end_time: eventData.endDate,
      location: eventData.location,
      // Valid status values: 'scheduled', 'in_progress', 'completed', 'cancelled'
      status: eventData.status || 'scheduled',
      // Store customerIds and isActive in their own columns
      customer_ids: Array.isArray(eventData.customerIds) ? eventData.customerIds : [],
      is_active: eventData.isActive !== false,
      // Store remaining data in metadata field
      metadata: {
        purpose: eventData.purpose,
        requiresApproval: eventData.requiresApproval !== false,
        budget: eventData.budget || { amount: 0, currency: 'USD' }
      },
      created_at: now,
      updated_at: now
    };
    
    // Log what we're sending to the database
    console.log('Sending to database:', eventForDb);
    
    // Insert into database
    const { data, error } = await supabase
      .from(EVENTS_TABLE)
      .insert(eventForDb)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Convert response back to camelCase
    const createdEvent = toCamelCase(data);
    
    return NextResponse.json(createdEvent, { status: 201 });
  } catch (error: any) {
    console.error('Server error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
