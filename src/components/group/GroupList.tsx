'use client';

import React from 'react';
import { FiPlus, FiEdit, FiTrash, FiUsers } from 'react-icons/fi';
import { CustomerGroup, CustomerGroupAPI } from '@/api/customer/customer-group-api';
import { EventGroup, EventGroupAPI } from '@/api/event/event-group-api';
import { ItemGroup, ItemGroupAPI } from '@/api/item/item-group-api';
import buttonStyles from '@/styles/components/Button.module.css';
import styles from '@/styles/modules/Groups.module.css';

// Define a generic Group type that works for all group types
type Group = CustomerGroup | EventGroup | ItemGroup;

interface GroupListProps {
  type: 'customer' | 'event' | 'item';
  groups: Group[];
  isLoading: boolean;
  error: string | null;
  onAddClick: () => void;
  onEditClick: (group: Group) => void;
  onDeleteSuccess: (groupId: string) => void;
  onViewMembersClick: (group: Group) => void;
}

export default function GroupList({ 
  type, 
  groups,
  isLoading,
  error, 
  onAddClick,
  onEditClick,
  onDeleteSuccess,
  onViewMembersClick
}: GroupListProps) {
  const handleDeleteClick = async (group: Group) => {
    if (!group.id) return;
    
    if (window.confirm(`Are you sure you want to delete the group "${group.name}"? This action cannot be undone.`)) {
      try {
        // Call the appropriate API based on the type
        if (type === 'customer') {
          await CustomerGroupAPI.deleteCustomerGroup(group.id);
        } else if (type === 'event') {
          await EventGroupAPI.deleteEventGroup(group.id);
        } else if (type === 'item') {
          await ItemGroupAPI.deleteItemGroup(group.id);
        }
        
        onDeleteSuccess(group.id);
      } catch (err: any) {
        // Handle different error cases specifically
        if (err.response?.status === 400) {
          alert(`Cannot delete this group because it is assigned to one or more ${type}s.`);
        } else {
          alert(`Failed to delete the group: ${err.response?.data?.error || 'Unknown error'}`);
        }
        console.error(`Failed to delete ${type} group:`, err);
      }
    }
  };

  return (
    <div className={styles.groupListContainer}>
      <div className={styles.groupListHeader}>
        <h2 className={styles.subTitle}>{type.charAt(0).toUpperCase() + type.slice(1)} Groups</h2>
        <button 
          className={`${buttonStyles.button} ${buttonStyles.primary}`}
          onClick={onAddClick}
        >
          <FiPlus className="mr-2" /> Add Group
        </button>
      </div>

      {isLoading && <p className="text-center py-4">Loading groups...</p>}
      
      {error && <p className="text-red-500 py-4">{error}</p>}
      
      {!isLoading && !error && groups.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-gray-500">No groups found.</p>
          <button 
            className={`${buttonStyles.button} ${buttonStyles.secondary} mt-3`}
            onClick={onAddClick}
          >
            <FiPlus className="mr-1" /> Create First Group
          </button>
        </div>
      )}

      {!isLoading && !error && groups.length > 0 && (
        <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groups.map((group) => (
                <tr key={group.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {group.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {group.description || <span className="text-gray-400 italic">No description</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {group.color ? (
                      <div className="flex items-center">
                        <div className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: group.color }}></div>
                        {group.color}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No color</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onViewMembersClick(group)}
                      className="text-green-600 hover:text-green-800 mr-4"
                      title="View Group Members"
                    >
                      <FiUsers className="inline h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onEditClick(group)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                      title="Edit Group"
                    >
                      <FiEdit className="inline h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(group)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Group"
                    >
                      <FiTrash className="inline h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
