
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SequenceGraphProps {
  data: number[];
}

export const SequenceGraph = ({ data }: SequenceGraphProps) => {
  const [graphType, setGraphType] = useState<"line" | "bar" | "area" | "scatter">("line");
  
  // Format data for Recharts
  const chartData = data.map((value, index) => ({
    n: index + 1,
    value,
  }));

  const getVisualization = () => {
    switch (graphType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#332940" />
              <XAxis dataKey="n" stroke="#9F7AEA" />
              <YAxis stroke="#9F7AEA" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#2A2F3C', border: '1px solid #4A3A59', color: '#9F7AEA' }}
                itemStyle={{ color: '#B794F4' }}
                labelStyle={{ color: '#9F7AEA' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#B794F4" 
                activeDot={{ r: 8, fill: '#A855F7' }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      // More visualization types can be added here
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#332940" />
              <XAxis dataKey="n" stroke="#9F7AEA" />
              <YAxis stroke="#9F7AEA" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#2A2F3C', border: '1px solid #4A3A59', color: '#9F7AEA' }}
                itemStyle={{ color: '#B794F4' }}
                labelStyle={{ color: '#9F7AEA' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#B794F4" 
                activeDot={{ r: 8, fill: '#A855F7' }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select 
          value={graphType} 
          onValueChange={(value: "line" | "bar" | "area" | "scatter") => setGraphType(value)}
        >
          <SelectTrigger className="w-[180px] bg-purple-900/20 border-purple-900/40 text-purple-200">
            <SelectValue placeholder="Visualization Type" />
          </SelectTrigger>
          <SelectContent className="bg-[#2A2F3C] border-purple-900/30 text-purple-200">
            <SelectItem value="line">Line</SelectItem>
            <SelectItem value="bar">Bar</SelectItem>
            <SelectItem value="area">Area</SelectItem>
            <SelectItem value="scatter">Scatter</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-full w-full">
        {getVisualization()}
      </div>
    </div>
  );
};
