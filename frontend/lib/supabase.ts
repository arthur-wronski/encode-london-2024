import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = 'https://tbxypxkqpidvxbbvrbiz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRieHlweGtxcGlkdnhiYnZyYml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4ODU2NTgsImV4cCI6MjA0NTQ2MTY1OH0.BsI1stJHB8Xe07VHpPsDZGcAf5jv0Y02Np3HGV_Gq_g';

// Only include auth configuration if not server-side rendering
const authConfig = Platform.OS === 'web' && typeof window === 'undefined' 
  ? {}
  : {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    };

export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey,
  authConfig
);
