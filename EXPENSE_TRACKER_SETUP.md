# Expense Tracker Setup Guide

## ✅ Completed Steps

1. ✅ Installed `@supabase/supabase-js` package
2. ✅ Created Supabase client configuration (`src/config/supabase.js`)
3. ✅ Created expense storage utilities (`src/utils/expenseStorage.js`)
4. ✅ Created expense helper utilities (`src/utils/expenseHelpers.js`)
5. ✅ Added expense tracker to plugin registry
6. ✅ Added EXPENSES route to routes configuration
7. ✅ Created all expense components:
   - AddExpenseModal
   - ExpenseTable
   - CategoryFilter
   - ExpensesManager
   - ExpensesDashboardWidget
8. ✅ Integrated expense widget into Dashboard
9. ✅ Added conditional expenses nav item to Navigation
10. ✅ Added /expenses route to App.jsx
11. ✅ Updated .gitignore for environment files

## 🔧 Required: Supabase Database Setup

**You need to run this SQL script in your Supabase dashboard:**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `oqxumrsqkuzjfxfdawhj`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the following SQL:

```sql
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
```

6. Click **Run** or press `Ctrl + Enter`
7. Verify the table was created by checking the **Table Editor**

## 🚀 How to Use

1. **Start the dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Install the plugin**:
   - Navigate to **Plugins** page
   - Find **💰 Expense Tracker**
   - Click **Install**

3. **Access the Expenses page**:
   - Click on **💰 Expenses** in the navigation bar
   - Or navigate to `http://localhost:5173/expenses`

4. **Add your first expense**:
   - Click the **Add Expense** button
   - Fill in the form (store, date, amount, category, notes)
   - Click **Add Expense**

5. **View on Dashboard**:
   - Go back to Dashboard
   - You'll see a **Monthly Spending** widget showing your expenses

## 🧪 Testing Checklist

- [ ] Database table created in Supabase
- [ ] Dev server running
- [ ] Plugin appears in Plugins list
- [ ] Can install plugin
- [ ] Navigation item "💰 Expenses" appears after installation
- [ ] Dashboard shows expense widget after installation
- [ ] Can access /expenses page
- [ ] Can add a new expense
- [ ] Expense appears in table
- [ ] Can filter by category
- [ ] Can edit an expense
- [ ] Can delete an expense
- [ ] Dashboard widget shows correct total
- [ ] Data persists after page refresh
- [ ] Mobile view works correctly

## 📊 Categories Available

- 🛒 Groceries
- ✈️ Travel
- 📱 Subscriptions
- 🎉 Entertainment
- 🏠 Housing
- 🚗 Transportation
- 🏥 Health
- 💳 Other

## 🎯 Features Implemented

- ✅ Cloud storage with Supabase
- ✅ Manual expense entry with validation
- ✅ Category organization (8 predefined categories)
- ✅ Monthly spending overview
- ✅ Expense history table (desktop + mobile responsive)
- ✅ Dashboard widget with top 3 categories
- ✅ Real-time sync across devices
- ✅ Edit/Delete functionality
- ✅ Category filtering
- ✅ Toast notifications for actions
- ✅ Loading states and error handling
- ✅ Dark mode support

## 🔮 Future Enhancements (Post-MVP)

- AI receipt scanning with OCR
- Calendar view for expenses
- Budget tracking and alerts
- Export to CSV
- Charts and analytics
- Multi-currency support
- Receipt image upload and storage
- User authentication

## 🐛 Troubleshooting

### Supabase Connection Errors

If you see "Supabase connection failed" in the console:

1. Check your `.env.local` file exists in project root
2. Verify the environment variables are correct:
   ```
   VITE_SUPABASE_URL=https://oqxumrsqkuzjfxfdawhj.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```
3. Restart the dev server after adding/changing env variables

### Table Not Found Error

If you see "relation 'expenses' does not exist":

1. Make sure you ran the SQL script in Supabase
2. Verify the table exists in Supabase Dashboard → Table Editor
3. Check that the table name is exactly `expenses` (lowercase)

### Plugin Not Showing in Navigation

If the expenses nav item doesn't appear:

1. Make sure you installed the plugin from the Plugins page
2. Check browser console for errors
3. Try refreshing the page

## 📝 Notes

- The `.env.local` file is gitignored for security
- The MVP uses anonymous access (no user authentication)
- All data is stored in Supabase PostgreSQL database
- The application works offline after initial load, but requires internet for data sync


