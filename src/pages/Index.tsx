
import { Button } from "@/components/ui/button";
import { SequenceCard } from "@/components/SequenceCard";
import { SubmitSequence } from "@/components/SubmitSequence";
import { useState, useEffect } from "react";
import { Sigma, PlusCircle, Sparkles, Trophy, Book, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Sequence {
  id: string;
  title: string;
  description: string;
  formula: string;
  latex_formula: string;
  author: string;
  votes: number;
  comments: number;
  created_at: string;
}

const Index = () => {
  const [showSubmit, setShowSubmit] = useState(false);
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [animateHeader, setAnimateHeader] = useState(false);
  const navigate = useNavigate();

  // Sample sequences as fallback
  const sampleSequences = [{
    id: "sample1",
    title: "The Mystical Fibonacci Variant",
    description: "A sequence where each number is the sum of the previous two, multiplied by the golden ratio's decimal places at that position",
    formula: "a(n) = φ_n(a_{n-1} + a_{n-2}), a_0 = 0, a_1 = 1",
    latex_formula: "a(n) = \\phi_n(a_{n-1} + a_{n-2}), a_0 = 0, a_1 = 1",
    author: "Enigmatic_Math",
    votes: 42,
    comments: 15,
    created_at: new Date().toISOString()
  }, {
    id: "sample2",
    title: "Quantum Prime Spiral",
    description: "A sequence that maps prime numbers onto a spiral pattern in complex space, revealing hidden symmetries",
    formula: "z_n = p_n * e^(2πi * sqrt(p_n)), where p_n is the nth prime",
    latex_formula: "z_n = p_n \\cdot e^{2\\pi i \\cdot \\sqrt{p_n}}, \\text{where } p_n \\text{ is the nth prime}",
    author: "QuantumSeeker",
    votes: 38,
    comments: 12,
    created_at: new Date().toISOString()
  }];

  useEffect(() => {
    const fetchSequences = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('sequences')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setSequences(data as Sequence[]);
        } else {
          // Use sample sequences if database is empty
          setSequences(sampleSequences);
        }
      } catch (error) {
        console.error("Error fetching sequences:", error);
        // Use sample sequences as fallback
        setSequences(sampleSequences);
      } finally {
        setLoading(false);
      }
    };

    if (!showSubmit) {
      fetchSequences();
    }
    
    // Animate header after a short delay
    setTimeout(() => setAnimateHeader(true), 300);
  }, [showSubmit]);

  // Latin letters for mystical floating elements
  const floatingElements = [
    { text: "α", top: "15%", left: "5%", delay: 0, size: "3xl" },
    { text: "β", top: "25%", left: "90%", delay: 1, size: "4xl" },
    { text: "γ", top: "65%", left: "8%", delay: 2, size: "3xl" },
    { text: "δ", top: "75%", left: "88%", delay: 1.5, size: "5xl" },
    { text: "ε", top: "40%", left: "15%", delay: 2.5, size: "4xl" },
    { text: "ζ", top: "10%", left: "80%", delay: 3, size: "3xl" },
    { text: "η", top: "80%", left: "20%", delay: 2, size: "4xl" },
    { text: "θ", top: "20%", left: "35%", delay: 1, size: "5xl" },
    { text: "ι", top: "45%", left: "95%", delay: 3.5, size: "3xl" },
    { text: "κ", top: "55%", left: "25%", delay: 4, size: "4xl" },
    { text: "λ", top: "30%", left: "75%", delay: 2.5, size: "5xl" },
    { text: "μ", top: "70%", left: "40%", delay: 3, size: "3xl" },
    { text: "SPQR", top: "5%", left: "50%", delay: 0, size: "2xl" },
    { text: "Alea iacta est", top: "95%", left: "50%", delay: 4, size: "xl" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b1c22] to-[#2b2231] math-pattern relative overflow-hidden">
      {/* Latin letter floating elements */}
      {floatingElements.map((el, index) => (
        <div 
          key={index}
          className={`absolute text-amber-500/10 text-${el.size} font-serif animate-float opacity-60 select-none z-0 transform -translate-x-1/2 -translate-y-1/2`}
          style={{ 
            top: el.top, 
            left: el.left, 
            animationDelay: `${el.delay}s`,
            animationDuration: `${8 + el.delay}s`,
          }}
        >
          {el.text}
        </div>
      ))}
      
      <div className="absolute inset-0 z-0 bg-pattern-grid opacity-5"></div>
      
      <header className={`bg-[#1A1824]/90 shadow-xl border-b border-amber-900/20 backdrop-blur-sm sticky top-0 z-10 transition-all duration-1000 ${animateHeader ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-amber-400 to-amber-600 p-2 rounded-lg shadow-lg">
                <Sigma className="h-7 w-7 text-[#1A1824]" />
              </div>
              <h1 className="text-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 bg-clip-text font-extrabold text-transparent animate-shimmer">
                Imperium Infinitum Mathematica
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="ghost"
                className="text-amber-300 hover:text-amber-200 hover:bg-amber-900/20 transition-all duration-300"
                onClick={() => navigate("/daily-challenge")}
              >
                <Trophy className="h-5 w-5 mr-2" />
                Daily Challenge
              </Button>
              <Button
                variant="ghost"
                className="text-amber-300 hover:text-amber-200 hover:bg-amber-900/20 transition-all duration-300"
                onClick={() => navigate("/library")}
              >
                <Book className="h-5 w-5 mr-2" />
                Library
              </Button>
              <Button
                onClick={() => setShowSubmit(!showSubmit)}
                className="flex items-center space-x-2 bg-amber-900 hover:bg-amber-800 text-amber-100 hover-glow transition-all duration-300"
              >
                {showSubmit ? <Sparkles className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
                <span>{showSubmit ? "View Sequences" : "Submit Sequence"}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 bg-transparent relative z-0">
        {showSubmit ? (
          <div className="flex justify-center mb-8 animate-fade-in">
            <SubmitSequence />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center mb-12 animate-scale-in">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 bg-clip-text text-transparent mb-4">
                Discover the Unknown
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                <span className="font-cinzel">Explore mathematical sequences</span> that bridge the gap between the known and the mysterious.
                Each submission is verified by our AI to ensure uniqueness and significance.
              </p>
              <div className="mt-8 flex justify-center space-x-3">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-900/20 text-amber-300 text-sm animate-pulse">
                  <Star className="h-4 w-4 mr-2 text-amber-400" />
                  Featured Discoveries
                </div>
              </div>
            </div>
            
            {loading ? (
              // Skeleton loading state
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="w-full bg-[#1b1c22]/80 p-6 rounded-lg border border-amber-900/30 shadow-lg animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <Skeleton className="h-6 w-64 bg-amber-900/20" />
                      <Skeleton className="h-5 w-5 rounded-full bg-amber-900/20" />
                    </div>
                    <Skeleton className="h-4 w-full bg-amber-900/20 mb-4" />
                    <Skeleton className="h-4 w-3/4 bg-amber-900/20 mb-6" />
                    <Skeleton className="h-24 w-full bg-amber-900/20 mb-4" />
                    <div className="flex space-x-4">
                      <Skeleton className="h-8 w-16 bg-amber-900/20" />
                      <Skeleton className="h-8 w-16 bg-amber-900/20" />
                      <Skeleton className="h-8 w-16 bg-amber-900/20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sequences.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sequences.map((sequence, index) => (
                  <div key={sequence.id} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                    <SequenceCard 
                      id={sequence.id}
                      title={sequence.title}
                      description={sequence.description}
                      formula={sequence.formula}
                      latexFormula={sequence.latex_formula}
                      author={sequence.author}
                      votes={sequence.votes}
                      comments={sequence.comments}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-amber-300">No sequences found. Be the first to submit!</p>
              </div>
            )}
          </div>
        )}
      </main>
      
      <footer className="bg-[#1A1824]/90 border-t border-amber-900/20 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-amber-300/50 text-sm">
            <span className="font-cinzel">Imperium Infinitum Mathematica</span> — <span className="italic">Exploring the Mysteries of Mathematical Sequences</span>
          </p>
          <div className="mt-3 text-amber-300/30 text-xs">
            "Numeri regunt mundum" — <span className="italic">Numbers rule the world</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
