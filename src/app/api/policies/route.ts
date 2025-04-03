import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// GET all policies
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get('active');
    const groupId = searchParams.get('group_id');

    let query = supabase.from('policies').select('*');

    if (active === 'true') {
      query = query.eq('is_active', true);
    } else if (active === 'false') {
      query = query.eq('is_active', false);
    }
    
    if (groupId) {
      query = query.eq('group_id', groupId);
    }

    const { data: policies, error } = await query.order('priority');

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
    if (!policyData.priority) {
      return NextResponse.json({ error: 'Policy priority is required' }, { status: 400 });
    }

    if (!policyData.conditions || !policyData.actions) {
      return NextResponse.json({ error: 'Policy conditions and actions are required' }, { status: 400 });
    }

    const { data: newPolicy, error } = await supabase
      .from('policies')
      .insert([
        {
          priority: policyData.priority,
          conditions: policyData.conditions,
          actions: policyData.actions,
          description: policyData.description || null,
          is_active: policyData.is_active !== undefined ? policyData.is_active : true,
          applies_to: policyData.applies_to || null,
          group_id: policyData.group_id || null,
          created_by: policyData.created_by || null,
          updated_by: policyData.updated_by || null
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
