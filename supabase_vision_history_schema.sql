-- Vision History Table
CREATE TABLE vision_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_uri TEXT,
  mode VARCHAR(20) NOT NULL CHECK (mode IN ('quick', 'detailed', 'accessibility', 'continuous')),
  description TEXT NOT NULL,
  objects JSONB DEFAULT '[]'::jsonb,
  scene TEXT,
  accessibility_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_vision_history_user_id ON vision_history(user_id);
CREATE INDEX idx_vision_history_created_at ON vision_history(created_at DESC);
CREATE INDEX idx_vision_history_mode ON vision_history(mode);

-- RLS Policies
ALTER TABLE vision_history ENABLE ROW LEVEL SECURITY;

-- Users can only read their own history
CREATE POLICY "Users can view their own vision history"
  ON vision_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own history
CREATE POLICY "Users can create their own vision history"
  ON vision_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own history
CREATE POLICY "Users can delete their own vision history"
  ON vision_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE vision_history IS 'Stores AI vision analysis history for users';
COMMENT ON COLUMN vision_history.mode IS 'Analysis mode used: quick, detailed, accessibility, or continuous';
COMMENT ON COLUMN vision_history.objects IS 'Array of detected objects stored as JSONB';
