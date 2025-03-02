
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Lightbulb, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SequenceAnalysisProps {
  sequence: string;
}

interface AnalysisResult {
  pattern: string;
  description: string;
  formula: string;
  confidence: number;
}

const SequenceAnalysis: React.FC<SequenceAnalysisProps> = ({ sequence }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const analyzeSequence = async () => {
    if (!sequence) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-sequence', {
        body: { sequence }
      });
      
      if (error) throw error;
      
      setAnalysis(data.analysis);
      setShowAnalysis(true);
    } catch (err) {
      console.error("Error analyzing sequence:", err);
      setError("Failed to analyze sequence. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <Button
        variant="outline"
        className="text-amber-300 border-amber-900/30 hover:bg-amber-900/20 hover:text-amber-200 transition-all duration-300"
        onClick={analyzeSequence}
        disabled={loading}
      >
        <Brain className={`h-4 w-4 mr-2 ${loading ? 'animate-pulse' : ''}`} />
        {loading ? "Analyzing..." : "AI Analysis"}
      </Button>

      {error && (
        <div className="p-4 mt-4 bg-red-900/20 rounded-lg border border-red-900/30 animate-fade-in">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      )}

      {showAnalysis && analysis && (
        <div className="p-6 mt-4 bg-[#1b1c22]/90 rounded-lg border border-amber-900/20 animate-fade-in transition-all duration-500">
          <div className="flex items-center mb-4">
            <Lightbulb className="h-4 w-4 text-amber-400 mr-2" />
            <h3 className="text-xl text-amber-300">AI Analysis</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <span className="text-amber-400 font-medium">Pattern:</span>
              <span className="text-amber-200 ml-2">{analysis.pattern}</span>
            </div>
            <div>
              <span className="text-amber-400 font-medium">Description:</span>
              <span className="text-amber-200 ml-2">{analysis.description}</span>
            </div>
            <div>
              <span className="text-amber-400 font-medium">Formula:</span>
              <span className="text-amber-200 ml-2 font-mono">{analysis.formula}</span>
            </div>
            <div>
              <span className="text-amber-400 font-medium">Confidence:</span>
              <div className="inline-flex items-center ml-2">
                <div className="h-2 w-24 bg-amber-900/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${analysis.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="text-amber-200 ml-2">{Math.round(analysis.confidence * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SequenceAnalysis;
