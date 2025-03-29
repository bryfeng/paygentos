"use client";

import React, { useState, useEffect } from 'react';
import { FlightResult, TravelAPI, FlightSearchParams } from '../../api/travel/travel-api';
import FlightSearchForm from './FlightSearchForm';
import Card from '../shared/Card';
import Button from '../shared/Button';

const FlightSearch: React.FC = () => {
  const [searchResults, setSearchResults] = useState<FlightResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);

  const handleSearch = async (params: FlightSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const results = await TravelAPI.searchFlights(params);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search flights. Please try again later.');
      console.error('Error searching flights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookFlight = async (flightId: string) => {
    try {
      setLoading(true);
      // In a real application, you would get these IDs from the current context
      const customerId = 'sample-customer-id';
      const eventId = 'sample-event-id';
      
      await TravelAPI.bookFlight(flightId, customerId, eventId);
      alert('Flight booked successfully!');
    } catch (err) {
      setError('Failed to book flight. Please try again later.');
      console.error('Error booking flight:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <FlightSearchForm onSearch={handleSearch} isLoading={loading} />
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {loading && <div className="text-center py-4">Searching for flights...</div>}
      
      {!loading && searchResults.length === 0 ? (
        <Card>
          <div className="text-center py-4 text-gray-500">
            {error ? 'Error searching flights.' : 'No flights found. Try adjusting your search criteria.'}
          </div>
        </Card>
      ) : (
        <Card title="Flight Search Results">
          <div className="space-y-4">
            {searchResults.map((flight) => (
              <div 
                key={flight.id} 
                className={`p-4 border rounded-lg ${selectedFlight === flight.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setSelectedFlight(flight.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{flight.airline} - {flight.flightNumber}</h3>
                    <p className="text-sm text-gray-600">
                      {flight.departureAirport} to {flight.arrivalAirport}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{flight.price.amount} {flight.price.currency}</p>
                    <p className="text-sm text-gray-600">{flight.cabinClass}</p>
                  </div>
                </div>
                
                <div className="mt-2 flex justify-between items-center">
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Departure:</span> {flight.departureTime}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Arrival:</span> {flight.arrivalTime}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Duration: {Math.floor(flight.duration / 60)}h {flight.duration % 60}m</p>
                    <p>Stops: {flight.stops}</p>
                  </div>
                </div>
                
                {selectedFlight === flight.id && (
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={() => handleBookFlight(flight.id)}
                      disabled={loading}
                    >
                      {loading ? 'Booking...' : 'Book Flight'}
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

export default FlightSearch;
