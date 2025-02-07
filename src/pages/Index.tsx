import { Button } from "@/components/ui/button";
import { SequenceCard } from "@/components/SequenceCard";
import { SubmitSequence } from "@/components/SubmitSequence";
import { useState } from "react";
import { Sigma, PlusCircle } from "lucide-react";

const Index = () => {
  const [showSubmit, setShowSubmit] = useState(false);

  const sampleSequences = [
    {
      title: "Modified Fibonacci with Exponential Growth",
      description: "A variation of the Fibonacci sequence where each number is also multiplied by its position",
      formula: "a_n = n(a_{n-1} + a_{n-2}), \\quad a_0 = 0, a_1 = 1",
      author: "MathEnthusiast",
      votes: 42,
      comments: 15,
    },
    {
      title: "Recursive Prime Product Sequence",
      description: "Each term is the product of the previous term with the next prime number",
      formula: "a_n = a_{n-1} \\cdot p_n, \\quad a_1 = 2",
      author: "NumberTheoryLover",
      votes: 38,
      comments: 12,
    },
  ];

  return (
    <div className="min-h-screen math-bg">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Sigma className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">MathSequence</h1>
            </div>
            <Button
              onClick={() => setShowSubmit(!showSubmit)}
              className="flex items-center space-x-2"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Submit Sequence</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {showSubmit ? (
          <div className="flex justify-center mb-8">
            <SubmitSequence />
          </div>
        ) : (
          <div className="space-y-6">
            {sampleSequences.map((sequence, index) => (
              <div key={index} className="flex justify-center">
                <SequenceCard {...sequence} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;