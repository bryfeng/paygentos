'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Policy, PolicyAPI } from '@/api/policy/policy-api';
import styles from '@/styles/modules/Policies.module.css'; // Create this CSS module
import buttonStyles from '@/styles/components/Button.module.css';
import { FiPlus } from 'react-icons/fi';

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedPolicies = await PolicyAPI.getPolicies(); // Add filtering if needed
        setPolicies(fetchedPolicies);
      } catch (err) {
        console.error('Failed to fetch policies:', err);
        setError('Failed to load policies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  return (
    <div className={styles.policiesContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Policies</h1>
        <Link href="/policies/new" className={`${buttonStyles.button} ${buttonStyles.primary}`}>
           <FiPlus className="mr-2" /> Create New Policy
        </Link>
      </div>

      {isLoading && <p>Loading policies...</p>}
      {error && <p className={styles.errorText}>{error}</p>}

      {!isLoading && !error && policies.length === 0 && (
        <p>No policies found.</p>
      )}

      {!isLoading && !error && policies.length > 0 && (
        <ul className={styles.policyList}>
          {policies.map((policy) => (
            <li key={policy.id} className={styles.policyListItem}>
              <Link href={`/policies/${policy.id}`} className={styles.policyLink}>
                <div className={styles.policyInfo}>
                    <h2 className={styles.policyName}>{policy.name}</h2>
                    <p className={styles.policyDescription}>{policy.description || 'No description'}</p>
                </div>
                <span className={styles.policyStatus}>{policy.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
