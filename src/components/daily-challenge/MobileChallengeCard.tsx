
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Trophy, Smartphone } from "lucide-react";
import { Challenge } from "./ChallengeCard";

interface MobileChallengeCardProps {
  loading: boolean;
  challenge: Challenge | null;
  animateIn: boolean;
  children?: React.ReactNode;
}

const MobileChallengeCard: React.FC<MobileChallengeCardProps> = ({
  loading,
  challenge,
  animateIn,
  children,
}) => {
  if (loading) {
    return (
      <Card className={`bg-[#1b1c22]/80 border-amber-900/30 shadow-xl backdrop-blur-sm transition-all duration-700 mx-2 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 bg-clip-text text-transparent">
              Daily Challenge
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-amber-400" />
              <Trophy className="h-4 w-4 text-amber-400 animate-pulse" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Brain className="h-6 w-6 text-amber-400 animate-spin" />
            <span className="ml-3 text-amber-300 text-sm">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!challenge) {
    return (
      <Card className={`bg-[#1b1c22]/80 border-amber-900/30 shadow-xl backdrop-blur-sm transition-all duration-700 mx-2 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 bg-clip-text text-transparent">
            Daily Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-amber-300 text-sm">
            <p>Unable to load challenge. Please refresh.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-[#1b1c22]/80 border-amber-900/30 shadow-xl backdrop-blur-sm transition-all duration-700 mx-2 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 bg-clip-text text-transparent">
            Daily Challenge
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4 text-amber-400" />
            <Trophy className="h-4 w-4 text-amber-400 animate-pulse" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-[#1b1c22]/80 rounded-lg border border-amber-900/20 transform transition-all duration-500">
            <h3 className="text-lg text-amber-300 mb-3">Today's Sequence</h3>
            <div className="text-sm font-mono text-amber-200 break-all overflow-x-auto">
              {challenge.sequence}
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-xs text-amber-400">Difficulty:</span>
              <div className="ml-2 flex">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-3 rounded-full mx-0.5 transition-all duration-300 ${
                      i < challenge.difficulty
                        ? "bg-amber-500"
                        : "bg-amber-900/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileChallengeCard;
