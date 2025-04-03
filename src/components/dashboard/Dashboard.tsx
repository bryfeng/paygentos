"use client";

import React, { useState, useEffect } from 'react';
import { CustomerAPI } from '../../api/customer/customer-api';
import { EventAPI } from '../../api/event/event-api';
import { LedgerAPI } from '../../api/ledger/ledger-api';
import DashboardStats from './DashboardStats';
import RecentActivity from './RecentActivity';
import UpcomingPayments from './UpcomingPayments';
import PaymentTypes from './PaymentTypes';
import Card from '../shared/Card';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeEvents: 0,
    pendingBookings: 0,
    totalExpenses: 0,
    expenseAmount: {
      amount: 0,
      currency: 'USD'
    }
  });
  
  const [activities, setActivities] = useState<any[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch customers
        const customers = await CustomerAPI.getCustomers();
        
        // Fetch events
        const events = await EventAPI.getEvents();
        const activeEvents = events.filter(event => 
          new Date(event.endDate || event.startDate) >= new Date()
        );
        
        // Fetch ledger entries (expenses)
        const ledgerEntries = await LedgerAPI.getLedgerEntries();
        const expenses = ledgerEntries.filter(entry => entry.type === 'charge');
        
        // Calculate total expense amount
        const totalExpenseAmount = expenses.reduce((total, expense) => {
          if (expense.currency === 'USD') {
            return total + expense.amount;
          }
          return total;
        }, 0);
        
        // Update stats
        setStats({
          totalCustomers: customers.length,
          activeEvents: activeEvents.length,
          pendingBookings: 0, // This would come from a booking service in a real app
          totalExpenses: expenses.length,
          expenseAmount: {
            amount: totalExpenseAmount,
            currency: 'USD'
          }
        });
        
        // Create recent activities from various data sources
        const recentActivities = [
          ...customers.slice(0, 3).map(customer => ({
            id: `customer-${customer.id}`,
            type: 'customer',
            title: 'New Customer',
            description: `${customer.firstName} ${customer.lastName} was added`,
            timestamp: customer.createdAt || new Date().toISOString(),
          })),
          ...events.slice(0, 3).map(event => ({
            id: `event-${event.id}`,
            type: 'event',
            title: 'Event Created',
            description: event.name,
            timestamp: event.createdAt || new Date().toISOString(),
            status: event.approvalStatus || 'pending'
          })),
          ...expenses.slice(0, 3).map(expense => ({
            id: `expense-${expense.id}`,
            type: 'expense',
            title: 'Expense Recorded',
            description: `${expense.amount} ${expense.currency} - ${expense.description}`,
            timestamp: expense.createdAt || new Date().toISOString(),
            status: expense.status
          }))
        ];
        
        // Sort by timestamp (newest first)
        recentActivities.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setActivities(recentActivities.slice(0, 5));
        
        // Set upcoming payments (pending expenses in a real app)
        setUpcomingPayments(expenses.filter(expense => expense.status === 'pending'));
        
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-4">Loading dashboard data...</div>
      ) : (
        <>
          <DashboardStats stats={stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity activities={activities} />
            <UpcomingPayments payments={upcomingPayments} />
          </div>
          

          
          <Card title="Quick Actions">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <a href="/customers/new" className="block p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100">
                <div className="text-3xl mb-2">👤</div>
                <h3 className="font-medium">Add Customer</h3>
              </a>
              <a href="/events/new" className="block p-4 bg-green-50 rounded-lg text-center hover:bg-green-100">
                <div className="text-3xl mb-2">📅</div>
                <h3 className="font-medium">Create Event</h3>
              </a>
              <a href="/payment-methods/new" className="block p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100">
                <div className="text-3xl mb-2">💳</div>
                <h3 className="font-medium">Add Payment Method</h3>
              </a>
              <a href="/travel/flights" className="block p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100">
                <div className="text-3xl mb-2">✈️</div>
                <h3 className="font-medium">Book Travel</h3>
              </a>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
