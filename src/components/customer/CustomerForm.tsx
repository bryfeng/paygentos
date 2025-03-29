import React, { useState } from 'react';
import Card from '../shared/Card';
import Input from '../shared/Input';
import Select from '../shared/Select';
import Button from '../shared/Button';
import { Customer } from '../../models/customer/customer';

interface CustomerFormProps {
  customer?: Partial<Customer>;
  onSubmit: (customer: Partial<Customer>) => void;
  isLoading?: boolean;
  error?: string;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer = {},
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [firstName, setFirstName] = useState(customer.firstName || '');
  const [lastName, setLastName] = useState(customer.lastName || '');
  const [email, setEmail] = useState(customer.email || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [company, setCompany] = useState(customer.company || '');
  const [role, setRole] = useState(customer.role || '');
  const [department, setDepartment] = useState(customer.department || '');
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const validateForm = (): boolean => {
    const errors = {
      firstName: '',
      lastName: '',
      email: '',
    };
    let isValid = true;

    if (!firstName) {
      errors.firstName = 'First name is required';
      isValid = false;
    }

    if (!lastName) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedCustomer: Partial<Customer> = {
        ...customer,
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        company: company || undefined,
        role: role || undefined,
        department: department || undefined,
      };
      onSubmit(updatedCustomer);
    }
  };

  const departmentOptions = [
    { value: '', label: 'Select Department' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'finance', label: 'Finance' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'operations', label: 'Operations' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Card title={customer.id ? 'Edit Customer' : 'Add Customer'}>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="firstName"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={formErrors.firstName}
            required
          />
          
          <Input
            id="lastName"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={formErrors.lastName}
            required
          />
        </div>
        
        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={formErrors.email}
          required
        />
        
        <Input
          id="phone"
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        
        <Input
          id="company"
          label="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        
        <Input
          id="role"
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        
        <Select
          id="department"
          label="Department"
          options={departmentOptions}
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        
        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (customer.id ? 'Update Customer' : 'Add Customer')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CustomerForm;
