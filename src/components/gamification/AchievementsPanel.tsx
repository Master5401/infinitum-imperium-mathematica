
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, Trophy } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Achievement = Database['public']['Tables']['achievements']['Row'];
type UserAchievement = Database['public']['Tables']['user_achievements']['Row'];
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface AchievementsPanelProps {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  userProfile: UserProfile | null;
}

const AchievementsPanel = ({ achievements, userAchievements, userProfile }: AchievementsPanelProps) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return 'bg-purple-500 text-white';
      case 'legendary': return 'bg-amber-500 text-white';
      case 'epic': return 'bg-orange-500 text-white';
      case 'rare': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getProgress = (achievement: Achievement) => {
    if (!userProfile) return 0;
    
    let current = 0;
    switch (achievement.requirement_type) {
      case 'sequences_submitted':
        current = userProfile.total_sequences_submitted;
        break;
      case 'challenges_completed':
        current = userProfile.total_challenges_completed;
        break;
      case 'streak_days':
        current = userProfile.streak_days;
        break;
      case 'level':
        current = userProfile.level;
        break;
      case 'mystical_essence':
        current = userProfile.mystical_essence;
        break;
    }
    
    return Math.min((current / achievement.requirement_value) * 100, 100);
  };

  const isUnlocked = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-purple-900/30 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-purple-300 flex items-center">
          <Trophy className="h-5 w-5 mr-2" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {achievements.map((achievement) => {
            const unlocked = isUnlocked(achievement.id);
            const progress = getProgress(achievement);
            
            return (
              <div 
                key={achievement.id} 
                className={`p-4 rounded-lg border transition-all ${
                  unlocked 
                    ? 'bg-gradient-to-r from-purple-900/50 to-amber-900/30 border-amber-500/30' 
                    : 'bg-slate-800/50 border-slate-700/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{unlocked ? achievement.icon : <Lock className="h-6 w-6 text-gray-500" />}</div>
                    <div>
                      <h4 className={`font-semibold ${unlocked ? 'text-amber-300' : 'text-gray-400'}`}>
                        {achievement.name}
                      </h4>
                      <p className={`text-sm ${unlocked ? 'text-purple-200' : 'text-gray-500'}`}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  <Badge className={getRarityColor(achievement.rarity || 'common')}>
                    {achievement.rarity}
                  </Badge>
                </div>
                
                {!unlocked && (
                  <div className="mt-3">
                    <Progress value={progress} className="h-2 bg-slate-700" />
                    <p className="text-xs text-gray-400 mt-1">
                      Progress: {Math.floor(progress)}%
                    </p>
                  </div>
                )}
                
                {unlocked && (
                  <div className="mt-2 text-xs text-amber-400">
                    ✨ Unlocked! +{achievement.experience_reward} XP, +{achievement.mystical_essence_reward} Essence
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsPanel;
