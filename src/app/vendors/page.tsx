'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiFilter } from 'react-icons/fi';
import { VendorAPI, Vendor } from '@/api/vendor/vendor-api';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);



  const fetchVendors = async () => {
    setLoading(true);
    try {
      const vendorsData = await VendorAPI.getVendors();
      setVendors(vendorsData || []); 
      setLoading(false);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError(err.message || 'Failed to fetch vendors');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch vendors from the API on component mount
    fetchVendors();
  }, []);
  
  const handleDeleteVendor = async (id: string | undefined) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
      return;
    }
    
    setDeleteLoading(id);
    try {
      await VendorAPI.deleteVendor(id);
      // Refresh the vendors list
      fetchVendors();
    } catch (err) {
      console.error('Error deleting vendor:', err);
      alert('Failed to delete vendor. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <h2 className="text-xl font-semibold text-red-700">Error</h2>
        <p className="mt-2 text-red-600">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendors</h1>
        <Link
          href="/vendors/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-500"
        >
          <FiPlus className="mr-2" /> Add Vendor
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search vendors..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-200">
              <FiFilter className="mr-2" /> Filter
            </button>
          </div>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 capitalize">{vendor.type.replace('_', ' ')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{vendor.contact_email || 'N/A'}</div>
                  <div className="text-sm text-gray-500">{vendor.contact_phone || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/vendors/${vendor.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                    View
                  </Link>
                  <Link href={`/vendors/${vendor.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => vendor.id && handleDeleteVendor(vendor.id)}
                    disabled={deleteLoading === vendor.id}
                  >
                    {deleteLoading === vendor.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
