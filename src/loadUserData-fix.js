  const loadUserData = async (authUser) => {
    console.log('[LOAD USER DATA] Starting to load user data for:', authUser.id);
    
    try {
      // Add a timeout to prevent hanging
      const profilePromise = getProfile(authUser.id);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 8000)
      );
      
      let profile = await Promise.race([profilePromise, timeoutPromise]).catch(err => {
        console.error('[LOAD USER DATA] Profile fetch error:', err);
        return null;
      });
      
      console.log('[LOAD USER DATA] Profile result:', profile);
      
      // If no profile exists (e.g., Google sign-in), create one
      if (!profile) {
        console.log('[LOAD USER DATA] No profile found, creating new one');
        const username = authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email.split('@')[0];
        
        try {
          const { error: createError } = await supabase.rpc('create_user_profile', {
            user_id: authUser.id,
            user_name: username,
            user_baseline_score: 40 // Default baseline for Google users
          });
          
          if (!createError) {
            profile = await getProfile(authUser.id);
            console.log('[LOAD USER DATA] New profile created:', profile);
          } else {
            console.error('[LOAD USER DATA] RPC creation error:', createError);
            throw createError;
          }
        } catch (rpcError) {
          console.error('[LOAD USER DATA] RPC failed, trying direct insert:', rpcError);