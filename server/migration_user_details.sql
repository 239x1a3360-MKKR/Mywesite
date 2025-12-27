-- Run this in your Supabase SQL Editor to add the new columns for user profile

ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS roll_number TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS year TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS semester TEXT;

-- Verify the columns were added
SELECT * FROM users LIMIT 1;
