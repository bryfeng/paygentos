-- Add new columns to events table
ALTER TABLE events
ADD COLUMN customer_ids UUID[] DEFAULT '{}',
ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- Migrate existing data from metadata JSONB to the new columns
UPDATE events
SET 
  customer_ids = COALESCE((metadata->>'customerIds')::UUID[], '{}'),
  is_active = COALESCE((metadata->>'isActive')::BOOLEAN, TRUE);

-- Remove the migrated fields from metadata to avoid duplication
UPDATE events
SET metadata = metadata - 'customerIds' - 'isActive';

-- Create an index on customer_ids to improve query performance
CREATE INDEX idx_events_customer_ids ON events USING GIN (customer_ids);
