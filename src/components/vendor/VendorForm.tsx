"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Vendor, VendorAPI } from '@/api/vendor/vendor-api';
import styles from '@/styles/components/Form.module.css';

type VendorFormProps = {
  id?: string;
  onClose?: () => void;
  onSave?: (formData: Vendor) => void;
};

export default function VendorForm({ id, onClose, onSave }: VendorFormProps) {
  const router = useRouter();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState<Vendor>({
    name: '',
    type: 'airline',
    contact_email: '',
    contact_phone: '',
    website: '',
    status: 'active',
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Vendor types
  const vendorTypes = [
    { value: 'airline', label: 'Airline' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'car_rental', label: 'Car Rental' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'other', label: 'Other' },
  ];
  
  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];
  
  useEffect(() => {
    if (isEditing) {
      // Fetch vendor data
      const fetchVendor = async () => {
        try {
          const vendorData = await VendorAPI.getVendor(id);
          setFormData(vendorData);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching vendor:', err);
          setError('Failed to load vendor data. Please try again.');
          setLoading(false);
        }
      };
      
      fetchVendor();
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
      let result;
      
      if (isEditing) {
        // Update existing vendor
        result = await VendorAPI.updateVendor(id, formData);
      } else {
        // Create new vendor
        result = await VendorAPI.createVendor(formData);
      }
      
      if (onSave) {
        onSave(result);
      } else {
        // Fallback to traditional navigation if onSave is not provided
        router.push(`/vendors/${result.id}`);
      }
    } catch (err) {
      console.error('Error saving vendor:', err);
      setError('Failed to save vendor. Please check your data and try again.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading vendor data...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>
          {isEditing ? 'Edit Vendor' : 'Add New Vendor'}
        </h2>
        
        {onClose && (
          <button 
            onClick={onClose} 
            className={styles.closeButton}
            aria-label="Close form"
          >
            &times;
          </button>
        )}
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.formLabel}>
            Vendor Name <span className={styles.required}>*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.formInput}
            placeholder="e.g. Delta Airlines"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="type" className={styles.formLabel}>
            Vendor Type <span className={styles.required}>*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className={styles.formSelect}
          >
            {vendorTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="contact_email" className={styles.formLabel}>
            Contact Email
          </label>
          <input
            id="contact_email"
            name="contact_email"
            type="email"
            value={formData.contact_email || ''}
            onChange={handleChange}
            className={styles.formInput}
            placeholder="e.g. contact@vendor.com"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="contact_phone" className={styles.formLabel}>
            Contact Phone
          </label>
          <input
            id="contact_phone"
            name="contact_phone"
            type="text"
            value={formData.contact_phone || ''}
            onChange={handleChange}
            className={styles.formInput}
            placeholder="e.g. +1 (555) 123-4567"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="website" className={styles.formLabel}>
            Website
          </label>
          <input
            id="website"
            name="website"
            type="url"
            value={formData.website || ''}
            onChange={handleChange}
            className={styles.formInput}
            placeholder="e.g. https://www.example.com"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="status" className={styles.formLabel}>
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status || 'active'}
            onChange={handleChange}
            className={styles.formSelect}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formActions}>
          <Link href="/vendors" className={styles.cancelButton}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Cancel
          </Link>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={saving}
          >
            {saving ? (
              <>
                <div className={styles.spinnerSmall}></div>
                Saving...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Vendor' : 'Create Vendor'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
