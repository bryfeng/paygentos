"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Event, defaultEvent, validateEvent } from '@/models/event/event';
import { EventAPI } from '@/api/event/event-api';
import { CustomerAPI } from '@/api/customer/customer-api';
import { Customer } from '@/models/customer/customer';
import { FiArrowLeft, FiSave, FiCalendar, FiAlertCircle } from 'react-icons/fi';

export default function NewEventPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<Event>>({
    ...defaultEvent,
    name: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Default to tomorrow
    location: '',
    purpose: '',
    customerIds: [],
    requiresApproval: true,
    isActive: true,
    budget: {
      amount: 0,
      currency: 'USD',
    }
  });

  // Fetch customers for the dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await CustomerAPI.getCustomers();
        setCustomers(data);
        
        // No need to set a default customer when using multi-select
      } catch (err) {
        console.error('Error fetching customers:', err);
      }
    };

    fetchCustomers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name === 'budget.amount') {
      // Handle nested budget object
      setFormData(prev => ({
        ...prev,
        budget: {
          ...(prev.budget || { currency: 'USD' }),
          amount: parseFloat(value) || 0
        }
      }));
    } else if (name === 'budget.currency') {
      // Handle nested budget currency
      setFormData(prev => ({
        ...prev,
        budget: {
          ...(prev.budget || { amount: 0 }),
          currency: value
        }
      }));
    } else {
      // Handle date fields
      if (name === 'startDate' || name === 'endDate') {
        setFormData(prev => ({
          ...prev,
          [name]: new Date(value)
        }));
      } else {
        // Handle other fields
        setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateEvent(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      window.scrollTo(0, 0);
      return;
    }
    
    try {
      setSaving(true);
      setErrors([]);
      
      // Ensure dates are properly formatted
      const eventData = {
        ...formData,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        // Ensure customerIds is always an array
        customerIds: formData.customerIds || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await EventAPI.createEvent(eventData);
      
      // Redirect to event detail page
      router.push(`/events/${result.id}`);
    } catch (err: any) {
      console.error('Error creating event:', err);
      setErrors([err.message || 'Failed to create event']);
      setSaving(false);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/events" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <FiArrowLeft className="mr-2" /> Back to Events
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
      </div>
      
      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Event Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  required
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>

              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-500" />
                  </div>
                  <input
                    type="datetime-local"
                    name="startDate"
                    id="startDate"
                    value={formData.startDate instanceof Date ? formData.startDate.toISOString().slice(0, 16) : ''}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-500" />
                  </div>
                  <input
                    type="datetime-local"
                    name="endDate"
                    id="endDate"
                    value={formData.endDate instanceof Date ? formData.endDate.toISOString().slice(0, 16) : ''}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>

              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                  Purpose
                </label>
                <input
                  type="text"
                  name="purpose"
                  id="purpose"
                  value={formData.purpose || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="customerIds" className="block text-sm font-medium text-gray-700">
                  Customers <span className="text-red-500">*</span>
                  <span className="ml-1 text-xs text-gray-500">(Select multiple customers by holding Ctrl/Cmd key)</span>
                </label>
                <select
                  name="customerIds"
                  id="customerIds"
                  multiple
                  value={formData.customerIds || []}
                  onChange={(e) => {
                    // Handle multi-select change
                    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                    setFormData(prev => ({
                      ...prev,
                      customerIds: selectedOptions
                    }));
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  required
                  size={5} // Show 5 options at once for better visibility
                >
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.fullName || `${customer.firstName} ${customer.lastName}`}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">At least one customer must be selected</p>
              </div>

              <div>
                <label htmlFor="budget.amount" className="block text-sm font-medium text-gray-700">
                  Budget Amount
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="budget.amount"
                    id="budget.amount"
                    value={formData.budget?.amount || 0}
                    onChange={handleChange}
                    className="flex-1 block w-full rounded-l-md border-gray-300 border focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                    min="0"
                    step="0.01"
                  />
                  <select
                    name="budget.currency"
                    id="budget.currency"
                    value={formData.budget?.currency || 'USD'}
                    onChange={handleChange}
                    className="rounded-r-md border-gray-300 border-l-0 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center col-span-2">
                <input
                  type="checkbox"
                  name="requiresApproval"
                  id="requiresApproval"
                  checked={formData.requiresApproval !== false}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <label htmlFor="requiresApproval" className="text-sm font-medium text-gray-700">
                  Requires Approval
                </label>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button
              type="button"
              onClick={() => router.push('/events')}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {saving ? (
                <>
                  <span className="mr-2">Saving...</span>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> Save Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
