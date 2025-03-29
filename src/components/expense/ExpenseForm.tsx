import React, { useState } from 'react';
import Card from '../shared/Card';
import Input from '../shared/Input';
import Select from '../shared/Select';
import Button from '../shared/Button';
import { Ledger } from '../../models/ledger/ledger';

interface ExpenseFormProps {
  expense?: Partial<Ledger>;
  onSubmit: (expense: Partial<Ledger>) => void;
  isLoading?: boolean;
  error?: string;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expense = {},
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [amount, setAmount] = useState(expense.amount?.toString() || '');
  const [currency, setCurrency] = useState(expense.currency || 'USD');
  const [description, setDescription] = useState(expense.description || '');
  const [expenseCategory, setExpenseCategory] = useState(expense.expenseCategory || '');
  const [customerId, setCustomerId] = useState(expense.customerId || '');
  const [eventId, setEventId] = useState(expense.eventId || '');
  const [itemId, setItemId] = useState(expense.itemId || '');
  const [walletId, setWalletId] = useState(expense.walletId || '');
  const [paymentMethodId, setPaymentMethodId] = useState(expense.paymentMethodId || '');
  const [notes, setNotes] = useState(expense.notes || '');
  const [receiptUrl, setReceiptUrl] = useState(expense.receiptUrl || '');
  const [formErrors, setFormErrors] = useState({
    amount: '',
    currency: '',
    description: '',
    customerId: '',
    walletId: '',
  });

  const validateForm = (): boolean => {
    const errors = {
      amount: '',
      currency: '',
      description: '',
      customerId: '',
      walletId: '',
    };
    let isValid = true;

    if (!amount || parseFloat(amount) <= 0) {
      errors.amount = 'Valid amount is required';
      isValid = false;
    }

    if (!currency) {
      errors.currency = 'Currency is required';
      isValid = false;
    }

    if (!description) {
      errors.description = 'Description is required';
      isValid = false;
    }

    if (!customerId) {
      errors.customerId = 'Customer ID is required';
      isValid = false;
    }

    if (!walletId) {
      errors.walletId = 'Wallet ID is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedExpense: Partial<Ledger> = {
        ...expense,
        amount: parseFloat(amount),
        currency,
        description,
        expenseCategory: expenseCategory || undefined,
        customerId,
        eventId: eventId || undefined,
        itemId: itemId || undefined,
        walletId,
        paymentMethodId: paymentMethodId || undefined,
        notes: notes || undefined,
        receiptUrl: receiptUrl || undefined,
        type: 'charge',
        status: 'completed',
      };
      onSubmit(updatedExpense);
    }
  };

  const currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'JPY', label: 'JPY' },
    { value: 'CAD', label: 'CAD' },
    { value: 'AUD', label: 'AUD' },
  ];

  const expenseCategoryOptions = [
    { value: '', label: 'Select Category' },
    { value: 'airfare', label: 'Airfare' },
    { value: 'lodging', label: 'Lodging' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'meals', label: 'Meals & Entertainment' },
    { value: 'conference', label: 'Conference & Registration' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Card title={expense.id ? 'Edit Expense' : 'Add Expense'}>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Input
              id="amount"
              label="Amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={formErrors.amount}
              required
            />
          </div>
          
          <Select
            id="currency"
            label="Currency"
            options={currencyOptions}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            error={formErrors.currency}
            required
          />
        </div>
        
        <Input
          id="description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={formErrors.description}
          required
        />
        
        <Select
          id="expenseCategory"
          label="Expense Category"
          options={expenseCategoryOptions}
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
        />
        
        <Input
          id="customerId"
          label="Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          error={formErrors.customerId}
          required
        />
        
        <Input
          id="eventId"
          label="Event ID (Optional)"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        />
        
        <Input
          id="itemId"
          label="Item ID (Optional)"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
        />
        
        <Input
          id="walletId"
          label="Wallet ID"
          value={walletId}
          onChange={(e) => setWalletId(e.target.value)}
          error={formErrors.walletId}
          required
        />
        
        <Input
          id="paymentMethodId"
          label="Payment Method ID (Optional)"
          value={paymentMethodId}
          onChange={(e) => setPaymentMethodId(e.target.value)}
        />
        
        <Input
          id="receiptUrl"
          label="Receipt URL (Optional)"
          value={receiptUrl}
          onChange={(e) => setReceiptUrl(e.target.value)}
        />
        
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (expense.id ? 'Update Expense' : 'Add Expense')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ExpenseForm;
