import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xkemskabkbljigsuuyis.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZW1za2Fia2Jsamlnc3V1eWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NjUzMTYsImV4cCI6MjA3OTU0MTMxNn0.YIo21h3DRX4akHtvba1n_HyEKMBzE-ApYfGhsdOwBdY';

export const supabase = createClient(supabaseUrl, supabaseKey);