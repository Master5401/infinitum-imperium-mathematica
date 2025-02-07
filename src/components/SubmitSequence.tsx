import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Sparkles } from "lucide-react";

export const SubmitSequence = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formula, setFormula] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);

    // Simulate AI validation (in a real implementation, this would call an AI service)
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
    }, 1500);
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
          Formula (LaTeX)
        </label>
        <Textarea
          id="formula"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="Enter your formula in LaTeX format"
          required
          className="bg-[#1A1F2C] border-purple-900/30 text-purple-100 placeholder:text-purple-900/50 font-mono"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-purple-900 hover:bg-purple-800 text-purple-100"
        disabled={isValidating}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {isValidating ? "Validating..." : "Submit Sequence"}
      </Button>
    </form>
  );
};