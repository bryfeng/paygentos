import React from 'react';
import ExpenseList from '../../../../components/expense/ExpenseList';

export default function ExpenseManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Expense Management</h1>
      <p className="mb-6 text-gray-600">
        Track and manage travel expenses for your business trips with our comprehensive expense management system.
      </p>
      <ExpenseList />
    </div>
  );
}
