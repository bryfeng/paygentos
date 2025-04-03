import React from 'react';
import Link from 'next/link';
import { FiCreditCard, FiDollarSign, FiSmartphone, FiBriefcase, FiPlus, FiChevronRight } from 'react-icons/fi';
import Card from '../shared/Card';

// Mock payment type data
const MOCK_PAYMENT_TYPES = [
  {
    id: 1,
    name: 'Credit Card',
    icon: <FiCreditCard className="h-5 w-5 text-blue-500" />,
    color: 'bg-blue-100',
    count: 5,
    description: 'Process credit card payments securely',
    route: '/payment-methods/credit_card'
  },
  {
    id: 2,
    name: 'Bank Account',
    icon: <FiDollarSign className="h-5 w-5 text-green-500" />,
    color: 'bg-green-100',
    count: 3,
    description: 'Direct bank transfers and ACH',
    route: '/payment-methods/bank_account'
  },
  {
    id: 3,
    name: 'Digital Wallet',
    icon: <FiSmartphone className="h-5 w-5 text-purple-500" />,
    color: 'bg-purple-100',
    count: 2,
    description: 'Accept payments via digital wallets',
    route: '/payment-methods/digital_wallet'
  },
  {
    id: 4,
    name: 'Corporate Account',
    icon: <FiBriefcase className="h-5 w-5 text-orange-500" />,
    color: 'bg-orange-100',
    count: 1,
    description: 'Track payments to corporate accounts',
    route: '/payment-methods/corporate_account'
  }
];

const PaymentTypes: React.FC = () => {
  return (
    <Card title="Payment Types">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Configure and manage payment types for your clients and events
          </p>
          <Link 
            href="/payment-methods/new" 
            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
          >
            <FiPlus className="mr-1" /> Add New Payment Method
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOCK_PAYMENT_TYPES.map((type) => (
            <div key={type.id} className={`p-4 rounded-lg ${type.color} hover:shadow-md transition-shadow`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {type.icon}
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">{type.name}</h3>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600 mr-2">
                    {type.count} active
                  </span>
                  <Link 
                    href={type.route} 
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <FiChevronRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-4">
          <Link 
            href="/wallet/payment-methods" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View all payment methods →
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default PaymentTypes;
