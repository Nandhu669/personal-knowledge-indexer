-- ============================================================
-- Personal Knowledge Indexer — Supabase Migration
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension (usually enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- 1. Create the tools table
-- =========================
CREATE TABLE IF NOT EXISTS tools (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT 'Other',
  website       TEXT,
  description   TEXT,
  use_case      TEXT,
  relevance_score INTEGER NOT NULL DEFAULT 3 CHECK (relevance_score >= 1 AND relevance_score <= 5),
  tags          TEXT[] DEFAULT '{}',
  source_link   TEXT,
  is_favorite   BOOLEAN DEFAULT FALSE,
  usage_count   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. GIN index for full-text search performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_tools_fts
  ON tools
  USING GIN (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));

-- Index on tags for array queries
CREATE INDEX IF NOT EXISTS idx_tools_tags
  ON tools
  USING GIN (tags);

-- Index on category for filtering
CREATE INDEX IF NOT EXISTS idx_tools_category
  ON tools (category);

-- Index on user_id for fast per-user queries
CREATE INDEX IF NOT EXISTS idx_tools_user_id
  ON tools (user_id);

-- ============================================
-- 3. Auto-update updated_at on row modification
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================
-- 4. Row Level Security (RLS) policies
-- =====================================
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Users can only see their own tools
CREATE POLICY "Users can view own tools"
  ON tools FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own tools
CREATE POLICY "Users can insert own tools"
  ON tools FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own tools
CREATE POLICY "Users can update own tools"
  ON tools FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own tools
CREATE POLICY "Users can delete own tools"
  ON tools FOR DELETE
  USING (auth.uid() = user_id);
