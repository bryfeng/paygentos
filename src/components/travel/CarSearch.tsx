"use client";

import React, { useState, useEffect } from 'react';
import { CarResult, TravelAPI, CarSearchParams } from '../../api/travel/travel-api';
import CarSearchForm from './CarSearchForm';
import Card from '../shared/Card';
import Button from '../shared/Button';

const CarSearch: React.FC = () => {
  const [searchResults, setSearchResults] = useState<CarResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<string | null>(null);

  const handleSearch = async (params: CarSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const results = await TravelAPI.searchCars(params);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search rental cars. Please try again later.');
      console.error('Error searching rental cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookCar = async (carId: string) => {
    try {
      setLoading(true);
      // In a real application, you would get these IDs from the current context
      const customerId = 'sample-customer-id';
      const eventId = 'sample-event-id';
      
      await TravelAPI.bookCar(carId, customerId, eventId);
      alert('Car rental booked successfully!');
    } catch (err) {
      setError('Failed to book car rental. Please try again later.');
      console.error('Error booking car rental:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <CarSearchForm onSearch={handleSearch} isLoading={loading} />
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {loading && <div className="text-center py-4">Searching for rental cars...</div>}
      
      {!loading && searchResults.length === 0 ? (
        <Card>
          <div className="text-center py-4 text-gray-500">
            {error ? 'Error searching rental cars.' : 'No rental cars found. Try adjusting your search criteria.'}
          </div>
        </Card>
      ) : (
        <Card title="Car Rental Search Results">
          <div className="space-y-4">
            {searchResults.map((car) => (
              <div 
                key={car.id} 
                className={`p-4 border rounded-lg ${selectedCar === car.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setSelectedCar(car.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{car.company}</h3>
                    <p className="text-sm text-gray-600">{car.carType} - {car.model}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {car.price.amount} {car.price.currency}
                      {car.price.perDay && <span className="text-sm font-normal"> per day</span>}
                    </p>
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm">
                    <span className="font-medium">Pickup:</span> {car.pickupLocation}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Dropoff:</span> {car.dropoffLocation}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Features:</span> {car.features.join(', ')}
                  </p>
                </div>
                
                {selectedCar === car.id && (
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={() => handleBookCar(car.id)}
                      disabled={loading}
                    >
                      {loading ? 'Booking...' : 'Book Car'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CarSearch;
