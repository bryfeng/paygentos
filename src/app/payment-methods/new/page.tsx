"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import PaymentMethodForm from '@/components/payment/PaymentMethodForm';
import { WalletAPI } from '@/api/wallet/wallet-api';

export default function NewPaymentMethodPage() {
  const router = useRouter();
  
  const handleSubmit = async (paymentMethod: any) => {
    try {
      console.log('Submitting payment method:', paymentMethod);
      
      // Add missing fields if needed
      const enhancedMethod = {
        ...paymentMethod,
        // Remove customerId if present
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Remove fields we don't want in the database
      delete enhancedMethod.customerId;
      delete enhancedMethod.isDefault;
      
      // Call the API to create the payment method
      const result = await WalletAPI.createPaymentMethod(enhancedMethod);
      console.log('Successfully created payment method:', result);
      
      // Redirect back to payment methods list
      router.push('/payment-methods');
    } catch (error: any) {
      console.error('Error creating payment method:', error);
      if (error.response) {
        // The request was made and the server responded with an error status
        console.error('Server error response:', error.response.data);
        console.error('Status:', error.response.status);
        alert(`Failed to create payment method: ${error.response.data?.error || 'Server error'} (${error.response.status})`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        alert('Failed to create payment method: No response from server');
      } else {
        // Something happened in setting up the request
        alert(`Failed to create payment method: ${error.message}`);
      }
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Payment Method</h1>
      <PaymentMethodForm 
        paymentMethod={{
          id: '',
          type: 'credit_card',
          name: '',
          isDefault: false,
          details: {}
        }} 
        onSubmit={handleSubmit}
      />
    </div>
  );
}
