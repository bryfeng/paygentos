import Link from 'next/link';
import { FiBarChart2, FiUsers, FiCalendar, FiCreditCard, FiLayers, FiShoppingBag, FiTrendingUp, FiMap } from 'react-icons/fi';

export default function Home() {
  // Mock data for quick stats
  const stats = [
    { label: 'Active Customers', value: '124', icon: <FiUsers className="text-blue-500" />, change: '+12%' },
    { label: 'Transactions', value: '854', icon: <FiCreditCard className="text-green-500" />, change: '+8.2%' },
    { label: 'Travel Bookings', value: '35', icon: <FiShoppingBag className="text-purple-500" />, change: '+4.5%' },
    { label: 'Revenue', value: '$12,548', icon: <FiTrendingUp className="text-indigo-500" />, change: '+10.3%' },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Payment Agent Platform</h2>
              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <FiUsers className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  124 active customers
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <FiCreditCard className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  854 transactions this month
                </div>
              </div>
            </div>
            <div className="mt-5 flex lg:mt-0 lg:ml-4">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Platform Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:translate-y-[-2px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</p>
                </div>
                <div className="p-3 rounded-full bg-gray-50 shadow-inner">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard" className="bg-white rounded-md p-4 shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col items-center justify-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <FiBarChart2 className="text-blue-600 h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-900">Dashboard</span>
          </Link>
            
          <Link href="/customers" className="bg-white rounded-md p-4 shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col items-center justify-center text-center">
            <div className="bg-indigo-100 p-3 rounded-full mb-3">
              <FiUsers className="text-indigo-600 h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-900">Customers</span>
          </Link>
            
          <Link href="/events" className="bg-white rounded-md p-4 shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col items-center justify-center text-center">
            <div className="bg-purple-100 p-3 rounded-full mb-3">
              <FiCalendar className="text-purple-600 h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-900">Events</span>
          </Link>
            
          <Link href="/payment-methods" className="bg-white rounded-md p-4 shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col items-center justify-center text-center">
            <div className="bg-green-100 p-3 rounded-full mb-3">
              <FiCreditCard className="text-green-600 h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-900">Payment Methods</span>
          </Link>
        </div>
      </div>
      
      {/* Main Workflow Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Agent Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-gray-200">
            <div className="flex items-center">
              <FiShoppingBag className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">Agent Management</h3>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Configure and manage payment-enabled agents</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <Link 
                href="/agent-applications/travel-agent" 
                className="block hover:bg-gray-50 p-3 rounded-md transition border border-gray-100 hover:border-blue-200"
              >
                <div className="flex items-center">
                  <FiMap className="text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Travel Agent</p>
                    <p className="text-xs text-gray-500">Manage travel bookings and payments</p>
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/payment-abstraction" 
                className="block hover:bg-gray-50 p-3 rounded-md transition border border-gray-100 hover:border-blue-200"
              >
                <div className="flex items-center">
                  <FiLayers className="text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Abstraction</p>
                    <p className="text-xs text-gray-500">Core payment mechanism configuration</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Customer Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <div className="flex items-center">
              <FiUsers className="h-5 w-5 text-indigo-500 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Management</h3>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage customers and their payment histories</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <Link 
                href="/customers" 
                className="block hover:bg-gray-50 p-3 rounded-md transition border border-gray-100 hover:border-indigo-200"
              >
                <div className="flex items-center">
                  <FiUsers className="text-indigo-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Customer Directory</p>
                    <p className="text-xs text-gray-500">View and manage customer accounts</p>
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/events" 
                className="block hover:bg-gray-50 p-3 rounded-md transition border border-gray-100 hover:border-indigo-200"
              >
                <div className="flex items-center">
                  <FiCalendar className="text-indigo-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Customer Events</p>
                    <p className="text-xs text-gray-500">Track customer payment activities</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Payment Operations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-green-50 border-b border-gray-200">
            <div className="flex items-center">
              <FiCreditCard className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Operations</h3>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Configure and monitor payment methods</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <Link 
                href="/payment-methods" 
                className="block hover:bg-gray-50 p-3 rounded-md transition border border-gray-100 hover:border-green-200"
              >
                <div className="flex items-center">
                  <FiCreditCard className="text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Methods</p>
                    <p className="text-xs text-gray-500">Configure supported payment types</p>
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/dashboard" 
                className="block hover:bg-gray-50 p-3 rounded-md transition border border-gray-100 hover:border-green-200"
              >
                <div className="flex items-center">
                  <FiBarChart2 className="text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Analytics</p>
                    <p className="text-xs text-gray-500">Monitor transaction performance</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Platform Features */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <FiTrendingUp className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Platform Features</h3>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-blue-600">Payment Abstraction</dt>
              <dd className="mt-1 text-sm text-gray-600">Simplifies complex payment mechanisms into reusable, consistent concepts across different scenarios.</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-green-600">Multi-payment Support</dt>
              <dd className="mt-1 text-sm text-gray-600">Supports various payment methods with consistent handling patterns across different regions and currencies.</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-purple-600">Security Compliance</dt>
              <dd className="mt-1 text-sm text-gray-600">Built-in security features adhering to financial regulations and data protection standards.</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-indigo-600">Scalable Design</dt>
              <dd className="mt-1 text-sm text-gray-600">Handles growing transaction volumes with efficient processing capabilities that scale with your business.</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
