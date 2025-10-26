-- ================================================
-- EXPENSE TRACKER - SUPABASE DATABASE SETUP
-- ================================================
-- Run this script in your Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard
-- Project: oqxumrsqkuzjfxfdawhj
-- ================================================

-- Create expenses table
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store TEXT NOT NULL,
  date DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_expenses_date ON expenses(date DESC);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_created ON expenses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Allow all operations (no auth required for MVP)
CREATE POLICY "Allow all operations" ON expenses
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER expenses_updated_at
BEFORE UPDATE ON expenses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ================================================
-- VERIFICATION QUERIES (Optional)
-- ================================================
-- Run these after creating the table to verify:

-- Check if table was created
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'expenses';

-- Check table structure
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'expenses';

-- Check indexes
-- SELECT indexname FROM pg_indexes WHERE tablename = 'expenses';

-- ================================================
-- SUCCESS!
-- ================================================
-- If you see no errors, the table is ready!
-- You can now use the expense tracker in your app.
-- ================================================


