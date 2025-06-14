
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Send, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AIAssistantProps {
  sequence: string;
  isMobile?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ sequence, isMobile = false }) => {
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const { toast } = useToast();

  const handleAskAI = async () => {
    if (!question.trim()) {
      toast({
        title: "Please enter a question",
        description: "Ask the AI about the sequence pattern or mathematical properties.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-sequence', {
        body: {
          sequence,
          question: question.trim(),
          context: "daily challenge analysis"
        }
      });

      if (error) throw error;

      setAiResponse(data.analysis || "I'm having trouble analyzing this sequence right now. Please try again later.");
    } catch (error) {
      console.error("AI analysis error:", error);
      setAiResponse("I'm currently unable to provide analysis. The AI service might be temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const cardClass = isMobile 
    ? "bg-[#1b1c22]/90 border-amber-900/20 mx-2" 
    : "bg-[#1b1c22]/90 border-amber-900/20";

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        className="text-amber-300 border-amber-900/30 hover:bg-amber-900/20 hover:text-amber-200 transition-all duration-300 w-full"
        onClick={() => setShowAssistant(!showAssistant)}
      >
        <Brain className="h-4 w-4 mr-2" />
        {showAssistant ? "Hide AI Assistant" : "Ask AI Assistant"}
      </Button>

      {showAssistant && (
        <Card className={`${cardClass} mt-4 animate-fade-in`}>
          <CardHeader className={isMobile ? "pb-3" : ""}>
            <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} text-amber-300 flex items-center`}>
              <Sparkles className="h-5 w-5 mr-2" />
              AI Mathematical Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-amber-400 mb-2 block">
                Ask about the sequence pattern, properties, or mathematical insights:
              </label>
              <Textarea
                placeholder="e.g., What pattern do you see? What's the mathematical rule? How does this sequence relate to other famous sequences?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className={`bg-[#1b1c22]/60 border-amber-900/30 text-amber-100 placeholder:text-amber-400/50 ${isMobile ? 'min-h-[80px]' : 'min-h-[100px]'}`}
                disabled={loading}
              />
            </div>

            <Button
              onClick={handleAskAI}
              disabled={loading || !question.trim()}
              className={`bg-amber-600 hover:bg-amber-700 text-white ${isMobile ? 'w-full' : ''}`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Ask AI
                </>
              )}
            </Button>

            {aiResponse && (
              <div className="p-4 bg-amber-900/10 rounded-lg border border-amber-900/20 animate-fade-in">
                <h4 className={`${isMobile ? 'text-sm' : 'text-base'} text-amber-300 mb-2 flex items-center`}>
                  <Brain className="h-4 w-4 mr-2" />
                  AI Analysis
                </h4>
                <p className={`${isMobile ? 'text-sm' : 'text-base'} text-amber-200 leading-relaxed whitespace-pre-wrap`}>
                  {aiResponse}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIAssistant;
