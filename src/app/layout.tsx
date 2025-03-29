import Navbar from '../components/shared/Navbar';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full flex flex-col">
        <Navbar />
        
        <div className="flex flex-col flex-1">
          <main className="flex-1 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
              {children}
            </div>
          </main>
          
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="py-4 text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} Payment Agent Platform. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
