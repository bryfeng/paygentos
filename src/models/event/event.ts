// Event Model
export interface Event {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  purpose?: string;
  requiresApproval: boolean;
  approvalStatus?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  approvedBy?: string;
  approvedAt?: Date;
  budget?: {
    amount: number;
    currency: string;
    remaining?: number;
  };
  customerIds: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    [key: string]: any;
  };
}

// Default values for new event
export const defaultEvent: Partial<Event> = {
  requiresApproval: true,
  approvalStatus: 'scheduled',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Event validation
export const validateEvent = (event: Partial<Event>): string[] => {
  const errors: string[] = [];
  
  if (!event.name) {
    errors.push('Event name is required');
  }
  
  if (!event.startDate) {
    errors.push('Start date is required');
  }
  
  if (!event.customerIds || event.customerIds.length === 0) {
    errors.push('At least one customer is required');
  }
  
  if (event.endDate && event.startDate && new Date(event.endDate) < new Date(event.startDate)) {
    errors.push('End date cannot be before start date');
  }
  
  return errors;
};
