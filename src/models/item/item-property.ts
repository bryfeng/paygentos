// Item Properties Model
export interface ItemProperty {
  id: string;
  itemId: string;
  name: string;
  value: any;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
  validationRules?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    options?: any[];
  };
  displayOptions?: {
    displayName?: string;
    displayOrder?: number;
    displayType?: 'text' | 'select' | 'checkbox' | 'radio' | 'date' | 'custom';
    displayGroup?: string;
    readOnly?: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    [key: string]: any;
  };
}

// Default values for new item property
export const defaultItemProperty: Partial<ItemProperty> = {
  dataType: 'string',
  validationRules: {
    required: false
  },
  displayOptions: {
    displayType: 'text',
    readOnly: false
  },
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Item Property validation
export const validateItemProperty = (property: Partial<ItemProperty>): string[] => {
  const errors: string[] = [];
  
  if (!property.itemId) {
    errors.push('Item ID is required');
  }
  
  if (!property.name) {
    errors.push('Property name is required');
  }
  
  if (property.value === undefined || property.value === null) {
    errors.push('Property value is required');
  }
  
  if (!property.dataType) {
    errors.push('Data type is required');
  }
  
  return errors;
};
