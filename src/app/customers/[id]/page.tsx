"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Customer } from '../../../models/customer/customer';
import { CustomerAPI } from '../../../api/customer/customer-api';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit2, FiTrash2, FiAlertCircle, FiLoader } from 'react-icons/fi';

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const data = await CustomerAPI.getCustomer(customerId);
        setCustomer(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching customer details:', err);
        setError('Failed to load customer details');
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FiLoader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading customer details...</p>
      </div>
    );
  }

  // Error state
  if (error || !customer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/customers" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <FiArrowLeft className="mr-2" /> Back to Customers
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <FiAlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Customer Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "We couldn't find the customer you're looking for."}</p>
          <Link
            href="/customers"
            className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Customers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/customers" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <FiArrowLeft className="mr-2" /> Back to Customers
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 text-white p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{customer.name}</h1>
              <p className="text-blue-100 mt-1">Customer ID: {customer.id}</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Link
                href={`/customers/${customer.id}/edit`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-500"
              >
                <FiEdit2 className="mr-2" /> Edit
              </Link>
              <button
                className="inline-flex items-center px-4 py-2 bg-white border border-transparent rounded-md font-medium text-red-600 hover:bg-red-50"
              >
                <FiTrash2 className="mr-2" /> Delete
              </button>
            </div>
          </div>
        </div>
        
        {/* Customer details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Contact Information</h2>
              
              <div className="flex items-start">
                <FiMail className="mt-1 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{customer.email}</p>
                </div>
              </div>
              
              {customer.phone && (
                <div className="flex items-start">
                  <FiPhone className="mt-1 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-900">{customer.phone}</p>
                  </div>
                </div>
              )}
              
              {customer.address && (
                <div className="flex items-start">
                  <FiMapPin className="mt-1 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-900">{customer.address}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Account Information</h2>
              
              <div className="flex items-start">
                <FiCalendar className="mt-1 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer Since</p>
                  <p className="text-gray-900">{new Date(customer.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiUser className="mt-1 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
