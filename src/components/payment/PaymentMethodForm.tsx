import React, { useState, useEffect } from 'react';
import { FiCreditCard, FiDollarSign, FiSmartphone, FiBriefcase, FiAlertCircle, FiCheck } from 'react-icons/fi';
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
    cvv: '',
    accountNumber: '',
    routingNumber: '',
    walletProvider: '',
    walletId: '',
    accountId: '',
  });
  
  // Add a success state
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const validateForm = (): boolean => {
    const errors = {
      name: '',
      cardNumber: '',
      cardholderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      accountNumber: '',
      routingNumber: '',
      walletProvider: '',
      walletId: '',
      accountId: '',
    };
    let isValid = true;

    if (!name.trim()) {
      errors.name = 'Payment method name is required';
      isValid = false;
    }

    if (type === 'credit_card' || type === 'debit_card') {
      if (!cardNumber) {
        errors.cardNumber = 'Card number is required';
        isValid = false;
      } else if (!/^[0-9]{13,19}$/.test(cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = 'Please enter a valid card number';
        isValid = false;
      }
      
      if (!cardholderName.trim()) {
        errors.cardholderName = 'Cardholder name is required';
        isValid = false;
      }
      
      if (!expiryMonth) {
        errors.expiryMonth = 'Expiry month is required';
        isValid = false;
      } else if (parseInt(expiryMonth) < 1 || parseInt(expiryMonth) > 12) {
        errors.expiryMonth = 'Please enter a valid month (1-12)';
        isValid = false;
      }
      
      if (!expiryYear) {
        errors.expiryYear = 'Expiry year is required';
        isValid = false;
      } else {
        const currentYear = new Date().getFullYear();
        if (parseInt(expiryYear) < currentYear) {
          errors.expiryYear = 'Card is expired';
          isValid = false;
        }
      }
      
      // CVV validation
      if (!cvv) {
        errors.cvv = 'Security code is required';
        isValid = false;
      } else if (!/^[0-9]{3,4}$/.test(cvv)) {
        errors.cvv = 'Please enter a valid security code';
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

  // Add cvv state
  const [cvv, setCvv] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitSuccessful(false);
    if (validateForm()) {
      const details: any = {};
      
      if (type === 'credit_card' || type === 'debit_card') {
        details.cardNumber = cardNumber;
        details.cardholderName = cardholderName;
        details.expiryMonth = parseInt(expiryMonth, 10);
        details.expiryYear = parseInt(expiryYear, 10);
        details.cvv = cvv; // Add CVV to details
        // Mask the card number for display in UI
        details.maskedNumber = cardNumber.replace(/^(\d{4})[\d\s]+(\d{4})$/, '$1 •••• •••• $2');
      } else if (type === 'bank_account') {
        details.accountNumber = accountNumber;
        details.routingNumber = routingNumber;
        details.accountType = accountType;
        // Mask the account number for display in UI
        details.maskedAccountNumber = '••••' + accountNumber.slice(-4);
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
      setIsSubmitSuccessful(true);
      
      // Clear form if it's a new payment method
      if (!paymentMethod.id) {
        resetForm();
      }
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

  const resetForm = () => {
    setName('');
    setCardNumber('');
    setCardholderName('');
    setExpiryMonth('');
    setExpiryYear('');
    setCvv('');
    setAccountNumber('');
    setRoutingNumber('');
    setAccountType(accountTypeOptions[0].value as 'checking' | 'savings' | 'business');
    setWalletProvider('');
    setWalletId('');
    setAccountId('');
    setDepartmentCode('');
    setCostCenter('');
    setFormErrors({
      name: '',
      cardNumber: '',
      cardholderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      accountNumber: '',
      routingNumber: '',
      walletProvider: '',
      walletId: '',
      accountId: '',
    });
  };

  // Clear success message after some time
  useEffect(() => {
    if (isSubmitSuccessful) {
      const timer = setTimeout(() => {
        setIsSubmitSuccessful(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitSuccessful]);

  const getPaymentTypeIcon = () => {
    switch(type) {
      case 'credit_card':
      case 'debit_card':
        return <FiCreditCard className="h-6 w-6 text-blue-500" />;
      case 'bank_account':
        return <FiDollarSign className="h-6 w-6 text-green-500" />;
      case 'digital_wallet':
        return <FiSmartphone className="h-6 w-6 text-purple-500" />;
      case 'corporate_account':
        return <FiBriefcase className="h-6 w-6 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <Card title={paymentMethod.id ? 'Edit Payment Method' : 'Add Payment Method'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
            <FiAlertCircle className="mr-2 flex-shrink-0" />
            {error}
          </div>
        )}
        
        {isSubmitSuccessful && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            Payment method {paymentMethod.id ? 'updated' : 'added'} successfully!
          </div>
        )}
        
        <Select
          id="type"
          label="Payment Method Type"
          options={paymentTypeOptions}
          value={type}
          onChange={(e) => setType(e.target.value as 'credit_card' | 'debit_card' | 'bank_account' | 'digital_wallet' | 'corporate_account' | 'other')}
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
        
        <div className="flex items-center mb-4 mt-2">
          <div className="mr-3">
            {getPaymentTypeIcon()}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              {paymentTypeOptions.find(option => option.value === type)?.label}
            </h3>
            <p className="text-xs text-gray-500">
              {type === 'credit_card' ? 'Secure credit card processing' : 
               type === 'debit_card' ? 'Direct bank card payment' :
               type === 'bank_account' ? 'Link your bank account' :
               type === 'digital_wallet' ? 'Use your digital wallet' :
               'Link your corporate account'}
            </p>
          </div>
        </div>

        {/* Credit/Debit Card Fields */}
        {(type === 'credit_card' || type === 'debit_card') && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <Input
              id="cardNumber"
              label="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              error={formErrors.cardNumber}
              placeholder="1234 5678 9012 3456"
              required
            />
            
            <Input
              id="cardholderName"
              label="Cardholder Name"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              error={formErrors.cardholderName}
              placeholder="John Doe"
              required
            />
            
            <div className="grid grid-cols-3 gap-4">
              <Input
                id="expiryMonth"
                label="Expiry Month (MM)"
                type="number"
                value={expiryMonth}
                onChange={(e) => setExpiryMonth(e.target.value)}
                error={formErrors.expiryMonth}
                placeholder="MM"
                required
              />
              
              <Input
                id="expiryYear"
                label="Expiry Year (YYYY)"
                type="number"
                value={expiryYear}
                onChange={(e) => setExpiryYear(e.target.value)}
                error={formErrors.expiryYear}
                placeholder="YYYY"
                required
              />
              
              <Input
                id="cvv"
                label="CVV/Security Code"
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                error={formErrors.cvv}
                placeholder="123"
                required
              />
            </div>
          </div>
        )}
        
        {/* Bank Account Fields */}
        {type === 'bank_account' && (
          <div className="bg-green-50 p-4 rounded-lg">
            <Input
              id="accountNumber"
              label="Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              error={formErrors.accountNumber}
              placeholder="Account number"
              required
            />
            
            <Input
              id="routingNumber"
              label="Routing Number"
              value={routingNumber}
              onChange={(e) => setRoutingNumber(e.target.value)}
              error={formErrors.routingNumber}
              placeholder="9-digit routing number"
              required
            />
            
            <Select
              id="accountType"
              label="Account Type"
              options={accountTypeOptions}
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as 'checking' | 'savings' | 'business')}
            />
          </div>
        )}
        
        {/* Digital Wallet Fields */}
        {type === 'digital_wallet' && (
          <div className="bg-purple-50 p-4 rounded-lg">
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
              label="Wallet ID or Email"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              error={formErrors.walletId}
              placeholder="ID or email associated with wallet"
              required
            />
          </div>
        )}
        
        {/* Corporate Account Fields */}
        {type === 'corporate_account' && (
          <div className="bg-orange-50 p-4 rounded-lg">
            <Input
              id="accountId"
              label="Account ID"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              error={formErrors.accountId}
              placeholder="Corporate account ID"
              required
            />
            
            <Input
              id="departmentCode"
              label="Department Code"
              value={departmentCode}
              onChange={(e) => setDepartmentCode(e.target.value)}
              placeholder="Optional: Department code"
            />
            
            <Input
              id="costCenter"
              label="Cost Center"
              value={costCenter}
              onChange={(e) => setCostCenter(e.target.value)}
              placeholder="Optional: Cost center code"
            />
          </div>
        )}
        
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={resetForm}
            disabled={isLoading}
          >
            Reset Form
          </Button>
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
