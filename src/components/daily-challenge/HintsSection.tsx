
import React from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface HintsSectionProps {
  hints: string[];
  currentHintIndex: number;
  showHint: boolean;
  onShowNextHint: () => void;
}

const HintsSection: React.FC<HintsSectionProps> = ({
  hints,
  currentHintIndex,
  showHint,
  onShowNextHint,
}) => {
  return (
    <div className="space-y-4">
      {showHint && hints.slice(0, currentHintIndex + 1).map((hint, index) => (
        <div
          key={index}
          className="p-4 bg-amber-900/10 rounded-lg border border-amber-900/20 animate-fade-in transition-all duration-500"
        >
          <div className="flex items-center text-amber-300 mb-2">
            <Lightbulb className="h-4 w-4 mr-2" />
            <span className="font-medium">Hint {index + 1}</span>
          </div>
          <p className="text-amber-200">{hint}</p>
        </div>
      ))}
      
      <Button
        variant="outline"
        className="text-amber-300 border-amber-900/30 hover:bg-amber-900/20 hover:text-amber-200 transition-all duration-300"
        onClick={onShowNextHint}
        disabled={showHint && currentHintIndex >= hints.length - 1}
      >
        <Lightbulb className="h-4 w-4 mr-2" />
        {showHint ? "Next Hint" : "Show Hint"}
      </Button>
    </div>
  );
};

export default HintsSection;
