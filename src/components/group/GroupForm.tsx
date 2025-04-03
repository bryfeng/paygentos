'use client';

import React, { useState, useEffect } from 'react';
import { CustomerGroup, CustomerGroupAPI } from '@/api/customer/customer-group-api';
import { EventGroup, EventGroupAPI } from '@/api/event/event-group-api';
import { ItemGroup, ItemGroupAPI } from '@/api/item/item-group-api';
import { createClient } from '@/utils/supabase';
import formStyles from '@/styles/components/Form.module.css';
import buttonStyles from '@/styles/components/Button.module.css';

// Entity interface for selected items/customers/events
interface Entity {
  id: string;
  name: string;
  email?: string;
  description?: string;
  date?: string;
}

// Define a generic Group type that works for all group types
type Group = CustomerGroup | EventGroup | ItemGroup;

interface GroupFormProps {
  type: 'customer' | 'event' | 'item';
  group: Group | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function GroupForm({ type, group, onSave, onCancel }: GroupFormProps) {
  // We can use a generic type here since all group types have the same structure
  const [formData, setFormData] = useState<Partial<Group>>({
    name: group?.name || '',
    description: group?.description || '',
  });
  
  // States for entity selections
  const [availableEntities, setAvailableEntities] = useState<Entity[]>([]);
  const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>([]);
  const [isLoadingEntities, setIsLoadingEntities] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!group;

  // Fetch available entities based on group type
  useEffect(() => {
    const fetchEntities = async () => {
      setIsLoadingEntities(true);
      try {
        const supabase = createClient();
        let data;
        
        if (type === 'customer') {
          // Fetch customers from database
          const { data: customers, error } = await supabase
            .from('customers')
            .select('id, name, email')
            .order('name');
            
          if (error) throw error;
          data = customers;
        } 
        else if (type === 'event') {
          // Fetch events from database
          const { data: events, error } = await supabase
            .from('events')
            .select('id, name, date')
            .order('name');
            
          if (error) throw error;
          data = events;
        } 
        else if (type === 'item') {
          // Fetch items from database
          const { data: items, error } = await supabase
            .from('items')
            .select('id, name, description')
            .order('name');
            
          if (error) throw error;
          data = items;
        }
        
        setAvailableEntities(data || []);
        
        // If editing, get existing members
        if (isEditMode && group?.id) {
          let membersData = [];
          
          if (type === 'customer') {
            const { data: members, error } = await supabase
              .from('customer_group_members')
              .select('customer_id')
              .eq('group_id', group.id);
              
            if (error) throw error;
            membersData = members?.map(m => m.customer_id) || [];
          } 
          else if (type === 'event') {
            const { data: members, error } = await supabase
              .from('event_group_members')
              .select('event_id')
              .eq('group_id', group.id);
              
            if (error) throw error;
            membersData = members?.map(m => m.event_id) || [];
          } 
          else if (type === 'item') {
            const { data: members, error } = await supabase
              .from('item_group_members')
              .select('item_id')
              .eq('group_id', group.id);
              
            if (error) throw error;
            membersData = members?.map(m => m.item_id) || [];
          }
          
          setSelectedEntityIds(membersData);
        }
      } catch (err) {
        console.error(`Error fetching available ${type}s:`, err);
      } finally {
        setIsLoadingEntities(false);
      }
    };
    
    fetchEntities();
  }, [type, group?.id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle entity selection
  const handleEntitySelection = (entityId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedEntityIds(prev => [...prev, entityId]);
    } else {
      setSelectedEntityIds(prev => prev.filter(id => id !== entityId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.name) {
      setError('Group name is required.');
      setIsSubmitting(false);
      return;
    }
    
    if (selectedEntityIds.length === 0) {
      setError(`Please select at least one ${type} for this group.`);
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      
      if (isEditMode && group?.id) {
        // Update existing group based on type
        if (type === 'customer') {
          // 1. Update the group information
          const { error } = await supabase
            .from('customer_groups')
            .update({
              name: formData.name,
              description: formData.description,
              updated_at: new Date().toISOString()
            })
            .eq('id', group.id);
          
          if (error) throw error;
          
          // 2. Delete existing members
          const { error: deleteError } = await supabase
            .from('customer_group_members')
            .delete()
            .eq('group_id', group.id);
          
          if (deleteError) throw deleteError;
          
          // 3. Add new members
          const memberRecords = selectedEntityIds.map(customerId => ({
            group_id: group.id,
            customer_id: customerId
          }));
          
          const { error: insertError } = await supabase
            .from('customer_group_members')
            .insert(memberRecords);
          
          if (insertError) throw insertError;
        } 
        else if (type === 'event') {
          // 1. Update the group information
          const { error } = await supabase
            .from('event_groups')
            .update({
              name: formData.name,
              description: formData.description,
              updated_at: new Date().toISOString()
            })
            .eq('id', group.id);
          
          if (error) throw error;
          
          // 2. Delete existing members
          const { error: deleteError } = await supabase
            .from('event_group_members')
            .delete()
            .eq('group_id', group.id);
          
          if (deleteError) throw deleteError;
          
          // 3. Add new members
          const memberRecords = selectedEntityIds.map(eventId => ({
            group_id: group.id,
            event_id: eventId
          }));
          
          const { error: insertError } = await supabase
            .from('event_group_members')
            .insert(memberRecords);
          
          if (insertError) throw insertError;
        } 
        else if (type === 'item') {
          // 1. Update the group information
          const { error } = await supabase
            .from('item_groups')
            .update({
              name: formData.name,
              description: formData.description,
              updated_at: new Date().toISOString()
            })
            .eq('id', group.id);
          
          if (error) throw error;
          
          // 2. Delete existing members
          const { error: deleteError } = await supabase
            .from('item_group_members')
            .delete()
            .eq('group_id', group.id);
          
          if (deleteError) throw deleteError;
          
          // 3. Add new members
          const memberRecords = selectedEntityIds.map(itemId => ({
            group_id: group.id,
            item_id: itemId
          }));
          
          const { error: insertError } = await supabase
            .from('item_group_members')
            .insert(memberRecords);
          
          if (insertError) throw insertError;
        }
      } else {
        // Create new group based on type
        if (type === 'customer') {
          // 1. Create the new group
          const { data: newGroup, error } = await supabase
            .from('customer_groups')
            .insert({
              name: formData.name,
              description: formData.description,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (error) throw error;
          
          // 2. Add members
          const memberRecords = selectedEntityIds.map(customerId => ({
            group_id: newGroup.id,
            customer_id: customerId
          }));
          
          const { error: insertError } = await supabase
            .from('customer_group_members')
            .insert(memberRecords);
          
          if (insertError) throw insertError;
        } 
        else if (type === 'event') {
          // 1. Create the new group
          const { data: newGroup, error } = await supabase
            .from('event_groups')
            .insert({
              name: formData.name,
              description: formData.description,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (error) throw error;
          
          // 2. Add members
          const memberRecords = selectedEntityIds.map(eventId => ({
            group_id: newGroup.id,
            event_id: eventId
          }));
          
          const { error: insertError } = await supabase
            .from('event_group_members')
            .insert(memberRecords);
          
          if (insertError) throw insertError;
        } 
        else if (type === 'item') {
          // 1. Create the new group
          const { data: newGroup, error } = await supabase
            .from('item_groups')
            .insert({
              name: formData.name,
              description: formData.description,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (error) throw error;
          
          // 2. Add members
          const memberRecords = selectedEntityIds.map(itemId => ({
            group_id: newGroup.id,
            item_id: itemId
          }));
          
          const { error: insertError } = await supabase
            .from('item_group_members')
            .insert(memberRecords);
          
          if (insertError) throw insertError;
        }
      }
      onSave();
    } catch (err: any) {
      console.error('Failed to save group:', err);
      if (err.code === '23505') {  // Postgres unique violation
        setError('A group with this name already exists.');
      } else {
        setError(err.message || 'An error occurred while saving the group.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={formStyles.form}>
      <h2 className={formStyles.formTitle}>
        {isEditMode ? `Edit ${type} Group` : `Add New ${type} Group`}
      </h2>
      
      {error && <div className={formStyles.errorMessage}>{error}</div>}
      
      <div className={formStyles.formGroup}>
        <label htmlFor="name" className={formStyles.label}>Group Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={formStyles.input}
          placeholder="e.g., Sales, Accounting, VIP Customers"
        />
      </div>

      <div className={formStyles.formGroup}>
        <label htmlFor="description" className={formStyles.label}>Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          className={formStyles.textarea}
          placeholder="Optional description of this group"
        />
      </div>

      <div className={formStyles.formGroup}>
        <label className={formStyles.label}>
          {type === 'customer' ? 'Select Customers' : 
           type === 'event' ? 'Select Events' : 'Select Items'}
           <span className="text-red-500 ml-1">*</span>
        </label>
        
        {isLoadingEntities ? (
          <div className="py-4 text-center">Loading {type}s...</div>
        ) : availableEntities.length === 0 ? (
          <div className="py-4 text-center border rounded bg-gray-50">
            No {type}s found. Please add some {type}s first.
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto border rounded p-2">
            {availableEntities.map(entity => (
              <div key={entity.id} className="flex items-center p-2 hover:bg-gray-100 rounded">
                <input
                  type="checkbox"
                  id={`entity-${entity.id}`}
                  checked={selectedEntityIds.includes(entity.id)}
                  onChange={(e) => handleEntitySelection(entity.id, e.target.checked)}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor={`entity-${entity.id}`} className="flex-grow cursor-pointer">
                  <span className="font-medium">{entity.name}</span>
                  {entity.email && <span className="ml-2 text-gray-500 text-sm">{entity.email}</span>}
                </label>
              </div>
            ))}
          </div>
        )}
        <div className="mt-1 text-sm text-gray-600">
          Selected: {selectedEntityIds.length} {type}{selectedEntityIds.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className={formStyles.formActions}>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`${buttonStyles.button} ${buttonStyles.primary}`}
        >
          {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Group' : 'Create Group')}
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          disabled={isSubmitting}
          className={`${buttonStyles.button} ${buttonStyles.secondary}`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
