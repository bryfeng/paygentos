"use client";

import React, { useState, useEffect } from 'react';
import { Event } from '@/models/event/event';
import { EventAPI } from '@/api/event/event-api';
import Card from '@/components/shared/Card';

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // In a real application, this would call the actual API
        // const response = await EventAPI.getEvents();
        // setEvents(response);
        
        // For demo purposes, we'll use mock data
        setEvents([
          {
            id: '1',
            customerId: '1',
            type: 'Business Trip',
            name: 'New York Client Meeting',
            description: 'Annual meeting with Acme Corporation executives',
            startDate: '2025-04-15T09:00:00Z',
            endDate: '2025-04-17T17:00:00Z',
            status: 'Confirmed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            customerId: '2',
            type: 'Conference',
            name: 'Tech Summit 2025',
            description: 'Annual technology conference in San Francisco',
            startDate: '2025-05-10T08:00:00Z',
            endDate: '2025-05-12T18:00:00Z',
            status: 'Planning',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '3',
            customerId: '3',
            type: 'Team Retreat',
            name: 'Q2 Planning Retreat',
            description: 'Quarterly planning session for executive team',
            startDate: '2025-06-05T09:00:00Z',
            endDate: '2025-06-07T17:00:00Z',
            status: 'Pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (events.length === 0) {
    return <div className="text-center py-10">No events found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Event List</h2>
        <a 
          href="/events/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create New Event
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold mb-2">{event.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  event.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                  event.status === 'Planning' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.status}
                </span>
              </div>
              <p className="text-gray-600 mb-1">Type: {event.type}</p>
              <p className="text-gray-600 mb-1">Description: {event.description}</p>
              <p className="text-gray-600 mb-3">
                Date: {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
              </p>
              <div className="flex justify-end space-x-2">
                <a 
                  href={`/events/${event.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View
                </a>
                <a 
                  href={`/events/${event.id}/edit`}
                  className="text-green-500 hover:text-green-700"
                >
                  Edit
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventList;
