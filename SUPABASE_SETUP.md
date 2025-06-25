# Setting up Supabase Authentication

To enable the authentication system, you need to set up a Supabase project:

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the project details:
   - Name: "80-in-80-training" (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select the closest region to you

## 2. Get Your API Credentials

1. Once your project is created, go to Settings > API
2. Copy:
   - Project URL (looks like: https://xxxxx.supabase.co)
   - Anon/Public key (a long string)

## 3. Configure the Application

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## 4. Set Up Database Tables

1. In your Supabase dashboard, go to SQL Editor
2. Copy and run this SQL first to drop any existing tables:
   ```sql
   -- Drop existing tables if they exist
   DROP TABLE IF EXISTS progress CASCADE;
   DROP TABLE IF EXISTS profiles CASCADE;
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   DROP FUNCTION IF EXISTS public.handle_new_user();
   ```

3. Then copy the contents of `supabase-schema.sql` and run it

## 5. Configure Authentication

1. Go to Authentication > Settings
2. Under "Auth Providers", make sure Email is enabled
3. Under "Email Auth", disable "Confirm email" for easier testing (re-enable for production)

### Enable Google Sign-In

1. Go to Authentication > Providers
2. Find Google in the list and enable it
3. You'll need to set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://yourproject.supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret
4. Back in Supabase, paste your Google Client ID and Secret
5. Save the configuration

## 6. Alternative: Service Role Key for Profile Creation

If you continue to have RLS issues, you can:

1. Create a Postgres function to handle profile creation:
   ```sql
   CREATE OR REPLACE FUNCTION create_profile(
     user_id UUID,
     user_name TEXT,
     user_baseline_score INTEGER
   )
   RETURNS void AS $$
   BEGIN
     INSERT INTO profiles (id, username, baseline_score, current_day)
     VALUES (user_id, user_name, user_baseline_score, 1);
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

2. Then call this function from your app instead of direct insert

## 7. Test the Application

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Try creating a new account
3. If you get RLS errors, check the Supabase logs in your dashboard

## Database Structure

The application uses two main tables:

### Profiles Table
- Stores user information (username, baseline score, current day)
- Linked to Supabase Auth users

### Progress Table
- Stores training progress for each day
- Includes daily tasks completion, scores, and exercise results

## Troubleshooting RLS Errors

If you see "row-level security policy" errors:

1. Make sure you're using the latest schema (without the trigger)
2. Try disabling RLS temporarily to test:
   ```sql
   ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
   ALTER TABLE progress DISABLE ROW LEVEL SECURITY;
   ```
3. Once working, re-enable RLS and fix policies:
   ```sql
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
   ```

For authentication errors:
- Check that your Supabase project is active
- Verify the API keys are correct
- Check the Authentication logs in Supabase dashboard