import Link from 'next/link'

export default function TravelAgentPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <Link href="/" className="text-blue-500 hover:underline mb-8 block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Travel Agent</h1>
        
        <div className="bg-white/30 p-8 rounded-lg shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-4">Travel Agent Overview</h2>
          <p className="mb-4">
            The travel agent application demonstrates how the platform can replace human travel agents in a corporate setting,
            handling the booking of flights, hotels, and other travel services for employees visiting clients or attending conferences.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Key Features</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Flight search and booking</li>
            <li>Hotel search and booking</li>
            <li>Car rental search and booking</li>
            <li>Travel expense management</li>
            <li>Travel policy compliance</li>
          </ul>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <Link href="#" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold">Flight Booking</h4>
              <p className="text-sm text-gray-600">Search and book flights for corporate travel</p>
            </Link>
            
            <Link href="#" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold">Hotel Booking</h4>
              <p className="text-sm text-gray-600">Find and reserve accommodations</p>
            </Link>
            
            <Link href="#" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold">Car Rental</h4>
              <p className="text-sm text-gray-600">Arrange ground transportation</p>
            </Link>
            
            <Link href="#" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold">Expense Management</h4>
              <p className="text-sm text-gray-600">Track and manage travel expenses</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
