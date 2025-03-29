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
        // In a real application, this would call the actual API
        // const response = await WalletAPI.getPaymentMethods();
        // setPaymentMethods(response);
        
        // For demo purposes, we'll use mock data
        setPaymentMethods([
          {
            id: '1',
            customerId: '1',
            type: 'Credit Card',
            name: 'Corporate Visa',
            details: {
              cardNumber: '**** **** **** 4567',
              expiryDate: '05/27',
              cardholderName: 'John Smith'
            },
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            customerId: '1',
            type: 'Bank Account',
            name: 'Business Checking',
            details: {
              accountNumber: '****5678',
              routingNumber: '****9012',
              bankName: 'First National Bank'
            },
            isDefault: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '3',
            customerId: '2',
            type: 'Credit Card',
            name: 'Corporate Amex',
            details: {
              cardNumber: '**** **** **** 7890',
              expiryDate: '12/26',
              cardholderName: 'Jane Doe'
            },
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch payment methods');
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
                {method.isDefault && (
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                    Default
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-1">Type: {method.type}</p>
              {method.type === 'Credit Card' && (
                <>
                  <p className="text-gray-600 mb-1">Card Number: {method.details.cardNumber}</p>
                  <p className="text-gray-600 mb-1">Expiry: {method.details.expiryDate}</p>
                  <p className="text-gray-600 mb-3">Cardholder: {method.details.cardholderName}</p>
                </>
              )}
              {method.type === 'Bank Account' && (
                <>
                  <p className="text-gray-600 mb-1">Account: {method.details.accountNumber}</p>
                  <p className="text-gray-600 mb-1">Routing: {method.details.routingNumber}</p>
                  <p className="text-gray-600 mb-3">Bank: {method.details.bankName}</p>
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
