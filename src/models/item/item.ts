// Item Model
export interface Item {
  id: string;
  name: string;
  description?: string;
  price: {
    amount: number;
    currency: string;
  };
  quantity: number;
  vendor: {
    id: string;
    name: string;
    contactInfo?: string;
  };
  itemType: 'flight' | 'hotel' | 'car' | 'other';
  status: 'available' | 'reserved' | 'purchased' | 'cancelled';
  eventId?: string;
  customerId?: string;
  travelDetails?: {
    // Flight-specific details
    flightNumber?: string;
    departureAirport?: string;
    arrivalAirport?: string;
    departureTime?: Date;
    arrivalTime?: Date;
    
    // Hotel-specific details
    hotelName?: string;
    checkInDate?: Date;
    checkOutDate?: Date;
    roomType?: string;
    
    // Car rental-specific details
    carType?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    pickupDate?: Date;
    returnDate?: Date;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    [key: string]: any;
  };
}

// Default values for new item
export const defaultItem: Partial<Item> = {
  quantity: 1,
  status: 'available',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Item validation
export const validateItem = (item: Partial<Item>): string[] => {
  const errors: string[] = [];
  
  if (!item.name) {
    errors.push('Item name is required');
  }
  
  if (!item.price || !item.price.amount || !item.price.currency) {
    errors.push('Price information is required');
  }
  
  if (!item.vendor || !item.vendor.id || !item.vendor.name) {
    errors.push('Vendor information is required');
  }
  
  if (!item.itemType) {
    errors.push('Item type is required');
  }
  
  return errors;
};
