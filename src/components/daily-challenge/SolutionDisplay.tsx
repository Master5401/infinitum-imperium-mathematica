
import React from "react";
import { Button } from "@/components/ui/button";

interface SolutionDisplayProps {
  solution: string;
  showSolution: boolean;
  onToggleSolution: () => void;
}

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({
  solution,
  showSolution,
  onToggleSolution,
}) => {
  return (
    <div>
      <Button
        variant="outline"
        className="text-amber-300 border-amber-900/30 hover:bg-amber-900/20 hover:text-amber-200 transition-all duration-300"
        onClick={onToggleSolution}
      >
        {showSolution ? "Hide Solution" : "Show Solution"}
      </Button>

      {showSolution && (
        <div className="p-6 bg-amber-900/10 rounded-lg border border-amber-900/20 mt-4 animate-fade-in">
          <h3 className="text-xl text-amber-300 mb-4">Solution</h3>
          <p className="text-amber-200">{solution}</p>
        </div>
      )}
    </div>
  );
};

export default SolutionDisplay;
