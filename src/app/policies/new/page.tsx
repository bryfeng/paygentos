'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SpendingPolicyForm from '@/components/policy/SpendingPolicyForm';
import { SpendingPolicy, SpendingPolicyAPI } from '@/api/spending-policy/spending-policy-api';
import styles from '@/styles/modules/Policies.module.css';

export default function NewSpendingPolicyPage() {
  const router = useRouter();
  
  const handleSubmit = async (policy: SpendingPolicy) => {
    // Submit the policy data to the API
    await SpendingPolicyAPI.createPolicy(policy);
  };
  
  const handleCancel = () => {
    router.push('/policies');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Spending Policy</h1>
        <p className="text-gray-600 mb-6">
          Use this form to create a spending policy that defines who can spend what, where, and how much.
          These policies provide spending frameworks for controlling budget allocation.
        </p>
        
        <SpendingPolicyForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel} 
        />
      </div>
    </div>
  );
}
