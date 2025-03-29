// Customer Model
export interface Customer {
  id: string;
  name?: string;          // Full name or company name
  firstName?: string;    // For individual customers
  lastName?: string;     // For individual customers
  email: string;
  phone?: string;
  address?: string;      // Full address
  company?: string;
  role?: string;
  department?: string;
  isActive?: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  preferences?: {
    [key: string]: any;
  };
  metadata?: {
    [key: string]: any;
  };
}

// Default values for new customer
export const defaultCustomer: Partial<Customer> = {
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Customer validation
export const validateCustomer = (customer: Partial<Customer>): string[] => {
  const errors: string[] = [];
  
  if (!customer.firstName) {
    errors.push('First name is required');
  }
  
  if (!customer.lastName) {
    errors.push('Last name is required');
  }
  
  if (!customer.email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    errors.push('Email format is invalid');
  }
  
  return errors;
};
