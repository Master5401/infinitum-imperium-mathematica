
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, Lightbulb, Trophy, LineChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SequenceGraph } from "@/components/SequenceGraph";

interface Challenge {
  id: string;
  sequence: string;
  hints: string[];
  difficulty: number;
  solution: string;
  date: string;
}

const DailyChallenge = () => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showGraph, setShowGraph] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        
        // First try to get challenge from Supabase
        const { data: existingChallenge, error } = await supabase
          .from('daily_challenges')
          .select('*')
          .eq('date', new Date().toISOString().split('T')[0])
          .single();

        if (existingChallenge) {
          setChallenge(existingChallenge);
        } else {
          // If no challenge exists, call our edge function to generate one
          const { data, error } = await supabase.functions.invoke('generate-daily-challenge');
          
          if (error) throw error;
          if (data.challenge) {
            setChallenge(data.challenge);
          } else {
            throw new Error("No challenge data returned");
          }
        }
      } catch (error) {
        console.error("Error fetching challenge:", error);
        toast({
          title: "Error",
          description: "Failed to load daily challenge. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [toast]);

  const showNextHint = () => {
    if (challenge && currentHintIndex < challenge.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
    setShowHint(true);
  };

  // Get sequence numbers for graphing
  const getSequenceNumbers = () => {
    if (!challenge) return [];
    return challenge.sequence.split(/[,\s]+/).map(num => parseFloat(num.trim())).filter(n => !isNaN(n));
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] math-bg py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6 text-purple-300 hover:text-purple-200"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="bg-[#2A2F3C] border-purple-900/30 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-purple-300">
                Daily Mathematical Challenge
              </CardTitle>
              <Trophy className="h-6 w-6 text-purple-400 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Brain className="h-8 w-8 text-purple-400 animate-spin" />
              </div>
            ) : challenge ? (
              <div className="space-y-6">
                <div className="p-6 bg-[#1A1F2C] rounded-lg border border-purple-900/20">
                  <h3 className="text-xl text-purple-300 mb-4">Today's Sequence</h3>
                  <p className="text-lg font-mono text-purple-200">{challenge.sequence}</p>
                  <div className="mt-4 flex items-center">
                    <span className="text-sm text-purple-400">Difficulty:</span>
                    <div className="ml-2 flex">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-4 rounded-full mx-0.5 ${
                            i < challenge.difficulty
                              ? "bg-purple-500"
                              : "bg-purple-900/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {showHint && challenge.hints.slice(0, currentHintIndex + 1).map((hint, index) => (
                    <div
                      key={index}
                      className="p-4 bg-purple-900/10 rounded-lg border border-purple-900/20"
                    >
                      <div className="flex items-center text-purple-300 mb-2">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        <span className="font-medium">Hint {index + 1}</span>
                      </div>
                      <p className="text-purple-200">{hint}</p>
                    </div>
                  ))}
                </div>

                {showGraph && (
                  <div className="p-4 bg-[#1A1F2C] rounded-lg border border-purple-900/20">
                    <h3 className="text-xl text-purple-300 mb-4">Sequence Visualization</h3>
                    <div className="h-64">
                      <SequenceGraph data={getSequenceNumbers()} />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="text-purple-300 border-purple-900/30"
                    onClick={showNextHint}
                    disabled={showHint && currentHintIndex >= challenge.hints.length - 1}
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    {showHint ? "Next Hint" : "Show Hint"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="text-purple-300 border-purple-900/30"
                    onClick={() => setShowGraph(!showGraph)}
                  >
                    <LineChart className="h-4 w-4 mr-2" />
                    {showGraph ? "Hide Graph" : "Visualize"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="text-purple-300 border-purple-900/30"
                    onClick={() => setShowSolution(!showSolution)}
                  >
                    {showSolution ? "Hide Solution" : "Show Solution"}
                  </Button>
                </div>

                {showSolution && (
                  <div className="p-6 bg-purple-900/10 rounded-lg border border-purple-900/20 mt-4">
                    <h3 className="text-xl text-purple-300 mb-4">Solution</h3>
                    <p className="text-purple-200">{challenge.solution}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-purple-300">
                Failed to load challenge. Please try again later.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyChallenge;
