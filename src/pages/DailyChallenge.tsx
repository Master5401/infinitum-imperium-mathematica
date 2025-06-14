
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ChallengeCard, { Challenge } from "@/components/daily-challenge/ChallengeCard";
import HintsSection from "@/components/daily-challenge/HintsSection";
import SolutionDisplay from "@/components/daily-challenge/SolutionDisplay";
import ActionButtons from "@/components/daily-challenge/ActionButtons";
import SequenceVisualizer from "@/components/daily-challenge/SequenceVisualizer";
import SequenceAnalysis from "@/components/daily-challenge/SequenceAnalysis";
import type { Database } from "@/integrations/supabase/types";

type DailyChallengeRow = Database['public']['Tables']['daily_challenges']['Row'];

const DailyChallenge = () => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [animateIn, setAnimateIn] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const { toast } = useToast();

  const getFallbackChallenge = (): Challenge => {
    const fallbackChallenges = [
      {
        id: "fallback-1",
        sequence: "1, 1, 2, 3, 5, 8, 13, 21, ...",
        hints: [
          "Add the two previous terms to get the next one",
          "It's a famous sequence named after an Italian mathematician",
          "The ratio of consecutive terms approaches the golden ratio"
        ],
        difficulty: 3,
        solution: "Fibonacci sequence: F(n) = F(n-1) + F(n-2) with F(0) = 0, F(1) = 1",
        created_at: new Date().toISOString()
      },
      {
        id: "fallback-2",
        sequence: "2, 4, 16, 256, 65536, ...",
        hints: [
          "Consider powers",
          "Look at how each term relates to the previous one",
          "Each term is the previous term raised to a power of 2"
        ],
        difficulty: 7,
        solution: "a(n) = 2^(2^(n-1)) for n ≥ 1",
        created_at: new Date().toISOString()
      },
      {
        id: "fallback-3",
        sequence: "1, 4, 9, 16, 25, 36, ...",
        hints: [
          "Look at the pattern of differences between consecutive terms",
          "Think about operations that result in these values",
          "Think of geometric shapes"
        ],
        difficulty: 2,
        solution: "Square numbers: a(n) = n²",
        created_at: new Date().toISOString()
      }
    ];
    
    // Rotate through fallback challenges based on the day
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return fallbackChallenges[dayOfYear % fallbackChallenges.length];
  };

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        console.log("Fetching daily challenge...");
        
        // First try to get today's challenge from the database
        const today = new Date().toISOString().split('T')[0];
        console.log("Looking for challenge for date:", today);
        
        const { data, error } = await supabase
          .from('daily_challenges')
          .select('*')
          .eq('date', today)
          .limit(1);
          
        if (error) {
          console.error("Database error:", error);
          throw error;
        }
        
        // If we have a challenge for today, use it
        if (data && data.length > 0) {
          console.log("Found existing challenge in database:", data[0]);
          const dbChallenge: DailyChallengeRow = data[0];
          setChallenge({
            id: dbChallenge.id,
            sequence: dbChallenge.sequence,
            hints: dbChallenge.hints,
            difficulty: dbChallenge.difficulty,
            solution: dbChallenge.solution,
            created_at: dbChallenge.created_at
          });
          setIsUsingFallback(false);
        } else {
          console.log("No existing challenge found, attempting to generate new one...");
          // Try to generate a new one with a simple timeout approach
          try {
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Timeout')), 5000);
            });
            
            const generatePromise = supabase.functions.invoke('generate-daily-challenge');
            
            const { data: generatedData, error: generateError } = await Promise.race([
              generatePromise,
              timeoutPromise
            ]) as any;
            
            if (generateError) {
              console.error("Edge function error:", generateError);
              throw generateError;
            }
            
            if (generatedData && generatedData.challenge) {
              console.log("Generated new challenge:", generatedData.challenge);
              
              // Try to store the generated challenge in the database (but don't fail if this doesn't work)
              try {
                const challengeInsert: Database['public']['Tables']['daily_challenges']['Insert'] = {
                  sequence: generatedData.challenge.sequence,
                  hints: generatedData.challenge.hints,
                  difficulty: generatedData.challenge.difficulty,
                  solution: generatedData.challenge.solution,
                  date: today
                };
                
                const { error: insertError } = await supabase
                  .from('daily_challenges')
                  .insert(challengeInsert);
                  
                if (insertError) {
                  console.error("Insert error (non-critical):", insertError);
                }
              } catch (insertError) {
                console.error("Failed to store challenge (non-critical):", insertError);
              }
              
              setChallenge(generatedData.challenge);
              setIsUsingFallback(false);
            } else {
              throw new Error("No challenge data received from edge function");
            }
          } catch (edgeFunctionError) {
            console.log("Edge function failed, using fallback challenge:", edgeFunctionError);
            // Use fallback challenge without showing error to user
            setChallenge(getFallbackChallenge());
            setIsUsingFallback(true);
          }
        }
      } catch (error) {
        console.error("Error fetching daily challenge:", error);
        
        // Always fallback gracefully without alarming the user
        console.log("Using fallback challenge due to error");
        setChallenge(getFallbackChallenge());
        setIsUsingFallback(true);
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

  console.log("Current state:", { loading, challenge: !!challenge, animateIn, isUsingFallback });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b1c22] to-[#272331] math-pattern">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ActionButtons />

        <ChallengeCard 
          loading={loading} 
          challenge={challenge} 
          animateIn={animateIn}
        >
          {challenge && (
            <>
              {/* Add Sequence Visualizer */}
              <SequenceVisualizer sequence={challenge.sequence} />
              
              {/* Add AI Analysis */}
              <SequenceAnalysis sequence={challenge.sequence} />
              
              <HintsSection 
                hints={challenge.hints}
                currentHintIndex={currentHintIndex}
                showHint={showHint}
                onShowNextHint={showNextHint}
              />

              <div className="flex items-center justify-between">
                {/* Left side placeholder for layout balance */}
                <div></div>
                <SolutionDisplay 
                  solution={challenge.solution}
                  showSolution={showSolution}
                  onToggleSolution={() => setShowSolution(!showSolution)}
                />
              </div>
            </>
          )}
        </ChallengeCard>
      </div>
    </div>
  );
};

export default DailyChallenge;
