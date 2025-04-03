import axios from 'axios';

const API_BASE_URL = '/api'; // Assuming your API routes are under /api

// Type definition for an ItemGroup
export interface ItemGroup {
  id?: string;
  name: string;
  description?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export class ItemGroupAPI {
  /**
   * Get all item groups
   */
  static async getItemGroups(): Promise<ItemGroup[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/item-groups`);
      return response.data as ItemGroup[];
    } catch (error) {
      console.error('Error fetching item groups:', error);
      throw error;
    }
  }

  /**
   * Get a single item group by its ID
   */
  static async getItemGroup(id: string): Promise<ItemGroup> {
    try {
      const response = await axios.get(`${API_BASE_URL}/item-groups/${id}`);
      return response.data as ItemGroup;
    } catch (error) {
      console.error(`Error fetching item group ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new item group
   */
  static async createItemGroup(groupData: Omit<ItemGroup, 'id' | 'created_at' | 'updated_at'>): Promise<ItemGroup> {
    try {
      const response = await axios.post(`${API_BASE_URL}/item-groups`, groupData);
      return response.data as ItemGroup;
    } catch (error) {
      console.error('Error creating item group:', error);
      throw error;
    }
  }

  /**
   * Update an existing item group
   */
  static async updateItemGroup(id: string, groupData: Partial<Omit<ItemGroup, 'id' | 'created_at' | 'updated_at'>>): Promise<ItemGroup> {
    try {
      const response = await axios.put(`${API_BASE_URL}/item-groups/${id}`, groupData);
      return response.data as ItemGroup;
    } catch (error) {
      console.error(`Error updating item group ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete an item group by its ID
   */
  static async deleteItemGroup(id: string): Promise<{ message: string }> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/item-groups/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting item group ${id}:`, error);
      throw error;
    }
  }
}
