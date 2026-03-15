CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'anon',
  display_name TEXT NOT NULL DEFAULT 'Guest',
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard','expert')),
  puzzle_id TEXT NOT NULL,
  final_score INTEGER NOT NULL,
  time_ms INTEGER NOT NULL,
  hints_used SMALLINT DEFAULT 0,
  errors_count SMALLINT DEFAULT 0,
  streak_bonus INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS scores_difficulty_final_score_time_ms_idx
  ON scores (difficulty, final_score DESC, time_ms ASC);
