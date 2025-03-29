import React, { useState } from 'react';
import Card from '../shared/Card';
import Input from '../shared/Input';
import Select from '../shared/Select';
import Button from '../shared/Button';
import { PaymentMethod } from '../../models/wallet/wallet';

interface PaymentMethodFormProps {
  paymentMethod?: Partial<PaymentMethod>;
  onSubmit: (paymentMethod: Partial<PaymentMethod>) => void;
  isLoading?: boolean;
  error?: string;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  paymentMethod = {},
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [type, setType] = useState(paymentMethod.type || 'credit_card');
  const [name, setName] = useState(paymentMethod.name || '');
  const [isDefault, setIsDefault] = useState(paymentMethod.isDefault || false);
  
  // Credit/Debit Card fields
  const [cardNumber, setCardNumber] = useState(paymentMethod.details?.cardNumber || '');
  const [cardholderName, setCardholderName] = useState(paymentMethod.details?.cardholderName || '');
  const [expiryMonth, setExpiryMonth] = useState(paymentMethod.details?.expiryMonth?.toString() || '');
  const [expiryYear, setExpiryYear] = useState(paymentMethod.details?.expiryYear?.toString() || '');
  
  // Bank Account fields
  const [accountNumber, setAccountNumber] = useState(paymentMethod.details?.accountNumber || '');
  const [routingNumber, setRoutingNumber] = useState(paymentMethod.details?.routingNumber || '');
  const [accountType, setAccountType] = useState(paymentMethod.details?.accountType || 'checking');
  
  // Digital Wallet fields
  const [walletProvider, setWalletProvider] = useState(paymentMethod.details?.walletProvider || '');
  const [walletId, setWalletId] = useState(paymentMethod.details?.walletId || '');
  
