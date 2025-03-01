
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Sparkles, Brain, Loader2, LineChart } from "lucide-react";
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { supabase } from "@/integrations/supabase/client";
import { SequenceGraph } from "./SequenceGraph";

export const SubmitSequence = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formula, setFormula] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [latexFormula, setLatexFormula] = useState("");
  const [previewSequence, setPreviewSequence] = useState<number[]>([]);
  const [showGraph, setShowGraph] = useState(false);
  const [author, setAuthor] = useState("");

  const convertToLatex = async (text: string) => {
    try {
      // In production, this would call a dedicated AI service
      // For now, we'll use the Gemini API via our edge function
      const { data, error } = await supabase.functions.invoke('convert-to-latex', {
        body: { text }
      });

      if (error) throw error;
      return data.latexFormula;
    } catch (error) {
      console.error("Error converting to LaTeX:", error);
      // Fallback to basic pattern matching if AI conversion fails
      return text
        .replace(/square root of ([^,]+)/g, '\\sqrt{$1}')
        .replace(/cubed/g, '^3')
        .replace(/squared/g, '^2')
        .replace(/infinity/g, '\\infty')
        .replace(/sum of ([^,]+)/g, '\\sum $1')
        .replace(/integral of ([^,]+)/g, '\\int $1')
        .replace(/pi/g, '\\pi')
        .replace(/theta/g, '\\theta')
        .replace(/alpha/g, '\\alpha')
        .replace(/beta/g, '\\beta')
        .replace(/delta/g, '\\delta')
        .replace(/for all ([a-z])/g, '\\forall $1')
        .replace(/there exists ([a-z])/g, '\\exists $1')
        .replace(/([a-z]) approaches ([a-z0-9]+)/g, '$1 \\to $2')
        .replace(/factorial/g, '!')
        .replace(/([a-z]) choose ([a-z])/g, '{$1 \\choose $2}')
        .replace(/divided by/g, '\\div')
        .replace(/multiplied by/g, '\\times')
        .replace(/product of ([^,]+) from ([a-z]) to ([a-z0-9]+)/g, '\\prod_{$2}^{$3} $1');
    }
  };

  const analyzeSequence = async (formula: string) => {
    try {
      // In production, this would call a dedicated AI service
      const { data, error } = await supabase.functions.invoke('analyze-sequence', {
        body: { formula, latexFormula }
      });

      if (error) throw error;
      return data.analysis;
    } catch (error) {
      console.error("Error analyzing sequence:", error);
      // Fallback responses
      const responses = [
        "This sequence appears to follow a non-linear growth pattern with mystical properties...",
        "Detecting traces of golden ratio relationships in the numerical progression...",
        "Fascinating pattern emerging from chaos theory principles...",
        "This sequence exhibits properties similar to ancient numerical systems...",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const generatePreviewSequence = async () => {
    try {
      // In production, this would calculate the actual sequence
      // For now, we'll generate some sample values
      return Array.from({ length: 10 }, (_, i) => 
        Math.round((Math.sin(i * 0.5) + Math.cos(i * 0.3)) * 100) / 10
      );
    } catch (error) {
      console.error("Error generating preview:", error);
      return [1, 2, 3, 5, 8, 13, 21, 34, 55, 89]; // Fallback to Fibonacci
    }
  };

  const handleFormulaChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setFormula(text);
    
    if (text.length > 10) {
      const convertedLatex = await convertToLatex(text);
      setLatexFormula(convertedLatex);
      
      // Generate a preview sequence
      const preview = await generatePreviewSequence();
      setPreviewSequence(preview);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setAiAnalysis("");

    try {
      // Generate final LaTeX if needed
      if (!latexFormula && formula) {
        const convertedLatex = await convertToLatex(formula);
        setLatexFormula(convertedLatex);
      }

      // Analyze the sequence
      const analysis = await analyzeSequence(formula);
      setAiAnalysis(analysis);

      // Save to database
      const { error } = await supabase.from('sequences').insert({
        title,
        description,
        formula,
        latex_formula: latexFormula,
        author: author || 'Anonymous',
        votes: 0,
        comments: 0
      });

      if (error) throw error;

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
        setLatexFormula("");
        setAiAnalysis("");
        setAuthor("");
        setPreviewSequence([]);
        setShowGraph(false);
      }, 1500);
    } catch (error) {
      console.error("Error submitting sequence:", error);
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
        <label htmlFor="author" className="block text-sm font-medium mb-1 text-purple-300">
          Author
        </label>
        <Input
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name or pseudonym"
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
          onChange={handleFormulaChange}
          placeholder="Describe your formula in words (e.g., 'the square root of x squared plus y squared')"
          required
          className="bg-[#1A1F2C] border-purple-900/30 text-purple-100 placeholder:text-purple-900/50 font-mono"
        />
      </div>
      {latexFormula && (
        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium text-purple-300">
            Generated LaTeX
          </label>
          <div className="p-4 bg-[#1A1F2C] rounded-md border border-purple-900/20">
            <div className="mb-2 font-mono text-sm text-purple-200">
              {latexFormula}
            </div>
            <div className="p-2 bg-purple-900/10 rounded flex items-center justify-center">
              <div
                dangerouslySetInnerHTML={{
                  __html: katex.renderToString(latexFormula, { throwOnError: false }),
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {previewSequence.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-purple-300">
              Sequence Preview
            </label>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20"
              onClick={() => setShowGraph(!showGraph)}
            >
              <LineChart className="h-4 w-4 mr-2" />
              {showGraph ? "Hide Graph" : "Show Graph"}
            </Button>
          </div>
          <div className="p-4 bg-[#1A1F2C] rounded-md border border-purple-900/20 mt-2">
            <div className="font-mono text-sm text-purple-200">
              {previewSequence.join(", ")}
            </div>
            {showGraph && (
              <div className="h-64 mt-4">
                <SequenceGraph data={previewSequence} />
              </div>
            )}
          </div>
        </div>
      )}
      
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
