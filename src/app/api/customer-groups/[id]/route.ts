import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

interface GroupParams {
  params: {
    id: string;
  };
}

// GET a specific customer group by ID
export async function GET(request: NextRequest, { params }: GroupParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }

    const { data: group, error } = await supabase
      .from('customer_groups')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching customer group ${id}:`, error);
      if (error.code === 'PGRST116') { // No rows found
        return NextResponse.json({ error: 'Customer group not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch customer group' }, { status: 500 });
    }

    if (!group) {
      return NextResponse.json({ error: 'Customer group not found' }, { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error('Unexpected error fetching customer group:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// PUT update a specific customer group by ID
export async function PUT(request: NextRequest, { params }: GroupParams) {
  try {
    const { id } = params;
    const groupData = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }

    // Basic validation
    if (!groupData.name) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
    }

    const { data: updatedGroup, error } = await supabase
      .from('customer_groups')
      .update({
        name: groupData.name,
        description: groupData.description,
        color: groupData.color,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating customer group ${id}:`, error);
      if (error.code === '23505') { // PostgreSQL unique constraint violation
        return NextResponse.json({ error: 'A group with this name already exists' }, { status: 409 });
      }
      if (error.code === 'PGRST116') { // No rows found
        return NextResponse.json({ error: 'Customer group not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to update customer group', details: error.message }, { status: 500 });
    }

    if (!updatedGroup) {
      return NextResponse.json({ error: 'Customer group not found after update attempt' }, { status: 404 });
    }

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error('Unexpected error updating customer group:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// DELETE a specific customer group by ID
export async function DELETE(request: NextRequest, { params }: GroupParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }

    // First check if any customers are using this group
    const { count, error: countError } = await supabase
      .from('customers')
      .select('id', { count: 'exact' })
      .eq('group_id', id);

    if (countError) {
      console.error(`Error checking customers for group ${id}:`, countError);
      return NextResponse.json({ error: 'Failed to check if group is in use' }, { status: 500 });
    }

    // If customers are using this group, prevent deletion
    if (count && count > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete this group because it is assigned to one or more customers',
        customersCount: count
      }, { status: 400 });
    }

    // If no customers are using it, proceed with deletion
    const { error } = await supabase
      .from('customer_groups')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting customer group ${id}:`, error);
      if (error.code === 'PGRST116') { // No rows found
        return NextResponse.json({ error: 'Customer group not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to delete customer group' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Customer group deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error deleting customer group:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
