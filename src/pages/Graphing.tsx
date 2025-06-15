
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { SequenceGraph } from "@/components/SequenceGraph";

interface DataPoint {
  n: number;
  value: number;
}

const Graphing = () => {
  const [sequenceType, setSequenceType] = useState<"fibonacci" | "arithmetic" | "geometric" | "prime" | "factorial" | "triangular">("fibonacci");
  const [terms, setTerms] = useState<number>(10);
  const [data, setData] = useState<DataPoint[]>([]);
  const [sequenceValues, setSequenceValues] = useState<number[]>([]);
  const { toast } = useToast();

  const generateSequence = () => {
    const newData: DataPoint[] = [];
    const values: number[] = [];
    
    switch (sequenceType) {
      case "fibonacci":
        let a = 0, b = 1;
        for (let i = 0; i < terms; i++) {
          newData.push({ n: i, value: a });
          values.push(a);
          [a, b] = [b, a + b];
        }
        break;
      
      case "arithmetic":
        // Arithmetic sequence with first term 1 and common difference 2
        for (let i = 0; i < terms; i++) {
          const value = 1 + (2 * i);
          newData.push({ n: i, value });
          values.push(value);
        }
        break;
      
      case "geometric":
        // Geometric sequence with first term 1 and common ratio 2
        for (let i = 0; i < terms; i++) {
          const value = Math.pow(2, i);
          newData.push({ n: i, value });
          values.push(value);
        }
        break;

      case "prime":
        // Generate prime numbers
        const primes: number[] = [];
        let num = 2;
        while (primes.length < terms) {
          let isPrime = true;
          for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) {
              isPrime = false;
              break;
            }
          }
          if (isPrime) {
            primes.push(num);
          }
          num++;
        }
        primes.forEach((prime, index) => {
          newData.push({ n: index, value: prime });
          values.push(prime);
        });
        break;

      case "factorial":
        // Generate factorial sequence
        for (let i = 0; i < terms; i++) {
          let factorial = 1;
          for (let j = 1; j <= i + 1; j++) {
            factorial *= j;
          }
          newData.push({ n: i, value: factorial });
          values.push(factorial);
        }
        break;

      case "triangular":
        // Generate triangular numbers
        for (let i = 0; i < terms; i++) {
          const value = (i + 1) * (i + 2) / 2;
          newData.push({ n: i, value });
          values.push(value);
        }
        break;
    }
    
    setData(newData);
    setSequenceValues(values);
    toast({
      title: "Graph Updated",
      description: `Generated ${terms} terms of the ${sequenceType} sequence.`,
    });
  };

  useEffect(() => {
    generateSequence();
  }, [sequenceType, terms]);

  return (
    <div className="min-h-screen bg-[#1A1F2C] math-bg p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-purple-300 font-cinzel">
            Advanced Sequence Visualizer
          </h1>
          <p className="text-purple-200/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Explore mathematical sequences through multiple visualization types including polar graphs, radar charts, and more.
          </p>
        </div>
        
        <Card className="p-8 bg-[#221F26]/80 border-purple-900/20 backdrop-blur-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-300 mb-4">Sequence Selection</h2>
              <div className="flex flex-wrap gap-3">
                {[
                  { key: "fibonacci", label: "Fibonacci" },
                  { key: "arithmetic", label: "Arithmetic" },
                  { key: "geometric", label: "Geometric" },
                  { key: "prime", label: "Prime Numbers" },
                  { key: "factorial", label: "Factorial" },
                  { key: "triangular", label: "Triangular" }
                ].map((seq) => (
                  <Button
                    key={seq.key}
                    variant={sequenceType === seq.key ? "default" : "outline"}
                    onClick={() => setSequenceType(seq.key as typeof sequenceType)}
                    className="bg-purple-900 hover:bg-purple-800 text-purple-100 border-purple-700"
                  >
                    {seq.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="text-purple-300 font-medium whitespace-nowrap">
                Number of Terms:
              </label>
              <Input
                type="number"
                value={terms}
                onChange={(e) => setTerms(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-32 bg-purple-900/20 border-purple-900/40 text-purple-100 focus:border-purple-600"
                min="1"
                max="20"
              />
              <span className="text-purple-400 text-sm">
                (Max: 20 for optimal visualization)
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-[#221F26]/80 border-purple-900/20 backdrop-blur-sm">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-purple-300">
              Interactive Visualizations
            </h2>
            <p className="text-purple-200/70 text-sm leading-relaxed">
              Choose from multiple chart types to visualize your sequence data. Each visualization offers unique insights into the mathematical patterns.
            </p>
            <SequenceGraph data={sequenceValues} />
          </div>
        </Card>

        <Card className="p-6 bg-[#221F26]/60 border-purple-900/20">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-300">Current Sequence Values</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {data.map((point, index) => (
                <div 
                  key={index}
                  className="bg-purple-900/30 border border-purple-800/40 rounded-lg p-3 text-center"
                >
                  <div className="text-purple-400 text-xs font-mono">T{point.n + 1}</div>
                  <div className="text-purple-200 font-semibold">{point.value}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Graphing;
