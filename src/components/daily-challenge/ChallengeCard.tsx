
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Trophy } from "lucide-react";

// Define the Challenge interface to fix TypeScript error
export interface Challenge {
  id?: string;
  sequence: string;
  hints: string[];
  difficulty: number;
  solution: string;
  created_at?: string;
}

interface ChallengeCardProps {
  loading: boolean;
  challenge: Challenge | null;
  animateIn: boolean;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  loading,
  challenge,
  animateIn,
  children,
}) => {
  if (loading) {
    return (
      <Card className={`bg-[#1b1c22]/80 border-amber-900/30 shadow-2xl backdrop-blur-sm transition-all duration-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 bg-clip-text text-transparent">
              Daily Mathematical Challenge
            </CardTitle>
            <Trophy className="h-6 w-6 text-amber-400 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Brain className="h-8 w-8 text-amber-400 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!challenge) {
    return (
      <Card className={`bg-[#1b1c22]/80 border-amber-900/30 shadow-2xl backdrop-blur-sm transition-all duration-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 bg-clip-text text-transparent">
              Daily Mathematical Challenge
            </CardTitle>
            <Trophy className="h-6 w-6 text-amber-400 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-amber-300">
            Failed to load challenge. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-[#1b1c22]/80 border-amber-900/30 shadow-2xl backdrop-blur-sm transition-all duration-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 bg-clip-text text-transparent">
            Daily Mathematical Challenge
          </CardTitle>
          <Trophy className="h-6 w-6 text-amber-400 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-6 bg-[#1b1c22]/80 rounded-lg border border-amber-900/20 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-amber-900/20 hover:shadow-md">
            <h3 className="text-xl text-amber-300 mb-4">Today's Sequence</h3>
            <p className="text-lg font-mono text-amber-200">{challenge.sequence}</p>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-amber-400">Difficulty:</span>
              <div className="ml-2 flex">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-4 rounded-full mx-0.5 transition-all duration-300 ${
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

export default ChallengeCard;
