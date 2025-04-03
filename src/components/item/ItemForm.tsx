"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { ItemGroup, ItemGroupAPI } from '@/api/item/item-group-api';
import { ItemAPI } from '@/api/item/item-api';
import styles from '@/styles/components/ItemForm.module.css';

type ItemFormProps = {
  id?: string;
  onClose?: () => void;
  onSave?: (formData: any) => void;
};

export default function ItemForm({ id, onClose, onSave }: ItemFormProps) {
  const router = useRouter();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    vendor_id: '',
    vendor_name: '',
    group_id: '',
    // Additional fields based on item type would be conditionally rendered
  });
  
  const [itemGroups, setItemGroups] = useState<ItemGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch item groups regardless of edit/create mode
    const fetchItemGroups = async () => {
      setLoadingGroups(true);
      try {
        const groups = await ItemGroupAPI.getItemGroups();
        setItemGroups(groups);
      } catch (error) {
        console.error('Error fetching item groups:', error);
      } finally {
        setLoadingGroups(false);
      }
    };
    
    fetchItemGroups();
    
    if (isEditing) {
      // Fetch item data
      // For demo, we'll use mock data
      setTimeout(() => {
        setFormData({
          name: 'Flight to New York',
          description: 'Round trip flight to NYC for business conference',
          type: 'flight',
          vendor_id: '123',
          vendor_name: 'Delta Airlines',
          group_id: '', // Add empty group_id field for now
        });
        setLoading(false);
      }, 500);
    }
  }, [isEditing, id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // Data validation
      if (!formData.name || !formData.name.trim()) {
        throw new Error('Item name is required');
      }
      
      if (!formData.type || !formData.type.trim()) {
        throw new Error('Item type is required');
      }
      
      // Call the appropriate API method based on whether we're editing or creating
      let savedItem;
      if (isEditing && id) {
        savedItem = await ItemAPI.updateItem(id, formData);
        console.log('Item updated:', savedItem);
      } else {
        savedItem = await ItemAPI.createItem(formData);
        console.log('Item created:', savedItem);
      }
      
      if (onSave) {
        onSave(savedItem);
      } else {
        // Fallback to traditional navigation if onSave is not provided
        router.push(isEditing ? `/items/${id}` : '/items');
      }
    } catch (err) {
      console.error('Error saving item:', err);
      setError(err.message || 'Failed to save item. Please try again.');
      setSaving(false);
      return; // Prevent further execution
    }
  };
  
  // Render type-specific fields based on selected item type
  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'flight':
        return (
          <div className={styles.typeSpecificFields}>
            <h3 className={styles.sectionTitle}>Flight Details</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Airline</label>
                <input
                  type="text"
                  name="airline"
                  className={styles.formInput}
                  placeholder="Airline name"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Flight Number</label>
                <input
                  type="text"
                  name="flight_number"
                  className={styles.formInput}
                  placeholder="e.g. DL123"
                />
              </div>
              {/* Additional flight-specific fields */}
            </div>
          </div>
        );
      case 'hotel':
        return (
          <div className={styles.typeSpecificFields}>
            <h3 className={styles.sectionTitle}>Hotel Details</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Hotel Name</label>
                <input
                  type="text"
                  name="hotel_name"
                  className={styles.formInput}
                  placeholder="Hotel name"
                />
              </div>
              {/* Additional hotel-specific fields */}
            </div>
          </div>
        );
      // Add other item types
      default:
        return null;
    }
  };
  
  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onClose} className={styles.backLink}>
          <ArrowLeftIcon className={styles.backIcon} width={16} height={16} />
          Close
        </button>
        <h1 className={styles.pageTitle}>
          {isEditing ? 'Edit Item' : 'New Item'}
        </h1>
      </div>
      
      {error && (
        <div className={styles.errorAlert}>
          <div className={styles.errorAlertContent}>
            <div className={styles.errorAlertIcon}>
              {/* Error icon */}
            </div>
            <div className={styles.errorAlertMessage}>{error}</div>
          </div>
        </div>
      )}
      
      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formBody}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Basic Information</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="name">
                    Item Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="Enter item name"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="type">
                    Item Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className={styles.formInput}
                  >
                    <option value="">Select a type</option>
                    <option value="flight">Flight</option>
                    <option value="hotel">Hotel</option>
                    <option value="car_rental">Car Rental</option>
                    <option value="conference">Conference</option>
                    <option value="product">Product</option>
                    <option value="service">Service</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={styles.formTextarea}
                    placeholder="Provide a description"
                    rows={3}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="group_id">
                    Item Group
                  </label>
                  <select
                    id="group_id"
                    name="group_id"
                    value={formData.group_id}
                    onChange={handleChange}
                    className={styles.formInput}
                    disabled={loadingGroups}
                  >
                    <option value="">Select a group</option>
                    {itemGroups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  {loadingGroups && <p className="text-sm text-gray-500 mt-1">Loading groups...</p>}
                </div>
              </div>
            </div>
            
            {/* Pricing section removed - will be added when items are purchased */}
            
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Vendor Information</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="vendor_name">
                    Vendor Name
                  </label>
                  <input
                    id="vendor_name"
                    name="vendor_name"
                    type="text"
                    value={formData.vendor_name}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="Enter vendor name"
                  />
                </div>
                
                {/* Add more vendor fields */}
              </div>
            </div>
            
            {/* Event Association section removed - items will be associated with events when purchased */}
            
            {formData.type && renderTypeSpecificFields()}
          </div>
          
          <div className={styles.formFooter}>
            <button 
              type="button" 
              onClick={onClose} 
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={styles.submitButton}
            >
              {saving ? (
                <>
                  <span className={styles.loadingIcon}>
                    {/* Loading spinner */}
                  </span>
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className={styles.buttonIcon} width={16} height={16} />
                  {isEditing ? 'Update Item' : 'Create Item'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
