"use client";

import React, { useState, useEffect } from 'react';
import { HotelResult, TravelAPI, HotelSearchParams } from '../../api/travel/travel-api';
import HotelSearchForm from './HotelSearchForm';
import Card from '../shared/Card';
import Button from '../shared/Button';

const HotelSearch: React.FC = () => {
  const [searchResults, setSearchResults] = useState<HotelResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);

  const handleSearch = async (params: HotelSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const results = await TravelAPI.searchHotels(params);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search hotels. Please try again later.');
      console.error('Error searching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookHotel = async (hotelId: string) => {
    try {
      setLoading(true);
      // In a real application, you would get these IDs from the current context
      const customerId = 'sample-customer-id';
      const eventId = 'sample-event-id';
      
      await TravelAPI.bookHotel(hotelId, customerId, eventId);
      alert('Hotel booked successfully!');
    } catch (err) {
      setError('Failed to book hotel. Please try again later.');
      console.error('Error booking hotel:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <HotelSearchForm onSearch={handleSearch} isLoading={loading} />
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {loading && <div className="text-center py-4">Searching for hotels...</div>}
      
      {!loading && searchResults.length === 0 ? (
        <Card>
          <div className="text-center py-4 text-gray-500">
            {error ? 'Error searching hotels.' : 'No hotels found. Try adjusting your search criteria.'}
          </div>
        </Card>
      ) : (
        <Card title="Hotel Search Results">
          <div className="space-y-4">
            {searchResults.map((hotel) => (
              <div 
                key={hotel.id} 
                className={`p-4 border rounded-lg ${selectedHotel === hotel.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setSelectedHotel(hotel.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{hotel.name}</h3>
                    <p className="text-sm text-gray-600">{hotel.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {hotel.price.amount} {hotel.price.currency}
                      {hotel.price.perNight && <span className="text-sm font-normal"> per night</span>}
                    </p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < hotel.starRating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm">
                    <span className="font-medium">Room Type:</span> {hotel.roomType}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Amenities:</span> {hotel.amenities.join(', ')}
                  </p>
                </div>
                
                {selectedHotel === hotel.id && (
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={() => handleBookHotel(hotel.id)}
                      disabled={loading}
                    >
                      {loading ? 'Booking...' : 'Book Hotel'}
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

export default HotelSearch;
