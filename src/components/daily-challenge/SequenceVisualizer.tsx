
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Sparkles, LineChart as LineChartIcon } from "lucide-react";

interface SequenceVisualizerProps {
  sequence: string;
}

const SequenceVisualizer: React.FC<SequenceVisualizerProps> = ({ sequence }) => {
  const [showVisualization, setShowVisualization] = useState(false);
  const [visualData, setVisualData] = useState<{ n: number; value: number }[]>([]);

  // Extract numbers from the sequence string and prepare data for visualization
  useEffect(() => {
    if (!sequence) return;
    
    try {
      // Extract numbers from the sequence string, handling different formats
      const numbers = sequence
        .split(",")
        .map(s => s.trim())
        .filter(s => !s.includes("...")) // Remove ellipsis entries
        .map(s => parseFloat(s));
      
      // Convert to format needed for Recharts
      const data = numbers.map((value, index) => ({
        n: index + 1,
        value
      }));
      
      setVisualData(data);
    } catch (error) {
      console.error("Error parsing sequence:", error);
      // Set empty data if parsing fails
      setVisualData([]);
    }
  }, [sequence]);

  if (visualData.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <Button
        variant="outline"
        className="text-amber-300 border-amber-900/30 hover:bg-amber-900/20 hover:text-amber-200 transition-all duration-300"
        onClick={() => setShowVisualization(!showVisualization)}
      >
        <LineChartIcon className="h-4 w-4 mr-2" />
        {showVisualization ? "Hide Visualization" : "Visualize Sequence"}
      </Button>

      {showVisualization && (
        <div className="p-6 mt-4 bg-[#1b1c22]/90 rounded-lg border border-amber-900/20 animate-fade-in transition-all duration-500">
          <div className="flex items-center mb-4">
            <Sparkles className="h-4 w-4 text-amber-400 mr-2" />
            <h3 className="text-xl text-amber-300">Sequence Visualization</h3>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visualData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#332940" />
                <XAxis dataKey="n" stroke="#D97706" />
                <YAxis stroke="#D97706" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1b1c22', border: '1px solid #92400E', color: '#D97706' }}
                  itemStyle={{ color: '#F59E0B' }}
                  labelStyle={{ color: '#D97706' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#F59E0B" 
                  activeDot={{ r: 8, fill: '#D97706' }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default SequenceVisualizer;
