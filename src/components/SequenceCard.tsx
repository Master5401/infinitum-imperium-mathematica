
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, MessageSquare, Code, Sparkles, LineChart } from "lucide-react";
import { SequenceGraph } from "./SequenceGraph";
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { supabase } from "@/integrations/supabase/client";

interface SequenceCardProps {
  id?: string;
  title: string;
  description: string;
  formula: string;
  latexFormula?: string;
  author: string;
  votes: number;
  comments: number;
}

export const SequenceCard = ({
  id,
  title,
  description,
  formula,
  latexFormula,
  author,
  votes,
  comments,
}: SequenceCardProps) => {
  const [currentVotes, setCurrentVotes] = useState(votes);
  const [showGraph, setShowGraph] = useState(false);
  const [showLatex, setShowLatex] = useState(false);
  
  // Generate sample sequence data for the graph
  const getSequenceData = () => {
    // In a real implementation, this would calculate values based on the formula
    return Array.from({ length: 10 }, (_, i) => 
      Math.round((Math.sin(i * 0.5) + Math.cos(i * 0.3)) * 100) / 10
    );
  };

  const handleVote = async (increment: boolean) => {
    if (!id) return;
    
    const newVotes = increment ? currentVotes + 1 : currentVotes - 1;
    setCurrentVotes(newVotes);
    
    try {
      const { error } = await supabase
        .from('sequences')
        .update({ votes: newVotes })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error("Error updating votes:", error);
      // Revert on error
      setCurrentVotes(currentVotes);
    }
  };

  return (
    <Card className="sequence-card w-full max-w-2xl bg-[#2A2F3C] border-purple-900/30 shadow-xl hover:shadow-purple-900/10 transform transition-all duration-300 hover:scale-[1.01]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-purple-300">{title}</CardTitle>
            <CardDescription className="text-gray-400">by {author}</CardDescription>
          </div>
          <Sparkles className="h-5 w-5 text-purple-400/40 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-gray-300 mb-4">{description}</p>
          <div className="p-4 bg-[#1A1F2C] rounded-md overflow-x-auto border border-purple-900/20 font-mono text-purple-200">
            {formula}
          </div>
          
          {latexFormula && showLatex && (
            <div className="mt-4 p-4 bg-purple-900/10 rounded-md border border-purple-900/20">
              <div className="flex items-center justify-center">
                <div
                  dangerouslySetInnerHTML={{
                    __html: katex.renderToString(latexFormula, { throwOnError: false }),
                  }}
                />
              </div>
            </div>
          )}
          
          {showGraph && (
            <div className="mt-4 bg-[#1A1F2C] p-4 rounded-md border border-purple-900/20">
              <h4 className="text-sm font-medium text-purple-300 mb-2">Sequence Visualization</h4>
              <div className="h-64">
                <SequenceGraph data={getSequenceData()} />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20"
                onClick={() => handleVote(true)}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-purple-300">{currentVotes}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20"
                onClick={() => handleVote(false)}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>{comments}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20"
              onClick={() => setShowLatex(!showLatex)}
            >
              <Code className="h-4 w-4 mr-2" />
              <span>{showLatex ? "Hide LaTeX" : "Show LaTeX"}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20"
              onClick={() => setShowGraph(!showGraph)}
            >
              <LineChart className="h-4 w-4 mr-2" />
              <span>{showGraph ? "Hide Graph" : "Graph"}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
