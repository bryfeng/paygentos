// Wallet Model
export interface Wallet {
  id: string;
  customerId: string;
  name: string;
  description?: string;
  paymentMethods: PaymentMethod[];
  balance?: {
    amount: number;
    currency: string;
  };
  spendingLimits?: {
    daily?: number;
    weekly?: number;
    monthly?: number;
    perTransaction?: number;
  };
  authorizationRules?: {
    requiresApprovalAbove?: number;
    approverIds?: string[];
    allowedCategories?: string[];
    restrictedCategories?: string[];
  };
  securityFeatures?: {
    tokenized: boolean;
    requiresMFA: boolean;
    lastVerifiedAt?: Date;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    [key: string]: any;
  };
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'bank_account' | 'digital_wallet' | 'corporate_account' | 'other';
  name: string;
  isDefault: boolean;
  details: {
    // Credit/Debit Card
    cardNumber?: string; // Raw card number (only used during form input, never stored)
    maskedCardNumber?: string; // Masked version for display (e.g., •••• •••• •••• 1234)
    maskedNumber?: string; // Alternative format for masking (for compatibility)
    cardholderName?: string;
    expiryMonth?: number;
    expiryYear?: number;
    billingAddress?: Address;
    
    // Bank Account
    accountNumber?: string; // Raw account number (only used during form input, never stored)
    maskedAccountNumber?: string; // Masked version for display (e.g., ••••5678)
    routingNumber?: string;
    accountType?: 'checking' | 'savings' | 'business';
    
    // Digital Wallet
    walletProvider?: string;
    walletId?: string;
    
    // Corporate Account
    accountId?: string;
    departmentCode?: string;
    costCenter?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Default values for new wallet
export const defaultWallet: Partial<Wallet> = {
  paymentMethods: [],
  securityFeatures: {
    tokenized: true,
    requiresMFA: false
  },
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Wallet validation
export const validateWallet = (wallet: Partial<Wallet>): string[] => {
  const errors: string[] = [];
  
  if (!wallet.customerId) {
    errors.push('Customer ID is required');
  }
  
  if (!wallet.name) {
    errors.push('Wallet name is required');
  }
  
  return errors;
};
