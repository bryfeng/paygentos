import React from 'react';
import { FiUsers, FiCalendar, FiClock, FiDollarSign } from 'react-icons/fi';
import Card from '../shared/Card';

interface DashboardStatsProps {
  stats: {
    totalCustomers: number;
    activeEvents: number;
    pendingBookings: number;
    totalExpenses: number;
    expenseAmount: {
      amount: number;
      currency: string;
    };
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-blue-500" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalCustomers}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <FiUsers className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <span className="text-sm text-blue-600 font-medium">+12% from last month</span>
          </div>
        </Card>
        
        <Card className="border-l-4 border-green-500" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active Events</p>
              <p className="text-2xl font-bold text-gray-800">{stats.activeEvents}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <FiCalendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <span className="text-sm text-green-600 font-medium">+5% from last month</span>
          </div>
        </Card>
        
        <Card className="border-l-4 border-yellow-500" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Pending Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingBookings}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <FiClock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <span className="text-sm text-yellow-600 font-medium">Needs attention</span>
          </div>
        </Card>
        
        <Card className="border-l-4 border-purple-500" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Expenses</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-800 mr-2">
                  {stats.expenseAmount.amount} {stats.expenseAmount.currency}
                </p>
                <p className="text-sm text-gray-500">({stats.totalExpenses} transactions)</p>
              </div>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <FiDollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <span className="text-sm text-purple-600 font-medium">+8.2% from last month</span>
          </div>
        </Card>
      </div>
    </>
  );
};

export default DashboardStats;
