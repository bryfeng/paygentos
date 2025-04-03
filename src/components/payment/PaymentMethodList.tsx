"use client";

import React, { useState, useEffect } from 'react';
import { Wallet, PaymentMethod } from '@/models/wallet/wallet';
import { WalletAPI } from '@/api/wallet/wallet-api';
import Card from '@/components/shared/Card';

const PaymentMethodList = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        // Call the real API to get payment methods
        const methods = await WalletAPI.getAllPaymentMethods();
        setPaymentMethods(methods);
        setLoading(false);
      } catch (err) {
        console.error('Error loading payment methods:', err);
        setError('Failed to fetch payment methods. Please try again later.');
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading payment methods...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (paymentMethods.length === 0) {
    return <div className="text-center py-10">No payment methods found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Payment Methods</h2>
        <a 
          href="/payment-methods/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Payment Method
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((method) => (
          <Card key={method.id}>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold mb-2">{method.name}</h3>
              </div>
              <p className="text-gray-600 mb-1">Type: {method.type === 'credit_card' ? 'Credit Card' : 
                                          method.type === 'debit_card' ? 'Debit Card' : 
                                          method.type === 'bank_account' ? 'Bank Account' : 
                                          method.type === 'digital_wallet' ? 'Digital Wallet' : 
                                          method.type === 'corporate_account' ? 'Corporate Account' : 'Other'}</p>
              {(method.type === 'credit_card' || method.type === 'debit_card') && (
                <>
                  {method.details.maskedNumber && (
                    <p className="text-gray-600 mb-1">Card Number: {method.details.maskedNumber}</p>
                  )}
                  {method.details.maskedCardNumber && (
                    <p className="text-gray-600 mb-1">Card Number: {method.details.maskedCardNumber}</p>
                  )}
                  <p className="text-gray-600 mb-1">Expiry: {method.details.expiryMonth}/{method.details.expiryYear}</p>
                  <p className="text-gray-600 mb-3">Cardholder: {method.details.cardholderName}</p>
                </>
              )}
              {method.type === 'bank_account' && (
                <>
                  {method.details.maskedAccountNumber && (
                    <p className="text-gray-600 mb-1">Account: {method.details.maskedAccountNumber}</p>
                  )}
                  <p className="text-gray-600 mb-1">Routing: {method.details.routingNumber}</p>
                  <p className="text-gray-600 mb-3">Type: {method.details.accountType}</p>
                </>
              )}
              <div className="flex justify-end space-x-2">
                <a 
                  href={`/payment-methods/${method.id}/edit`}
                  className="text-green-500 hover:text-green-700"
                >
                  Edit
                </a>
                <button 
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodList;
