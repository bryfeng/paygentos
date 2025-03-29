// API client for event endpoints
import axios from 'axios';
import { Event } from '../../models/event/event';

const API_BASE_URL = '/api';

export const EventAPI = {
  // Get all events
  getEvents: async (): Promise<Event[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Get event by ID
  getEvent: async (id: string): Promise<Event> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error;
    }
  },

  // Create new event
  createEvent: async (event: Partial<Event>): Promise<Event> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/events`, event);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update event
  updateEvent: async (id: string, event: Partial<Event>): Promise<Event> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/events/${id}`, event);
      return response.data;
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/events/${id}`);
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      throw error;
    }
  }
};
