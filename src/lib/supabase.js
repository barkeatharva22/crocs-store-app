import { createClient } from '@supabase/supabase-js';

// 1. Go to your Supabase project → Settings → API
// 2. Copy "Project URL" and paste it below
// 3. Copy "anon public" key and paste it below
const SUPABASE_URL = 'https://ifukmdojgtajayfxijwq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmdWttZG9qZ3RhamF5ZnhpandxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMzcyNzUsImV4cCI6MjA5NjkxMzI3NX0.grT6bK89W_JUpvrs4VqnrimS3UbHC0ISP9jXhmkB22s';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});