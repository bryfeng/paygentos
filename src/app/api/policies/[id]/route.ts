import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

interface PolicyParams {
  params: {
    id: string;
  };
}

// GET a specific policy by ID
export async function GET(request: NextRequest, { params }: PolicyParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Policy ID is required' }, { status: 400 });
    }

    const { data: policy, error } = await supabase
      .from('policies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching policy ${id}:`, error);
      if (error.code === 'PGRST116') { // PostgREST error for no rows found
        return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch policy' }, { status: 500 });
    }

    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    return NextResponse.json(policy);
  } catch (error) {
    console.error('Unexpected error fetching policy:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// PUT update a specific policy by ID
export async function PUT(request: NextRequest, { params }: PolicyParams) {
  try {
    const { id } = params;
    const policyData = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Policy ID is required' }, { status: 400 });
    }

    // Add validation if necessary (e.g., ensure required fields are present)

    const { data: updatedPolicy, error } = await supabase
      .from('policies')
      .update({
        name: policyData.name,
        description: policyData.description,
        content: policyData.content,
        version: policyData.version,
        status: policyData.status,
        updated_at: new Date().toISOString(), // Explicitly update updated_at
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating policy ${id}:`, error);
       if (error.code === 'PGRST116') { 
        return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to update policy', details: error.message }, { status: 500 });
    }
    
     if (!updatedPolicy) {
      return NextResponse.json({ error: 'Policy not found after update attempt' }, { status: 404 });
    }

    return NextResponse.json(updatedPolicy);
  } catch (error) {
    console.error('Unexpected error updating policy:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// DELETE a specific policy by ID
export async function DELETE(request: NextRequest, { params }: PolicyParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Policy ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('policies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting policy ${id}:`, error);
       if (error.code === 'PGRST116') { // May not always occur on delete, check count instead
         // Check if the policy existed before trying to delete
         const { count } = await supabase.from('policies').select('id', { count: 'exact' }).eq('id', id);
         if (count === 0) {
            return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
         }
      }
      return NextResponse.json({ error: 'Failed to delete policy' }, { status: 500 });
    }

    // Optionally, check if the delete actually removed a row if needed

    return NextResponse.json({ message: 'Policy deleted successfully' }, { status: 200 }); // Or 204 No Content
  } catch (error) {
    console.error('Unexpected error deleting policy:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
