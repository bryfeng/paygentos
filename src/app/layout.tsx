import Navbar from '../components/shared/Navbar';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className="h-full flex">
        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <Navbar />
        </div>
        
        {/* Mobile Navbar (optional, handled inside Navbar component) */}
        {/* <Navbar /> */}
        
        {/* Main content area */}
        <div className="flex flex-col flex-1 lg:pl-64">
          {/* Optional top bar for mobile/smaller screens or additional controls */}
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow lg:hidden">
            {/* Mobile menu button placeholder - logic might be in Navbar */}
            <button type="button" className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden">
              <span className="sr-only">Open sidebar</span>
              {/* Heroicon name: outline/bars-3-bottom-left */}
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
            </button>
            {/* Add search or other top bar elements here if needed */}
            <div className="flex-1 px-4 flex justify-between"></div>
          </div>
          
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
          
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="py-4 text-center text-sm text-gray-500">
                <p> {new Date().getFullYear()} Payment Agent Platform. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
