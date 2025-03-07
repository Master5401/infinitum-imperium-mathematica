
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Define the interface for the sequence prop
export interface SequenceCardProps {
  sequence: {
    id: string;
    oeis_id?: string;
    name: string;
    description: string;
    values: string;
    formula?: string | null;
  };
}

export const SequenceCard: React.FC<SequenceCardProps> = ({ sequence }) => {
  return (
    <div>
      <div className="font-medium text-amber-300">{sequence.name}</div>
      <div className="text-sm text-amber-200/70 mt-1">{sequence.description}</div>
      <div className="mt-2 p-2 bg-gray-900 rounded-md font-mono text-sm text-amber-100 overflow-x-auto">
        {sequence.values.split(',').slice(0, 15).join(', ')}{sequence.values.split(',').length > 15 ? '...' : ''}
      </div>
      {sequence.formula && (
        <div className="mt-2 p-2 bg-gray-900/50 rounded-md font-mono text-sm text-amber-200/80">
          Formula: {sequence.formula}
        </div>
      )}
      {sequence.oeis_id && (
        <div className="text-xs text-amber-400 mt-2">
          OEIS ID: {sequence.oeis_id}
        </div>
      )}
    </div>
  );
};
