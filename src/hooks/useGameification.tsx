
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type Achievement = Database['public']['Tables']['achievements']['Row'];
type UserAchievement = Database['public']['Tables']['user_achievements']['Row'];
type Quest = Database['public']['Tables']['quests']['Row'];
type UserQuestProgress = Database['public']['Tables']['user_quest_progress']['Row'];
type MysticalArtifact = Database['public']['Tables']['mystical_artifacts']['Row'];

export const useGameification = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [userQuestProgress, setUserQuestProgress] = useState<UserQuestProgress[]>([]);
  const [artifacts, setArtifacts] = useState<MysticalArtifact[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchGameificationData();
  }, []);

  const fetchGameificationData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch achievements
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at');

      // Fetch user achievements
      const { data: userAchievementsData } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      // Fetch active quests
      const { data: questsData } = await supabase
        .from('quests')
        .select('*')
        .eq('is_active', true)
        .order('created_at');

      // Fetch user quest progress
      const { data: questProgressData } = await supabase
        .from('user_quest_progress')
        .select('*')
        .eq('user_id', user.id);

      // Fetch mystical artifacts
      const { data: artifactsData } = await supabase
        .from('mystical_artifacts')
        .select('*')
        .order('rarity');

      setUserProfile(profile);
      setAchievements(achievementsData || []);
      setUserAchievements(userAchievementsData || []);
      setQuests(questsData || []);
      setUserQuestProgress(questProgressData || []);
      setArtifacts(artifactsData || []);
    } catch (error) {
      console.error('Error fetching gamification data:', error);
      toast({
        title: "Error",
        description: "Failed to load gamification data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (error) throw error;
    
    // Refresh profile data
    fetchGameificationData();
  };

  const checkAchievements = async () => {
    if (!userProfile) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check for new achievements based on user stats
    for (const achievement of achievements) {
      const hasAchievement = userAchievements.some(ua => ua.achievement_id === achievement.id);
      if (hasAchievement) continue;

      let qualifies = false;
      
      switch (achievement.requirement_type) {
        case 'sequences_submitted':
          qualifies = userProfile.total_sequences_submitted >= achievement.requirement_value;
          break;
        case 'challenges_completed':
          qualifies = userProfile.total_challenges_completed >= achievement.requirement_value;
          break;
        case 'streak_days':
          qualifies = userProfile.streak_days >= achievement.requirement_value;
          break;
        case 'level':
          qualifies = userProfile.level >= achievement.requirement_value;
          break;
        case 'mystical_essence':
          qualifies = userProfile.mystical_essence >= achievement.requirement_value;
          break;
      }

      if (qualifies) {
        // Award achievement
        await supabase
          .from('user_achievements')
          .insert({
            user_id: user.id,
            achievement_id: achievement.id
          });

        // Update user profile with rewards
        await updateUserProfile({
          experience_points: userProfile.experience_points + achievement.experience_reward,
          mystical_essence: userProfile.mystical_essence + achievement.mystical_essence_reward
        });

        toast({
          title: "Achievement Unlocked! 🏆",
          description: `${achievement.name}: ${achievement.description}`,
        });
      }
    }
  };

  return {
    userProfile,
    achievements,
    userAchievements,
    quests,
    userQuestProgress,
    artifacts,
    loading,
    updateUserProfile,
    checkAchievements,
    refreshData: fetchGameificationData
  };
};
