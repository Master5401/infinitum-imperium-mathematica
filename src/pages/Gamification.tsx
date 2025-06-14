
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useGameification } from "@/hooks/useGameification";
import UserProfileCard from "@/components/gamification/UserProfileCard";
import AchievementsPanel from "@/components/gamification/AchievementsPanel";
import QuestsPanel from "@/components/gamification/QuestsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Gamification = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    achievements,
    userAchievements,
    quests,
    userQuestProgress,
    artifacts,
    loading,
  } = useGameification();

  useEffect(() => {
    document.title = "Math Torcher - Gamification";
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-purple-300">Loading your mystical profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-slate-800/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-purple-300 text-center">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-purple-200">Please sign in to access your gamification profile.</p>
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 text-purple-300 hover:text-purple-200"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-300 mb-2 font-cinzel">
            Mystical Profile
          </h1>
          <p className="text-purple-200/80 font-sorts-mill">
            Track your mathematical journey through achievements, quests, and mystical artifacts.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Achievements */}
          <div className="lg:col-span-2 space-y-8">
            <UserProfileCard profile={userProfile} />
            <AchievementsPanel 
              achievements={achievements}
              userAchievements={userAchievements}
              userProfile={userProfile}
            />
          </div>

          {/* Right Column - Quests & Artifacts */}
          <div className="space-y-8">
            <QuestsPanel 
              quests={quests}
              userQuestProgress={userQuestProgress}
            />
            
            <Card className="bg-gradient-to-br from-slate-900 to-amber-900/30 border-amber-500/30">
              <CardHeader>
                <CardTitle className="text-amber-300 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Mystical Artifacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {artifacts.slice(0, 5).map((artifact) => (
                    <div 
                      key={artifact.id}
                      className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-amber-300 font-medium text-sm">{artifact.name}</h4>
                          <p className="text-amber-200/70 text-xs">{artifact.description}</p>
                        </div>
                        <div className="text-amber-400 text-sm">
                          ✨ {artifact.mystical_essence_cost}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 text-amber-300 border-amber-500/50"
                >
                  View All Artifacts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gamification;
