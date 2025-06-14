
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
          .eq('date', today)
          .limit(1);
          
        if (error) throw error;
        
        // If we have a challenge for today, use it
        if (data && data.length > 0) {
          const dbChallenge: DailyChallengeRow = data[0];
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
