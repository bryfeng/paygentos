"use client";

import React, { useState } from 'react';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Select from '../shared/Select';

export interface CarSearchParams {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  carType?: string;
}

interface CarSearchFormProps {
  onSearch: (params: CarSearchParams) => void;
  isLoading: boolean;
}

const CarSearchForm: React.FC<CarSearchFormProps> = ({ onSearch, isLoading }) => {
  const [searchParams, setSearchParams] = useState<CarSearchParams>({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    dropoffDate: '',
    carType: undefined
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSameLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSearchParams(prev => ({
        ...prev,
        dropoffLocation: prev.pickupLocation
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Car Rental Search</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          label="Pickup Location"
          name="pickupLocation"
          value={searchParams.pickupLocation}
          onChange={handleChange}
          placeholder="City, airport, or address"
          required
        />
        
        <div>
          <Input
            label="Dropoff Location"
            name="dropoffLocation"
            value={searchParams.dropoffLocation}
            onChange={handleChange}
            placeholder="City, airport, or address"
            required
          />
          <div className="mt-1">
            <label className="inline-flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                onChange={handleSameLocation}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="ml-2">Same as pickup location</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          label="Pickup Date & Time"
          name="pickupDate"
          type="datetime-local"
          value={searchParams.pickupDate}
          onChange={handleChange}
          min={new Date().toISOString().slice(0, 16)}
          required
        />
        
        <Input
          label="Dropoff Date & Time"
          name="dropoffDate"
          type="datetime-local"
          value={searchParams.dropoffDate}
          onChange={handleChange}
          min={searchParams.pickupDate || new Date().toISOString().slice(0, 16)}
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Car Type</label>
        <Select
          name="carType"
          value={searchParams.carType || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Any Car Type' },
            { value: 'economy', label: 'Economy' },
            { value: 'compact', label: 'Compact' },
            { value: 'midsize', label: 'Midsize' },
            { value: 'fullsize', label: 'Full Size' },
            { value: 'suv', label: 'SUV' },
            { value: 'luxury', label: 'Luxury' }
          ]}
        />
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search Cars'}
        </Button>
      </div>
    </form>
  );
};

export default CarSearchForm;
