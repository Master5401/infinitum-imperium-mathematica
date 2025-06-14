
-- Create user profiles table with gamification stats
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT UNIQUE,
  level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  total_sequences_submitted INTEGER DEFAULT 0,
  total_challenges_completed INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  avatar_url TEXT,
  title TEXT DEFAULT 'Novice Mathematician',
  mystical_essence INTEGER DEFAULT 100,
  arcane_knowledge INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary', 'mythic')) DEFAULT 'common',
  experience_reward INTEGER DEFAULT 0,
  mystical_essence_reward INTEGER DEFAULT 0,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create quests table
CREATE TABLE IF NOT EXISTS public.quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  quest_type TEXT CHECK (quest_type IN ('daily', 'weekly', 'monthly', 'special')) DEFAULT 'daily',
  difficulty TEXT CHECK (difficulty IN ('novice', 'adept', 'master', 'grandmaster')) DEFAULT 'novice',
  experience_reward INTEGER DEFAULT 0,
  mystical_essence_reward INTEGER DEFAULT 0,
  requirements JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user quest progress table
CREATE TABLE IF NOT EXISTS public.user_quest_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quest_id UUID REFERENCES public.quests(id) ON DELETE CASCADE NOT NULL,
  progress JSONB DEFAULT '{}',
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- Create leaderboards table
CREATE TABLE IF NOT EXISTS public.leaderboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  leaderboard_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  rank INTEGER,
  period TEXT DEFAULT 'all_time',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create mystical artifacts table (collectible items)
CREATE TABLE IF NOT EXISTS public.mystical_artifacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary', 'mythic')) DEFAULT 'common',
  artifact_type TEXT NOT NULL,
  power_level INTEGER DEFAULT 1,
  mystical_essence_cost INTEGER DEFAULT 0,
  unlock_requirement TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user artifacts table
CREATE TABLE IF NOT EXISTS public.user_artifacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  artifact_id UUID REFERENCES public.mystical_artifacts(id) ON DELETE CASCADE NOT NULL,
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_equipped BOOLEAN DEFAULT false,
  UNIQUE(user_id, artifact_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mystical_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_artifacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for achievements
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view all user achievements" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "System can insert user achievements" ON public.user_achievements FOR INSERT WITH CHECK (true);

-- Create RLS policies for quests
CREATE POLICY "Anyone can view active quests" ON public.quests FOR SELECT USING (is_active = true);

-- Create RLS policies for user_quest_progress
CREATE POLICY "Users can view own quest progress" ON public.user_quest_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own quest progress" ON public.user_quest_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quest progress" ON public.user_quest_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for leaderboards
CREATE POLICY "Anyone can view leaderboards" ON public.leaderboards FOR SELECT USING (true);
CREATE POLICY "System can update leaderboards" ON public.leaderboards FOR ALL USING (true);

-- Create RLS policies for mystical_artifacts
CREATE POLICY "Anyone can view artifacts" ON public.mystical_artifacts FOR SELECT USING (true);

-- Create RLS policies for user_artifacts
CREATE POLICY "Users can view all user artifacts" ON public.user_artifacts FOR SELECT USING (true);
CREATE POLICY "Users can update own artifacts" ON public.user_artifacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert user artifacts" ON public.user_artifacts FOR INSERT WITH CHECK (true);

-- Insert initial achievements
INSERT INTO public.achievements (name, description, icon, rarity, experience_reward, mystical_essence_reward, requirement_type, requirement_value) VALUES
('First Steps', 'Submit your first mathematical sequence', '🌟', 'common', 100, 50, 'sequences_submitted', 1),
('Pattern Seeker', 'Submit 10 mathematical sequences', '🔍', 'rare', 250, 100, 'sequences_submitted', 10),
('Sequence Master', 'Submit 50 mathematical sequences', '🏆', 'epic', 500, 200, 'sequences_submitted', 50),
('Daily Devotion', 'Complete 7 daily challenges in a row', '📅', 'rare', 300, 150, 'streak_days', 7),
('Mystic Scholar', 'Complete 30 daily challenges', '📚', 'epic', 750, 300, 'challenges_completed', 30),
('Arcane Mathematician', 'Reach level 10', '🧙‍♂️', 'legendary', 1000, 500, 'level', 10),
('Essence Collector', 'Accumulate 1000 mystical essence', '💎', 'rare', 200, 0, 'mystical_essence', 1000);

-- Insert initial quests
INSERT INTO public.quests (title, description, quest_type, difficulty, experience_reward, mystical_essence_reward, requirements) VALUES
('Daily Pattern Discovery', 'Complete today''s daily challenge', 'daily', 'novice', 50, 25, '{"challenges_completed": 1}'),
('Weekly Sequence Scholar', 'Submit 3 sequences this week', 'weekly', 'adept', 200, 100, '{"sequences_submitted": 3}'),
('Monthly Mystic', 'Accumulate 500 mystical essence this month', 'monthly', 'master', 500, 250, '{"mystical_essence_earned": 500}');

-- Insert initial mystical artifacts
INSERT INTO public.mystical_artifacts (name, description, rarity, artifact_type, power_level, mystical_essence_cost, unlock_requirement) VALUES
('Crystal of Clarity', 'Enhances pattern recognition abilities', 'common', 'tool', 1, 100, 'complete_first_challenge'),
('Tome of Ancient Numbers', 'Contains forbidden mathematical knowledge', 'rare', 'book', 2, 250, 'submit_10_sequences'),
('Staff of Infinite Sequences', 'Channels the power of mathematical infinity', 'epic', 'weapon', 3, 500, 'reach_level_5'),
('Crown of the Sequence Master', 'Worn by the greatest mathematical minds', 'legendary', 'crown', 5, 1000, 'complete_100_challenges'),
('Orb of Mystical Essence', 'Radiates pure mathematical energy', 'mythic', 'orb', 10, 2000, 'legendary_achievement');

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user_gamification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, username, level, experience_points, mystical_essence)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    1,
    0,
    100
  );
  RETURN new;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created_gamification ON auth.users;
CREATE TRIGGER on_auth_user_created_gamification
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_gamification();
