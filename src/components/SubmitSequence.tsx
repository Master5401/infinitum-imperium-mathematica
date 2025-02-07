import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Sparkles, Brain, Loader2 } from "lucide-react";

export const SubmitSequence = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formula, setFormula] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");

  const analyzeSequence = async (sequence: string) => {
    // Simulate AI analysis - in a real app, this would call an AI service
    const responses = [
      "This sequence appears to follow a non-linear growth pattern with mystical properties...",
      "Detecting traces of golden ratio relationships in the numerical progression...",
      "Fascinating pattern emerging from chaos theory principles...",
      "This sequence exhibits properties similar to ancient numerical systems...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setAiAnalysis("");

    try {
      // Simulate AI validation and analysis
      const analysis = await analyzeSequence(formula);
      setAiAnalysis(analysis);

      setTimeout(() => {
        setIsValidating(false);
        toast({
          title: "Sequence Validated & Submitted",
          description: "Our AI has confirmed this sequence is unique and has been added to the collection.",
          className: "bg-purple-900 text-purple-100",
        });
        setTitle("");
        setDescription("");
        setFormula("");
        setAiAnalysis("");
      }, 1500);
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Please try again with a different sequence.",
        variant: "destructive",
      });
      setIsValidating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl bg-[#2A2F3C] p-6 rounded-lg border border-purple-900/30">
      <div className="text-center mb-6">
        <h2 className="text-xl text-purple-300 mb-2">Submit Your Discovery</h2>
        <p className="text-gray-400">Our AI will validate your sequence for uniqueness and mathematical significance</p>
      </div>
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1 text-purple-300">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Name your sequence"
          required
          className="bg-[#1A1F2C] border-purple-900/30 text-purple-100 placeholder:text-purple-900/50"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1 text-purple-300">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your sequence and its significance"
          required
          className="bg-[#1A1F2C] border-purple-900/30 text-purple-100 placeholder:text-purple-900/50"
        />
      </div>
      <div>
        <label htmlFor="formula" className="block text-sm font-medium mb-1 text-purple-300">
          Formula or Pattern
        </label>
        <Textarea
          id="formula"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="Enter your sequence formula or pattern"
          required
          className="bg-[#1A1F2C] border-purple-900/30 text-purple-100 placeholder:text-purple-900/50 font-mono"
        />
      </div>
      {aiAnalysis && (
        <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-400/20">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">AI Analysis</span>
          </div>
          <p className="text-sm text-purple-200">{aiAnalysis}</p>
        </div>
      )}
      <Button 
        type="submit" 
        className="w-full bg-purple-900 hover:bg-purple-800 text-purple-100"
        disabled={isValidating}
      >
        {isValidating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Submit Sequence
          </>
        )}
      </Button>
    </form>
  );
};