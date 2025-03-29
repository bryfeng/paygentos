import React from 'react';
import Dashboard from '../../components/dashboard/Dashboard';
import { FiRefreshCw, FiFilter, FiDownload, FiCalendar, FiList } from 'react-icons/fi';

export default function DashboardPage() {
  return (
    <div>
      {/* Page header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Monitor your platform performance and activity</p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <span className="hidden md:inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <FiCalendar className="-ml-1 mr-1.5 h-4 w-4" />
                Last 30 days
              </span>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                <FiRefreshCw className="-ml-1 mr-2 h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter bar */}
      <div className="bg-white border-t border-b border-gray-200 mt-2 mb-5">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex space-x-4">
              <button className="inline-flex items-center text-sm text-gray-700 hover:text-blue-600">
                <FiList className="mr-1.5 h-4 w-4" />
                All Activities
              </button>
              <button className="inline-flex items-center text-sm text-gray-700 hover:text-blue-600">
                <FiCalendar className="mr-1.5 h-4 w-4" />
                This Week
              </button>
            </div>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                <FiFilter className="-ml-1 mr-1 h-4 w-4" />
                Filter
              </button>
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                <FiDownload className="-ml-1 mr-1 h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard content */}
      <Dashboard />
    </div>
  );
}
