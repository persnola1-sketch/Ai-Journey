-- ================================================
-- USER AUTHENTICATION SETUP
-- ================================================
-- Run this script in your Supabase SQL Editor
-- This enables user authentication and data isolation
-- ================================================

-- 1. CREATE PROFILES TABLE
-- ================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. AUTO-CREATE PROFILE ON SIGNUP
-- ================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Create default preferences for new user
  INSERT INTO user_preferences (user_id, theme, installed_plugins, plugin_settings, preferences)
  VALUES (NEW.id, 'dark', '[]'::jsonb, '{}'::jsonb, '{}'::jsonb);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at on profiles
CREATE TRIGGER profiles_updated_at 
BEFORE UPDATE ON profiles 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at();

-- 3. DROP OLD ANONYMOUS POLICIES
-- ================================================
DROP POLICY IF EXISTS "Public access" ON expenses;
DROP POLICY IF EXISTS "Allow all operations" ON expenses;
DROP POLICY IF EXISTS "Public access" ON goals;
DROP POLICY IF EXISTS "Public access" ON milestones;
DROP POLICY IF EXISTS "Public access" ON chat_messages;
DROP POLICY IF EXISTS "Public access" ON conversations;
DROP POLICY IF EXISTS "Public access" ON prompts;
DROP POLICY IF EXISTS "Public access" ON user_preferences;

-- 4. CREATE USER-SPECIFIC RLS POLICIES
-- ================================================

-- EXPENSES POLICIES
CREATE POLICY "Users can view own expenses" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses" ON expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses" ON expenses
  FOR DELETE USING (auth.uid() = user_id);

-- GOALS POLICIES
CREATE POLICY "Users can view own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- MILESTONES POLICIES
CREATE POLICY "Users can view own milestones" ON milestones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own milestones" ON milestones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own milestones" ON milestones
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own milestones" ON milestones
  FOR DELETE USING (auth.uid() = user_id);

-- CHAT MESSAGES POLICIES
CREATE POLICY "Users can view own messages" ON chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages" ON chat_messages
  FOR DELETE USING (auth.uid() = user_id);

-- CONVERSATIONS POLICIES
CREATE POLICY "Users can view own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" ON conversations
  FOR DELETE USING (auth.uid() = user_id);

-- PROMPTS POLICIES
CREATE POLICY "Users can view own prompts" ON prompts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prompts" ON prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts" ON prompts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts" ON prompts
  FOR DELETE USING (auth.uid() = user_id);

-- USER PREFERENCES POLICIES
-- Note: user_preferences uses user_id column (not id)
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- ================================================
-- VERIFICATION QUERIES (Optional - for testing)
-- ================================================

-- Check if profiles table was created
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'profiles';

-- Check if trigger was created
-- SELECT trigger_name FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';

-- Check RLS policies
-- SELECT tablename, policyname FROM pg_policies WHERE tablename IN ('expenses', 'goals', 'milestones', 'chat_messages', 'conversations', 'prompts', 'user_preferences', 'profiles');

-- ================================================
-- SUCCESS!
-- ================================================
-- Authentication is now enabled!
-- Users can sign up and will have isolated data.
-- ================================================


