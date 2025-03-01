
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, Lightbulb, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Fixed the TypeScript error by explicitly defining the Challenge interface without recursive types
interface Challenge {
  id?: string;
  sequence: string;
  hints: string[];
  difficulty: number;
  solution: string;
  created_at?: string;
}

const DailyChallenge = () => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [animateIn, setAnimateIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        
        // First try to get today's challenge from the database
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('daily_challenges')
          .select('*')
          .eq('created_at::date', today)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) throw error;
        
        // If we have a challenge for today, use it
        if (data && data.length > 0) {
          const dbChallenge = data[0];
          setChallenge({
            id: dbChallenge.id,
            sequence: dbChallenge.sequence,
            hints: dbChallenge.hints,
            difficulty: dbChallenge.difficulty,
            solution: dbChallenge.solution,
            created_at: dbChallenge.created_at
          });
        } else {
          // Otherwise, generate a new one
          const { data: generatedData, error: generateError } = await supabase.functions.invoke('generate-daily-challenge');
          
          if (generateError) throw generateError;
          
          if (generatedData && generatedData.challenge) {
            // Store the generated challenge in the database
            const { error: insertError } = await supabase
              .from('daily_challenges')
              .insert({
                sequence: generatedData.challenge.sequence,
                hints: generatedData.challenge.hints,
                difficulty: generatedData.challenge.difficulty,
                solution: generatedData.challenge.solution
              });
              
            if (insertError) throw insertError;
            
            setChallenge(generatedData.challenge);
          }
        }
      } catch (error) {
        console.error("Error fetching daily challenge:", error);
        toast({
          title: "Error",
          description: "Failed to load daily challenge. Please try again later.",
          variant: "destructive",
        });
        
        // Fallback challenge
        setChallenge({
          sequence: "2, 4, 16, 256, 65536, ...",
          hints: [
            "Consider powers",
            "Look at how each term relates to the previous one",
            "Each term is the previous term raised to a power of 2"
          ],
          difficulty: 7,
          solution: "a(n) = 2^(2^(n-1)) for n ≥ 1"
        });
      } finally {
        setLoading(false);
        setTimeout(() => setAnimateIn(true), 100);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1B25] to-[#2D243B] math-pattern">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 text-amber-300 hover:text-amber-200 transition-all duration-300"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className={`bg-[#21202e]/80 border-amber-900/30 shadow-2xl backdrop-blur-sm transition-all duration-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 bg-clip-text text-transparent">
                Daily Mathematical Challenge
              </CardTitle>
              <Trophy className="h-6 w-6 text-amber-400 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Brain className="h-8 w-8 text-amber-400 animate-spin" />
              </div>
            ) : challenge ? (
              <div className="space-y-6">
                <div className="p-6 bg-[#1A1B25]/80 rounded-lg border border-amber-900/20 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-amber-900/20 hover:shadow-md">
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

                <div className="space-y-4">
                  {showHint && challenge.hints.slice(0, currentHintIndex + 1).map((hint, index) => (
                    <div
                      key={index}
                      className="p-4 bg-amber-900/10 rounded-lg border border-amber-900/20 animate-fade-in transition-all duration-500"
                    >
                      <div className="flex items-center text-amber-300 mb-2">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        <span className="font-medium">Hint {index + 1}</span>
                      </div>
                      <p className="text-amber-200">{hint}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    className="text-amber-300 border-amber-900/30 hover:bg-amber-900/20 hover:text-amber-200 transition-all duration-300"
                    onClick={showNextHint}
                    disabled={showHint && currentHintIndex >= challenge.hints.length - 1}
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    {showHint ? "Next Hint" : "Show Hint"}
                  </Button>
                  <Button
                    variant="outline"
                    className="text-amber-300 border-amber-900/30 hover:bg-amber-900/20 hover:text-amber-200 transition-all duration-300"
                    onClick={() => setShowSolution(!showSolution)}
                  >
                    {showSolution ? "Hide Solution" : "Show Solution"}
                  </Button>
                </div>

                {showSolution && (
                  <div className="p-6 bg-amber-900/10 rounded-lg border border-amber-900/20 mt-4 animate-fade-in">
                    <h3 className="text-xl text-amber-300 mb-4">Solution</h3>
                    <p className="text-amber-200">{challenge.solution}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-amber-300">
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
