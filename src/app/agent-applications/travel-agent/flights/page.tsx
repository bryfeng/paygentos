import React from 'react';
import FlightSearch from '../../../../components/travel/FlightSearch';

export default function FlightBookingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Flight Booking</h1>
      <p className="mb-6 text-gray-600">
        Search and book flights for corporate travel with our comprehensive flight booking system.
      </p>
      <FlightSearch />
    </div>
  );
}
