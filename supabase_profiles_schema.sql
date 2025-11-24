-- Profiles Table Schema
-- Purpose: Store user profile information including name and avatar
-- Links to: auth.users table via foreign key

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(50) CHECK (char_length(first_name) >= 3),
    last_name VARCHAR(50),
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- RLS Policies
-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Allow users to insert their own profile during onboarding
CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
    ON public.profiles
    FOR DELETE
    USING (auth.uid() = id);

-- Add comment to table
COMMENT ON TABLE public.profiles IS 'User profile information including name and avatar';

-- Add comments to columns
COMMENT ON COLUMN public.profiles.id IS 'User ID from auth.users table';
COMMENT ON COLUMN public.profiles.first_name IS 'User first name (minimum 3 characters)';
COMMENT ON COLUMN public.profiles.last_name IS 'User last name (optional)';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL to user avatar image (optional)';
COMMENT ON COLUMN public.profiles.updated_at IS 'Timestamp when profile was last updated';
COMMENT ON COLUMN public.profiles.created_at IS 'Timestamp when profile was created';
