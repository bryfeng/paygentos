'use client';

import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { CustomerGroup, CustomerGroupAPI } from '@/api/customer/customer-group-api';
import { EventGroup, EventGroupAPI } from '@/api/event/event-group-api';
import { ItemGroup, ItemGroupAPI } from '@/api/item/item-group-api';
import GroupForm from '@/components/group/GroupForm';
import GroupList from '@/components/group/GroupList';
import GroupMembers from '@/components/group/GroupMembers';
import styles from '@/styles/modules/Groups.module.css';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function GroupsPage() {
  // Customer groups state
  const [customerGroups, setCustomerGroups] = useState<CustomerGroup[]>([]);
  const [isCustomerGroupsLoading, setIsCustomerGroupsLoading] = useState(true);
  const [customerGroupsError, setCustomerGroupsError] = useState<string | null>(null);
  const [isAddingCustomerGroup, setIsAddingCustomerGroup] = useState(false);
  const [editingCustomerGroup, setEditingCustomerGroup] = useState<CustomerGroup | null>(null);
  const [selectedCustomerGroup, setSelectedCustomerGroup] = useState<CustomerGroup | null>(null);
  
  // Event groups state
  const [eventGroups, setEventGroups] = useState<EventGroup[]>([]);
  const [isEventGroupsLoading, setIsEventGroupsLoading] = useState(true);
  const [eventGroupsError, setEventGroupsError] = useState<string | null>(null);
  const [isAddingEventGroup, setIsAddingEventGroup] = useState(false);
  const [editingEventGroup, setEditingEventGroup] = useState<EventGroup | null>(null);
  const [selectedEventGroup, setSelectedEventGroup] = useState<EventGroup | null>(null);
  
  // Item groups state
  const [itemGroups, setItemGroups] = useState<ItemGroup[]>([]);
  const [isItemGroupsLoading, setIsItemGroupsLoading] = useState(true);
  const [itemGroupsError, setItemGroupsError] = useState<string | null>(null);
  const [isAddingItemGroup, setIsAddingItemGroup] = useState(false);
  const [editingItemGroup, setEditingItemGroup] = useState<ItemGroup | null>(null);
  const [selectedItemGroup, setSelectedItemGroup] = useState<ItemGroup | null>(null);
  
  // UI state
  const [activeView, setActiveView] = useState<'list' | 'form' | 'members'>('list');
  
  // Fetch customer groups
  const fetchCustomerGroups = async () => {
    setIsCustomerGroupsLoading(true);
    setCustomerGroupsError(null);
    try {
      const fetchedGroups = await CustomerGroupAPI.getCustomerGroups();
      setCustomerGroups(fetchedGroups);
    } catch (err) {
      console.error('Failed to fetch customer groups:', err);
      setCustomerGroupsError('Failed to load customer groups. Please try again later.');
    } finally {
      setIsCustomerGroupsLoading(false);
    }
  };

  // Fetch event groups
  const fetchEventGroups = async () => {
    setIsEventGroupsLoading(true);
    setEventGroupsError(null);
    try {
      const fetchedGroups = await EventGroupAPI.getEventGroups();
      setEventGroups(fetchedGroups);
    } catch (err) {
      console.error('Failed to fetch event groups:', err);
      setEventGroupsError('Failed to load event groups. Please try again later.');
    } finally {
      setIsEventGroupsLoading(false);
    }
  };

  // Fetch item groups
  const fetchItemGroups = async () => {
    setIsItemGroupsLoading(true);
    setItemGroupsError(null);
    try {
      const fetchedGroups = await ItemGroupAPI.getItemGroups();
      setItemGroups(fetchedGroups);
    } catch (err) {
      console.error('Failed to fetch item groups:', err);
      setItemGroupsError('Failed to load item groups. Please try again later.');
    } finally {
      setIsItemGroupsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerGroups();
    fetchEventGroups();
    fetchItemGroups();
  }, []);

  // Customer group handlers
  const handleAddCustomerGroup = () => {
    setEditingCustomerGroup(null);
    setIsAddingCustomerGroup(true);
    setActiveView('form');
  };

  const handleEditCustomerGroup = (group: CustomerGroup) => {
    setIsAddingCustomerGroup(false);
    setEditingCustomerGroup(group);
    setActiveView('form');
  };

  const handleViewCustomerGroupMembers = (group: CustomerGroup) => {
    setSelectedCustomerGroup(group);
    setActiveView('members');
  };

  const handleCustomerGroupSaved = () => {
    setIsAddingCustomerGroup(false);
    setEditingCustomerGroup(null);
    setActiveView('list');
    fetchCustomerGroups();
  };

  const handleCustomerGroupDeleted = (groupId: string) => {
    setCustomerGroups(prev => prev.filter(group => group.id !== groupId));
  };

  // Event group handlers
  const handleAddEventGroup = () => {
    setEditingEventGroup(null);
    setIsAddingEventGroup(true);
    setActiveView('form');
  };

  const handleEditEventGroup = (group: EventGroup) => {
    setIsAddingEventGroup(false);
    setEditingEventGroup(group);
    setActiveView('form');
  };

  const handleViewEventGroupMembers = (group: EventGroup) => {
    setSelectedEventGroup(group);
    setActiveView('members');
  };

  const handleEventGroupSaved = () => {
    setIsAddingEventGroup(false);
    setEditingEventGroup(null);
    setActiveView('list');
    fetchEventGroups();
  };

  const handleEventGroupDeleted = (groupId: string) => {
    setEventGroups(prev => prev.filter(group => group.id !== groupId));
  };

  // Item group handlers
  const handleAddItemGroup = () => {
    setEditingItemGroup(null);
    setIsAddingItemGroup(true);
    setActiveView('form');
  };

  const handleEditItemGroup = (group: ItemGroup) => {
    setIsAddingItemGroup(false);
    setEditingItemGroup(group);
    setActiveView('form');
  };

  const handleViewItemGroupMembers = (group: ItemGroup) => {
    setSelectedItemGroup(group);
    setActiveView('members');
  };

  const handleItemGroupSaved = () => {
    setIsAddingItemGroup(false);
    setEditingItemGroup(null);
    setActiveView('list');
    fetchItemGroups();
  };

  const handleItemGroupDeleted = (groupId: string) => {
    setItemGroups(prev => prev.filter(group => group.id !== groupId));
  };

  // Common handlers
  const handleCancelForm = () => {
    setIsAddingCustomerGroup(false);
    setEditingCustomerGroup(null);
    setIsAddingEventGroup(false);
    setEditingEventGroup(null);
    setIsAddingItemGroup(false);
    setEditingItemGroup(null);
    setActiveView('list');
  };

  const handleBackToList = () => {
    setSelectedCustomerGroup(null);
    setSelectedEventGroup(null);
    setSelectedItemGroup(null);
    setActiveView('list');
  };

  // We're using a tabbed interface for the different group types
  return (
    <div className={styles.groupsContainer}>
      <h1 className={styles.title}>Manage Groups</h1>
      
      <Tab.Group>
        <Tab.List className={styles.tabList}>
          <Tab className={({ selected }) => 
            classNames(
              styles.tab,
              selected ? styles.tabActive : styles.tabInactive
            )
          }>
            Customer Groups
          </Tab>
          <Tab className={({ selected }) => 
            classNames(
              styles.tab,
              selected ? styles.tabActive : styles.tabInactive
            )
          }>
            Event Groups
          </Tab>
          <Tab className={({ selected }) => 
            classNames(
              styles.tab,
              selected ? styles.tabActive : styles.tabInactive
            )
          }>
            Item Groups
          </Tab>
        </Tab.List>
        
        <Tab.Panels className={styles.tabPanels}>
          {/* Customer Groups Panel */}
          <Tab.Panel className={styles.tabPanel}>
            <div className={styles.panelContent}>
              {activeView === 'form' && (isAddingCustomerGroup || editingCustomerGroup) ? (
                <GroupForm 
                  type="customer"
                  group={editingCustomerGroup}
                  onSave={handleCustomerGroupSaved}
                  onCancel={handleCancelForm}
                />
              ) : activeView === 'members' && selectedCustomerGroup ? (
                <GroupMembers
                  type="customer"
                  group={selectedCustomerGroup}
                  onBackClick={handleBackToList}
                />
              ) : (
                <GroupList 
                  type="customer"
                  groups={customerGroups}
                  isLoading={isCustomerGroupsLoading}
                  error={customerGroupsError}
                  onAddClick={handleAddCustomerGroup}
                  onEditClick={handleEditCustomerGroup}
                  onDeleteSuccess={handleCustomerGroupDeleted}
                  onViewMembersClick={handleViewCustomerGroupMembers}
                />
              )}
            </div>
          </Tab.Panel>
          
          {/* Event Groups Panel */}
          <Tab.Panel className={styles.tabPanel}>
            <div className={styles.panelContent}>
              {activeView === 'form' && (isAddingEventGroup || editingEventGroup) ? (
                <GroupForm 
                  type="event"
                  group={editingEventGroup}
                  onSave={handleEventGroupSaved}
                  onCancel={handleCancelForm}
                />
              ) : activeView === 'members' && selectedEventGroup ? (
                <GroupMembers
                  type="event"
                  group={selectedEventGroup}
                  onBackClick={handleBackToList}
                />
              ) : (
                <GroupList 
                  type="event"
                  groups={eventGroups}
                  isLoading={isEventGroupsLoading}
                  error={eventGroupsError}
                  onAddClick={handleAddEventGroup}
                  onEditClick={handleEditEventGroup}
                  onDeleteSuccess={handleEventGroupDeleted}
                  onViewMembersClick={handleViewEventGroupMembers}
                />
              )}
            </div>
          </Tab.Panel>
          
          {/* Item Groups Panel */}
          <Tab.Panel className={styles.tabPanel}>
            <div className={styles.panelContent}>
              {activeView === 'form' && (isAddingItemGroup || editingItemGroup) ? (
                <GroupForm 
                  type="item"
                  group={editingItemGroup}
                  onSave={handleItemGroupSaved}
                  onCancel={handleCancelForm}
                />
              ) : activeView === 'members' && selectedItemGroup ? (
                <GroupMembers
                  type="item"
                  group={selectedItemGroup}
                  onBackClick={handleBackToList}
                />
              ) : (
                <GroupList 
                  type="item"
                  groups={itemGroups}
                  isLoading={isItemGroupsLoading}
                  error={itemGroupsError}
                  onAddClick={handleAddItemGroup}
                  onEditClick={handleEditItemGroup}
                  onDeleteSuccess={handleItemGroupDeleted}
                  onViewMembersClick={handleViewItemGroupMembers}
                />
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
