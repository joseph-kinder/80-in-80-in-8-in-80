// Test script to debug Supabase connection issues
import { supabase } from './lib/supabase.js';

async function debugSupabase() {
  console.log('=== SUPABASE DEBUG ===');
  
  // 1. Test basic connection
  console.log('1. Testing basic connection...');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session error:', error);
    } else {
      console.log('Session:', data.session ? 'Active' : 'None');
      if (data.session) {
        console.log('User ID:', data.session.user.id);
        console.log('Email:', data.session.user.email);
      }
    }
  } catch (e) {
    console.error('Connection test failed:', e);
  }
  
  // 2. Test profiles table access
  console.log('\n2. Testing profiles table access...');
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Profiles table error:', error);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
    } else {
      console.log('Profiles table accessible');
    }
  } catch (e) {
    console.error('Profiles test failed:', e);
  }
  
  // 3. Test RLS policies
  console.log('\n3. Testing RLS policies...');
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id);
      
      if (error) {
        console.error('RLS test error:', error);
      } else {
        console.log('RLS test passed, records found:', data.length);
      }
    } catch (e) {
      console.error('RLS test failed:', e);
    }
  }
  
  // 4. Test RPC function
  console.log('\n4. Testing RPC function...');
  if (session) {
    try {
      const { data, error } = await supabase.rpc('create_user_profile', {
        user_id: session.user.id,
        user_name: 'test_user',
        user_baseline_score: 40
      });
      
      if (error) {
        console.error('RPC test error:', error);
        if (error.message.includes('already exists')) {
          console.log('Profile already exists (expected)');
        }
      } else {
        console.log('RPC function accessible');
      }
    } catch (e) {
      console.error('RPC test failed:', e);
    }
  }
  
  console.log('\n=== DEBUG COMPLETE ===');
}

// Run the debug
debugSupabase();