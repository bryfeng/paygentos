// Contact type enum
export enum ContactType {
  EMAIL = 'email',
  PHONE = 'phone',
  TELEGRAM = 'telegram',
  SLACK = 'slack',
  DISCORD = 'discord',
  WHATSAPP = 'whatsapp',
  SIGNAL = 'signal',
  OTHER = 'other'
}

// ID document type enum
export enum IdDocumentType {
  PASSPORT = 'passport',
  DRIVERS_LICENSE = 'drivers_license',
  NATIONAL_ID = 'national_id',
  RESIDENCE_PERMIT = 'residence_permit',
  SOCIAL_SECURITY = 'social_security',
  TAX_ID = 'tax_id',
  OTHER = 'other'
}

// Contact information type
export interface ContactInfo {
  type: ContactType;
  value: string;
  isPrimary?: boolean;
  label?: string;
}

// ID document type
export interface IdDocument {
  type: IdDocumentType;
  number: string;
  issuedBy?: string;
  issuedDate?: string | Date;
  expiryDate?: string | Date;
  isVerified?: boolean;
}

// Customer Model - focused on individuals
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;       // Computed or provided full name
  dob?: string | Date;     // Date of birth
  // Address information
  address?: string;        // Full address or street address
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  // Contact information
  contacts: ContactInfo[];  // Array of different contact methods
  preferredContactType?: ContactType;
  // Identity documents
  idDocuments?: IdDocument[];
  // Status
  isActive?: boolean;
  // System fields
  createdAt: string | Date;
  updatedAt: string | Date;
  // Additional fields
  notes?: string;
  tags?: string[];
  // Legacy fields (can be deprecated over time)
  email?: string;         // For backward compatibility
  phone?: string;         // For backward compatibility
  // For extensibility
  metadata?: {
    [key: string]: any;
  };
}

// Default values for new customer
export const defaultCustomer: Partial<Customer> = {
  contacts: [],
  preferredContactType: ContactType.EMAIL,
  idDocuments: [],
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
  
  // Check if at least one contact method exists
  if (!customer.contacts || customer.contacts.length === 0) {
    errors.push('At least one contact method is required');
  } else {
    // Validate that the primary contact information is properly formatted
    const primaryContact = customer.contacts.find(c => c.isPrimary);
    if (!primaryContact) {
      errors.push('At least one contact method must be marked as primary');
    } else if (primaryContact.type === ContactType.EMAIL && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(primaryContact.value)) {
      errors.push('Primary email format is invalid');
    }
  }
  
  // Validate date of birth if provided
  if (customer.dob) {
    const dobDate = new Date(customer.dob);
    const today = new Date();
    if (isNaN(dobDate.getTime())) {
      errors.push('Date of birth is invalid');
    } else if (dobDate > today) {
      errors.push('Date of birth cannot be in the future');
    }
  }
  
  return errors;
};

// Utility function to get primary contact
export const getPrimaryContact = (customer: Customer): ContactInfo | undefined => {
  return customer.contacts.find(contact => contact.isPrimary);
};

// Utility function to get contact by type
export const getContactByType = (customer: Customer, type: ContactType): ContactInfo | undefined => {
  return customer.contacts.find(contact => contact.type === type);
};

// Utility function to get full name
export const getFullName = (customer: Customer): string => {
  return customer.fullName || `${customer.firstName} ${customer.lastName}`;
};
