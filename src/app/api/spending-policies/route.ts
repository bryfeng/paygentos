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
    
    // Extract relationship arrays, individual entities, and action
    const { 
      item_groups, 
      customer_groups, 
      event_groups, 
      payment_methods, 
      vendors,
      individual_items,
      individual_customers,
      individual_events,
      action, // Extract the action field (allow/block)
      ...mainPolicyData 
    } = policyData;
    
    // Get the current count of policies to determine the new priority
    const { count, error: countError } = await supabase
      .from('policies')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Error counting policies:', countError);
      return NextResponse.json({ error: 'Failed to determine policy priority', details: countError }, { status: 500 });
    }
    
    // Add timestamps, priority, and required fields with defaults
    const policyWithTimestamps = {
      ...mainPolicyData,
      priority: (count || 0) + 1, // Set priority to current count + 1
      conditions: mainPolicyData.conditions || JSON.stringify({
        operator: 'and',
        conditions: []
      }),
      // Convert the simple allow/block action to the JSON format expected by the database
      actions: mainPolicyData.actions || JSON.stringify({
        actions: [
          {
            type: action === 'block' ? 'block' : 'allow',
            parameters: {}
          }
        ]
      }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Creating policy with priority:', (count || 0) + 1);
    
    // Insert the main policy record
    const { data: policy, error: policyError } = await supabase
      .from('policies')
      .insert([policyWithTimestamps])
      .select()
      .single();
    
    if (policyError) {
      console.error('Error creating main policy record:', policyError);
      return NextResponse.json({ error: 'Failed to create policy', details: policyError }, { status: 500 });
    }
    
    const policyId = policy.id;
    let hasError = false;
    let errorDetails = {};
    
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
        console.error('Error inserting item groups:', itemGroupsError);
        hasError = true;
        errorDetails = { ...errorDetails, itemGroups: itemGroupsError.message };
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
        console.error('Error inserting customer groups:', customerGroupsError);
        hasError = true;
        errorDetails = { ...errorDetails, customerGroups: customerGroupsError.message };
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
        console.error('Error inserting event groups:', eventGroupsError);
        hasError = true;
        errorDetails = { ...errorDetails, eventGroups: eventGroupsError.message };
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
        console.error('Error inserting payment methods:', paymentMethodsError);
        hasError = true;
        errorDetails = { ...errorDetails, paymentMethods: paymentMethodsError.message };
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
        console.error('Error inserting vendors:', vendorsError);
        hasError = true;
        errorDetails = { ...errorDetails, vendors: vendorsError.message };
      }
    }
    
    // Handle individual items if the table exists
    if (individual_items && individual_items.length > 0) {
      try {
        const itemRelations = individual_items.map(itemId => ({
          policy_id: policyId,
          item_id: itemId
        }));
        
        const { error: individualItemsError } = await supabase
          .from('policy_individual_items')
          .insert(itemRelations);
        
        if (individualItemsError) {
          console.warn('Error inserting individual items (table may not exist):', individualItemsError);
        }
      } catch (error) {
        console.warn('Could not insert individual items, table might not exist', error);
      }
    }
    
    // Handle individual customers if the table exists
    if (individual_customers && individual_customers.length > 0) {
      try {
        const customerRelations = individual_customers.map(customerId => ({
          policy_id: policyId,
          customer_id: customerId
        }));
        
        const { error: individualCustomersError } = await supabase
          .from('policy_individual_customers')
          .insert(customerRelations);
        
        if (individualCustomersError) {
          console.warn('Error inserting individual customers (table may not exist):', individualCustomersError);
        }
      } catch (error) {
        console.warn('Could not insert individual customers, table might not exist', error);
      }
    }
    
    // Handle individual events if the table exists
    if (individual_events && individual_events.length > 0) {
      try {
        const eventRelations = individual_events.map(eventId => ({
          policy_id: policyId,
          event_id: eventId
        }));
        
        const { error: individualEventsError } = await supabase
          .from('policy_individual_events')
          .insert(eventRelations);
        
        if (individualEventsError) {
          console.warn('Error inserting individual events (table may not exist):', individualEventsError);
        }
      } catch (error) {
        console.warn('Could not insert individual events, table might not exist', error);
      }
    }
    
    // If there were any errors with the core relationships, report them but still return the policy
    if (hasError) {
      console.warn('Created policy with some relationship errors:', errorDetails);
    }
    
    return NextResponse.json(policy);
  } catch (error: any) {
    console.error('Error creating policy:', error);
    return NextResponse.json({ 
      error: 'Failed to create policy', 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}
