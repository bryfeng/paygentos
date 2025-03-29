// Ledger Model
export interface Ledger {
  id: string;
  transactionId: string;
  customerId: string;
  eventId?: string;
  itemId?: string;
  walletId: string;
  paymentMethodId?: string;
  amount: number;
  currency: string;
  type: 'charge' | 'refund' | 'authorization' | 'capture' | 'void' | 'transfer';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  paymentProcessor?: {
    name: string;
    transactionId: string;
    responseCode?: string;
    responseMessage?: string;
  };
  expenseCategory?: string;
  receiptUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    [key: string]: any;
  };
}

// Default values for new ledger entry
export const defaultLedger: Partial<Ledger> = {
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Ledger validation
export const validateLedger = (ledger: Partial<Ledger>): string[] => {
  const errors: string[] = [];
  
  if (!ledger.transactionId) {
    errors.push('Transaction ID is required');
  }
  
  if (!ledger.customerId) {
    errors.push('Customer ID is required');
  }
  
  if (!ledger.walletId) {
    errors.push('Wallet ID is required');
  }
  
  if (ledger.amount === undefined || ledger.amount === null) {
    errors.push('Amount is required');
  }
  
  if (!ledger.currency) {
    errors.push('Currency is required');
  }
  
  if (!ledger.type) {
    errors.push('Transaction type is required');
  }
  
  if (!ledger.status) {
    errors.push('Transaction status is required');
  }
  
  return errors;
};
