
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Brain, ArrowLeft, Calculator, Save, Check, Info, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

      const { error } = await supabase
        .from("special_numbers")
        .insert({
          number: number,
          name: name,
          description: description,
          formula: formula || convertedFormula,
          author: userId || "guest",
        });

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
    <div className="min-h-screen bg-gray-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-gray-900 to-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            className="text-amber-300 hover:text-amber-200"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <Button
            variant="outline"
            className="text-amber-300 border-amber-700/30 hover:bg-amber-900/20 hover:text-amber-200"
            onClick={() => navigate("/special-numbers/browse")}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Browse Dictionary
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-300 mb-2">Special Numbers Dictionary</h1>
          <p className="text-amber-200/80">
            Add unique numbers with special mathematical properties to our growing dictionary.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-amber-600/20 bg-gradient-to-b from-gray-900 to-gray-950 shadow-lg shadow-amber-900/10">
            <CardHeader>
              <CardTitle className="text-xl text-amber-300">Submit a Special Number</CardTitle>
              <CardDescription className="text-amber-200/70">
                Share numbers with interesting mathematical properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-amber-200">Number</label>
                <Input
                  placeholder="e.g. 6, 28, 496"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="bg-gray-800/50 border-amber-700/30 text-amber-100 placeholder:text-amber-100/50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-amber-200">Name/Category</label>
                <Input
                  placeholder="e.g. Perfect Number, Armstrong Number"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-800/50 border-amber-700/30 text-amber-100 placeholder:text-amber-100/50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-amber-200">Description</label>
                <Textarea
                  placeholder="Describe what makes this number special..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-24 bg-gray-800/50 border-amber-700/30 text-amber-100 placeholder:text-amber-100/50"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-amber-200">Mathematical Formula</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateFormula}
                    disabled={isGenerating || !description}
                    className="text-amber-300 border-amber-700/30 hover:bg-amber-900/20 hover:text-amber-200"
                  >
                    <Brain className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-pulse' : ''}`} />
                    {isGenerating ? "Generating..." : "Generate"}
                  </Button>
                </div>
                <Textarea
                  placeholder="Enter mathematical formula or use AI to generate it"
                  value={formula || convertedFormula}
                  onChange={(e) => setFormula(e.target.value)}
                  className="min-h-20 font-mono bg-gray-800/50 border-amber-700/30 text-amber-100 placeholder:text-amber-100/50"
                />
              </div>
              
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700 text-white mt-2"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Submit Number
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-amber-600/20 bg-gradient-to-b from-gray-900 to-gray-950 shadow-lg shadow-amber-900/10">
              <CardHeader>
                <CardTitle className="text-xl text-amber-300">What are Special Numbers?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-amber-900/20 rounded-md border border-amber-700/20">
                  <h3 className="font-semibold text-amber-300 flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-400" />
                    Perfect Numbers
                  </h3>
                  <p className="text-sm text-amber-200/80 mt-1">
                    A perfect number equals the sum of its proper divisors. For example, 6 = 1 + 2 + 3.
                  </p>
                  <p className="text-xs font-mono text-amber-300/70 mt-1">n = sum of proper divisors of n</p>
                </div>
                
                <div className="p-3 bg-amber-900/20 rounded-md border border-amber-700/20">
                  <h3 className="font-semibold text-amber-300 flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-400" />
                    Armstrong Numbers
                  </h3>
                  <p className="text-sm text-amber-200/80 mt-1">
                    An Armstrong number equals the sum of its digits each raised to the power of the number of digits.
                  </p>
                  <p className="text-xs font-mono text-amber-300/70 mt-1">n = sum(digit^k) where k is the number of digits</p>
                </div>
                
                <div className="p-3 bg-amber-900/20 rounded-md border border-amber-700/20">
                  <h3 className="font-semibold text-amber-300 flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-400" />
                    Harshad Numbers
                  </h3>
                  <p className="text-sm text-amber-200/80 mt-1">
                    A Harshad number is divisible by the sum of its digits. For example, 18 is divisible by 1+8=9.
                  </p>
                  <p className="text-xs font-mono text-amber-300/70 mt-1">n mod sum(digits of n) = 0</p>
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
