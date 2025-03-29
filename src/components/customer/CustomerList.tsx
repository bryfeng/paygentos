"use client";

import React, { useState, useEffect } from 'react';
import { Customer } from '../../models/customer/customer';
import { CustomerAPI } from '../../api/customer/customer-api';
import Card from '../shared/Card';
import Link from 'next/link';
import { FiLoader, FiAlertCircle, FiUserPlus } from 'react-icons/fi';

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // Get customers from API (which now includes fallbacks)
        const data = await CustomerAPI.getCustomers();
        
        // Check if we got valid data
        if (Array.isArray(data)) {
          setCustomers(data);
        } else {
          console.warn('Customer data is not an array:', data);
          setCustomers([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error in customer list component:', err);
        setError('Failed to fetch customers');
        setLoading(false);
        // Don't crash - initialize with empty array
        setCustomers([]);
      }
    };

    fetchCustomers();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FiLoader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading customers...</p>
      </div>
    );
  }

  // Error state with retry button
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <FiAlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Customers</h3>
        <p className="text-center text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (!customers || customers.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Customer List</h2>
          <Link 
            href="/customers/new" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          >
            <FiUserPlus className="mr-2" />
            Add New Customer
          </Link>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FiUserPlus className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first customer</p>
          <Link 
            href="/customers/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Add a Customer
          </Link>
        </div>
      </div>
    );
  }

  // Normal state with customers
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Customer List ({customers.length})
        </h2>
        <Link 
          href="/customers/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
        >
          <FiUserPlus className="mr-2" />
          Add New Customer
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <Card key={customer.id} hoverable>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{customer.name}</h3>
              <p className="text-gray-600 mb-1">Email: {customer.email}</p>
              {customer.phone && (
                <p className="text-gray-600 mb-1">Phone: {customer.phone}</p>
              )}
              {customer.address && (
                <p className="text-gray-600 mb-3">Address: {customer.address}</p>
              )}
              <div className="flex justify-end space-x-2 mt-4">
                <Link 
                  href={`/customers/${customer.id}`}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  View
                </Link>
                <Link 
                  href={`/customers/${customer.id}/edit`}
                  className="text-green-500 hover:text-green-700 font-medium"
                >
                  Edit
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;
