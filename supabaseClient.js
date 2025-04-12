import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wacvgkxassacasqnootm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhY3Zna3hhc3NhY2FzcW5vb3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NTA5NTMsImV4cCI6MjA1ODEyNjk1M30.m_9aeaMvh1wxB_7c4eNpkBZf3SSLrglpIr19-54De2s'

export const supabase = createClient(supabaseUrl, supabaseKey)
