'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Policy, PolicyAPI } from '@/api/policy/policy-api';
import { WalletAPI } from '@/api/wallet/wallet-api';
import styles from '@/styles/components/Form.module.css';
import buttonStyles from '@/styles/components/Button.module.css';

// Define the types for our policy data
interface SpendingPolicy {
  id?: string;
  priority?: number;
  description?: string;
  conditions: Record<string, any>;
  actions: Record<string, any>;
  is_active: boolean;
  applies_to?: string;
  group_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface Group {
  id: string;
  name: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
}

interface Vendor {
  id: string;
  name: string;
}

interface PolicyFormProps {
  existingPolicy?: SpendingPolicy | null;
  onCancel?: () => void;
}

export default function PolicyForm({ existingPolicy = null, onCancel }: PolicyFormProps) {
  const router = useRouter();
  // Define a form-specific interface to handle string representations of JSON fields
  interface PolicyFormData {
    priority?: number;
    description?: string;
    conditionsStr: string; // String representation for the form
    actionsStr: string;   // String representation for the form
    is_active: boolean;
    applies_to?: string;
    group_id?: string;
  }

  const [formData, setFormData] = useState<PolicyFormData>({
    description: '',
    conditionsStr: '{}',
    actionsStr: '{}',
    is_active: true,
    applies_to: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!existingPolicy;

  useEffect(() => {
    if (isEditMode && existingPolicy) {
        // Pre-fill form if editing
        setFormData({
            priority: existingPolicy.priority,
            description: existingPolicy.description || '',
            conditionsStr: typeof existingPolicy.conditions === 'object' ? JSON.stringify(existingPolicy.conditions, null, 2) : '{}',
            actionsStr: typeof existingPolicy.actions === 'object' ? JSON.stringify(existingPolicy.actions, null, 2) : '{}',
            is_active: existingPolicy.is_active,
            applies_to: existingPolicy.applies_to || '',
            group_id: existingPolicy.group_id,
        });
    }
  }, [isEditMode, existingPolicy]);
  
  // Find the highest existing priority to place new policies at the end
  const [maxPriority, setMaxPriority] = useState(100);
  
  useEffect(() => {
    // Fetch existing policies to determine max priority
    if (!isEditMode) {
      const fetchMaxPriority = async () => {
        try {
          const policies = await PolicyAPI.getPolicies();
          if (policies.length > 0) {
            const highestPriority = Math.max(...policies.map(p => p.priority || 0));
            setMaxPriority(highestPriority + 10); // Add 10 to place at end with room between policies
          }
        } catch (err) {
          console.error('Failed to fetch policies for priority:', err);
          // Default to 100 if fetch fails
        }
      };
      fetchMaxPriority();
    }
  }, [isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'priority' ? parseInt(value, 10) || maxPriority : 
              name === 'is_active' ? value === 'true' : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Parse conditions and actions JSON
    let parsedConditions = {};
    let parsedActions = {};
    try {
        // Attempt to parse conditions JSON
        parsedConditions = JSON.parse(formData.conditionsStr);
    } catch (parseError) {
        setError('Conditions must be valid JSON');
        setIsSubmitting(false);
        return;
    }
    
    try {
        // Attempt to parse actions JSON
        parsedActions = JSON.parse(formData.actionsStr);
    } catch (parseError) {
        setError('Actions must be valid JSON');
        setIsSubmitting(false);
        return;
    }

    const policyPayload = {
      priority: isEditMode ? formData.priority : maxPriority,
      description: formData.description,
      conditions: parsedConditions,
      actions: parsedActions,
      is_active: formData.is_active === undefined ? true : formData.is_active,
      applies_to: formData.applies_to,
      group_id: formData.group_id,
    };

    try {
      if (isEditMode && existingPolicy?.id) {
        // Update existing policy
        await PolicyAPI.updatePolicy(existingPolicy.id, policyPayload);
        // Optionally redirect or show success message
        if (onCancel) onCancel(); // Close edit form
        else router.push(`/policies/${existingPolicy.id}`); // Or stay on page
         router.refresh(); // Refresh data on the detail page
      } else {
        // Create new policy
        const newPolicy = await PolicyAPI.createPolicy(policyPayload);
        router.push(`/policies`); // Redirect to policy list page
        // router.push(`/policies/${newPolicy.id}`); // Or redirect to the new policy's detail page
      }
    } catch (err: any) {
      console.error('Failed to save policy:', err);
      setError(err.response?.data?.error || 'An error occurred while saving the policy.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.errorBanner}>{error}</div>}
      


      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={styles.textarea}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="conditionsStr" className={styles.label}>Conditions (JSON)</label>
        <textarea
          id="conditionsStr"
          name="conditionsStr"
          value={formData.conditionsStr}
          onChange={handleChange}
          rows={8}
          className={styles.textarea}
          placeholder='{"amount": {"greaterThan": 1000}, "category": "travel"}'
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="actionsStr" className={styles.label}>Actions (JSON)</label>
        <textarea
          id="actionsStr"
          name="actionsStr"
          value={formData.actionsStr}
          onChange={handleChange}
          rows={8}
          className={styles.textarea}
          placeholder='{"requireApproval": true, "approvalLevel": "manager"}'
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="applies_to" className={styles.label}>Applies To</label>
        <input
          type="text"
          id="applies_to"
          name="applies_to"
          value={formData.applies_to as string}
          onChange={handleChange}
          className={styles.input}
          placeholder="expenses, travel, etc."
        />
      </div>

      <div className={styles.formRow}>
          {isEditMode && (
            <div className={styles.formGroup} style={{ marginRight: '1rem' }}>
              <label htmlFor="priority" className={styles.label}>Priority (Lower numbers execute first)</label>
              <input
                type="number"
                id="priority"
                name="priority"
                value={formData.priority || maxPriority}
                onChange={handleChange}
                min="1"
                className={styles.input}
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="is_active" className={styles.label}>Status</label>
            <select
              id="is_active"
              name="is_active"
              value={formData.is_active === true ? 'true' : 'false'}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
      </div>

      <div className={styles.formActions}>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`${buttonStyles.button} ${buttonStyles.primary}`}
        >
          {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Policy')}
        </button>
        {isEditMode && onCancel && (
             <button 
                type="button" 
                onClick={onCancel}
                className={`${buttonStyles.button} ${buttonStyles.secondary}`}
            >
                Cancel
            </button>
        )}
      </div>
    </form>
  );
}
