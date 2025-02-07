import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export const SubmitSequence = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formula, setFormula] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Sequence submitted",
      description: "Your mathematical sequence has been submitted successfully!",
    });
    setTitle("");
    setDescription("");
    setFormula("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Name your sequence"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your sequence and its significance"
          required
        />
      </div>
      <div>
        <label htmlFor="formula" className="block text-sm font-medium mb-1">
          Formula (LaTeX)
        </label>
        <Textarea
          id="formula"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="Enter your formula in LaTeX format"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Submit Sequence
      </Button>
    </form>
  );
};