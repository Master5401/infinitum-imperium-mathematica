
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ExampleSequences = () => {
  return (
    <Card className="border-red-600/30 bg-gradient-to-b from-gray-900 to-gray-950 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-red-300">Famous Sequences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="p-3 bg-red-900/15 rounded-md border border-red-700/20 hover:bg-red-900/25 transition-colors">
          <h3 className="font-semibold text-red-300 flex items-center">
            <Check className="h-4 w-4 mr-2 text-green-400" />
            Fibonacci Sequence
          </h3>
          <p className="text-sm text-red-200/90 mt-1">
            Each number is the sum of the two preceding ones, starting from 0 and 1.
          </p>
          <p className="text-xs font-mono text-red-300/80 mt-1">0, 1, 1, 2, 3, 5, 8, 13, 21, ...</p>
          <p className="text-xs font-mono text-red-300/80 mt-1">F(n) = F(n-1) + F(n-2)</p>
        </div>
        
        <div className="p-3 bg-red-900/15 rounded-md border border-red-700/20 hover:bg-red-900/25 transition-colors">
          <h3 className="font-semibold text-red-300 flex items-center">
            <Check className="h-4 w-4 mr-2 text-green-400" />
            Prime Numbers
          </h3>
          <p className="text-sm text-red-200/90 mt-1">
            Numbers greater than 1 that are only divisible by 1 and themselves.
          </p>
          <p className="text-xs font-mono text-red-300/80 mt-1">2, 3, 5, 7, 11, 13, 17, 19, 23, ...</p>
        </div>
        
        <div className="p-3 bg-red-900/15 rounded-md border border-red-700/20 hover:bg-red-900/25 transition-colors">
          <h3 className="font-semibold text-red-300 flex items-center">
            <Check className="h-4 w-4 mr-2 text-green-400" />
            Triangular Numbers
          </h3>
          <p className="text-sm text-red-200/90 mt-1">
            Numbers that can be represented as triangular arrangements of points.
          </p>
          <p className="text-xs font-mono text-red-300/80 mt-1">1, 3, 6, 10, 15, 21, 28, 36, 45, ...</p>
          <p className="text-xs font-mono text-red-300/80 mt-1">T(n) = n(n+1)/2</p>
        </div>
      </CardContent>
    </Card>
  );
};
