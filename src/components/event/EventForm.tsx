import React, { useState } from 'react';
import Card from '../shared/Card';
import Input from '../shared/Input';
import Select from '../shared/Select';
import Button from '../shared/Button';
import { Event } from '../../models/event/event';

interface EventFormProps {
  event?: Partial<Event>;
  onSubmit: (event: Partial<Event>) => void;
  isLoading?: boolean;
  error?: string;
}

const EventForm: React.FC<EventFormProps> = ({
  event = {},
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [name, setName] = useState(event.name || '');
  const [description, setDescription] = useState(event.description || '');
  const [startDate, setStartDate] = useState(event.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '');
  const [endDate, setEndDate] = useState(event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '');
  const [location, setLocation] = useState(event.location || '');
  const [purpose, setPurpose] = useState(event.purpose || '');
  const [requiresApproval, setRequiresApproval] = useState(event.requiresApproval !== undefined ? event.requiresApproval : true);
  const [budgetAmount, setBudgetAmount] = useState(event.budget?.amount?.toString() || '');
  const [budgetCurrency, setBudgetCurrency] = useState(event.budget?.currency || 'USD');
  const [customerId, setCustomerId] = useState(event.customerId || '');
  const [formErrors, setFormErrors] = useState({
    name: '',
    startDate: '',
    customerId: '',
  });

  const validateForm = (): boolean => {
    const errors = {
      name: '',
      startDate: '',
      customerId: '',
    };
    let isValid = true;

    if (!name) {
      errors.name = 'Event name is required';
      isValid = false;
    }

    if (!startDate) {
      errors.startDate = 'Start date is required';
      isValid = false;
    }

    if (!customerId) {
      errors.customerId = 'Customer is required';
      isValid = false;
    }

    if (endDate && new Date(endDate) < new Date(startDate)) {
      errors.startDate = 'End date cannot be before start date';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedEvent: Partial<Event> = {
        ...event,
        name,
        description: description || undefined,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        location: location || undefined,
        purpose: purpose || undefined,
        requiresApproval,
        budget: budgetAmount ? {
          amount: parseFloat(budgetAmount),
          currency: budgetCurrency,
        } : undefined,
        customerId,
      };
      onSubmit(updatedEvent);
    }
  };

  const purposeOptions = [
    { value: '', label: 'Select Purpose' },
    { value: 'client_visit', label: 'Client Visit' },
    { value: 'prospect_meeting', label: 'Prospect Meeting' },
    { value: 'conference', label: 'Conference' },
    { value: 'training', label: 'Training' },
    { value: 'internal_meeting', label: 'Internal Meeting' },
    { value: 'other', label: 'Other' },
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'JPY', label: 'JPY' },
    { value: 'CAD', label: 'CAD' },
    { value: 'AUD', label: 'AUD' },
  ];

  return (
    <Card title={event.id ? 'Edit Event' : 'Create Event'}>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <Input
          id="name"
          label="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={formErrors.name}
          required
        />
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="startDate"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            error={formErrors.startDate}
            required
          />
          
          <Input
            id="endDate"
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        
        <Input
          id="location"
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        
        <Select
          id="purpose"
          label="Purpose"
          options={purposeOptions}
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        />
        
        <div className="mb-4">
          <div className="flex items-center">
            <input
              id="requiresApproval"
              type="checkbox"
              checked={requiresApproval}
              onChange={(e) => setRequiresApproval(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="requiresApproval" className="ml-2 block text-sm text-gray-700">
              Requires Approval
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <Input
                id="budgetAmount"
                label=""
                type="number"
                placeholder="Amount"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="mb-0"
              />
            </div>
            <div className="col-span-1">
              <Select
                id="budgetCurrency"
                label=""
                options={currencyOptions}
                value={budgetCurrency}
                onChange={(e) => setBudgetCurrency(e.target.value)}
                className="mb-0"
              />
            </div>
          </div>
        </div>
        
        <Input
          id="customerId"
          label="Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          error={formErrors.customerId}
          required
        />
        
        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (event.id ? 'Update Event' : 'Create Event')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EventForm;
