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
  name: string;
  description?: string;
  budget_amount: number;
  budget_interval: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'one_time';
  budget_start_date?: string;
  budget_end_date?: string;
  status: 'active' | 'inactive' | 'draft';
  allowed_payment_types: string[];
  require_approval: boolean;
  approval_threshold?: number;
  itemGroups: string[];
  customerGroups: string[];
  eventGroups: string[];
  paymentMethods: string[];
  vendors: string[];
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
  const [formData, setFormData] = useState<Partial<Policy>>({
    name: '',
    description: '',
    content: '', // Initialize as empty string, handle JSON later if needed
    status: 'draft',
    version: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!existingPolicy;

  useEffect(() => {
    if (isEditMode && existingPolicy) {
        // Pre-fill form if editing
        setFormData({
            name: existingPolicy.name,
            description: existingPolicy.description || '',
            // Handle content loading: If JSONB, stringify; if TEXT, use directly
            content: typeof existingPolicy.content === 'object' ? JSON.stringify(existingPolicy.content, null, 2) : (existingPolicy.content || ''),
            status: existingPolicy.status || 'draft',
            version: existingPolicy.version || 1,
        });
    }
  }, [isEditMode, existingPolicy]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'version' ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.name) {
        setError('Policy name is required.');
        setIsSubmitting(false);
        return;
    }
    
    let processedContent: any = {};
    try {
        // Attempt to parse content if it looks like JSON, otherwise treat as text
        processedContent = formData.content ? JSON.parse(formData.content) : {};
    } catch (parseError) {
        // If parsing fails, assume it's plain text or invalid JSON
        console.warn('Content is not valid JSON, saving as text or default object.');
        processedContent = formData.content || {}; // Save as text or empty object if needed
        // Depending on DB schema (JSONB vs TEXT), adjust how you save non-JSON
        // If your DB column is TEXT, you might just save formData.content directly.
        // If JSONB, you might wrap it: { "text_content": formData.content }
    }

    const policyPayload = {
      name: formData.name!,
      description: formData.description,
      content: processedContent,
      status: formData.status,
      version: formData.version,
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
        <label htmlFor="name" className={styles.label}>Policy Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

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
        <label htmlFor="content" className={styles.label}>Content (JSON or Text)</label>
        <textarea
          id="content"
          name="content"
          value={formData.content as string} // Cast to string for textarea
          onChange={handleChange}
          rows={10}
          className={styles.textarea} // Style as code if desired
          placeholder='Enter policy content here (e.g., JSON format: { "key": "value" })'
        />
      </div>

      <div className={styles.formRow}> // Use formRow for side-by-side elements
          <div className={styles.formGroup} style={{ marginRight: '1rem' }}>
            <label htmlFor="version" className={styles.label}>Version</label>
            <input
              type="number"
              id="version"
              name="version"
              value={formData.version}
              onChange={handleChange}
              min="1"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.label}>Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
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
