
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface DataPoint {
  n: number;
  value: number;
}

const Graphing = () => {
  const [sequenceType, setSequenceType] = useState<"fibonacci" | "arithmetic" | "geometric">("fibonacci");
  const [terms, setTerms] = useState<number>(10);
  const [data, setData] = useState<DataPoint[]>([]);
  const { toast } = useToast();

  const generateSequence = () => {
    const newData: DataPoint[] = [];
    
    switch (sequenceType) {
      case "fibonacci":
        let a = 0, b = 1;
        for (let i = 0; i < terms; i++) {
          newData.push({ n: i, value: a });
          [a, b] = [b, a + b];
        }
        break;
      
      case "arithmetic":
        // Arithmetic sequence with first term 1 and common difference 2
        for (let i = 0; i < terms; i++) {
          newData.push({ n: i, value: 1 + (2 * i) });
        }
        break;
      
      case "geometric":
        // Geometric sequence with first term 1 and common ratio 2
        for (let i = 0; i < terms; i++) {
          newData.push({ n: i, value: Math.pow(2, i) });
        }
        break;
    }
    
    setData(newData);
    toast({
      title: "Graph Updated",
      description: `Generated ${terms} terms of the ${sequenceType} sequence.`,
    });
  };

  useEffect(() => {
    generateSequence();
  }, [sequenceType, terms]);

  return (
    <div className="min-h-screen bg-[#1A1F2C] math-bg p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-300 mb-8">Sequence Visualizer</h1>
        
        <Card className="p-6 bg-[#221F26]/80 border-purple-900/20 mb-8">
          <div className="flex flex-wrap gap-4 mb-6">
            <Button
              variant={sequenceType === "fibonacci" ? "default" : "outline"}
              onClick={() => setSequenceType("fibonacci")}
              className="bg-purple-900 hover:bg-purple-800 text-purple-100"
            >
              Fibonacci
            </Button>
            <Button
              variant={sequenceType === "arithmetic" ? "default" : "outline"}
              onClick={() => setSequenceType("arithmetic")}
              className="bg-purple-900 hover:bg-purple-800 text-purple-100"
            >
              Arithmetic
            </Button>
            <Button
              variant={sequenceType === "geometric" ? "default" : "outline"}
              onClick={() => setSequenceType("geometric")}
              className="bg-purple-900 hover:bg-purple-800 text-purple-100"
            >
              Geometric
            </Button>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <label className="text-purple-300">Number of Terms:</label>
            <Input
              type="number"
              value={terms}
              onChange={(e) => setTerms(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-24 bg-purple-900/20 border-purple-900/40 text-purple-100"
            />
          </div>
        </Card>

        <Card className="p-6 bg-[#221F26]/80 border-purple-900/20">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#332940" />
              <XAxis 
                dataKey="n" 
                stroke="#9F7AEA"
                label={{ value: 'n (term number)', position: 'bottom', fill: '#9F7AEA' }}
              />
              <YAxis 
                stroke="#9F7AEA"
                label={{ value: 'Value', angle: -90, position: 'insideLeft', fill: '#9F7AEA' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#221F26', border: '1px solid #4A3A59' }}
                labelStyle={{ color: '#9F7AEA' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#B794F4" 
                name={`${sequenceType} sequence`}
                dot={{ fill: '#B794F4' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Graphing;
