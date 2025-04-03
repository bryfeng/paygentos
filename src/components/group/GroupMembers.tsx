'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiPlus, FiX, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { CustomerGroup, CustomerGroupAPI } from '@/api/customer/customer-group-api';
import { EventGroup, EventGroupAPI } from '@/api/event/event-group-api';
import { ItemGroup, ItemGroupAPI } from '@/api/item/item-group-api';
import { CustomerAPI } from '@/api/customer/customer-api';
import buttonStyles from '@/styles/components/Button.module.css';
import formStyles from '@/styles/components/Form.module.css';
import styles from '@/styles/modules/Groups.module.css';

// Generic type for all group types
type Group = CustomerGroup | EventGroup | ItemGroup;

// Type for group members based on group type
interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  group_id?: string;
}

interface Event {
  id: string;
  title: string;
  start_date: string;
  end_date?: string;
  group_id?: string;
}

interface Item {
  id: string;
  name: string;
  description?: string;
  price: number;
  group_id?: string;
}

// Map type to entity
type EntityMap = {
  customer: Customer;
  event: Event;
  item: Item;
};

// Interface for component props
interface GroupMembersProps {
  type: 'customer' | 'event' | 'item';
  group: Group;
  onBackClick: () => void;
}

export default function GroupMembers({ type, group, onBackClick }: GroupMembersProps) {
  const [members, setMembers] = useState<EntityMap[typeof type][]>([]);
  const [availableEntities, setAvailableEntities] = useState<EntityMap[typeof type][]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Function to fetch members for the selected group
  const fetchMembers = async () => {
    if (!group.id) return;
    
    setIsLoadingMembers(true);
    setError(null);
    
    try {
      let fetchedMembers: any[] = [];
      
      if (type === 'customer') {
        // Fetch customers in this group
        fetchedMembers = await CustomerAPI.getCustomers({ group_id: group.id });
      } else if (type === 'event') {
        // Fetch events in this group - replace with actual API call
        const response = await fetch(`/api/events?group_id=${group.id}`);
        fetchedMembers = await response.json();
      } else if (type === 'item') {
        // Fetch items in this group - replace with actual API call
        const response = await fetch(`/api/items?group_id=${group.id}`);
        fetchedMembers = await response.json();
      }
      
      setMembers(fetchedMembers);
    } catch (err) {
      console.error(`Error fetching ${type} members:`, err);
      setError(`Failed to load ${type} members. Please try again.`);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  // Function to fetch available entities (not yet in a group or in other groups)
  const fetchAvailableEntities = async () => {
    setIsLoadingAvailable(true);
    
    try {
      let fetchedEntities: any[] = [];
      
      if (type === 'customer') {
        // Fetch customers not in this group
        fetchedEntities = await CustomerAPI.getCustomers({ 
          exclude_group: group.id 
        });
      } else if (type === 'event') {
        // Fetch events not in this group - replace with actual API call
        const response = await fetch(`/api/events?exclude_group=${group.id}`);
        fetchedEntities = await response.json();
      } else if (type === 'item') {
        // Fetch items not in this group - replace with actual API call
        const response = await fetch(`/api/items?exclude_group=${group.id}`);
        fetchedEntities = await response.json();
      }
      
      setAvailableEntities(fetchedEntities);
    } catch (err) {
      console.error(`Error fetching available ${type}s:`, err);
      setError(`Failed to load available ${type}s. Please try again.`);
    } finally {
      setIsLoadingAvailable(false);
    }
  };

  // Function to add entity to group
  const addToGroup = async (entityId: string) => {
    if (!group.id) return;
    
    try {
      if (type === 'customer') {
        // Update customer's group_id
        await CustomerAPI.updateCustomer(entityId, { group_id: group.id });
      } else if (type === 'event') {
        // Update event's group_id - replace with actual API call
        await fetch(`/api/events/${entityId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ group_id: group.id })
        });
      } else if (type === 'item') {
        // Update item's group_id - replace with actual API call
        await fetch(`/api/items/${entityId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ group_id: group.id })
        });
      }
      
      // Refresh members list
      fetchMembers();
      
      // Remove from available entities locally
      setAvailableEntities(prev => prev.filter(entity => entity.id !== entityId));
    } catch (err) {
      console.error(`Error adding ${type} to group:`, err);
      alert(`Failed to add ${type} to group. Please try again.`);
    }
  };

  // Function to remove entity from group
  const removeFromGroup = async (entityId: string) => {
    if (!confirm(`Are you sure you want to remove this ${type} from the group?`)) return;
    
    try {
      if (type === 'customer') {
        // Update customer to remove group_id
        await CustomerAPI.updateCustomer(entityId, { group_id: null });
      } else if (type === 'event') {
        // Update event to remove group_id - replace with actual API call
        await fetch(`/api/events/${entityId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ group_id: null })
        });
      } else if (type === 'item') {
        // Update item to remove group_id - replace with actual API call
        await fetch(`/api/items/${entityId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ group_id: null })
        });
      }
      
      // Remove from members locally
      setMembers(prev => prev.filter(member => member.id !== entityId));
      
      // Optionally refresh available entities if in add mode
      if (isAdding) {
        fetchAvailableEntities();
      }
    } catch (err) {
      console.error(`Error removing ${type} from group:`, err);
      alert(`Failed to remove ${type} from group. Please try again.`);
    }
  };

  // Load members when component mounts
  useEffect(() => {
    fetchMembers();
  }, [group.id]);

  // Toggle add mode and fetch available entities
  const toggleAddMode = () => {
    const newAddingState = !isAdding;
    setIsAdding(newAddingState);
    
    if (newAddingState) {
      fetchAvailableEntities();
    }
  };

  // Filter entities based on search term
  const filterEntities = (entities: any[]) => {
    if (!searchTerm) return entities;
    
    const term = searchTerm.toLowerCase();
    
    return entities.filter(entity => {
      if (type === 'customer') {
        return (
          (entity.firstName?.toLowerCase() || '').includes(term) ||
          (entity.lastName?.toLowerCase() || '').includes(term) ||
          (entity.email?.toLowerCase() || '').includes(term)
        );
      } else if (type === 'event') {
        return (
          (entity.title?.toLowerCase() || '').includes(term)
        );
      } else if (type === 'item') {
        return (
          (entity.name?.toLowerCase() || '').includes(term) ||
          (entity.description?.toLowerCase() || '').includes(term)
        );
      }
      return false;
    });
  };

  // Render entity name based on type
  const renderEntityName = (entity: any) => {
    if (type === 'customer') {
      return `${entity.firstName} ${entity.lastName}`;
    } else if (type === 'event') {
      return entity.title;
    } else if (type === 'item') {
      return entity.name;
    }
    return '';
  };

  // Render entity details based on type
  const renderEntityDetails = (entity: any) => {
    if (type === 'customer') {
      return entity.email;
    } else if (type === 'event') {
      return `${new Date(entity.start_date).toLocaleDateString()}${entity.end_date ? ` - ${new Date(entity.end_date).toLocaleDateString()}` : ''}`;
    } else if (type === 'item') {
      return `$${entity.price?.toFixed(2) || '0.00'}`;
    }
    return '';
  };

  return (
    <div className={styles.groupMembersContainer}>
      <div className={styles.groupMembersHeader}>
        <button 
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          onClick={onBackClick}
        >
          <FiArrowLeft className="mr-2" />
          Back to Groups
        </button>
        
        <h2 className={styles.subTitle}>
          <span className="font-normal text-gray-500">Group:</span> {group.name}
        </h2>
        
        <div className="flex items-center space-x-2">
          <button
            className={`${buttonStyles.button} ${isAdding ? buttonStyles.warning : buttonStyles.primary}`}
            onClick={toggleAddMode}
          >
            {isAdding ? (
              <>
                <FiX className="mr-2" /> Cancel Adding
              </>
            ) : (
              <>
                <FiPlus className="mr-2" /> Add {type === 'customer' ? 'Customers' : type === 'event' ? 'Events' : 'Items'}
              </>
            )}
          </button>
          
          {!isAdding && (
            <button
              className={`${buttonStyles.button} ${buttonStyles.secondary}`}
              onClick={fetchMembers}
              disabled={isLoadingMembers}
            >
              <FiRefreshCw className={`mr-2 ${isLoadingMembers ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </div>
      </div>
      
      {/* Search input */}
      <div className={formStyles.formGroup}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={`Search ${isAdding ? 'available' : ''} ${type}s...`}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Entity list container */}
      <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        {isAdding ? (
          // Available entities list
          <>
            <h3 className="px-6 py-3 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b">
              Available {type === 'customer' ? 'Customers' : type === 'event' ? 'Events' : 'Items'}
            </h3>
            
            {isLoadingAvailable ? (
              <div className="text-center py-4">Loading available {type}s...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filterEntities(availableEntities).length > 0 ? (
                    filterEntities(availableEntities).map((entity) => (
                      <tr key={entity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {renderEntityName(entity)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {renderEntityDetails(entity)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => addToGroup(entity.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <FiPlus className="inline h-5 w-5 mr-1" />
                            Add
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchTerm ? 'No matching entities found' : 'No available entities found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </>
        ) : (
          // Current members list
          <>
            <h3 className="px-6 py-3 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b">
              {type === 'customer' ? 'Customers' : type === 'event' ? 'Events' : 'Items'} in this Group
            </h3>
            
            {isLoadingMembers ? (
              <div className="text-center py-4">Loading members...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filterEntities(members).length > 0 ? (
                    filterEntities(members).map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {renderEntityName(member)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {renderEntityDetails(member)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => removeFromGroup(member.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiX className="inline h-5 w-5 mr-1" />
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchTerm ? 'No matching members found' : `No ${type}s in this group yet`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}
