-- Create payment_methods table if it doesn't exist
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  type TEXT NOT NULL CHECK (type IN ('credit_card', 'debit_card', 'bank_account', 'digital_wallet', 'corporate_account', 'other')),
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  details JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on customer_id for faster lookups
CREATE INDEX IF NOT EXISTS payment_methods_customer_id_idx ON payment_methods(customer_id);

-- Add comment to the table
COMMENT ON TABLE payment_methods IS 'Stores payment method details with sensitive information masked or tokenized';

-- Insert trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_payment_methods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payment_methods_timestamp ON payment_methods;
CREATE TRIGGER update_payment_methods_timestamp
BEFORE UPDATE ON payment_methods
FOR EACH ROW
EXECUTE FUNCTION update_payment_methods_updated_at();
