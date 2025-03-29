"use client";

import React, { useState, useEffect } from 'react';
import { Ledger } from '@/models/ledger/ledger';
import { LedgerAPI } from '@/api/ledger/ledger-api';
import Card from '@/components/shared/Card';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState<Ledger[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        // In a real application, this would call the actual API
        // const response = await LedgerAPI.getExpenses();
        // setExpenses(response);
        
        // For demo purposes, we'll use mock data
        setExpenses([
          {
            id: '1',
            customerId: '1',
            eventId: '1',
            amount: 1250.00,
            currency: 'USD',
            description: 'Flight to New York',
            category: 'Travel',
            status: 'Approved',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            customerId: '1',
            eventId: '1',
            amount: 450.00,
            currency: 'USD',
            description: 'Hotel - 3 nights',
            category: 'Accommodation',
            status: 'Pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '3',
            customerId: '2',
            eventId: '2',
            amount: 75.50,
            currency: 'USD',
            description: 'Taxi from airport',
            category: 'Transportation',
            status: 'Approved',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch expenses');
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading expenses...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (expenses.length === 0) {
    return <div className="text-center py-10">No expenses found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Expense List</h2>
        <a 
          href="/expenses/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Expense
        </a>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b">
                <td className="py-2 px-4">{expense.description}</td>
                <td className="py-2 px-4">{expense.category}</td>
                <td className="py-2 px-4">{expense.currency} {expense.amount.toFixed(2)}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    expense.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    expense.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {expense.status}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <div className="flex space-x-2">
                    <a 
                      href={`/expenses/${expense.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View
                    </a>
                    <a 
                      href={`/expenses/${expense.id}/edit`}
                      className="text-green-500 hover:text-green-700"
                    >
                      Edit
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
