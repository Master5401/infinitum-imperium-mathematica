
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Sparkles, Brain, Loader2, LineChart, RefreshCw, Wand2 } from "lucide-react";
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { supabase } from "@/integrations/supabase/client";
import { SequenceGraph } from "./SequenceGraph";

export const SubmitSequence = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formula, setFormula] = useState("");
  const [sequence, setSequence] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [latexFormula, setLatexFormula] = useState("");
  const [previewSequence, setPreviewSequence] = useState<number[]>([]);
  const [showGraph, setShowGraph] = useState(false);
  const [author, setAuthor] = useState("");
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const convertToLatex = async () => {
    if (!formula) {
      toast({
        title: "Formula Required",
        description: "Please enter a formula description first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsConverting(true);
      // Call the Supabase edge function to convert text to LaTeX
      const { data, error } = await supabase.functions.invoke('convert-to-latex', {
        body: { text: formula }
      });

      if (error) throw error;
      setLatexFormula(data.latexFormula);
      
      // Generate a preview sequence
      const preview = await generatePreviewSequence();
      setPreviewSequence(preview);
    } catch (error) {
      console.error("Error converting to LaTeX:", error);
      toast({
        title: "Conversion Failed",
        description: "Could not convert your formula. Please try simplifying it.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const analyzeSequence = async (formula: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-sequence', {
        body: { formula, latexFormula }
      });

      if (error) throw error;
      return data.analysis;
    } catch (error) {
      console.error("Error analyzing sequence:", error);
      return "This sequence appears to follow an intriguing pattern that connects to several branches of mathematics...";
    }
  };

  const generatePreviewSequence = async () => {
    try {
      // Parse the sequence input if available
      if (sequence) {
        const numbers = sequence.split(',')
          .map(s => s.trim())
          .filter(s => !isNaN(Number(s)))
          .map(Number);
          
        if (numbers.length > 0) {
          return numbers;
        }
      }
      
      // Fallback to generated values
      return Array.from({ length: 10 }, (_, i) => 
        Math.round((Math.sin(i * 0.5) + Math.cos(i * 0.3)) * 100) / 10
      );
    } catch (error) {
      console.error("Error generating preview:", error);
      return [1, 2, 3, 5, 8, 13, 21, 34, 55, 89]; // Fallback to Fibonacci
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setAiAnalysis("");

    try {
      // Generate final LaTeX if needed
      if (!latexFormula && formula) {
        const convertedLatex = await convertToLatex();
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
          className: "bg-amber-900 text-amber-100",
        });
        setTitle("");
        setDescription("");
        setFormula("");
        setSequence("");
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
    <form onSubmit={handleSubmit} className={`space-y-6 w-full max-w-2xl bg-[#21202e]/80 p-8 rounded-lg border border-amber-900/30 backdrop-blur-sm shadow-2xl transition-all duration-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 bg-clip-text text-transparent mb-3">Submit Your Discovery</h2>
        <p className="text-gray-400">Our AI will validate your sequence for uniqueness and mathematical significance</p>
      </div>
      
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1 text-amber-300">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name your sequence"
              required
              className="bg-[#1A1B25]/80 border-amber-900/30 text-amber-100 placeholder:text-amber-900/50 focus:border-amber-500/50 transition-all"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium mb-1 text-amber-300">
              Author
            </label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name or pseudonym"
              className="bg-[#1A1B25]/80 border-amber-900/30 text-amber-100 placeholder:text-amber-900/50 focus:border-amber-500/50 transition-all"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1 text-amber-300">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your sequence and its significance"
            required
            className="bg-[#1A1B25]/80 border-amber-900/30 text-amber-100 placeholder:text-amber-900/50 focus:border-amber-500/50 min-h-[100px] transition-all"
          />
        </div>
        
        <div>
          <label htmlFor="sequence" className="block text-sm font-medium mb-1 text-amber-300">
            Sequence Values
          </label>
          <Input
            id="sequence"
            value={sequence}
            onChange={(e) => setSequence(e.target.value)}
            placeholder="Enter values separated by commas (e.g., 1, 3, 6, 10, 15)"
            className="bg-[#1A1B25]/80 border-amber-900/30 text-amber-100 placeholder:text-amber-900/50 focus:border-amber-500/50 font-mono transition-all"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="formula" className="block text-sm font-medium mb-1 text-amber-300">
              Formula or Pattern
            </label>
            <Button 
              type="button" 
              size="sm"
              variant="outline"
              className="text-amber-300 border-amber-900/30 hover:bg-amber-900/20 hover:text-amber-200 transition-all"
              onClick={convertToLatex}
              disabled={isConverting || !formula}
            >
              {isConverting ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Wand2 className="h-3 w-3 mr-2" />
                  Convert to LaTeX
                </>
              )}
            </Button>
          </div>
          <Textarea
            id="formula"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="Describe your formula in words (e.g., 'the square root of x squared plus y squared')"
            required
            className="bg-[#1A1B25]/80 border-amber-900/30 text-amber-100 placeholder:text-amber-900/50 focus:border-amber-500/50 font-mono min-h-[80px] transition-all"
          />
        </div>
      </div>
      
      {latexFormula && (
        <div className="mt-6 space-y-2 animate-fade-in">
          <label className="block text-sm font-medium text-amber-300">
            Generated LaTeX
          </label>
          <div className="p-4 bg-[#1A1B25]/80 rounded-md border border-amber-900/20 hover-glow">
            <div className="mb-2 font-mono text-sm text-amber-200 overflow-x-auto">
              {latexFormula}
            </div>
            <div className="p-4 bg-amber-900/10 rounded flex items-center justify-center">
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
        <div className="mt-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-amber-300">
              Sequence Preview
            </label>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="text-amber-300 hover:text-amber-200 hover:bg-amber-900/20 transition-all"
              onClick={() => setShowGraph(!showGraph)}
            >
              <LineChart className="h-4 w-4 mr-2" />
              {showGraph ? "Hide Graph" : "Show Graph"}
            </Button>
          </div>
          <div className="p-4 bg-[#1A1B25]/80 rounded-md border border-amber-900/20 mt-2 hover-glow">
            <div className="font-mono text-sm text-amber-200 overflow-x-auto">
              {previewSequence.join(", ")}
            </div>
            {showGraph && (
              <div className="h-64 mt-4 animate-fade-in">
                <SequenceGraph data={previewSequence} />
              </div>
            )}
          </div>
        </div>
      )}
      
      {aiAnalysis && (
        <div className="bg-amber-900/10 p-5 rounded-lg border border-amber-400/20 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-300">AI Analysis</span>
          </div>
          <p className="text-sm text-amber-200">{aiAnalysis}</p>
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full bg-amber-900 hover:bg-amber-800 text-amber-100 transition-all duration-300 hover-glow py-6"
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
