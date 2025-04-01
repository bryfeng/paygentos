"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import styles from '@/styles/components/ItemList.module.css';
import ItemForm from './ItemForm';

// Mock data - replace with actual API calls
const mockItems = [
  {
    id: '1',
    name: 'Flight to New York',
    type: 'flight',
    status: 'purchased',
    total_price: 450.00,
    currency: 'USD',
    vendor: { name: 'Delta Airlines' },
    event: { name: 'Business Conference' },
  },
  {
    id: '2',
    name: 'Hotel Accommodation',
    type: 'hotel',
    status: 'reserved',
    total_price: 780.00,
    currency: 'USD',
    vendor: { name: 'Marriott' },
    event: { name: 'Business Conference' },
  },
];

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setItems(mockItems);
      setLoading(false);
    }, 500);
  }, []);

  const handleAddItem = () => {
    setSelectedItemId(null);
    setShowFormModal(true);
  };

  const handleEditItem = (itemId) => {
    setSelectedItemId(itemId);
    setShowFormModal(true);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
  };

  const handleSaveItem = (itemData) => {
    // In a real app, you'd make an API call to save the item
    // For this demo, we'll just update the local state
    if (selectedItemId) {
      // Update existing item
      setItems(items.map(item => 
        item.id === selectedItemId ? { ...item, ...itemData } : item
      ));
    } else {
      // Add new item
      const newItem = {
        id: Date.now().toString(),
        ...itemData
      };
      setItems([...items, newItem]);
    }
    setShowFormModal(false);
  };

  const handleDeleteItem = (itemId) => {
    if (confirm('Are you sure you want to delete this item?')) {
      // In a real app, you'd make an API call to delete the item
      // For this demo, we'll just update the local state
      setItems(items.filter(item => item.id !== itemId));
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingIcon}>
          {/* Loading spinner icon */}
        </div>
        <p className={styles.loadingText}>Loading items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          {/* Error icon */}
        </div>
        <h3 className={styles.errorTitle}>Failed to load items</h3>
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
        <h1 className={styles.title}>Items</h1>
        <button onClick={handleAddItem} className={styles.addButton}>
          <PlusIcon className={styles.addButtonIcon} width={20} height={20} />
          Add Item
        </button>
      </div>
      
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="itemType">Item Type:</label>
          <select id="itemType" className={styles.filterSelect}>
            <option value="">All Types</option>
            <option value="flight">Flight</option>
            <option value="hotel">Hotel</option>
            <option value="car_rental">Car Rental</option>
            <option value="conference">Conference</option>
            <option value="product">Product</option>
            <option value="service">Service</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="status">Status:</label>
          <select id="status" className={styles.filterSelect}>
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="purchased">Purchased</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      <div className={styles.itemsGrid}>
        {items.length > 0 ? (
          items.map(item => (
            <div key={item.id} className={styles.itemCard}>
              <div className={styles.itemHeader}>
                <span className={`${styles.itemStatus} ${styles[item.status]}`}>
                  {item.status}
                </span>
                <span className={`${styles.itemType} ${styles[item.type]}`}>
                  {item.type}
                </span>
              </div>
              <h2 className={styles.itemName}>{item.name}</h2>
              {item.total_price && item.currency && (
                <p className={styles.itemPrice}>
                  {item.total_price} {item.currency}
                </p>
              )}
              <p className={styles.itemVendor}>
                Vendor: {item.vendor && item.vendor.name ? item.vendor.name : 'N/A'}
              </p>
              {item.event && (
                <p className={styles.itemEvent}>
                  Event: {item.event.name || 'N/A'}
                </p>
              )}
              <div className={styles.itemActions}>
                <button onClick={() => handleEditItem(item.id)} className={styles.editButton}>
                  Edit
                </button>
                <Link href={`/items/${item.id}`} className={styles.viewButton}>
                  View
                </Link>
                <button 
                  onClick={() => handleDeleteItem(item.id)} 
                  className={styles.deleteButton}
                  aria-label="Delete item"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              {/* Empty state icon */}
            </div>
            <h3 className={styles.emptyTitle}>No items found</h3>
            <p className={styles.emptyDescription}>
              Get started by creating your first item
            </p>
            <button onClick={handleAddItem} className={styles.emptyButton}>
              Create Item
            </button>
          </div>
        )}
      </div>

      {/* Item Form Modal */}
      {showFormModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <ItemForm
              id={selectedItemId}
              onClose={handleCloseModal}
              onSave={handleSaveItem}
            />
          </div>
        </div>
      )}
    </div>
  );
}
