-- Create PaymentTypes table
CREATE TABLE IF NOT EXISTS payment_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create constraint to ensure unique payment type names
ALTER TABLE payment_types
ADD CONSTRAINT unique_payment_type_name UNIQUE (name);

-- Insert the initial payment types as specified
INSERT INTO payment_types (name, description) VALUES
  ('Recurring/Subscription', 'Regular recurring payment on a fixed schedule'),
  ('Single', 'One-time payment'),
  ('Streaming', 'Variable/metered payment based on usage');

-- Create a payment_policies table to link payment types with policies
CREATE TABLE IF NOT EXISTS payment_policies (
  id SERIAL PRIMARY KEY,
  policy_id INTEGER NOT NULL,
  payment_type_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (payment_type_id) REFERENCES payment_types(id) ON DELETE CASCADE
);

-- Create an index for faster lookups by policy_id
CREATE INDEX payment_policies_policy_id_idx ON payment_policies(policy_id);

-- Comment on tables
COMMENT ON TABLE payment_types IS 'Stores different types of payments like recurring, single, streaming';
COMMENT ON TABLE payment_policies IS 'Links policies with permitted payment types';
