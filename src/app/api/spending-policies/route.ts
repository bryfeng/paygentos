import { createClient } from '@/utils/supabase';
import { NextResponse } from 'next/server';

// GET: Retrieve all spending policies
export async function GET() {
  try {
    console.log('Fetching all spending policies');
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('policies')
      .select(`
        *,
        policy_item_groups(item_group_id),
        policy_customer_groups(customer_group_id),
        policy_event_groups(event_group_id),
        policy_payment_methods(payment_method_id),
        policy_vendors(vendor_id)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching policies:', error);
      return NextResponse.json({ error: 'Failed to fetch policies' }, { status: 500 });
    }
    
    // Transform the data to match our frontend structure
    const transformedData = data.map(policy => ({
      id: policy.id,
      name: policy.name,
      description: policy.description,
      budget_amount: policy.budget_amount,
      budget_interval: policy.budget_interval,
      budget_start_date: policy.budget_start_date,
      budget_end_date: policy.budget_end_date,
      status: policy.status,
      allowed_payment_types: policy.allowed_payment_types || [],
      require_approval: policy.require_approval,
      approval_threshold: policy.approval_threshold,
      item_groups: policy.policy_item_groups?.map((item: any) => item.item_group_id) || [],
      customer_groups: policy.policy_customer_groups?.map((item: any) => item.customer_group_id) || [],
      event_groups: policy.policy_event_groups?.map((item: any) => item.event_group_id) || [],
      payment_methods: policy.policy_payment_methods?.map((item: any) => item.payment_method_id) || [],
      vendors: policy.policy_vendors?.map((item: any) => item.vendor_id) || [],
      created_at: policy.created_at,
      updated_at: policy.updated_at
    }));
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Server error fetching policies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create a new spending policy with relationships
export async function POST(request: Request) {
  try {
    console.log('Creating new spending policy');
    const supabase = createClient();
    const policyData = await request.json();
    
    // Start a transaction using RPC
    const { error: txError } = await supabase.rpc('begin_transaction');
    if (txError) {
      console.error('Error starting transaction:', txError);
      return NextResponse.json({ error: 'Failed to start transaction' }, { status: 500 });
    }
    
    try {
      // Extract relationship arrays
      const { 
        item_groups, 
        customer_groups, 
        event_groups, 
        payment_methods, 
        vendors,
        ...mainPolicyData 
      } = policyData;
      
      // Add timestamps
      const policyWithTimestamps = {
        ...mainPolicyData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Insert the main policy record
      const { data: policy, error: policyError } = await supabase
        .from('policies')
        .insert([policyWithTimestamps])
        .select()
        .single();
      
      if (policyError) {
        throw policyError;
      }
      
      const policyId = policy.id;
      
      // Create item groups relationships
      if (item_groups && item_groups.length > 0) {
        const itemGroupRelations = item_groups.map(groupId => ({
          policy_id: policyId,
          item_group_id: groupId
        }));
        
        const { error: itemGroupsError } = await supabase
          .from('policy_item_groups')
          .insert(itemGroupRelations);
        
        if (itemGroupsError) {
          throw itemGroupsError;
        }
      }
      
      // Create customer groups relationships
      if (customer_groups && customer_groups.length > 0) {
        const customerGroupRelations = customer_groups.map(groupId => ({
          policy_id: policyId,
          customer_group_id: groupId
        }));
        
        const { error: customerGroupsError } = await supabase
          .from('policy_customer_groups')
          .insert(customerGroupRelations);
        
        if (customerGroupsError) {
          throw customerGroupsError;
        }
      }
      
      // Create event groups relationships
      if (event_groups && event_groups.length > 0) {
        const eventGroupRelations = event_groups.map(groupId => ({
          policy_id: policyId,
          event_group_id: groupId
        }));
        
        const { error: eventGroupsError } = await supabase
          .from('policy_event_groups')
          .insert(eventGroupRelations);
        
        if (eventGroupsError) {
          throw eventGroupsError;
        }
      }
      
      // Create payment methods relationships
      if (payment_methods && payment_methods.length > 0) {
        const paymentMethodRelations = payment_methods.map(methodId => ({
          policy_id: policyId,
          payment_method_id: methodId
        }));
        
        const { error: paymentMethodsError } = await supabase
          .from('policy_payment_methods')
          .insert(paymentMethodRelations);
        
        if (paymentMethodsError) {
          throw paymentMethodsError;
        }
      }
      
      // Create vendors relationships
      if (vendors && vendors.length > 0) {
        const vendorRelations = vendors.map(vendorId => ({
          policy_id: policyId,
          vendor_id: vendorId
        }));
        
        const { error: vendorsError } = await supabase
          .from('policy_vendors')
          .insert(vendorRelations);
        
        if (vendorsError) {
          throw vendorsError;
        }
      }
      
      // Commit the transaction
      const { error: commitError } = await supabase.rpc('commit_transaction');
      if (commitError) {
        throw commitError;
      }
      
      return NextResponse.json(policy);
    } catch (error) {
      // Rollback the transaction on error
      const { error: rollbackError } = await supabase.rpc('rollback_transaction');
      if (rollbackError) {
        console.error('Error rolling back transaction:', rollbackError);
      }
      
      throw error;
    }
  } catch (error: any) {
    console.error('Error creating policy:', error);
    return NextResponse.json({ 
      error: 'Failed to create policy', 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}
