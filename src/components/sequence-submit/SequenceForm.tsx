
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Save, Sigma } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SequenceFormProps {
  onSubmitSuccess: () => void;
}

export const SequenceForm = ({ onSubmitSuccess }: SequenceFormProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [formula, setFormula] = useState<string>("");
  const [latexFormula, setLatexFormula] = useState<string>("");
  const [exampleValues, setExampleValues] = useState<string>("");
  const [complexity, setComplexity] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerateLatex = async () => {
    if (!formula) {
      toast("Missing formula", {
        description: "Please provide a mathematical formula to convert to LaTeX."
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('convert-to-latex', {
        body: { formula: formula }
      });

      if (error) throw error;

      if (data?.latex) {
        setLatexFormula(data.latex);
        toast("LaTeX generated", {
          description: "Mathematical representation has been generated."
        });
      }
    } catch (error: any) {
      console.error("LaTeX generation error:", error);
      toast("Generation failed", {
        description: error.message || "Failed to generate LaTeX. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !formula) {
      toast("Missing fields", {
        description: "Please provide the title, description, and formula."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      const authorName = userId ? (session?.session?.user?.email?.split('@')[0] || 'User') : 'Guest';

      const { error } = await supabase
        .from("sequences_library")
        .insert({
          title,
          description,
          formula,
          latex_formula: latexFormula || formula,
          example_values: exampleValues,
          complexity,
          author: userId || null,
          author_name: authorName,
          tags: [],
        });

      if (error) throw error;

      toast("Sequence submitted", {
        description: "Your mathematical sequence has been added to the library."
      });

      // Reset form
      setTitle("");
      setDescription("");
      setFormula("");
      setLatexFormula("");
      setExampleValues("");
      setComplexity(1);
      
      onSubmitSuccess();
    } catch (error: any) {
      console.error("Submission error:", error);
      toast("Submission failed", {
        description: error.message || "Failed to submit sequence. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-red-600/20 bg-gradient-to-b from-gray-900/90 to-gray-950 shadow-lg shadow-red-900/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-red-300 flex items-center">
          <Sigma className="h-5 w-5 mr-2 text-red-400" />
          Submit a Mathematical Sequence
        </CardTitle>
        <CardDescription className="text-red-200/70">
          Share your mathematical patterns and formulas with the community
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-red-200">Title/Name</label>
          <Input
            placeholder="e.g. Fibonacci Sequence, Prime Numbers"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-800/50 border-red-700/30 text-red-100 placeholder:text-red-100/50"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-red-200">Description</label>
          <Textarea
            placeholder="Describe the sequence and its significance..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-24 bg-gray-800/50 border-red-700/30 text-red-100 placeholder:text-red-100/50"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-red-200">Formula/Pattern</label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateLatex}
              disabled={isGenerating || !formula}
              className="text-red-300 border-red-700/30 hover:bg-red-900/20 hover:text-red-200"
            >
              <Calculator className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-pulse' : ''}`} />
              {isGenerating ? "Converting..." : "Convert to LaTeX"}
            </Button>
          </div>
          <Textarea
            placeholder="Enter the formula or pattern (e.g. a_n = a_{n-1} + a_{n-2})"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            className="min-h-16 font-mono bg-gray-800/50 border-red-700/30 text-red-100 placeholder:text-red-100/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-red-200">Example Values</label>
          <Input
            placeholder="e.g. 1, 1, 2, 3, 5, 8, 13, ..."
            value={exampleValues}
            onChange={(e) => setExampleValues(e.target.value)}
            className="bg-gray-800/50 border-red-700/30 text-red-100 placeholder:text-red-100/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-red-200">Complexity Level (1-5)</label>
          <Input 
            type="number"
            min={1}
            max={5}
            value={complexity}
            onChange={(e) => setComplexity(Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))}
            className="bg-gray-800/50 border-red-700/30 text-red-100"
          />
        </div>
        
        {latexFormula && (
          <div className="p-3 bg-red-900/20 rounded-md border border-red-700/20">
            <h3 className="font-semibold text-red-300 mb-1">LaTeX Preview</h3>
            <div className="font-mono text-xs text-red-200/80 bg-gray-900/50 p-2 rounded">
              {latexFormula}
            </div>
          </div>
        )}
        
        <Button
          className="w-full bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white mt-2"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>Submitting...</>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Submit Sequence
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
