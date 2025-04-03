"use client";

import React, { useState, useEffect } from 'react';
import { Event } from '@/models/event/event';
import { EventAPI } from '@/api/event/event-api';
import Card from '@/components/shared/Card';
import Link from 'next/link';
import { FunnelIcon } from '@heroicons/react/24/outline';

// Define interface for events from the database
interface DatabaseEvent {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  purpose?: string;
  approvalStatus: string;
  customerIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Type conversion helper that maps API event to correct format
function mapToDatabaseEvents(events: any[]): DatabaseEvent[] {
  return events.map(event => ({
    id: event.id || '',
    name: event.name || '',
    description: event.description || '',
    startDate: event.startDate || new Date().toISOString(),
    endDate: event.endDate || null,
    location: event.location || '',
    purpose: event.purpose || '',
    approvalStatus: event.approvalStatus || 'scheduled',
    customerIds: Array.isArray(event.customerIds) ? event.customerIds : [],
    isActive: event.isActive !== false,
    createdAt: event.createdAt || new Date().toISOString(),
    updatedAt: event.updatedAt || new Date().toISOString()
  }));
}

const EventList = () => {
  const [events, setEvents] = useState<DatabaseEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<DatabaseEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Call the actual API to get events from database
        const fetchedEvents = await EventAPI.getEvents();
        const dbEvents = mapToDatabaseEvents(fetchedEvents);
        setEvents(dbEvents);
        setFilteredEvents(dbEvents);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  
  // Apply filters when filter states change
  useEffect(() => {
    let result = [...events];
    
    // Extract event type from purpose or metadata
    if (typeFilter) {
      result = result.filter(event => {
        const purpose = event.purpose?.toLowerCase() || '';
        return purpose.includes(typeFilter.toLowerCase());
      });
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(event => 
        event.approvalStatus.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    setFilteredEvents(result);
  }, [events, typeFilter, statusFilter]);

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        // Delete event via API
        await EventAPI.deleteEvent(eventId);
        // Update state after successful deletion
        setEvents(events.filter(event => event.id !== eventId));
      } catch (err: any) {
        console.error('Error deleting event:', err);
        setError(err.message || 'Failed to delete event');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Event List</h2>
        <div className="flex space-x-2 items-center">
          <div className="relative">
            <button
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50"
            >
              <FunnelIcon className="h-4 w-4 mr-1" />
              Filter
            </button>
          </div>
          <Link 
            href="/events/new" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create New Event
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
        <div>
          <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
          <select 
            id="eventType" 
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="business">Business Trip</option>
            <option value="conference">Conference</option>
            <option value="retreat">Team Retreat</option>
            <option value="meeting">Meeting</option>
            <option value="workshop">Workshop</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            id="status" 
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex items-end">
          {(typeFilter || statusFilter) && (
            <button
              onClick={() => {
                setTypeFilter('');
                setStatusFilter('');
              }}
              className="w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
      
      {filteredEvents.length === 0 && !loading ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No events match your filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id}>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold mb-2">{event.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    event.approvalStatus === 'completed' ? 'bg-green-100 text-green-800' :
                    event.approvalStatus === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    event.approvalStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.approvalStatus.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-600 mb-1">Purpose: {event.purpose || 'N/A'}</p>
                <p className="text-gray-600 mb-1">Description: {event.description || 'N/A'}</p>
                <p className="text-gray-600 mb-3">
                  Date: {new Date(event.startDate).toLocaleDateString()} 
                  {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                </p>
                <div className="flex justify-end space-x-2">
                  <Link 
                    href={`/events/${event.id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View
                  </Link>
                  <Link 
                    href={`/events/${event.id}/edit`}
                    className="text-green-500 hover:text-green-700"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
