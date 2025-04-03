'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/components/Form.module.css';
import buttonStyles from '@/styles/components/Button.module.css';
import { WalletAPI } from '@/api/wallet/wallet-api';
import { createClient } from '@/utils/supabase';

// Define types for our spending policy data structure
interface SpendingPolicy {
  id?: string;
  name: string;
  description: string;
  budget_amount: number;
  budget_interval: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'one_time';
  budget_start_date: string;
  budget_end_date: string;
  status: 'active' | 'inactive' | 'draft';
  allowed_payment_types: string[];
  require_approval: boolean;
  approval_threshold?: number;
  item_groups: string[];  // IDs of item groups
  customer_groups: string[]; // IDs of customer groups
  event_groups: string[]; // IDs of event groups
  payment_methods: string[]; // IDs of payment methods
  vendors: string[]; // IDs of vendors
}

// Types for our select options
interface SelectOption {
  id: string;
  name: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  details?: any;
}

interface FormProps {
  existingPolicy?: SpendingPolicy;
  onSubmit: (policy: SpendingPolicy) => Promise<void>;
  onCancel?: () => void;
}

// Available payment types
const PAYMENT_TYPES = [
  { id: 'credit', name: 'Credit Card' },
  { id: 'debit', name: 'Debit Card' },
  { id: 'bank_transfer', name: 'Bank Transfer' },
  { id: 'digital_wallet', name: 'Digital Wallet' },
  { id: 'corporate_card', name: 'Corporate Card' },
  { id: 'cash', name: 'Cash' },
];

