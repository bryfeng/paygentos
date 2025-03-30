"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CustomerAPI } from '../../../api/customer/customer-api';
import { 
  ContactType, 
  IdDocumentType, 
  ContactInfo,
  IdDocument,
  validateCustomer 
} from '../../../models/customer/customer';
import { FiArrowLeft, FiSave, FiLoader, FiUserPlus, FiPlus, FiTrash2, FiCalendar } from 'react-icons/fi';

export default function NewCustomerPage() {
  const router = useRouter();
  
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    dob: '',
    // Address fields
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    // Contact information
    contacts: [{ type: ContactType.EMAIL, value: '', isPrimary: true, label: 'Primary Email' }],
    preferredContactType: ContactType.EMAIL,
    // ID Documents
    idDocuments: [],
    // Status
    isActive: true,
    notes: ''
  });
  
  // For managing contact methods
  const [newContact, setNewContact] = useState({
    type: ContactType.PHONE,
    value: '',
    label: '',
    isPrimary: false
  });
  
  // For managing ID documents
  const [newIdDocument, setNewIdDocument] = useState({
    type: IdDocumentType.PASSPORT,
    number: '',
    issuedBy: '',
    issuedDate: '',
    expiryDate: '',
    isVerified: false
  });
  
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Handle changes to basic form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Auto-generate fullName when first or last name changes
    if (name === 'firstName' || name === 'lastName') {
      const firstName = name === 'firstName' ? value : formData.firstName;
      const lastName = name === 'lastName' ? value : formData.lastName;
      setFormData(prev => ({
        ...prev,
        fullName: `${firstName} ${lastName}`.trim()
      }));
    }
  };
  
  // Handle changes to contact fields
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setNewContact(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  // Handle changes to ID document fields
  const handleIdDocumentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setNewIdDocument(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  // Add a new contact method
  const addContact = () => {
    if (!newContact.value) return;
    
    // If this is marked as primary, remove primary from other contacts
    let updatedContacts = [...formData.contacts];
    if (newContact.isPrimary) {
      updatedContacts = updatedContacts.map(c => ({ ...c, isPrimary: false }));
    }
    
    // Add the new contact
    setFormData(prev => ({
      ...prev,
      contacts: [...updatedContacts, { ...newContact }]
    }));
    
    // Reset the form
    setNewContact({
      type: ContactType.PHONE,
      value: '',
      label: '',
      isPrimary: false
    });
  };
  
  // Remove a contact method
  const removeContact = (index: number) => {
    const updatedContacts = [...formData.contacts];
    updatedContacts.splice(index, 1);
    
    // If we removed the primary contact and have other contacts, make the first one primary
    if (updatedContacts.length > 0 && !updatedContacts.some(c => c.isPrimary)) {
      updatedContacts[0].isPrimary = true;
    }
    
    setFormData(prev => ({
      ...prev,
      contacts: updatedContacts
    }));
  };
  
  // Add a new ID document
  const addIdDocument = () => {
    if (!newIdDocument.number) return;
    
    setFormData(prev => ({
      ...prev,
      idDocuments: [...(prev.idDocuments || []), { ...newIdDocument }]
    }));
    
    // Reset the form
    setNewIdDocument({
      type: IdDocumentType.PASSPORT,
      number: '',
      issuedBy: '',
      issuedDate: '',
      expiryDate: '',
      isVerified: false
    });
  };
  
  // Remove an ID document
  const removeIdDocument = (index: number) => {
    const updatedDocuments = [...(formData.idDocuments || [])];
    updatedDocuments.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      idDocuments: updatedDocuments
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the customer data
    const errors = validateCustomer(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {
      setSaving(true);
      setValidationErrors([]);
      
      // Prepare final data for submission
      const customerData = {
        ...formData,
        // If no ID documents were added, ensure it's at least an empty array
        idDocuments: formData.idDocuments || []
      };
      
      const result = await CustomerAPI.createCustomer(customerData);
      
      if (result) {
        // Navigate to the new customer's detail page
        router.push(`/customers/${result.id}`);
      } else {
        setError('Failed to create customer');
        setSaving(false);
      }
    } catch (err: any) {
      console.error('Error creating customer:', err);
      setError(err?.message || 'An error occurred while saving');
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/customers" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <FiArrowLeft className="mr-2" /> Back to Customers
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Customer</h1>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiLoader className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {validationErrors.length > 0 && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                {validationErrors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FiUserPlus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Individual Information</h2>
              <p className="text-sm text-gray-500">Enter the details for the new customer</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>
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
                  required
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
                  required
                />
              </div>
              
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dob"
                    id="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  />
                  <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="isActive" className="flex items-center mt-6">
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
            </div>
          
            {/* Contact Information Section */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mt-8">Contact Information</h3>
            
            {/* Existing Contacts */}
            {formData.contacts.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Contact Methods</h4>
                <div className="space-y-2">
                  {formData.contacts.map((contact, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-800 mr-2">{contact.type}</span>
                          {contact.isPrimary && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Primary</span>
                          )}
                          {contact.label && <span className="text-xs text-gray-500 ml-2">({contact.label})</span>}
                        </div>
                        <div className="text-sm text-gray-600">{contact.value}</div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeContact(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Add New Contact Form */}
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Add Contact Method</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="contactType" className="block text-xs font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    name="type"
                    id="contactType"
                    value={newContact.type}
                    onChange={handleContactChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs border p-2"
                  >
                    {Object.values(ContactType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="contactValue" className="block text-xs font-medium text-gray-700">
                    Value
                  </label>
                  <input
                    type={newContact.type === ContactType.EMAIL ? 'email' : 'text'}
                    name="value"
                    id="contactValue"
                    value={newContact.value}
                    onChange={handleContactChange}
                    placeholder={newContact.type === ContactType.EMAIL ? 'email@example.com' : 
                              newContact.type === ContactType.PHONE ? '+1 (555) 123-4567' : 
                              newContact.type === ContactType.TELEGRAM ? '@username' : 
                              'Contact value'}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs border p-2"
                  />
                </div>
                
                <div>
                  <label htmlFor="contactLabel" className="block text-xs font-medium text-gray-700">
                    Label (optional)
                  </label>
                  <input
                    type="text"
                    name="label"
                    id="contactLabel"
                    value={newContact.label}
                    onChange={handleContactChange}
                    placeholder="Work, Personal, etc."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs border p-2"
                  />
                </div>
              </div>
              
              <div className="mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPrimary"
                    checked={newContact.isPrimary}
                    onChange={handleContactChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-xs font-medium text-gray-700">Set as primary contact method</span>
                </label>
              </div>
              
              <div className="mt-3">
                <button
                  type="button"
                  onClick={addContact}
                  disabled={!newContact.value}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <FiPlus className="-ml-1 mr-1" /> Add Contact
                </button>
              </div>
            </div>
            
            {/* Preferred Contact Method */}
            <div className="mt-4">
              <label htmlFor="preferredContactType" className="block text-sm font-medium text-gray-700">
                Preferred Contact Method
              </label>
              <select
                name="preferredContactType"
                id="preferredContactType"
                value={formData.preferredContactType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              >
                {Object.values(ContactType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Address Section */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mt-8">Address Information</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <textarea
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State / Province
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>
              
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Zip / Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>
            </div>
            
            {/* ID Documents Section */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mt-8">ID Documents</h3>
            
            {/* Existing ID Documents */}
            {formData.idDocuments && formData.idDocuments.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current ID Documents</h4>
                <div className="space-y-2">
                  {formData.idDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-800">{doc.type}</span>
                          {doc.isVerified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded ml-2">Verified</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">Number: {doc.number}</div>
                        {doc.issuedBy && <div className="text-sm text-gray-600">Issued by: {doc.issuedBy}</div>}
                        {doc.issuedDate && <div className="text-xs text-gray-500">Issued: {new Date(doc.issuedDate).toLocaleDateString()}</div>}
                        {doc.expiryDate && <div className="text-xs text-gray-500">Expires: {new Date(doc.expiryDate).toLocaleDateString()}</div>}
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeIdDocument(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Add New ID Document Form */}
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Add ID Document</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="idType" className="block text-xs font-medium text-gray-700">
                    Document Type
                  </label>
                  <select
                    name="type"
                    id="idType"
                    value={newIdDocument.type}
                    onChange={handleIdDocumentChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs border p-2"
                  >
                    {Object.values(IdDocumentType).map(type => (
                      <option key={type} value={type}>{type.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="idNumber" className="block text-xs font-medium text-gray-700">
                    Document Number
                  </label>
                  <input
                    type="text"
                    name="number"
                    id="idNumber"
                    value={newIdDocument.number}
                    onChange={handleIdDocumentChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs border p-2"
                  />
                </div>
                
                <div>
                  <label htmlFor="idIssuedBy" className="block text-xs font-medium text-gray-700">
                    Issued By
                  </label>
                  <input
                    type="text"
                    name="issuedBy"
                    id="idIssuedBy"
                    value={newIdDocument.issuedBy}
                    onChange={handleIdDocumentChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs border p-2"
                  />
                </div>
                
                <div className="sm:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="idIssuedDate" className="block text-xs font-medium text-gray-700">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      name="issuedDate"
                      id="idIssuedDate"
                      value={newIdDocument.issuedDate}
                      onChange={handleIdDocumentChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs border p-2"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="idExpiryDate" className="block text-xs font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      id="idExpiryDate"
                      value={newIdDocument.expiryDate}
                      onChange={handleIdDocumentChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs border p-2"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={newIdDocument.isVerified}
                    onChange={handleIdDocumentChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-xs font-medium text-gray-700">Document is verified</span>
                </label>
              </div>
              
              <div className="mt-3">
                <button
                  type="button"
                  onClick={addIdDocument}
                  disabled={!newIdDocument.number}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <FiPlus className="-ml-1 mr-1" /> Add Document
                </button>
              </div>
            </div>
            
            {/* Notes */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mt-8">Additional Notes</h3>
            <div>
              <textarea
                name="notes"
                id="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Add any additional notes about this customer..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              />
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3">
            <Link
              href="/customers"
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
                  Creating...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Create Customer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
