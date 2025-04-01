'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@/models/event/event';
import { EventAPI } from '@/api/event/event-api';
import { CustomerAPI } from '@/api/customer/customer-api';
import { FiEdit2, FiTrash2, FiArrowLeft, FiCalendar, FiMapPin } from 'react-icons/fi';
import Link from 'next/link';

// Format date for display
function formatDate(date: Date | string): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(dateObj);
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [customerNames, setCustomerNames] = useState<{[key: string]: string}>({});

  // Extract id from params to use in dependency array
  const eventId = params.id;
  
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const eventData = await EventAPI.getEvent(eventId);
        setEvent(eventData);
        
        // Fetch customer names if we have customer IDs
        if (eventData.customerIds && eventData.customerIds.length > 0) {
          const customerNameMap: {[key: string]: string} = {};
          
          // Fetch each customer's details to get their name
          for (const customerId of eventData.customerIds) {
            try {
              const customerData = await CustomerAPI.getCustomer(customerId);
              customerNameMap[customerId] = customerData.fullName || 
                `${customerData.firstName} ${customerData.lastName}`;
            } catch (err) {
              console.error(`Error fetching customer ${customerId}:`, err);
              customerNameMap[customerId] = 'Unknown Customer';
            }
          }
          
          setCustomerNames(customerNameMap);
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleDelete = async () => {
    if (!event) return;
    
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await EventAPI.deleteEvent(event.id);
        router.push('/events');
      } catch (err) {
        console.error('Error deleting event:', err);
        alert('Failed to delete event');
      }
    }
  };
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    const statusColors: {[key: string]: string} = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-500">Error</h2>
        <p className="mt-4">{error || 'Event not found'}</p>
        <button
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-500"
          onClick={() => router.push('/events')}
        >
          <FiArrowLeft className="mr-2" /> Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <div className="flex space-x-2">
          <Link
            href={`/events/${event.id}/edit`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-500"
          >
            <FiEdit2 className="mr-2" /> Edit
          </Link>
          <button
            className="inline-flex items-center px-4 py-2 bg-white border border-transparent rounded-md font-medium text-red-600 hover:bg-red-50"
            onClick={handleDelete}
          >
            <FiTrash2 className="mr-2" /> Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Event Details</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.approvalStatus || 'scheduled')}`}>
              {event.approvalStatus || 'Scheduled'}
            </span>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-700">Date & Time</h3>
            <p className="mt-1">
              {formatDate(event.startDate)} 
              {event.endDate && ` - ${formatDate(event.endDate)}`}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700">Location</h3>
            <p className="mt-1">{event.location || 'Not specified'}</p>
          </div>
          
          {event.purpose && (
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-medium text-gray-700">Purpose</h3>
              <p className="mt-1">{event.purpose}</p>
            </div>
          )}
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-medium text-gray-700">Description</h3>
            <p className="mt-1 whitespace-pre-wrap">{event.description || 'No description provided'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Customers</h2>
        </div>
        <div className="p-6">
          {event.customerIds && event.customerIds.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {event.customerIds.map(customerId => (
                <li key={customerId} className="py-3 flex justify-between items-center">
                  <span className="text-gray-900">
                    {customerNames[customerId] || 'Loading...'}
                  </span>
                  <Link 
                    href={`/customers/${customerId}`} 
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
                  >
                    View
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No customers associated with this event</p>
          )}
        </div>
      </div>

      {event.budget && (
        <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Budget</h2>
          </div>
          <div className="p-6">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{event.budget.amount.toLocaleString()}</span>
              <span className="ml-1 text-gray-600">{event.budget.currency}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <button 
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => router.push('/events')}
        >
          <FiArrowLeft className="mr-2" /> Back to Events
        </button>
      </div>
    </div>
  );
}
