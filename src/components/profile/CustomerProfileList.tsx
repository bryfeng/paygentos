import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/outline';
import styles from '@/styles/components/ProfileList.module.css';

type CustomerProfileListProps = {
  customerId: string;
};

// Mock data - replace with actual API calls
const mockProfiles = [
  {
    id: '1',
    customer_id: '123',
    profile_name: 'Business Travel',
    item_type: 'flight',
    is_default: true,
    description: 'Default profile for all business flights',
    created_at: '2025-01-15T09:00:00Z',
    updated_at: '2025-02-20T14:30:00Z',
  },
  {
    id: '2',
    customer_id: '123',
    profile_name: 'Conference Stays',
    item_type: 'hotel',
    is_default: true,
    description: 'Hotel preferences for conference attendance',
    created_at: '2025-01-15T09:00:00Z',
    updated_at: '2025-01-15T09:00:00Z',
  },
];

export default function CustomerProfileList({ customerId }: CustomerProfileListProps) {
  const [profiles, setProfiles] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      // Get customer info
      setCustomer({
        id: customerId,
        name: 'John Doe',
        email: 'john@example.com',
      });
      
      // Get profiles
      setProfiles(mockProfiles.filter(p => p.customer_id === customerId));
      setLoading(false);
    }, 500);
  }, [customerId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingIcon}>
          {/* Loading spinner icon */}
        </div>
        <p className={styles.loadingText}>Loading profiles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          {/* Error icon */}
        </div>
        <h3 className={styles.errorTitle}>Failed to load profiles</h3>
        <p className={styles.errorMessage}>{error}</p>
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
        <div className={styles.headerLeft}>
          <Link href={`/customers/${customerId}`} className={styles.backLink}>
            Back to Customer
          </Link>
          <h1 className={styles.title}>
            {customer ? `${customer.name}'s Profiles` : 'Customer Profiles'}
          </h1>
        </div>
        <Link href={`/customers/${customerId}/profiles/new`} className={styles.addButton}>
          <PlusIcon className={styles.addButtonIcon} width={20} height={20} />
          Add Profile
        </Link>
      </div>
      
      <div className={styles.profilesGrid}>
        {profiles.length > 0 ? (
          profiles.map(profile => (
            <div key={profile.id} className={styles.profileCard}>
              <h2 className={styles.profileName}>{profile.profile_name}</h2>
              <p className={styles.profileDescription}>{profile.description}</p>
              <p className={styles.profileItemType}>Item Type: {profile.item_type}</p>
              <p className={styles.profileDefaultStatus}>
                {profile.is_default ? 'Default Profile' : 'Custom Profile'}
              </p>
              <div className={styles.profileActions}>
                <Link href={`/customers/${customerId}/profiles/${profile.id}`} className={styles.viewButton}>
                  View
                </Link>
                <Link href={`/customers/${customerId}/profiles/${profile.id}/edit`} className={styles.editButton}>
                  Edit
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              {/* Empty state icon */}
            </div>
            <h3 className={styles.emptyTitle}>No profiles found</h3>
            <p className={styles.emptyDescription}>
              Get started by creating your first profile
            </p>
            <Link href={`/customers/${customerId}/profiles/new`} className={styles.emptyButton}>
              Create Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
