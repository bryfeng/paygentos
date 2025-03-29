// Customer Profile per Item Model
export interface CustomerProfile {
  id: string;
  customerId: string;
  itemTypeId: string; // The type of item this profile is for (e.g., flight, hotel, car)
  preferences: {
    [key: string]: any; // Flexible structure for different preference types
  };
  frequentPrograms?: {
    programName: string;
    membershipId: string;
    level?: string;
  }[];
  paymentPreferences?: {
    preferredPaymentMethodId?: string;
    billingAddressId?: string;
  };
  complianceRequirements?: {
    [key: string]: any; // Compliance-specific requirements
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    [key: string]: any;
  };
}

// Default values for new customer profile
export const defaultCustomerProfile: Partial<CustomerProfile> = {
  preferences: {},
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Customer Profile validation
export const validateCustomerProfile = (profile: Partial<CustomerProfile>): string[] => {
  const errors: string[] = [];
  
  if (!profile.customerId) {
    errors.push('Customer ID is required');
  }
  
  if (!profile.itemTypeId) {
    errors.push('Item type ID is required');
  }
  
  if (!profile.preferences || Object.keys(profile.preferences).length === 0) {
    errors.push('At least one preference is required');
  }
  
  return errors;
};
