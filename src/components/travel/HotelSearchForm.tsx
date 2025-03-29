"use client";

import React, { useState } from 'react';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Select from '../shared/Select';

export interface HotelSearchParams {
  location: string;
  checkInDate: string;
  checkOutDate: string;
  rooms: number;
  guests: number;
  starRating?: number;
}

interface HotelSearchFormProps {
  onSearch: (params: HotelSearchParams) => void;
  isLoading: boolean;
}

const HotelSearchForm: React.FC<HotelSearchFormProps> = ({ onSearch, isLoading }) => {
  const [searchParams, setSearchParams] = useState<HotelSearchParams>({
    location: '',
    checkInDate: '',
    checkOutDate: '',
    rooms: 1,
    guests: 1,
    starRating: undefined
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
      <h2 className="text-xl font-semibold mb-4">Hotel Search</h2>
      
      <div className="mb-4">
        <Input
          label="Location"
          name="location"
          value={searchParams.location}
          onChange={handleChange}
          placeholder="City, region, or specific hotel"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          label="Check-in Date"
          name="checkInDate"
          type="date"
          value={searchParams.checkInDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          required
        />
        
        <Input
          label="Check-out Date"
          name="checkOutDate"
          type="date"
          value={searchParams.checkOutDate}
          onChange={handleChange}
          min={searchParams.checkInDate || new Date().toISOString().split('T')[0]}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input
          label="Rooms"
          name="rooms"
          type="number"
          value={searchParams.rooms.toString()}
          onChange={handleNumberChange}
          min="1"
          max="10"
          required
        />
        
        <Input
          label="Guests"
          name="guests"
          type="number"
          value={searchParams.guests.toString()}
          onChange={handleNumberChange}
          min="1"
          max="20"
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Star Rating</label>
          <Select
            name="starRating"
            value={searchParams.starRating?.toString() || ''}
            onChange={handleChange}
            options={[
              { value: '', label: 'Any Rating' },
              { value: '3', label: '3+ Stars' },
              { value: '4', label: '4+ Stars' },
              { value: '5', label: '5 Stars' }
            ]}
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search Hotels'}
        </Button>
      </div>
    </form>
  );
};

export default HotelSearchForm;
