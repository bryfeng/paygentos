// Travel API client for travel-specific endpoints
import axios from 'axios';

const API_BASE_URL = '/api/travel';

export interface FlightSearchParams {
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
}

export interface HotelSearchParams {
  location: string;
  checkInDate: string;
  checkOutDate: string;
  rooms: number;
  guests: number;
  starRating?: number;
}

export interface CarSearchParams {
  pickupLocation: string;
  dropoffLocation?: string;
  pickupDate: string;
  returnDate: string;
  carType?: string;
}

export interface FlightResult {
  id: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  stops: number;
  price: {
    amount: number;
    currency: string;
  };
  cabinClass: string;
}

export interface HotelResult {
  id: string;
  name: string;
  address: string;
  starRating: number;
  price: {
    amount: number;
    currency: string;
    perNight: boolean;
  };
  amenities: string[];
  roomType: string;
}

export interface CarResult {
  id: string;
  company: string;
  carType: string;
  model: string;
  price: {
    amount: number;
    currency: string;
    perDay: boolean;
  };
  pickupLocation: string;
  dropoffLocation: string;
  features: string[];
}

export const TravelAPI = {
  // Search for flights
  searchFlights: async (params: FlightSearchParams): Promise<FlightResult[]> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/flights/search`, params);
      return response.data;
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  },

  // Search for hotels
  searchHotels: async (params: HotelSearchParams): Promise<HotelResult[]> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/hotels/search`, params);
      return response.data;
    } catch (error) {
      console.error('Error searching hotels:', error);
      throw error;
    }
  },

  // Search for rental cars
  searchCars: async (params: CarSearchParams): Promise<CarResult[]> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/cars/search`, params);
      return response.data;
    } catch (error) {
      console.error('Error searching rental cars:', error);
      throw error;
    }
  },

  // Book a flight
  bookFlight: async (flightId: string, customerId: string, eventId: string): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/flights/book`, {
        flightId,
        customerId,
        eventId
      });
      return response.data;
    } catch (error) {
      console.error('Error booking flight:', error);
      throw error;
    }
  },

  // Book a hotel
  bookHotel: async (hotelId: string, customerId: string, eventId: string): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/hotels/book`, {
        hotelId,
        customerId,
        eventId
      });
      return response.data;
    } catch (error) {
      console.error('Error booking hotel:', error);
      throw error;
    }
  },

  // Book a rental car
  bookCar: async (carId: string, customerId: string, eventId: string): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/cars/book`, {
        carId,
        customerId,
        eventId
      });
      return response.data;
    } catch (error) {
      console.error('Error booking rental car:', error);
      throw error;
    }
  }
};
