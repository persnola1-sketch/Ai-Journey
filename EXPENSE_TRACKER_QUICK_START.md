# 💰 Expense Tracker - Quick Start

## 🚀 3 Simple Steps to Get Started

### Step 1: Setup Supabase Database (1 minute)

1. Open: https://supabase.com/dashboard
2. Select your project: **oqxumrsqkuzjfxfdawhj**
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Open the file `SUPABASE_SQL_SCRIPT.sql` in this project
6. Copy ALL the SQL code (lines 1-58)
7. Paste into Supabase SQL Editor
8. Click **Run** (or press Ctrl+Enter)
9. ✅ You should see "Success. No rows returned"

### Step 2: Open the App (30 seconds)

1. Dev server is already running at: **http://localhost:5173**
2. Open it in your browser
3. Navigate to **Plugins** page
4. Find **💰 Expense Tracker**
5. Click **Install**
6. ✅ You'll see "💰 Expenses" in the navigation bar

### Step 3: Add Your First Expense (30 seconds)

1. Click **💰 Expenses** in the navigation
2. Click **Add Expense** button
3. Fill in the form:
   - Store: e.g., "Starbucks"
   - Date: Today's date
   - Amount: e.g., "5.50"
   - Category: Pick any (e.g., "🎉 Entertainment")
   - Notes: Optional
4. Click **Add Expense**
5. ✅ You'll see your expense in the table!

---

## 🎉 That's It!

Now you can:
- ✅ View your expenses at `/expenses`
- ✅ See monthly totals on the Dashboard
- ✅ Filter by category
- ✅ Edit/delete expenses
- ✅ Track spending across all your devices

---

## 🐛 Troubleshooting

**"Supabase connection failed"**
- Make sure you ran the SQL script in Step 1
- Check that `.env.local` file exists with correct credentials
- Restart dev server: `npm run dev`

**"Can't see expenses navigation item"**
- Make sure you installed the plugin (Step 2, item 5)
- Refresh the page

**"Table 'expenses' does not exist"**
- Go back to Step 1 and run the SQL script

---

## 📚 More Information

- **Full Setup Guide**: `EXPENSE_TRACKER_SETUP.md`
- **Implementation Details**: `EXPENSE_TRACKER_IMPLEMENTATION_COMPLETE.md`
- **SQL Script**: `SUPABASE_SQL_SCRIPT.sql`

---

**Need help?** Check the browser console (F12) for error messages.


