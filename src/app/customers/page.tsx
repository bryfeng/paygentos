import React from 'react';
import CustomerList from '../../components/customer/CustomerList';

export default function CustomersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Customers</h1>
      <CustomerList />
    </div>
  );
}
