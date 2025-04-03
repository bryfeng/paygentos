"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiPieChart, FiUsers, FiCalendar, FiCreditCard, FiMap, FiMenu, FiX, FiBell, FiBox, FiShield, FiGrid, FiTag, FiLayers } from 'react-icons/fi';
import styles from '../../styles/components/Navbar.module.css';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const getNavLinkClass = (href: string) => {
    return pathname === href
      ? `${styles.navLink} ${styles.navLinkActive}`
      : styles.navLink;
  };
  
  const getMobileNavLinkClass = (href: string) => {
    return pathname === href ? `${styles.mobileNavLink} ${styles.mobileNavLinkActive}` : styles.mobileNavLink;
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: <FiPieChart className="h-5 w-5" /> },
    { href: '/customers', label: 'Customers', icon: <FiUsers className="h-5 w-5" /> },
    { href: '/events', label: 'Events', icon: <FiCalendar className="h-5 w-5" /> },
    { href: '/items', label: 'Items', icon: <FiBox className="h-5 w-5" /> },
    { href: '/groups', label: 'Groups', icon: <FiLayers className="h-5 w-5" /> },
    { href: '/vendors', label: 'Vendors', icon: <FiUsers className="h-5 w-5" /> },
    { href: '/payment-methods', label: 'Payment Methods', icon: <FiCreditCard className="h-5 w-5" /> },
    { href: '/agent-applications/travel-agent', label: 'Travel Agent', icon: <FiMap className="h-5 w-5" /> },
    { href: '/policies', label: 'Policies', icon: <FiShield className="h-5 w-5" /> },
  ];

  return (
    <div className={`${styles.sidebarContainer} bg-gray-800 text-white flex flex-col`}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <Link href="/" className="text-xl font-bold text-white">
          Payment Agent
        </Link>
      </div>

      {/* Navigation Links Section */}
      <nav className={styles.navSection}>
        {navLinks.map((link) => (
          <Link 
            key={link.href} 
            href={link.href} 
            className={getNavLinkClass(link.href)}
          >
            <span className={styles.navIcon}>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Spacer to push profile section to bottom */}
      <div className="flex-grow"></div>

      {/* Profile Section */}
      <div className={styles.profileSection}>
        {/* Notification button (Optional in sidebar) */}
        {/* <button type="button" className="rounded-full p-1 text-gray-400 hover:text-white focus:outline-none"> ... </button> */}
        
        <div className={styles.profileContent}>
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
            JD
          </div>
          <span className="ml-3 text-sm font-medium text-gray-200">John Doe</span>
        </div>
      </div>
      
      {/* Mobile Menu (Conditional rendering, might need adjustments based on trigger mechanism) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-gray-800 bg-opacity-75 z-40" onClick={toggleMobileMenu}></div>
      )}
      {isMobileMenuOpen && (
        <div className={`${styles.mobileMenuContainer} lg:hidden fixed inset-y-0 left-0 w-64 bg-gray-800 z-50 flex flex-col`}>
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <span className="text-white font-bold">Menu</span>
            <button onClick={toggleMobileMenu} className="text-gray-400 hover:text-white">
              <FiX className="h-6 w-6" />
            </button>
          </div>
          {/* Mobile Menu Links */}
          <nav className="flex-1 p-4 space-y-1">
            {navLinks.map((link) => (
              <Link 
                key={`mobile-${link.href}`} 
                href={link.href} 
                className={getMobileNavLinkClass(link.href)}
                onClick={toggleMobileMenu} // Close menu on link click
              >
                <span className={styles.navIcon}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
          {/* Optional: Mobile Profile Section */}
        </div>
      )}
    </div>
  );
}