  // Corporate Account fields
  const [accountId, setAccountId] = useState(paymentMethod.details?.accountId || '');
  const [departmentCode, setDepartmentCode] = useState(paymentMethod.details?.departmentCode || '');
  const [costCenter, setCostCenter] = useState(paymentMethod.details?.costCenter || '');
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    accountNumber: '',
    routingNumber: '',
    walletProvider: '',
    walletId: '',
    accountId: '',
  });

  const validateForm = (): boolean => {
    const errors = {
      name: '',
      cardNumber: '',
      cardholderName: '',
      expiryMonth: '',
      expiryYear: '',
      accountNumber: '',
      routingNumber: '',
      walletProvider: '',
      walletId: '',
      accountId: '',
    };
    let isValid = true;

    if (!name) {
      errors.name = 'Payment method name is required';
      isValid = false;
    }

    if (type === 'credit_card' || type === 'debit_card') {
      if (!cardNumber) {
        errors.cardNumber = 'Card number is required';
        isValid = false;
      }
      
      if (!cardholderName) {
        errors.cardholderName = 'Cardholder name is required';
        isValid = false;
      }
      
      if (!expiryMonth) {
        errors.expiryMonth = 'Expiry month is required';
        isValid = false;
      }
      
      if (!expiryYear) {
        errors.expiryYear = 'Expiry year is required';
        isValid = false;
      }
    } else if (type === 'bank_account') {
      if (!accountNumber) {
        errors.accountNumber = 'Account number is required';
        isValid = false;
      }
      
      if (!routingNumber) {
        errors.routingNumber = 'Routing number is required';
        isValid = false;
      }
    } else if (type === 'digital_wallet') {
      if (!walletProvider) {
        errors.walletProvider = 'Wallet provider is required';
        isValid = false;
      }
      
      if (!walletId) {
        errors.walletId = 'Wallet ID is required';
        isValid = false;
      }
    } else if (type === 'corporate_account') {
      if (!accountId) {
        errors.accountId = 'Account ID is required';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const details: any = {};
      
      if (type === 'credit_card' || type === 'debit_card') {
        details.cardNumber = cardNumber;
        details.cardholderName = cardholderName;
        details.expiryMonth = parseInt(expiryMonth, 10);
        details.expiryYear = parseInt(expiryYear, 10);
      } else if (type === 'bank_account') {
        details.accountNumber = accountNumber;
        details.routingNumber = routingNumber;
        details.accountType = accountType;
      } else if (type === 'digital_wallet') {
        details.walletProvider = walletProvider;
        details.walletId = walletId;
      } else if (type === 'corporate_account') {
        details.accountId = accountId;
        details.departmentCode = departmentCode || undefined;
        details.costCenter = costCenter || undefined;
      }
      
      const updatedPaymentMethod: Partial<PaymentMethod> = {
        ...paymentMethod,
        type: type as any,
        name,
        isDefault,
        details,
      };
      
      onSubmit(updatedPaymentMethod);
    }
  };

  const paymentTypeOptions = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'bank_account', label: 'Bank Account' },
    { value: 'digital_wallet', label: 'Digital Wallet' },
    { value: 'corporate_account', label: 'Corporate Account' },
    { value: 'other', label: 'Other' },
  ];

  const accountTypeOptions = [
    { value: 'checking', label: 'Checking' },
    { value: 'savings', label: 'Savings' },
    { value: 'business', label: 'Business' },
  ];

  const walletProviderOptions = [
    { value: 'paypal', label: 'PayPal' },
    { value: 'apple_pay', label: 'Apple Pay' },
    { value: 'google_pay', label: 'Google Pay' },
    { value: 'venmo', label: 'Venmo' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Card title={paymentMethod.id ? 'Edit Payment Method' : 'Add Payment Method'}>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <Select
          id="type"
          label="Payment Method Type"
          options={paymentTypeOptions}
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
        
        <Input
          id="name"
          label="Name"
          placeholder="e.g., Corporate Amex, Personal Visa"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={formErrors.name}
          required
        />
        
        <div className="mb-4">
          <div className="flex items-center">
            <input
              id="isDefault"
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
              Set as default payment method
            </label>
          </div>
        </div>
        
        {/* Credit/Debit Card Fields */}
        {(type === 'credit_card' || type === 'debit_card') && (
          <>
            <Input
              id="cardNumber"
              label="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              error={formErrors.cardNumber}
              required
            />
            
            <Input
              id="cardholderName"
              label="Cardholder Name"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              error={formErrors.cardholderName}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="expiryMonth"
                label="Expiry Month (MM)"
                type="number"
                min="1"
                max="12"
                value={expiryMonth}
                onChange={(e) => setExpiryMonth(e.target.value)}
                error={formErrors.expiryMonth}
                required
              />
              
              <Input
                id="expiryYear"
                label="Expiry Year (YYYY)"
                type="number"
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 20}
                value={expiryYear}
                onChange={(e) => setExpiryYear(e.target.value)}
                error={formErrors.expiryYear}
                required
              />
            </div>
          </>
        )}
        
        {/* Bank Account Fields */}
        {type === 'bank_account' && (
          <>
            <Input
              id="accountNumber"
              label="Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              error={formErrors.accountNumber}
              required
            />
            
            <Input
              id="routingNumber"
              label="Routing Number"
              value={routingNumber}
              onChange={(e) => setRoutingNumber(e.target.value)}
              error={formErrors.routingNumber}
              required
            />
            
            <Select
              id="accountType"
              label="Account Type"
              options={accountTypeOptions}
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            />
          </>
        )}
        
        {/* Digital Wallet Fields */}
        {type === 'digital_wallet' && (
          <>
            <Select
              id="walletProvider"
              label="Wallet Provider"
              options={walletProviderOptions}
              value={walletProvider}
              onChange={(e) => setWalletProvider(e.target.value)}
              error={formErrors.walletProvider}
              required
            />
            
            <Input
              id="walletId"
              label="Wallet ID"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              error={formErrors.walletId}
              required
            />
          </>
        )}
        
        {/* Corporate Account Fields */}
        {type === 'corporate_account' && (
          <>
            <Input
              id="accountId"
              label="Account ID"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              error={formErrors.accountId}
              required
            />
            
            <Input
              id="departmentCode"
              label="Department Code"
              value={departmentCode}
              onChange={(e) => setDepartmentCode(e.target.value)}
            />
            
            <Input
              id="costCenter"
              label="Cost Center"
              value={costCenter}
              onChange={(e) => setCostCenter(e.target.value)}
            />
          </>
        )}
        
        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (paymentMethod.id ? 'Update Payment Method' : 'Add Payment Method')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PaymentMethodForm;
