'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@/models/event/event';
import { EventAPI } from '@/api/event/event-api';
import { CustomerAPI } from '@/api/customer/customer-api';
import { FiEdit2, FiTrash2, FiArrowLeft, FiSave } from 'react-icons/fi';
import Link from 'next/link';

import { Customer as CustomerModel } from '@/models/customer/customer';

type Customer = CustomerModel & {
  fullName?: string;
};

export default function EventEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Event>>({});
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch event data
        const eventData = await EventAPI.getEvent(params.id);
        setFormData(eventData);
        
        // Fetch customers for the dropdown
        const customersData = await CustomerAPI.getCustomers();
        setCustomers(customersData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (name === 'budget.amount') {
      setFormData(prev => ({
        ...prev,
        budget: {
          ...(prev.budget || { currency: 'USD' }),
          amount: isNaN(numValue) ? 0 : numValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue
      }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? new Date(value) : undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (saving) return;
    
    setSaving(true);
    setError(null);
    
    try {
      // Validation
      if (!formData.name) {
        throw new Error('Event name is required');
      }
      
      if (!formData.startDate) {
        throw new Error('Start date is required');
      }
      
      if (!formData.customerIds || formData.customerIds.length === 0) {
        throw new Error('At least one customer must be selected');
      }

      await EventAPI.updateEvent(params.id, formData);
      router.push(`/events/${params.id}`);
    } catch (err: any) {
      console.error('Error updating event:', err);
      setError(err.message || 'Failed to update event');
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Event</h1>
        <Link href={`/events/${params.id}`} className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
          <FiArrowLeft className="mr-2" /> Cancel
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Event Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                required
              />
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="startDate"
                id="startDate"
                value={formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ''}
                onChange={handleDateChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                required
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                name="endDate"
                id="endDate"
                value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ''}
                onChange={handleDateChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              />
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description || ''}
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
              <label htmlFor="approvalStatus" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="approvalStatus"
                id="approvalStatus"
                value={formData.approvalStatus || 'scheduled'}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              >
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700">Budget</legend>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="budget.amount"
                    id="budget.amount"
                    value={formData.budget?.amount || 0}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    className="flex-1 rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  />
                  <select
                    name="budget.currency"
                    id="budget.currency"
                    value={formData.budget?.currency || 'USD'}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        budget: {
                          ...(prev.budget || { amount: 0 }),
                          currency: e.target.value
                        }
                      }));
                    }}
                    className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                    <option value="JPY">JPY</option>
                    <option value="CNY">CNY</option>
                  </select>
                </div>
              </fieldset>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              type="button" 
              className="mr-4 inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => router.push(`/events/${params.id}`)}
            >
              <FiArrowLeft className="mr-2" /> Cancel
            </button>
            <button 
              type="submit" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-500"
              disabled={saving}
            >
              {saving ? (
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em]"></span>
              ) : (
                <FiSave className="mr-2" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
