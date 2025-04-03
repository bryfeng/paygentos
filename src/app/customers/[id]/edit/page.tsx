"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Customer, ContactType, ContactInfo } from '../../../../models/customer/customer';
import { CustomerAPI } from '../../../../api/customer/customer-api';
import { CustomerGroup, CustomerGroupAPI } from '../../../../api/customer/customer-group-api';
import { FiArrowLeft, FiSave, FiLoader, FiAlertCircle, FiPlus, FiTrash } from 'react-icons/fi';

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customerGroups, setCustomerGroups] = useState<CustomerGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [formData, setFormData] = useState<Partial<Customer>>({
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isActive: true,
    group_id: '',
    contacts: [] as ContactInfo[]
  });

  useEffect(() => {
    // Fetch customer groups
    const fetchCustomerGroups = async () => {
      setLoadingGroups(true);
      try {
        const groups = await CustomerGroupAPI.getCustomerGroups();
        setCustomerGroups(groups);
      } catch (error) {
        console.error('Error fetching customer groups:', error);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchCustomerGroups();
    
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const data = await CustomerAPI.getCustomer(customerId);
        
        if (data) {
          setCustomer(data);
          // Extract phone contact if it exists
          const phoneContact = data.contacts?.find(c => c.type === 'phone');

          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            fullName: data.fullName || '',
            email: data.email || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            postalCode: data.postalCode || '',
            country: data.country || '',
            isActive: data.isActive !== false, // Default to true if not specified
            contacts: data.contacts || []
          });
        } else {
          setError('Customer not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching customer:', err);
        setError('Failed to load customer data');
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Create a copy of the form data to work with
      const updatedCustomer = {...formData};
      
      // Ensure we have a full name - generate it from first and last name if needed
      if (!updatedCustomer.fullName && (updatedCustomer.firstName || updatedCustomer.lastName)) {
        updatedCustomer.fullName = `${updatedCustomer.firstName || ''} ${updatedCustomer.lastName || ''}`.trim();
      }
      
      // Make sure we have at least one primary contact if there are contacts
      if (updatedCustomer.contacts && updatedCustomer.contacts.length > 0) {
        if (!updatedCustomer.contacts.some(c => c.isPrimary)) {
          // Set the first contact as primary if none are marked
          updatedCustomer.contacts[0].isPrimary = true;
        }
        
        // Ensure all contacts have their values trimmed
        updatedCustomer.contacts = updatedCustomer.contacts.map(contact => ({
          ...contact,
          value: contact.value.trim()
        }));
      }
      
      // Make sure email is consistent in both places (direct field and in contacts array)
      if (updatedCustomer.email) {
        // Check if we have an email contact
        const hasEmailContact = updatedCustomer.contacts?.some(c => c.type === ContactType.EMAIL);
        
        if (!hasEmailContact && updatedCustomer.email) {
          // Add the email to contacts array if it doesn't exist there
          const emailContact: ContactInfo = {
            type: ContactType.EMAIL,
            value: updatedCustomer.email,
            isPrimary: !(updatedCustomer.contacts?.some(c => c.isPrimary))
          };
          updatedCustomer.contacts = [...(updatedCustomer.contacts || []), emailContact];
        }
      }
      
      // Update the customer
      const result = await CustomerAPI.updateCustomer(customerId, updatedCustomer);
      
      if (result) {
        // Navigate back to customer detail page
        router.push(`/customers/${customerId}`);
      } else {
        setError('Failed to update customer');
        setSaving(false);
      }
    } catch (err) {
      console.error('Error updating customer:', err);
      setError('An error occurred while saving changes');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FiLoader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading customer data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/customers" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <FiArrowLeft className="mr-2" /> Back to Customers
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <FiAlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
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
      <div className="flex items-center justify-between mb-6">
        <Link href={`/customers/${customerId}`} className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <FiArrowLeft className="mr-2" /> Back to Customer
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Customer</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>
              
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name or Company
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  required
                />
              </div>

              {/* Display contact list */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Methods
                </label>
                
                {formData.contacts && formData.contacts.length > 0 ? (
                  <div className="space-y-3">
                    {formData.contacts.map((contact, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <select
                          value={contact.type}
                          onChange={(e) => {
                            const newContacts = [...formData.contacts!];
                            newContacts[index] = {
                              ...newContacts[index],
                              type: e.target.value as ContactType
                            };
                            setFormData({...formData, contacts: newContacts});
                          }}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        >
                          {Object.values(ContactType).map(type => (
                            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={contact.value}
                          onChange={(e) => {
                            const newContacts = [...formData.contacts!];
                            newContacts[index] = {
                              ...newContacts[index],
                              value: e.target.value
                            };
                            setFormData({...formData, contacts: newContacts});
                          }}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                          placeholder={`Enter ${contact.type}`}
                        />
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={contact.isPrimary === true}
                            onChange={(e) => {
                              // Set this contact as primary and others as not primary
                              const newContacts = formData.contacts!.map((c, i) => ({
                                ...c,
                                isPrimary: i === index ? e.target.checked : false
                              }));
                              setFormData({...formData, contacts: newContacts});
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-1"
                          />
                          <span className="text-xs text-gray-500 mr-2">Primary</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newContacts = formData.contacts!.filter((_, i) => i !== index);
                            setFormData({...formData, contacts: newContacts});
                          }}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <FiTrash size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No contact methods added.</p>
                )}
                
                <button
                  type="button"
                  onClick={() => {
                    // Add a new contact with default phone type
                    const newContact: ContactInfo = {
                      type: ContactType.PHONE,
                      value: '',
                      isPrimary: formData.contacts?.length === 0
                    };
                    setFormData({
                      ...formData,
                      contacts: [...(formData.contacts || []), newContact]
                    });
                  }}
                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  <FiPlus className="mr-1" /> Add Contact Method
                </button>
              </div>

              <div>
                <label htmlFor="isActive" className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Active Customer</span>
                </label>
              </div>
              
              <div>
                <label htmlFor="group_id" className="block text-sm font-medium text-gray-700">
                  Customer Group
                </label>
                <select
                  id="group_id"
                  name="group_id"
                  value={formData.group_id || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  disabled={loadingGroups}
                >
                  <option value="">Select Group</option>
                  {customerGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                {loadingGroups && <p className="mt-1 text-xs text-gray-500">Loading groups...</p>}
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              />
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3">
            <Link
              href={`/customers/${customerId}`}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
            >
              {saving ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
