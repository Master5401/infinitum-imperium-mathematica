
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, Sparkles, Trophy, Target } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface UserProfileCardProps {
  profile: UserProfile;
}

const UserProfileCard = ({ profile }: UserProfileCardProps) => {
  const experienceToNextLevel = profile.level * 100;
  const currentLevelProgress = profile.experience_points % 100;
  const progressPercentage = (currentLevelProgress / 100) * 100;

  const getRarityColor = (level: number) => {
    if (level >= 20) return "text-purple-400 border-purple-400";
    if (level >= 15) return "text-amber-400 border-amber-400";
    if (level >= 10) return "text-orange-400 border-orange-400";
    if (level >= 5) return "text-blue-400 border-blue-400";
    return "text-green-400 border-green-400";
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border-purple-500/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
              <Badge className={`absolute -bottom-1 -right-1 text-xs px-1 ${getRarityColor(profile.level)}`}>
                {profile.level}
              </Badge>
            </div>
            <div>
              <CardTitle className="text-purple-300 text-lg">{profile.username}</CardTitle>
              <p className="text-purple-400/70 text-sm">{profile.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-purple-300 font-bold">{profile.mystical_essence}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-purple-400">Experience</span>
            <span className="text-purple-300">{profile.experience_points} XP</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-purple-900/50" />
          <p className="text-xs text-purple-400/70 mt-1">
            {100 - currentLevelProgress} XP to level {profile.level + 1}
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Trophy className="h-4 w-4 text-amber-400 mr-1" />
              <span className="text-white font-bold">{profile.total_sequences_submitted}</span>
            </div>
            <p className="text-xs text-purple-400/70">Sequences</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Target className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-white font-bold">{profile.total_challenges_completed}</span>
            </div>
            <p className="text-xs text-purple-400/70">Challenges</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <span className="text-orange-400 font-bold text-lg">🔥</span>
              <span className="text-white font-bold ml-1">{profile.streak_days}</span>
            </div>
            <p className="text-xs text-purple-400/70">Streak</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
