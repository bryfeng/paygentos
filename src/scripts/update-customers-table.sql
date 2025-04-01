-- Modify the customers table to make email nullable or remove constraint
ALTER TABLE customers 
ALTER COLUMN email DROP NOT NULL;

-- If you want to migrate existing data, you could run something like this:
-- This would move email values to the contacts array for existing records
-- UPDATE customers 
-- SET contacts = jsonb_build_array(
--   jsonb_build_object(
--     'type', 'EMAIL',
--     'value', email,
--     'isPrimary', true,
--     'label', 'Primary Email'
--   )
-- )
-- WHERE email IS NOT NULL AND contacts IS NULL;
