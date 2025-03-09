
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Sigma, Calculator, Save, Check, Function, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SequenceSubmit = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [formula, setFormula] = useState<string>("");
  const [latexFormula, setLatexFormula] = useState<string>("");
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

      const { error } = await supabase
        .from("sequences")
        .insert({
          title: title,
          description: description,
          formula: formula,
          latex_formula: latexFormula || formula,
          author: userId || "guest",
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
    <div className="min-h-screen bg-gradient-to-b from-red-950/80 via-gray-900 to-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            className="text-red-300 hover:text-red-200"
            onClick={() => navigate("/library")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-red-700/30 bg-red-900/20 text-red-300 hover:bg-red-900/30 hover:text-red-200"
              onClick={() => window.open("https://en.wikipedia.org/wiki/List_of_mathematical_symbols", "_blank")}
            >
              <Function className="h-4 w-4 mr-2" />
              Symbol Reference
            </Button>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-red-300 mb-2 font-cinzel">Sequence Submission</h1>
          <p className="text-red-200/80 max-w-2xl mx-auto font-sorts-mill">
            Add your mathematical sequences to our growing collection for others to discover and explore.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
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

          <div className="space-y-6">
            <Card className="border-red-600/20 bg-gradient-to-b from-gray-900/90 to-gray-950 shadow-lg shadow-red-900/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-red-300">Famous Sequences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-red-900/20 rounded-md border border-red-700/20 hover:bg-red-900/30 transition-colors">
                  <h3 className="font-semibold text-red-300 flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-400" />
                    Fibonacci Sequence
                  </h3>
                  <p className="text-sm text-red-200/80 mt-1">
                    Each number is the sum of the two preceding ones, starting from 0 and 1.
                  </p>
                  <p className="text-xs font-mono text-red-300/70 mt-1">0, 1, 1, 2, 3, 5, 8, 13, 21, ...</p>
                  <p className="text-xs font-mono text-red-300/70 mt-1">F(n) = F(n-1) + F(n-2)</p>
                </div>
                
                <div className="p-3 bg-red-900/20 rounded-md border border-red-700/20 hover:bg-red-900/30 transition-colors">
                  <h3 className="font-semibold text-red-300 flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-400" />
                    Prime Numbers
                  </h3>
                  <p className="text-sm text-red-200/80 mt-1">
                    Numbers greater than 1 that are only divisible by 1 and themselves.
                  </p>
                  <p className="text-xs font-mono text-red-300/70 mt-1">2, 3, 5, 7, 11, 13, 17, 19, 23, ...</p>
                </div>
                
                <div className="p-3 bg-red-900/20 rounded-md border border-red-700/20 hover:bg-red-900/30 transition-colors">
                  <h3 className="font-semibold text-red-300 flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-400" />
                    Triangular Numbers
                  </h3>
                  <p className="text-sm text-red-200/80 mt-1">
                    Numbers that can be represented as triangular arrangements of points.
                  </p>
                  <p className="text-xs font-mono text-red-300/70 mt-1">1, 3, 6, 10, 15, 21, 28, 36, 45, ...</p>
                  <p className="text-xs font-mono text-red-300/70 mt-1">T(n) = n(n+1)/2</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-red-600/20 bg-gradient-to-b from-gray-900/90 to-gray-950 shadow-lg shadow-red-900/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-red-300">Submission Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-red-200/80">
                  <p className="font-medium text-red-300 mb-1">📌 Clear Description</p>
                  <p>Provide a concise but informative description of your sequence.</p>
                </div>
                <div className="text-sm text-red-200/80">
                  <p className="font-medium text-red-300 mb-1">📌 Accurate Formula</p>
                  <p>Use standard mathematical notation or specify recurrence relations clearly.</p>
                </div>
                <div className="text-sm text-red-200/80">
                  <p className="font-medium text-red-300 mb-1">📌 Include Context</p>
                  <p>Mention where the sequence appears in mathematics or real-world applications.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceSubmit;
