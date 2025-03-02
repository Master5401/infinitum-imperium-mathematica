
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Button } from "@/components/ui/button";
import { Sparkles, LineChart as LineChartIcon, BarChart as BarChartIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SequenceVisualizerProps {
  sequence: string;
}

const SequenceVisualizer: React.FC<SequenceVisualizerProps> = ({ sequence }) => {
  const [showVisualization, setShowVisualization] = useState(false);
  const [visualData, setVisualData] = useState<{ n: number; value: number }[]>([]);
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [isValid, setIsValid] = useState(true);

  // Extract numbers from the sequence string and prepare data for visualization
  useEffect(() => {
    if (!sequence) {
      setIsValid(false);
      return;
    }
    
    try {
      // Handle various sequence formats:
      // 1. Comma-separated: "1, 2, 3, 4"
      // 2. Space-separated: "1 2 3 4"
      // 3. Mixed format: "1, 2 3,4"
      // 4. With ellipsis: "1, 2, 3, ..., 10"
      
      // First, replace ellipsis patterns with empty string
      const cleanSequence = sequence.replace(/\.{3,}|…/g, "");
      
      // Split by both commas and spaces, then filter empty entries
      const parts = cleanSequence
        .split(/[,\s]+/)
        .filter(part => part.trim().length > 0);
      
      // Parse numbers and filter out NaN values
      const numbers = parts
        .map(s => {
          const parsed = parseFloat(s.trim());
          return isNaN(parsed) ? null : parsed;
        })
        .filter((n): n is number => n !== null);
      
      if (numbers.length === 0) {
        setIsValid(false);
        return;
      }
      
      // Convert to format needed for Recharts
      const data = numbers.map((value, index) => ({
        n: index + 1,
        value
      }));
      
      setVisualData(data);
      setIsValid(true);
    } catch (error) {
      console.error("Error parsing sequence:", error);
      setIsValid(false);
      // Set empty data if parsing fails
      setVisualData([]);
    }
  }, [sequence]);

  const toggleChartType = () => {
    setChartType(chartType === "line" ? "bar" : "line");
  };

  if (!isValid || visualData.length === 0) {
    return (
      <div className="mt-6">
        <Button
          variant="outline"
          className="text-amber-300 border-amber-900/30 hover:bg-amber-900/20 hover:text-amber-200 transition-all duration-300"
          onClick={() => toast({
            title: "Invalid Sequence",
            description: "This sequence couldn't be visualized. Please ensure it contains valid numbers.",
            variant: "destructive",
          })}
        >
          <LineChartIcon className="h-4 w-4 mr-2" />
          Visualize Sequence
        </Button>
      </div>
    );
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 text-amber-400 mr-2" />
              <h3 className="text-xl text-amber-300">Sequence Visualization</h3>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleChartType}
              className="text-amber-300 hover:text-amber-200 hover:bg-amber-900/20"
            >
              {chartType === "line" 
                ? <BarChartIcon className="h-4 w-4 mr-1" /> 
                : <LineChartIcon className="h-4 w-4 mr-1" />
              }
              Switch to {chartType === "line" ? "Bar" : "Line"} Chart
            </Button>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={visualData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#332940" />
                  <XAxis dataKey="n" stroke="#D97706" />
                  <YAxis stroke="#D97706" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1b1c22', border: '1px solid #92400E', color: '#D97706' }}
                    itemStyle={{ color: '#F59E0B' }}
                    labelStyle={{ color: '#D97706' }}
                    formatter={(value) => [`${value}`, 'Value']}
                    labelFormatter={(label) => `Term ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#F59E0B" 
                    activeDot={{ r: 8, fill: '#D97706' }}
                    animationDuration={1500}
                  />
                </LineChart>
              ) : (
                <BarChart data={visualData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#332940" />
                  <XAxis dataKey="n" stroke="#D97706" />
                  <YAxis stroke="#D97706" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1b1c22', border: '1px solid #92400E', color: '#D97706' }}
                    itemStyle={{ color: '#F59E0B' }}
                    labelStyle={{ color: '#D97706' }}
                    formatter={(value) => [`${value}`, 'Value']}
                    labelFormatter={(label) => `Term ${label}`}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#F59E0B" 
                    animationDuration={1500}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default SequenceVisualizer;
