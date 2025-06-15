
-- First, let's check what RLS policies already exist and only add the missing ones

-- Add RLS policies for achievements (public read) - only if not exists
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'achievements' AND policyname = 'Anyone can view achievements'
    ) THEN
        CREATE POLICY "Anyone can view achievements" 
          ON public.achievements 
          FOR SELECT 
          USING (true);
    END IF;
END $$;

-- Add RLS policies for user_achievements - only if not exists
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_achievements' AND policyname = 'Users can view own achievements'
    ) THEN
        CREATE POLICY "Users can view own achievements" 
          ON public.user_achievements 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_achievements' AND policyname = 'System can insert user achievements'
    ) THEN
        CREATE POLICY "System can insert user achievements" 
          ON public.user_achievements 
          FOR INSERT 
          WITH CHECK (true);
    END IF;
END $$;

-- Add RLS policies for quests (public read) - only if not exists
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quests' AND policyname = 'Anyone can view active quests'
    ) THEN
        CREATE POLICY "Anyone can view active quests" 
          ON public.quests 
          FOR SELECT 
          USING (is_active = true);
    END IF;
END $$;

-- Add RLS policies for user_quest_progress - only if not exists
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_quest_progress' AND policyname = 'Users can view own quest progress'
    ) THEN
        CREATE POLICY "Users can view own quest progress" 
          ON public.user_quest_progress 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_quest_progress' AND policyname = 'Users can update own quest progress'
    ) THEN
        CREATE POLICY "Users can update own quest progress" 
          ON public.user_quest_progress 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_quest_progress' AND policyname = 'Users can insert own quest progress'
    ) THEN
        CREATE POLICY "Users can insert own quest progress" 
          ON public.user_quest_progress 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Add RLS policies for mystical_artifacts (public read) - only if not exists
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mystical_artifacts' AND policyname = 'Anyone can view artifacts'
    ) THEN
        CREATE POLICY "Anyone can view artifacts" 
          ON public.mystical_artifacts 
          FOR SELECT 
          USING (true);
    END IF;
END $$;

-- Add RLS policies for user_artifacts - only if not exists
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_artifacts' AND policyname = 'Users can view own artifacts'
    ) THEN
        CREATE POLICY "Users can view own artifacts" 
          ON public.user_artifacts 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_artifacts' AND policyname = 'Users can update own artifacts'
    ) THEN
        CREATE POLICY "Users can update own artifacts" 
          ON public.user_artifacts 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_artifacts' AND policyname = 'Users can insert own artifacts'
    ) THEN
        CREATE POLICY "Users can insert own artifacts" 
          ON public.user_artifacts 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Add RLS policies for daily_challenges (public read) - only if not exists
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'daily_challenges' AND policyname = 'Anyone can view daily challenges'
    ) THEN
        CREATE POLICY "Anyone can view daily challenges" 
          ON public.daily_challenges 
          FOR SELECT 
          USING (true);
    END IF;
END $$;

-- Add RLS policies for sequences_library - only if not exists
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sequences_library' AND policyname = 'Anyone can view sequences'
    ) THEN
        CREATE POLICY "Anyone can view sequences" 
          ON public.sequences_library 
          FOR SELECT 
          USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sequences_library' AND policyname = 'Authenticated users can insert sequences'
    ) THEN
        CREATE POLICY "Authenticated users can insert sequences" 
          ON public.sequences_library 
          FOR INSERT 
          TO authenticated 
          WITH CHECK (true);
    END IF;
END $$;

-- Add RLS policies for sequences - only if not exists
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sequences' AND policyname = 'Anyone can view sequences'
    ) THEN
        CREATE POLICY "Anyone can view sequences" 
          ON public.sequences 
          FOR SELECT 
          USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sequences' AND policyname = 'Authenticated users can insert sequences'
    ) THEN
        CREATE POLICY "Authenticated users can insert sequences" 
          ON public.sequences 
          FOR INSERT 
          TO authenticated 
          WITH CHECK (true);
    END IF;
END $$;

-- Add function to automatically update user profile timestamps (only if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for user_profiles updated_at (only if not exists)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_user_profiles_updated_at'
    ) THEN
        CREATE TRIGGER update_user_profiles_updated_at 
          BEFORE UPDATE ON public.user_profiles 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Add indexes for better performance (only if not exists)
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quest_progress_user_id ON public.user_quest_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_artifacts_user_id ON public.user_artifacts(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON public.daily_challenges(date);
