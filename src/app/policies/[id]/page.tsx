'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Policy, PolicyAPI } from '@/api/policy/policy-api';
import PolicyForm from '@/components/policy/PolicyForm';
import styles from '@/styles/modules/Policies.module.css';
import buttonStyles from '@/styles/components/Button.module.css';

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [policy, setPolicy] = useState<Policy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // To toggle form view

  useEffect(() => {
    if (!id) return;

    const fetchPolicy = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedPolicy = await PolicyAPI.getPolicy(id);
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
    if (window.confirm(`Are you sure you want to delete the policy "${policy.name}"?`)) {
        try {
            await PolicyAPI.deletePolicy(policy.id);
            router.push('/policies'); // Redirect to list after delete
        } catch (err) {
            console.error('Failed to delete policy:', err);
            alert('Failed to delete policy. Please try again.');
        }
    }
  };

  if (isLoading) return <p>Loading policy details...</p>;
  if (error) return <p className={styles.errorText}>{error}</p>;
  if (!policy) return <p>Policy not found.</p>;

  return (
    <div className={styles.policyDetailContainer}>
      {isEditing ? (
        <div className={styles.formContainer}>
            <h1 className={styles.title}>Edit Policy: {policy.name}</h1>
            <PolicyForm existingPolicy={policy} onCancel={() => setIsEditing(false)} />
        </div>
      ) : (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>{policy.name}</h1>
                <div className={styles.actionButtons}>
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className={`${buttonStyles.button} ${buttonStyles.secondary}`}
                    >
                        Edit Policy
                    </button>
                    <button 
                        onClick={handleDelete} 
                        className={`${buttonStyles.button} ${buttonStyles.danger}`}
                    >
                        Delete Policy
                    </button>
                </div>
            </div>
          <p><strong>Description:</strong> {policy.description || 'N/A'}</p>
          <p><strong>Status:</strong> {policy.status}</p>
          <p><strong>Version:</strong> {policy.version}</p>
          {/* Display policy content - needs formatting based on JSON or Text */}
          <div className={styles.contentSection}>
            <h3>Policy Content:</h3>
            <pre>{JSON.stringify(policy.content, null, 2)}</pre> 
            {/* Adjust how content is displayed based on its structure */}
          </div>
          <p><small>Last Updated: {new Date(policy.updated_at!).toLocaleString()}</small></p>
        </div>
      )}
    </div>
  );
}
