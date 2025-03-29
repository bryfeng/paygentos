import Link from 'next/link'

export default function PaymentAbstractionPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <Link href="/" className="text-blue-500 hover:underline mb-8 block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Payment Abstraction Layer</h1>
        
        <div className="bg-white/30 p-8 rounded-lg shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-4">Payment Abstraction Overview</h2>
          <p className="mb-4">
            The Payment Abstraction Layer provides core concepts that abstract payment mechanisms into simple, reusable components
            that can be applied across various payment scenarios.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Core Components</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Link href="#" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold">Customer Management</h4>
              <p className="text-sm text-gray-600">Manage individuals or entities for whom payments are being made</p>
            </Link>
            
            <Link href="#" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold">Event Management</h4>
              <p className="text-sm text-gray-600">Handle occasions that trigger the need for payments</p>
            </Link>
            
            <Link href="#" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold">Item Management</h4>
              <p className="text-sm text-gray-600">Manage goods or services being purchased</p>
            </Link>
            
            <Link href="#" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold">Profile Management</h4>
              <p className="text-sm text-gray-600">Handle context-specific information for customers</p>
            </Link>
            
            <Link href="#" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold">Wallet Management</h4>
              <p className="text-sm text-gray-600">Manage payment methods and funds available</p>
            </Link>
            
            <Link href="#" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold">Ledger Management</h4>
              <p className="text-sm text-gray-600">Track all financial transactions</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
