"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiPieChart, FiUsers, FiCalendar, FiCreditCard, FiMap, FiMenu, FiX, FiBell, FiBox } from 'react-icons/fi';
import styles from '../../styles/components/Navbar.module.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const getNavLinkClass = (href: string) => {
    return pathname === href ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;
  };
  
  const getMobileNavLinkClass = (href: string) => {
    return pathname === href ? `${styles.mobileNavLink} ${styles.mobileNavLinkActive}` : styles.mobileNavLink;
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: <FiHome className="h-5 w-5" /> },
    { href: '/dashboard', label: 'Dashboard', icon: <FiPieChart className="h-5 w-5" /> },
    { href: '/customers', label: 'Customers', icon: <FiUsers className="h-5 w-5" /> },
    { href: '/events', label: 'Events', icon: <FiCalendar className="h-5 w-5" /> },
    { href: '/items', label: 'Items', icon: <FiBox className="h-5 w-5" /> },
    { href: '/payment-methods', label: 'Payment Methods', icon: <FiCreditCard className="h-5 w-5" /> },
    { href: '/agent-applications/travel-agent', label: 'Travel Agent', icon: <FiMap className="h-5 w-5" /> },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className={styles.navbarContainer}>
        <div className={styles.navbarFlex}>
          {/* Logo */}
          <div className={styles.logo}>
            <Link href="/" className="text-xl font-bold text-blue-700">
              Payment Agent Platform
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={getNavLinkClass(link.href)}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className={styles.rightIcons}>
            {/* Notification button */}
            <button type="button" className="rounded-full p-1 text-gray-500 hover:bg-gray-100 focus:outline-none">
              <span className="sr-only">View notifications</span>
              <FiBell className="h-6 w-6" />
              <span className="absolute top-3 right-3 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* Profile dropdown */}
            <div className={styles.profileContainer}>
              <div className={styles.profileContent}>
                <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-medium">
                  JD
                </div>
                <span className="hidden md:inline-block text-sm font-medium text-gray-700">John Doe</span>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden ml-4">
              <button 
                onClick={toggleMenu} 
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <FiX className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <FiMenu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-sm">
          <div className={styles.mobileMenuContent}>
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={getMobileNavLinkClass(link.href)}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
