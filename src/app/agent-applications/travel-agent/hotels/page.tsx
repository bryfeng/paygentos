import React from 'react';
import HotelSearch from '../../../../components/travel/HotelSearch';

export default function HotelBookingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Hotel Booking</h1>
      <p className="mb-6 text-gray-600">
        Find and reserve accommodations for your business trips with our hotel booking system.
      </p>
      <HotelSearch />
    </div>
  );
}
