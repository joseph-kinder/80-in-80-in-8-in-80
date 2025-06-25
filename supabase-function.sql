-- Alternative approach using a database function to bypass RLS issues

-- Create a function that can insert profiles with SECURITY DEFINER
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id UUID,
  user_name TEXT,
  user_baseline_score INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, username, baseline_score, current_day)
  VALUES (user_id, user_name, user_baseline_score, 1);
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, do nothing
    NULL;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_user_profile TO authenticated;

-- You can then call this function from your app like:
-- const { error } = await supabase.rpc('create_user_profile', {
--   user_id: authData.user.id,
--   user_name: username,
--   user_baseline_score: baselineScore
-- })