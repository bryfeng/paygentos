/**
 * PaymentType Model
 * Represents different types of payments (Recurring/Subscription, Single, Streaming)
 */
export interface PaymentType {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Default payment types matching the database seed data
 */
export const defaultPaymentTypes: PaymentType[] = [
  {
    id: 1,
    name: 'Recurring/Subscription',
    description: 'Regular recurring payment on a fixed schedule',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Single',
    description: 'One-time payment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Streaming',
    description: 'Variable/metered payment based on usage',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * PaymentPolicy Model
 * Links policies with permitted payment types
 */
export interface PaymentPolicy {
  id: number;
  policyId: number;
  paymentTypeId: number;
  createdAt: string;
  updatedAt: string;
}
