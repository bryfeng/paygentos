import React from 'react';
import EventList from '@/components/event/EventList';

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      <EventList />
    </div>
  );
}
