
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Brain, ArrowLeft, Save, Check, BookOpen, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type SpecialNumberInsert = Database['public']['Tables']['special_numbers']['Insert'];

const SpecialNumbers = () => {
  const navigate = useNavigate();
  const [number, setNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [formula, setFormula] = useState<string>("");
  const [convertedFormula, setConvertedFormula] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerateFormula = async () => {
    if (!description) {
      toast("Missing description", {
        description: "Please provide a description of the number property."
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('convert-to-latex', {
        body: { formula: description }
      });

      if (error) throw error;

      if (data?.latex) {
        setConvertedFormula(data.latex);
        toast("Formula generated", {
          description: "Mathematical representation has been generated."
        });
      }
    } catch (error: any) {
      console.error("Formula generation error:", error);
      toast("Generation failed", {
        description: error.message || "Failed to generate formula. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!number || !name || !description) {
      toast("Missing fields", {
        description: "Please provide the number, name, and description."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      const specialNumberData: SpecialNumberInsert = {
        number: number,
        name: name,
        description: description,
        formula: formula || convertedFormula,
        author: userId || "guest",
      };

      const { error } = await supabase
        .from("special_numbers")
        .insert(specialNumberData);

      if (error) throw error;

      toast("Number submitted", {
        description: "Your special number has been added to the dictionary."
      });

      // Reset form
      setNumber("");
      setName("");
      setDescription("");
      setFormula("");
      setConvertedFormula("");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast("Submission failed", {
        description: error.message || "Failed to submit number. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-800 hover:bg-white/50 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-all"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <Button
            variant="outline"
            className="border-blue-200 bg-white text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-700 shadow-sm transition-all"
            onClick={() => navigate("/special-numbers/browse")}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Browse Dictionary
          </Button>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Special Numbers Dictionary
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Discover and share numbers with fascinating mathematical properties that inspire curiosity and research.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-blue-200 bg-white/80 dark:border-slate-600 dark:bg-slate-800/80 shadow-lg backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-slate-800 dark:text-slate-200 flex items-center">
                  <Sparkles className="h-6 w-6 mr-3 text-blue-500" />
                  Submit a Special Number
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
                  Share numbers with unique mathematical properties that deserve recognition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Number</label>
                    <Input
                      placeholder="e.g., 6, 28, 496"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name/Category</label>
                    <Input
                      placeholder="e.g., Perfect Number, Armstrong Number"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 h-11"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                  <Textarea
                    placeholder="Describe what makes this number special and its mathematical significance..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-28 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mathematical Formula</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateFormula}
                      disabled={isGenerating || !description}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900/20"
                    >
                      <Brain className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-pulse' : ''}`} />
                      {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Enter mathematical formula or use AI to generate it"
                    value={formula || convertedFormula}
                    onChange={(e) => setFormula(e.target.value)}
                    className="min-h-24 font-mono bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 resize-none"
                  />
                </div>
                
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Submit Number
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-blue-200 bg-white/80 dark:border-slate-600 dark:bg-slate-800/80 shadow-lg backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-slate-800 dark:text-slate-200">What are Special Numbers?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center mb-2">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Perfect Numbers
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                    A perfect number equals the sum of its proper divisors. For example, 6 = 1 + 2 + 3.
                  </p>
                  <p className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 p-2 rounded">
                    n = sum of proper divisors of n
                  </p>
                </div>
                
                <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-100 dark:border-cyan-800">
                  <h3 className="font-semibold text-cyan-800 dark:text-cyan-300 flex items-center mb-2">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Armstrong Numbers
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                    An Armstrong number equals the sum of its digits each raised to the power of the number of digits.
                  </p>
                  <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400 bg-white dark:bg-slate-800 p-2 rounded">
                    n = sum(digit^k) where k is the number of digits
                  </p>
                </div>
                
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                  <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 flex items-center mb-2">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Harshad Numbers
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                    A Harshad number is divisible by the sum of its digits. For example, 18 is divisible by 1+8=9.
                  </p>
                  <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 p-2 rounded">
                    n mod sum(digits of n) = 0
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialNumbers;