export default function SpendingPolicyForm({ existingPolicy, onSubmit, onCancel }: FormProps) {
  const router = useRouter();
  const isEditMode = !!existingPolicy;
  
  // Initialize form state
  const [policy, setPolicy] = useState<SpendingPolicy>({
    name: '',
    description: '',
    budget_amount: 1000,
    budget_interval: 'monthly',
    budget_start_date: new Date().toISOString().split('T')[0],
    budget_end_date: new Date(new Date().setMonth(new Date().getMonth() + 12)).toISOString().split('T')[0],
    status: 'draft',
    allowed_payment_types: ['credit', 'debit'],
    require_approval: true,
    approval_threshold: 500,
    item_groups: [],
    customer_groups: [],
    event_groups: [],
    payment_methods: [],
    vendors: []
  });
  
  // Available options states
  const [itemGroups, setItemGroups] = useState<SelectOption[]>([]);
  const [customerGroups, setCustomerGroups] = useState<SelectOption[]>([]);
  const [eventGroups, setEventGroups] = useState<SelectOption[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [vendors, setVendors] = useState<SelectOption[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load existing policy if in edit mode
  useEffect(() => {
    if (isEditMode && existingPolicy) {
      setPolicy(existingPolicy);
    }
  }, [isEditMode, existingPolicy]);
  
  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();

        // Fetch actual payment methods from the database
        const methods = await WalletAPI.getAllPaymentMethods();
        setPaymentMethods(methods);
        
        // Fetch item groups from database
        const { data: itemGroupsData, error: itemGroupsError } = await supabase
          .from('item_groups')
          .select('id, name')
          .order('name');
        
        if (itemGroupsError) throw itemGroupsError;
        setItemGroups(itemGroupsData || []);
        
        // Fetch customer groups from database
        const { data: customerGroupsData, error: customerGroupsError } = await supabase
          .from('customer_groups')
          .select('id, name')
          .order('name');
        
        if (customerGroupsError) throw customerGroupsError;
        setCustomerGroups(customerGroupsData || []);
        
        // Fetch event groups from database
        const { data: eventGroupsData, error: eventGroupsError } = await supabase
          .from('event_groups')
          .select('id, name')
          .order('name');
        
        if (eventGroupsError) throw eventGroupsError;
        setEventGroups(eventGroupsData || []);
        
        // Fetch vendors from database
        const { data: vendorsData, error: vendorsError } = await supabase
          .from('vendors')
          .select('id, name')
          .order('name');
        
        if (vendorsError) throw vendorsError;
        setVendors(vendorsData || []);
        
        // If no data exists, provide empty arrays with informative messages in the UI
        if (!itemGroupsData?.length) {
          console.log('No item groups found in the database');
        }
        if (!customerGroupsData?.length) {
          console.log('No customer groups found in the database');
        }
        if (!eventGroupsData?.length) {
          console.log('No event groups found in the database');
        }
        if (!vendorsData?.length) {
          console.log('No vendors found in the database');
        }
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('Failed to load required data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle text/number input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPolicy((prev) => ({
      ...prev,
      [name]: name === 'budget_amount' || name === 'approval_threshold' 
        ? parseFloat(value) || 0 
        : value
    }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPolicy((prev) => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle multi-select changes (checkboxes for arrays)
  const handleMultiSelectChange = (field: keyof SpendingPolicy, itemId: string, checked: boolean) => {
    setPolicy((prev) => {
      const currentItems = prev[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentItems, itemId] };
      } else {
        return { ...prev, [field]: currentItems.filter(id => id !== itemId) };
      }
    });
  };
  
  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validation
      if (!policy.name) {
        throw new Error('Policy name is required');
      }
      
      if (policy.budget_amount <= 0) {
        throw new Error('Budget amount must be greater than zero');
      }
      
      if (new Date(policy.budget_end_date) <= new Date(policy.budget_start_date)) {
        throw new Error('End date must be after start date');
      }
      
      if (policy.require_approval && (!policy.approval_threshold || policy.approval_threshold <= 0)) {
        throw new Error('Approval threshold must be set when approval is required');
      }
      
      // Check if at least one group is selected
      if (
        policy.item_groups.length === 0 && 
        policy.customer_groups.length === 0 && 
        policy.event_groups.length === 0
      ) {
        throw new Error('At least one group (item, customer, or event) must be selected');
      }
      
      // Check if at least one payment method is selected
      if (policy.payment_methods.length === 0) {
        throw new Error('At least one payment method must be selected');
      }
      
      // Check if at least one vendor is selected
      if (policy.vendors.length === 0) {
        throw new Error('At least one vendor must be selected');
      }
      
      // Submit the policy data
      await onSubmit(policy);
      
      // Redirect or show success message
      router.push('/policies');
    } catch (err: any) {
      console.error('Error submitting policy:', err);
      setError(err.message || 'An error occurred while saving the policy');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <h2 className="text-xl font-bold mb-6">
        {isEditMode ? 'Edit Spending Policy' : 'Create New Spending Policy'}
      </h2>
      
      {/* Basic Information Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Policy Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={policy.name}
            onChange={handleInputChange}
            required
            className={styles.input}
            placeholder="Enter policy name"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Description</label>
          <textarea
            id="description"
            name="description"
            value={policy.description}
            onChange={handleInputChange}
            rows={3}
            className={styles.textarea}
            placeholder="Describe the purpose and scope of this policy"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="status" className={styles.label}>Status</label>
          <select
            id="status"
            name="status"
            value={policy.status}
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      {/* Budget Configuration Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Budget Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={styles.formGroup}>
            <label htmlFor="budget_amount" className={styles.label}>Budget Amount *</label>
            <input
              type="number"
              id="budget_amount"
              name="budget_amount"
              value={policy.budget_amount}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="budget_interval" className={styles.label}>Budget Interval *</label>
            <select
              id="budget_interval"
              name="budget_interval"
              value={policy.budget_interval}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
              <option value="one_time">One-time</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={styles.formGroup}>
            <label htmlFor="budget_start_date" className={styles.label}>Start Date *</label>
            <input
              type="date"
              id="budget_start_date"
              name="budget_start_date"
              value={policy.budget_start_date}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="budget_end_date" className={styles.label}>End Date *</label>
            <input
              type="date"
              id="budget_end_date"
              name="budget_end_date"
              value={policy.budget_end_date}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
        </div>
      </div>
      
      {/* Approval Settings Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Approval Settings</h3>
        
        <div className={styles.formGroup}>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="require_approval"
              name="require_approval"
              checked={policy.require_approval}
              onChange={handleCheckboxChange}
              className="h-4 w-4 mr-2"
            />
            <label htmlFor="require_approval" className={styles.label}>
              Require approval for transactions
            </label>
          </div>
        </div>
        
        {policy.require_approval && (
          <div className={styles.formGroup}>
            <label htmlFor="approval_threshold" className={styles.label}>
              Approval Threshold *
            </label>
            <input
              type="number"
              id="approval_threshold"
              name="approval_threshold"
              value={policy.approval_threshold || 0}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required={policy.require_approval}
              className={styles.input}
              placeholder="Amount above which approval is required"
            />
          </div>
        )}
      </div>
      
      {/* Payment Methods & Types Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Payment Methods & Types</h3>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Allowed Payment Types *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {PAYMENT_TYPES.map(type => (
              <div key={type.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`payment_type_${type.id}`}
                  checked={policy.allowed_payment_types.includes(type.id)}
                  onChange={(e) => handleMultiSelectChange('allowed_payment_types', type.id, e.target.checked)}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor={`payment_type_${type.id}`}>{type.name}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Available Payment Methods *</label>
          <div className="max-h-60 overflow-y-auto p-2 border rounded">
            {paymentMethods.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No payment methods found. <br />
                <a href="/payment-methods/new" className="text-blue-600 hover:underline">Create payment methods</a> first.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {paymentMethods.map(method => (
                  <div key={method.id} className="flex items-center p-2 hover:bg-gray-100 rounded">
                    <input
                      type="checkbox"
                      id={`payment_method_${method.id}`}
                      checked={policy.payment_methods.includes(method.id)}
                      onChange={(e) => handleMultiSelectChange('payment_methods', method.id, e.target.checked)}
                      className="h-4 w-4 mr-2"
                    />
                    <label htmlFor={`payment_method_${method.id}`} className="flex-grow">
                      {method.name} ({method.type})
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {policy.payment_methods.length} selected
            {paymentMethods.length > 0 && ` of ${paymentMethods.length}`}
          </p>
        </div>
      </div>
      
      {/* Groups Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Group Assignments</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select which groups this policy applies to. At least one group must be selected.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Item Groups */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Item Groups</label>
            <div className="max-h-60 overflow-y-auto p-2 border rounded">
              {itemGroups.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No item groups found. <br />
                  <a href="/groups" className="text-blue-600 hover:underline">Create item groups</a> first.
                </div>
              ) : (
                itemGroups.map(group => (
                  <div key={group.id} className="flex items-center p-2 hover:bg-gray-100 rounded">
                    <input
                      type="checkbox"
                      id={`item_group_${group.id}`}
                      checked={policy.item_groups.includes(group.id)}
                      onChange={(e) => handleMultiSelectChange('item_groups', group.id, e.target.checked)}
                      className="h-4 w-4 mr-2"
                    />
                    <label htmlFor={`item_group_${group.id}`}>{group.name}</label>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {policy.item_groups.length} selected
              {itemGroups.length > 0 && ` of ${itemGroups.length}`}
            </p>
          </div>
          
          {/* Customer Groups */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Customer Groups</label>
            <div className="max-h-60 overflow-y-auto p-2 border rounded">
              {customerGroups.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No customer groups found. <br />
                  <a href="/groups" className="text-blue-600 hover:underline">Create customer groups</a> first.
                </div>
              ) : (
                customerGroups.map(group => (
                  <div key={group.id} className="flex items-center p-2 hover:bg-gray-100 rounded">
                    <input
                      type="checkbox"
                      id={`customer_group_${group.id}`}
                      checked={policy.customer_groups.includes(group.id)}
                      onChange={(e) => handleMultiSelectChange('customer_groups', group.id, e.target.checked)}
                      className="h-4 w-4 mr-2"
                    />
                    <label htmlFor={`customer_group_${group.id}`}>{group.name}</label>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {policy.customer_groups.length} selected
              {customerGroups.length > 0 && ` of ${customerGroups.length}`}
            </p>
          </div>
          
          {/* Event Groups */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Event Groups</label>
            <div className="max-h-60 overflow-y-auto p-2 border rounded">
              {eventGroups.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No event groups found. <br />
                  <a href="/groups" className="text-blue-600 hover:underline">Create event groups</a> first.
                </div>
              ) : (
                eventGroups.map(group => (
                  <div key={group.id} className="flex items-center p-2 hover:bg-gray-100 rounded">
                    <input
                      type="checkbox"
                      id={`event_group_${group.id}`}
                      checked={policy.event_groups.includes(group.id)}
                      onChange={(e) => handleMultiSelectChange('event_groups', group.id, e.target.checked)}
                      className="h-4 w-4 mr-2"
                    />
                    <label htmlFor={`event_group_${group.id}`}>{group.name}</label>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {policy.event_groups.length} selected
              {eventGroups.length > 0 && ` of ${eventGroups.length}`}
            </p>
          </div>
        </div>
      </div>
      
      {/* Vendors Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Allowed Vendors</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select vendors that can be used with this policy. At least one vendor must be selected.
        </p>
        
        <div className={styles.formGroup}>
          <div className="max-h-60 overflow-y-auto p-2 border rounded">
            {vendors.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No vendors found. <br />
                <a href="/vendors" className="text-blue-600 hover:underline">Create vendors</a> first.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {vendors.map(vendor => (
                  <div key={vendor.id} className="flex items-center p-2 hover:bg-gray-100 rounded">
                    <input
                      type="checkbox"
                      id={`vendor_${vendor.id}`}
                      checked={policy.vendors.includes(vendor.id)}
                      onChange={(e) => handleMultiSelectChange('vendors', vendor.id, e.target.checked)}
                      className="h-4 w-4 mr-2"
                    />
                    <label htmlFor={`vendor_${vendor.id}`}>{vendor.name}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {policy.vendors.length} selected
            {vendors.length > 0 && ` of ${vendors.length}`}
          </p>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-4 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`${buttonStyles.button} ${buttonStyles.secondary}`}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          className={`${buttonStyles.button} ${buttonStyles.primary}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Policy' : 'Create Policy'}
        </button>
      </div>
    </form>
  );
}
