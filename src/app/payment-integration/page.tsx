import Link from 'next/link'

export default function PaymentIntegrationPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <Link href="/" className="text-blue-500 hover:underline mb-8 block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Payment Integration Layer</h1>
        
        <div className="bg-white/30 p-8 rounded-lg shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-4">Payment Integration Overview</h2>
          <p className="mb-4">
            The Payment Integration Layer provides connections to external payment systems,
            enabling secure and reliable payment processing for the platform.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Integration Components</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Link href="#" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold">Payment Processors</h4>
              <p className="text-sm text-gray-600">Integration with payment processing services</p>
            </Link>
            
            <Link href="#" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold">Banking Systems</h4>
              <p className="text-sm text-gray-600">Connections to banking and financial institutions</p>
            </Link>
            
            <Link href="#" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold">Expense Management</h4>
              <p className="text-sm text-gray-600">Integration with expense tracking and reporting systems</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
