"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import styles from '@/styles/components/ItemList.module.css';
import ItemForm from './ItemForm';
import { ItemAPI } from '@/api/item/item-api';

// Define interface for items from the database
interface DatabaseItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  properties: any;
  status: string;
  created_at: string;
  updated_at: string;
  group_id: string | null;
}

// Type conversion helper that maps API item to DatabaseItem
function mapToDatabaseItems(items: any[]): DatabaseItem[] {
  return items.map(item => ({
    id: item.id || '',
    name: item.name || '',
    description: item.description || null,
    category: item.category || item.type || 'general',
    properties: item.properties || {},
    status: item.status || 'active',
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString(),
    group_id: item.group_id || null
  }));
}

export default function ItemList() {
  const [items, setItems] = useState<DatabaseItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<DatabaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const fetchedItems = await ItemAPI.getItems();
        const dbItems = mapToDatabaseItems(fetchedItems);
        setItems(dbItems);
        setFilteredItems(dbItems);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError(err.message || 'Failed to load items');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, []);
  
  // Apply filters when filter states change
  useEffect(() => {
    let result = [...items];
    
    // Apply category filter
    if (categoryFilter) {
      result = result.filter(item => item.category === categoryFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(item => item.status === statusFilter);
    }
    
    setFilteredItems(result);
  }, [items, categoryFilter, statusFilter]);

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

  const handleSaveItem = async (itemData: any) => {
    try {
      if (selectedItemId) {
        // Update existing item via API
        const updatedItem = await ItemAPI.updateItem(selectedItemId, itemData);
        // Convert to DatabaseItem type with proper mapping
        const typedUpdatedItem = mapToDatabaseItems([updatedItem])[0];
        setItems(items.map(item => 
          item.id === selectedItemId ? typedUpdatedItem : item
        ));
      } else {
        // Add new item via API
        const newItem = await ItemAPI.createItem(itemData);
        // Convert to DatabaseItem type with proper mapping
        const typedNewItem = mapToDatabaseItems([newItem])[0];
        setItems([...items, typedNewItem]);
      }
      setShowFormModal(false);
    } catch (err: any) {
      console.error('Error saving item:', err);
      setError(err.message || 'Failed to save item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        // Delete item via API
        await ItemAPI.deleteItem(itemId);
        // Update state after successful deletion
        setItems(items.filter(item => item.id !== itemId));
      } catch (err: any) {
        console.error('Error deleting item:', err);
        setError(err.message || 'Failed to delete item');
      }
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
          <label htmlFor="itemType">Item Category:</label>
          <select 
            id="itemType" 
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="flight">Flight</option>
            <option value="hotel">Hotel</option>
            <option value="car_rental">Car Rental</option>
            <option value="conference">Conference</option>
            <option value="product">Product</option>
            <option value="service">Service</option>
            <option value="general">General</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="status">Status:</label>
          <select 
            id="status" 
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="purchased">Purchased</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        {(categoryFilter || statusFilter) && (
          <button
            onClick={() => {
              setCategoryFilter('');
              setStatusFilter('');
            }}
            className={styles.resetButton}
          >
            Reset Filters
          </button>
        )}
      </div>
      
      <div className={styles.itemsGrid}>
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} className={styles.itemCard}>
              <div className={styles.itemHeader}>
                <span className={`${styles.itemStatus} ${styles[item.status || 'active']}`}>
                  {item.status || 'Active'}
                </span>
                <span className={`${styles.itemType} ${styles[item.category || 'general']}`}>
                  {item.category || 'General'}
                </span>
              </div>
              <h2 className={styles.itemName}>{item.name}</h2>
              {item.properties?.price && (
                <p className={styles.itemPrice}>
                  {item.properties.price.amount} {item.properties.price.currency || 'USD'}
                </p>
              )}
              <p className={styles.itemVendor}>
                Vendor: {item.properties?.vendor?.name || 'N/A'}
              </p>
              {item.properties?.event && (
                <p className={styles.itemEvent}>
                  Event: {item.properties.event.name || 'N/A'}
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
        ) : loading ? null : (
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
