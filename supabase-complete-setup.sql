-- ============================================
-- SPECTRA APP - COMPLETE SUPABASE DATABASE SETUP
-- ============================================
-- This file contains all database schemas, indexes, and RLS policies
-- Run this script to set up the complete database for Spectra app
-- ============================================

-- ============================================
-- PROFILES TABLE
-- ============================================
-- Purpose: Store user profile information including name and avatar
-- Links to: auth.users table via foreign key

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(50) CHECK (char_length(first_name) >= 3),
    last_name VARCHAR(50),
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
    ON public.profiles
    FOR DELETE
    USING (auth.uid() = id);

-- Comments for profiles table
COMMENT ON TABLE public.profiles IS 'User profile information including name and avatar';
COMMENT ON COLUMN public.profiles.id IS 'User ID from auth.users table';
COMMENT ON COLUMN public.profiles.first_name IS 'User first name (minimum 3 characters)';
COMMENT ON COLUMN public.profiles.last_name IS 'User last name (optional)';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL to user avatar image (optional)';
COMMENT ON COLUMN public.profiles.updated_at IS 'Timestamp when profile was last updated';
COMMENT ON COLUMN public.profiles.created_at IS 'Timestamp when profile was created';


-- ============================================
-- VISION HISTORY TABLE
-- ============================================
-- Purpose: Store AI vision analysis history for each user
-- Links to: auth.users table via foreign key

CREATE TABLE IF NOT EXISTS public.vision_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    image_uri TEXT,
    mode VARCHAR(20) NOT NULL CHECK (mode IN ('quick', 'detailed', 'accessibility', 'continuous')),
    description TEXT NOT NULL,
    objects JSONB DEFAULT '[]'::jsonb,
    scene TEXT,
    accessibility_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for vision_history table
CREATE INDEX IF NOT EXISTS idx_vision_history_user_id ON public.vision_history(user_id);
CREATE INDEX IF NOT EXISTS idx_vision_history_created_at ON public.vision_history(created_at);
CREATE INDEX IF NOT EXISTS idx_vision_history_mode ON public.vision_history(mode);

-- Enable RLS on vision_history table
ALTER TABLE public.vision_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own vision history" ON public.vision_history;
DROP POLICY IF EXISTS "Users can insert their own vision history" ON public.vision_history;
DROP POLICY IF EXISTS "Users can delete their own vision history" ON public.vision_history;

-- RLS Policies for vision_history
CREATE POLICY "Users can view their own vision history"
    ON public.vision_history
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vision history"
    ON public.vision_history
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vision history"
    ON public.vision_history
    FOR DELETE
    USING (auth.uid() = user_id);

-- Comments for vision_history table
COMMENT ON TABLE public.vision_history IS 'AI vision analysis history for each user';
COMMENT ON COLUMN public.vision_history.id IS 'Unique identifier for each vision analysis';
COMMENT ON COLUMN public.vision_history.user_id IS 'User ID from auth.users table';
COMMENT ON COLUMN public.vision_history.image_uri IS 'URI/path to the analyzed image (optional)';
COMMENT ON COLUMN public.vision_history.mode IS 'Analysis mode: quick, detailed, accessibility, or continuous';
COMMENT ON COLUMN public.vision_history.description IS 'AI-generated description of the image';
COMMENT ON COLUMN public.vision_history.objects IS 'JSONB array of detected objects';
COMMENT ON COLUMN public.vision_history.scene IS 'Scene category/classification';
COMMENT ON COLUMN public.vision_history.accessibility_info IS 'Accessibility-focused information';
COMMENT ON COLUMN public.vision_history.created_at IS 'Timestamp when analysis was created';


-- ============================================
-- SETUP COMPLETE
-- ============================================
-- All tables, indexes, and RLS policies have been created
-- Database is ready for production use
