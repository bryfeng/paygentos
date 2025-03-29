"use client";

import React, { useState } from 'react';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Select from '../shared/Select';

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
  tripType: 'one_way' | 'round_trip';
}

interface FlightSearchFormProps {
  onSearch: (params: FlightSearchParams) => void;
  isLoading: boolean;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ onSearch, isLoading }) => {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    cabinClass: 'economy',
    tripType: 'round_trip'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 1
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Flight Search</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tripType"
                value="round_trip"
                checked={searchParams.tripType === 'round_trip'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Round Trip</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tripType"
                value="one_way"
                checked={searchParams.tripType === 'one_way'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2">One Way</span>
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cabin Class</label>
          <Select
            name="cabinClass"
            value={searchParams.cabinClass}
            onChange={handleChange}
            options={[
              { value: 'economy', label: 'Economy' },
              { value: 'premium_economy', label: 'Premium Economy' },
              { value: 'business', label: 'Business' },
              { value: 'first', label: 'First Class' }
            ]}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          label="Origin"
          name="origin"
          value={searchParams.origin}
          onChange={handleChange}
          placeholder="City or airport code"
          required
        />
        
        <Input
          label="Destination"
          name="destination"
          value={searchParams.destination}
          onChange={handleChange}
          placeholder="City or airport code"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          label="Departure Date"
          name="departureDate"
          type="date"
          value={searchParams.departureDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          required
        />
        
        {searchParams.tripType === 'round_trip' && (
          <Input
            label="Return Date"
            name="returnDate"
            type="date"
            value={searchParams.returnDate}
            onChange={handleChange}
            min={searchParams.departureDate || new Date().toISOString().split('T')[0]}
            required={searchParams.tripType === 'round_trip'}
          />
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input
          label="Passengers"
          name="passengers"
          type="number"
          value={searchParams.passengers.toString()}
          onChange={handleNumberChange}
          min="1"
          max="9"
          required
        />
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search Flights'}
        </Button>
      </div>
    </form>
  );
};

export default FlightSearchForm;
