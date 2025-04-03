'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SpendingPolicyAPI, SpendingPolicy } from '@/api/spending-policy/spending-policy-api';
import SpendingPolicyForm from '@/components/policy/SpendingPolicyForm';
import styles from '@/styles/modules/Policies.module.css';
import buttonStyles from '@/styles/components/Button.module.css';

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [policy, setPolicy] = useState<SpendingPolicy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // To toggle form view

  useEffect(() => {
    if (!id) return;

    const fetchPolicy = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedPolicy = await SpendingPolicyAPI.getPolicy(id);
        setPolicy(fetchedPolicy);
      } catch (err: any) {
        console.error('Failed to fetch policy:', err);
        setError(err.response?.data?.error || 'Failed to load policy details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicy();
  }, [id]);

  const handleDelete = async () => {
    if (!policy || !policy.id) return;
    if (window.confirm(`Are you sure you want to delete the policy "${policy.description}"?`)) {
        try {
            await SpendingPolicyAPI.deletePolicy(policy.id);
            router.push('/policies'); // Redirect to list after delete
        } catch (err) {
            console.error('Failed to delete policy:', err);
            alert('Failed to delete policy. Please try again.');
        }
    }
  };
  
  const handleSubmit = async (updatedPolicy: SpendingPolicy) => {
    if (!policy?.id) return;
    try {
      await SpendingPolicyAPI.updatePolicy(policy.id, updatedPolicy);
      setIsEditing(false);
      // Refresh the policy data
      const refreshedPolicy = await SpendingPolicyAPI.getPolicy(policy.id);
      setPolicy(refreshedPolicy);
    } catch (err) {
      console.error('Failed to update policy:', err);
      alert('Failed to update policy. Please try again.');
    }
  };

  if (isLoading) return <p>Loading policy details...</p>;
  if (error) return <p className={styles.errorText}>{error}</p>;
  if (!policy) return <p>Policy not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      {isEditing ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Spending Policy</h1>
          <p className="text-gray-600 mb-6">
            Update this spending policy to adjust who can spend what, where, and how much.
            These policies provide spending frameworks for controlling budget allocation.
          </p>
          
          <SpendingPolicyForm 
            existingPolicy={policy as SpendingPolicy} 
            onSubmit={handleSubmit}
            onCancel={() => setIsEditing(false)} 
            isEditMode={true}
          />
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Policy Details</h1>
            <div className="space-x-2">
              <button 
                onClick={() => setIsEditing(true)} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Edit Policy
              </button>
              <button 
                onClick={handleDelete} 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete Policy
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h2 className="text-lg font-semibold">Basic Information</h2>
              <p><strong>Description:</strong> {policy.description || 'N/A'}</p>
              <p><strong>Status:</strong> {policy.status}</p>
              <p><strong>Action:</strong> {policy.action || 'Allow'}</p>
            </div>
            
            <div className="border-b pb-2">
              <h2 className="text-lg font-semibold">Budget Details</h2>
              <p><strong>Amount:</strong> ${policy.budget_amount}</p>
              <p><strong>Interval:</strong> {policy.budget_interval}</p>
              <p><strong>Period:</strong> {policy.budget_start_date || 'N/A'} to {policy.budget_end_date || 'N/A'}</p>
            </div>
            
            <div className="border-b pb-2">
              <h2 className="text-lg font-semibold">Approval Settings</h2>
              <p><strong>Requires Approval:</strong> {policy.require_approval ? 'Yes' : 'No'}</p>
              {policy.require_approval && policy.approval_threshold && (
                <p><strong>Approval Threshold:</strong> ${policy.approval_threshold}</p>
              )}
            </div>
            
            <div className="border-b pb-2">
              <h2 className="text-lg font-semibold">Applied To</h2>
              <p><strong>Item Groups:</strong> {policy.item_groups.length} selected</p>
              <p><strong>Customer Groups:</strong> {policy.customer_groups.length} selected</p>
              <p><strong>Event Groups:</strong> {policy.event_groups.length} selected</p>
              <p><strong>Payment Methods:</strong> {policy.payment_methods.length} selected</p>
              <p><strong>Vendors:</strong> {policy.vendors.length} selected</p>
            </div>
            
            <p className="text-sm text-gray-500">Last Updated: {new Date(policy.updated_at!).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
