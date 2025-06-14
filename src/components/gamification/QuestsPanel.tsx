
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, Target, Star } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Quest = Database['public']['Tables']['quests']['Row'];
type UserQuestProgress = Database['public']['Tables']['user_quest_progress']['Row'];

interface QuestsPanelProps {
  quests: Quest[];
  userQuestProgress: UserQuestProgress[];
}

const QuestsPanel = ({ quests, userQuestProgress }: QuestsPanelProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'grandmaster': return 'bg-purple-500 text-white';
      case 'master': return 'bg-red-500 text-white';
      case 'adept': return 'bg-orange-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  const getQuestTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return '📅';
      case 'weekly': return '📰';
      case 'monthly': return '🗓️';
      default: return '⭐';
    }
  };

  const getQuestProgress = (questId: string) => {
    return userQuestProgress.find(up => up.quest_id === questId);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-blue-900/30 border-blue-500/30">
      <CardHeader>
        <CardTitle className="text-blue-300 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Active Quests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quests.map((quest) => {
            const progress = getQuestProgress(quest.id);
            const isCompleted = progress?.completed || false;
            
            return (
              <div 
                key={quest.id} 
                className={`p-4 rounded-lg border transition-all ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/30 border-green-500/30' 
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getQuestTypeIcon(quest.quest_type || 'daily')}</div>
                    <div>
                      <h4 className={`font-semibold ${isCompleted ? 'text-green-300' : 'text-blue-300'}`}>
                        {quest.title}
                      </h4>
                      <p className={`text-sm ${isCompleted ? 'text-green-200' : 'text-blue-200'}`}>
                        {quest.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={getDifficultyColor(quest.difficulty || 'novice')}>
                      {quest.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {quest.quest_type}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-amber-400">
                      <Star className="h-3 w-3 mr-1" />
                      {quest.experience_reward} XP
                    </div>
                    <div className="flex items-center text-purple-400">
                      <span className="mr-1">✨</span>
                      {quest.mystical_essence_reward} Essence
                    </div>
                  </div>
                  
                  {isCompleted ? (
                    <Badge className="bg-green-500 text-white">
                      ✓ Completed
                    </Badge>
                  ) : (
                    <Button size="sm" variant="outline" className="text-blue-300 border-blue-500/50">
                      Start Quest
                    </Button>
                  )}
                </div>
                
                {quest.expires_at && (
                  <div className="flex items-center text-xs text-gray-400 mt-2">
                    <Clock className="h-3 w-3 mr-1" />
                    Expires: {new Date(quest.expires_at).toLocaleDateString()}
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

export default QuestsPanel;
