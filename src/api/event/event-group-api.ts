import axios from 'axios';

const API_BASE_URL = '/api'; // Assuming your API routes are under /api

// Type definition for an EventGroup
export interface EventGroup {
  id?: string;
  name: string;
  description?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export class EventGroupAPI {
  /**
   * Get all event groups
   */
  static async getEventGroups(): Promise<EventGroup[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/event-groups`);
      return response.data as EventGroup[];
    } catch (error) {
      console.error('Error fetching event groups:', error);
      throw error;
    }
  }

  /**
   * Get a single event group by its ID
   */
  static async getEventGroup(id: string): Promise<EventGroup> {
    try {
      const response = await axios.get(`${API_BASE_URL}/event-groups/${id}`);
      return response.data as EventGroup;
    } catch (error) {
      console.error(`Error fetching event group ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new event group
   */
  static async createEventGroup(groupData: Omit<EventGroup, 'id' | 'created_at' | 'updated_at'>): Promise<EventGroup> {
    try {
      const response = await axios.post(`${API_BASE_URL}/event-groups`, groupData);
      return response.data as EventGroup;
    } catch (error) {
      console.error('Error creating event group:', error);
      throw error;
    }
  }

  /**
   * Update an existing event group
   */
  static async updateEventGroup(id: string, groupData: Partial<Omit<EventGroup, 'id' | 'created_at' | 'updated_at'>>): Promise<EventGroup> {
    try {
      const response = await axios.put(`${API_BASE_URL}/event-groups/${id}`, groupData);
      return response.data as EventGroup;
    } catch (error) {
      console.error(`Error updating event group ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete an event group by its ID
   */
  static async deleteEventGroup(id: string): Promise<{ message: string }> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/event-groups/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting event group ${id}:`, error);
      throw error;
    }
  }
}
