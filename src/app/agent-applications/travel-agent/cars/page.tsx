import React from 'react';
import CarSearch from '../../../../components/travel/CarSearch';

export default function CarRentalPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Car Rental</h1>
      <p className="mb-6 text-gray-600">
        Arrange ground transportation for your business trips with our car rental booking system.
      </p>
      <CarSearch />
    </div>
  );
}
