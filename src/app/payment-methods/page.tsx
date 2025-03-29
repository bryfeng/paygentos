import React from 'react';
import PaymentMethodList from '@/components/payment/PaymentMethodList';

export default function PaymentMethodsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Payment Methods</h1>
      <PaymentMethodList />
    </div>
  );
}
