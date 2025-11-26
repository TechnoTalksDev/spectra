-- ============================================
-- MIGRATION: Fix Vision History Mode Values
-- ============================================
-- Run this if you already created the vision_history table with wrong mode values
-- This updates the CHECK constraint to use the correct modes

-- Step 1: Drop the existing CHECK constraint
ALTER TABLE public.vision_history 
DROP CONSTRAINT IF EXISTS vision_history_mode_check;

-- Step 2: Add the correct CHECK constraint with proper mode values
ALTER TABLE public.vision_history 
ADD CONSTRAINT vision_history_mode_check 
CHECK (mode IN ('quick', 'detailed', 'accessibility', 'continuous'));

-- Step 3: Make image_uri optional (if it was NOT NULL before)
ALTER TABLE public.vision_history 
ALTER COLUMN image_uri DROP NOT NULL;

-- Step 4: Set default for objects column (if not already set)
ALTER TABLE public.vision_history 
ALTER COLUMN objects SET DEFAULT '[]'::jsonb;

-- Verification: Check the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'vision_history' 
ORDER BY ordinal_position;

-- Verification: Check the constraint
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.vision_history'::regclass
AND contype = 'c';
