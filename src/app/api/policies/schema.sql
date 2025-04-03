-- Policy management schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS policies CASCADE;
DROP TABLE IF EXISTS policy_item_groups CASCADE;
DROP TABLE IF EXISTS policy_customer_groups CASCADE;
DROP TABLE IF EXISTS policy_event_groups CASCADE;
DROP TABLE IF EXISTS policy_payment_methods CASCADE;
DROP TABLE IF EXISTS policy_vendors CASCADE;

-- Main policies table
CREATE TABLE policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  budget_amount DECIMAL(15, 2),
  budget_interval TEXT CHECK (budget_interval IN ('daily', 'weekly', 'monthly', 'quarterly', 'annually', 'one_time')),
  budget_start_date TIMESTAMP WITH TIME ZONE,
  budget_end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  allowed_payment_types TEXT[],  -- Array of allowed payment types (credit, debit, bank_transfer, etc.)
  require_approval BOOLEAN DEFAULT false,
  approval_threshold DECIMAL(15, 2),  -- Amount that requires approval
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Policy Item Groups junction table
CREATE TABLE policy_item_groups (
  policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
  item_group_id UUID NOT NULL,
  PRIMARY KEY (policy_id, item_group_id)
);

-- Policy Customer Groups junction table
CREATE TABLE policy_customer_groups (
  policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
  customer_group_id UUID NOT NULL,
  PRIMARY KEY (policy_id, customer_group_id)
);

-- Policy Event Groups junction table
CREATE TABLE policy_event_groups (
  policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
  event_group_id UUID NOT NULL,
  PRIMARY KEY (policy_id, event_group_id)
);

-- Policy Payment Methods junction table
CREATE TABLE policy_payment_methods (
  policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
  payment_method_id UUID NOT NULL,
  PRIMARY KEY (policy_id, payment_method_id)
);

-- Policy Vendors junction table
CREATE TABLE policy_vendors (
  policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL,
  PRIMARY KEY (policy_id, vendor_id)
);

-- Add indexes for faster lookups
CREATE INDEX policy_item_groups_item_group_id_idx ON policy_item_groups(item_group_id);
CREATE INDEX policy_customer_groups_customer_group_id_idx ON policy_customer_groups(customer_group_id);
CREATE INDEX policy_event_groups_event_group_id_idx ON policy_event_groups(event_group_id);
CREATE INDEX policy_payment_methods_payment_method_id_idx ON policy_payment_methods(payment_method_id);
CREATE INDEX policy_vendors_vendor_id_idx ON policy_vendors(vendor_id);

-- Add comments
COMMENT ON TABLE policies IS 'Spending policies that define budget constraints and relationships between groups and vendors';
COMMENT ON TABLE policy_item_groups IS 'Junction table linking policies to item groups';
COMMENT ON TABLE policy_customer_groups IS 'Junction table linking policies to customer groups';
COMMENT ON TABLE policy_event_groups IS 'Junction table linking policies to event groups';
COMMENT ON TABLE policy_payment_methods IS 'Junction table linking policies to allowed payment methods';
COMMENT ON TABLE policy_vendors IS 'Junction table linking policies to allowed vendors';
