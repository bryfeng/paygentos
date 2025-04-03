import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// GET all policies
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    let query = supabase.from('policies').select('*');

    if (status) {
      query = query.eq('status', status);
    }

    const { data: policies, error } = await query.order('name');

    if (error) {
      console.error('Error fetching policies:', error);
      return NextResponse.json({ error: 'Failed to fetch policies' }, { status: 500 });
    }

    return NextResponse.json(policies);
  } catch (error) {
    console.error('Unexpected error fetching policies:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// POST create a new policy
export async function POST(request: NextRequest) {
  try {
    const policyData = await request.json();

    // Basic validation
    if (!policyData.name) {
      return NextResponse.json({ error: 'Policy name is required' }, { status: 400 });
    }

    const { data: newPolicy, error } = await supabase
      .from('policies')
      .insert([
        {
          name: policyData.name,
          description: policyData.description || null,
          content: policyData.content || {},
          version: policyData.version || 1,
          status: policyData.status || 'draft',
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating policy:', error);
      // Consider more specific error handling based on Supabase error codes
      return NextResponse.json({ error: 'Failed to create policy', details: error.message }, { status: 500 });
    }

    return NextResponse.json(newPolicy, { status: 201 });
  } catch (error) {
    console.error('Unexpected error creating policy:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
