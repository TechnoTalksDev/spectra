-- FIX THE VISION_HISTORY MODE CONSTRAINT
-- Run this in Supabase SQL Editor to fix the constraint

-- Drop the old constraint if it exists
ALTER TABLE public.vision_history 
DROP CONSTRAINT IF EXISTS vision_history_mode_check;

-- Add the correct constraint with the right mode values
ALTER TABLE public.vision_history 
ADD CONSTRAINT vision_history_mode_check 
CHECK (mode IN ('quick', 'detailed', 'accessibility', 'continuous'));
