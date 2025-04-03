import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// GET all customer groups
export async function GET(request: NextRequest) {
  try {
    const { data: customerGroups, error } = await supabase
      .from('customer_groups')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching customer groups:', error);
      return NextResponse.json({ error: 'Failed to fetch customer groups' }, { status: 500 });
    }

    return NextResponse.json(customerGroups);
  } catch (error) {
    console.error('Unexpected error fetching customer groups:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// POST create a new customer group
export async function POST(request: NextRequest) {
  try {
    const groupData = await request.json();

    // Basic validation
    if (!groupData.name) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
    }

    const { data: newGroup, error } = await supabase
      .from('customer_groups')
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
      console.error('Error creating customer group:', error);
      if (error.code === '23505') { // PostgreSQL unique constraint violation
        return NextResponse.json({ error: 'A group with this name already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create customer group', details: error.message }, { status: 500 });
    }

    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error('Unexpected error creating customer group:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
