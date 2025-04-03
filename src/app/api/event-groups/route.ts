import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// GET all event groups
export async function GET(request: NextRequest) {
  try {
    const { data: eventGroups, error } = await supabase
      .from('event_groups')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching event groups:', error);
      return NextResponse.json({ error: 'Failed to fetch event groups' }, { status: 500 });
    }

    return NextResponse.json(eventGroups);
  } catch (error) {
    console.error('Unexpected error fetching event groups:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// POST create a new event group
export async function POST(request: NextRequest) {
  try {
    const groupData = await request.json();

    // Basic validation
    if (!groupData.name) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
    }

    const { data: newGroup, error } = await supabase
      .from('event_groups')
      .insert([
        {
          name: groupData.name,
          description: groupData.description || null,
          color: groupData.color || null,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating event group:', error);
      if (error.code === '23505') { // PostgreSQL unique constraint violation
        return NextResponse.json({ error: 'A group with this name already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create event group', details: error.message }, { status: 500 });
    }

    return NextResponse.json(newGroup);
  } catch (error) {
    console.error('Unexpected error creating event group:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
