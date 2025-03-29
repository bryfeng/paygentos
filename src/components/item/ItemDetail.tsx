"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import styles from '@/styles/components/ItemDetail.module.css';

type ItemDetailProps = {
  id: string;
};

// Mock data - replace with actual API call
const mockItem = {
  id: '1',
  name: 'Flight to New York',
  type: 'flight',
  status: 'purchased',
  total_price: 450.00,
  currency: 'USD',
  vendor: { name: 'Delta Airlines' },
  event: { name: 'Business Conference' },
  description: 'Round trip flight to NYC for business conference',
};

export default function ItemDetail({ id }: ItemDetailProps) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setItem(mockItem);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error || !item) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>Item not found</h1>
        <p className={styles.errorMessage}>We couldn't find the item you're looking for.</p>
        <button 
          className={styles.retryButton}
          onClick={() => {
            setLoading(true);
            setError(null);
            // Retry logic
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/items" className={styles.backLink}>
          <ArrowLeftIcon className={styles.backIcon} width={16} height={16} />
          Back to Items
        </Link>
        <h1 className={styles.pageTitle}>{item.name}</h1>
      </div>

      <div className={styles.card}>
        <div className={styles.cardSection}>
          <h3 className={styles.sectionTitle}>Item Details</h3>
          <p className={styles.itemDescription}>{item.description}</p>
          <p className={styles.itemType}>Type: {item.type}</p>
          <p className={styles.itemStatus}>Status: {item.status}</p>
        </div>

        <div className={styles.cardSection}>
          <h3 className={styles.sectionTitle}>Pricing</h3>
          <p className={styles.itemPrice}>Total Price: {item.total_price} {item.currency}</p>
        </div>

        <div className={styles.cardSection}>
          <h3 className={styles.sectionTitle}>Vendor Information</h3>
          <p className={styles.itemVendor}>Vendor: {item.vendor.name}</p>
        </div>

        <div className={styles.cardSection}>
          <h3 className={styles.sectionTitle}>Event Association</h3>
          <p className={styles.itemEvent}>Event: {item.event.name}</p>
        </div>
      </div>
    </div>
  );
}
