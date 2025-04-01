-- Create customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  dob DATE,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  contacts JSONB DEFAULT '[]'::jsonb,
  preferred_contact_type TEXT,
  id_documents JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_full_name ON customers(full_name);
CREATE INDEX IF NOT EXISTS idx_customer_first_name ON customers(first_name);
CREATE INDEX IF NOT EXISTS idx_customer_last_name ON customers(last_name);
