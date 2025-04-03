import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';

// GET endpoint to retrieve a single spending policy
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;

    // Fetch the main policy record
    const { data: policyData, error: policyError } = await supabase
      .from('policies')
      .select('*')
      .eq('id', id)
      .single();

    if (policyError) {
      console.error('Error fetching policy:', policyError);
      return NextResponse.json(
        { error: 'Failed to fetch policy', details: policyError },
        { status: 404 }
      );
    }

    if (!policyData) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    // Fetch related item groups
    const { data: itemGroups } = await supabase
      .from('policy_item_groups')
      .select('item_group_id')
      .eq('policy_id', id);

    // Fetch related customer groups
    const { data: customerGroups } = await supabase
      .from('policy_customer_groups')
      .select('customer_group_id')
      .eq('policy_id', id);

    // Fetch related event groups
    const { data: eventGroups } = await supabase
      .from('policy_event_groups')
      .select('event_group_id')
      .eq('policy_id', id);

    // Fetch related payment methods
    const { data: paymentMethods } = await supabase
      .from('policy_payment_methods')
      .select('payment_method_id')
      .eq('policy_id', id);

    // Fetch related vendors
    const { data: vendors } = await supabase
      .from('policy_vendors')
      .select('vendor_id')
      .eq('policy_id', id);

    // Fetch individual items
    const { data: individualItems } = await supabase
      .from('policy_individual_items')
      .select('item_id')
      .eq('policy_id', id);

    // Fetch individual customers
    const { data: individualCustomers } = await supabase
      .from('policy_individual_customers')
      .select('customer_id')
      .eq('policy_id', id);

    // Fetch individual events
    const { data: individualEvents } = await supabase
      .from('policy_individual_events')
      .select('event_id')
      .eq('policy_id', id);

    // Extract the action from the actions JSON field
    let action = 'allow'; // Default
    try {
      if (policyData.actions) {
        const actionsObj = JSON.parse(policyData.actions);
        if (actionsObj.actions && actionsObj.actions.length > 0) {
          action = actionsObj.actions[0].type;
        }
      }
    } catch (err) {
      console.error('Error parsing actions JSON:', err);
    }

    // Combine all data
    const response = {
      ...policyData,
      item_groups: itemGroups?.map(item => item.item_group_id) || [],
      customer_groups: customerGroups?.map(item => item.customer_group_id) || [],
      event_groups: eventGroups?.map(item => item.event_group_id) || [],
      payment_methods: paymentMethods?.map(item => item.payment_method_id) || [],
      vendors: vendors?.map(item => item.vendor_id) || [],
      individual_items: individualItems?.map(item => item.item_id) || [],
      individual_customers: individualCustomers?.map(item => item.customer_id) || [],
      individual_events: individualEvents?.map(item => item.event_id) || [],
      action: action
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a spending policy
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;

    // Delete related records first (maintain referential integrity)
    await supabase.from('policy_item_groups').delete().eq('policy_id', id);
    await supabase.from('policy_customer_groups').delete().eq('policy_id', id);
    await supabase.from('policy_event_groups').delete().eq('policy_id', id);
    await supabase.from('policy_payment_methods').delete().eq('policy_id', id);
    await supabase.from('policy_vendors').delete().eq('policy_id', id);
    await supabase.from('policy_individual_items').delete().eq('policy_id', id);
    await supabase.from('policy_individual_customers').delete().eq('policy_id', id);
    await supabase.from('policy_individual_events').delete().eq('policy_id', id);

    // Delete the main policy record
    const { error } = await supabase.from('policies').delete().eq('id', id);

    if (error) {
      console.error('Error deleting policy:', error);
      return NextResponse.json(
        { error: 'Failed to delete policy', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error processing delete request:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update a spending policy
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;
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
    
    // Create policy record with proper JSON fields
    const policyRecord = {
      ...mainPolicyData,
      allowed_payment_types: mainPolicyData.allowed_payment_types || [],
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
      updated_at: new Date().toISOString()
    };
    
    // Update main policy record
    const { error: updateError } = await supabase
      .from('policies')
      .update(policyRecord)
      .eq('id', id);
    
    if (updateError) {
      throw new Error(`Error updating main policy record: ${JSON.stringify(updateError)}`);
    }

    // Update related item groups
    if (item_groups) {
      // Delete existing relationships
      await supabase.from('policy_item_groups').delete().eq('policy_id', id);
      
      // Insert new relationships if there are any item groups
      if (item_groups.length > 0) {
        const itemGroupRecords = item_groups.map(item_group_id => ({
          policy_id: id,
          item_group_id
        }));
        
        const { error: itemGroupError } = await supabase
          .from('policy_item_groups')
          .insert(itemGroupRecords);
        
        if (itemGroupError) {
          throw new Error(`Error updating item groups: ${JSON.stringify(itemGroupError)}`);
        }
      }
    }
    
    // Update related customer groups
    if (customer_groups) {
      // Delete existing relationships
      await supabase.from('policy_customer_groups').delete().eq('policy_id', id);
      
      // Insert new relationships if there are any customer groups
      if (customer_groups.length > 0) {
        const customerGroupRecords = customer_groups.map(customer_group_id => ({
          policy_id: id,
          customer_group_id
        }));
        
        const { error: customerGroupError } = await supabase
          .from('policy_customer_groups')
          .insert(customerGroupRecords);
        
        if (customerGroupError) {
          throw new Error(`Error updating customer groups: ${JSON.stringify(customerGroupError)}`);
        }
      }
    }
    
    // Update related event groups
    if (event_groups) {
      // Delete existing relationships
      await supabase.from('policy_event_groups').delete().eq('policy_id', id);
      
      // Insert new relationships if there are any event groups
      if (event_groups.length > 0) {
        const eventGroupRecords = event_groups.map(event_group_id => ({
          policy_id: id,
          event_group_id
        }));
        
        const { error: eventGroupError } = await supabase
          .from('policy_event_groups')
          .insert(eventGroupRecords);
        
        if (eventGroupError) {
          throw new Error(`Error updating event groups: ${JSON.stringify(eventGroupError)}`);
        }
      }
    }
    
    // Update related payment methods
    if (payment_methods) {
      // Delete existing relationships
      await supabase.from('policy_payment_methods').delete().eq('policy_id', id);
      
      // Insert new relationships if there are any payment methods
      if (payment_methods.length > 0) {
        const paymentMethodRecords = payment_methods.map(payment_method_id => ({
          policy_id: id,
          payment_method_id
        }));
        
        const { error: paymentMethodError } = await supabase
          .from('policy_payment_methods')
          .insert(paymentMethodRecords);
        
        if (paymentMethodError) {
          throw new Error(`Error updating payment methods: ${JSON.stringify(paymentMethodError)}`);
        }
      }
    }
    
    // Update related vendors
    if (vendors) {
      // Delete existing relationships
      await supabase.from('policy_vendors').delete().eq('policy_id', id);
      
      // Insert new relationships if there are any vendors
      if (vendors.length > 0) {
        const vendorRecords = vendors.map(vendor_id => ({
          policy_id: id,
          vendor_id
        }));
        
        const { error: vendorError } = await supabase
          .from('policy_vendors')
          .insert(vendorRecords);
        
        if (vendorError) {
          throw new Error(`Error updating vendors: ${JSON.stringify(vendorError)}`);
        }
      }
    }
    
    // Update individual items
    if (individual_items) {
      await supabase.from('policy_individual_items').delete().eq('policy_id', id);
      
      if (individual_items.length > 0) {
        const itemRecords = individual_items.map(item_id => ({
          policy_id: id,
          item_id
        }));
        
        const { error: itemError } = await supabase
          .from('policy_individual_items')
          .insert(itemRecords);
        
        if (itemError) {
          throw new Error(`Error updating individual items: ${JSON.stringify(itemError)}`);
        }
      }
    }
    
    // Update individual customers
    if (individual_customers) {
      await supabase.from('policy_individual_customers').delete().eq('policy_id', id);
      
      if (individual_customers.length > 0) {
        const customerRecords = individual_customers.map(customer_id => ({
          policy_id: id,
          customer_id
        }));
        
        const { error: customerError } = await supabase
          .from('policy_individual_customers')
          .insert(customerRecords);
        
        if (customerError) {
          throw new Error(`Error updating individual customers: ${JSON.stringify(customerError)}`);
        }
      }
    }
    
    // Update individual events
    if (individual_events) {
      await supabase.from('policy_individual_events').delete().eq('policy_id', id);
      
      if (individual_events.length > 0) {
        const eventRecords = individual_events.map(event_id => ({
          policy_id: id,
          event_id
        }));
        
        const { error: eventError } = await supabase
          .from('policy_individual_events')
          .insert(eventRecords);
        
        if (eventError) {
          throw new Error(`Error updating individual events: ${JSON.stringify(eventError)}`);
        }
      }
    }
    
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Error processing patch request:', error);
    return NextResponse.json(
      { error: 'Failed to update policy', details: error.message },
      { status: 500 }
    );
  }
}
