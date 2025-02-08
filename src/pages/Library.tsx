
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const categories = [
  {
    title: "Classical Sequences",
    description: "Fundamental sequences that shaped mathematics",
    count: 42,
  },
  {
    title: "Number Theory",
    description: "Sequences related to prime numbers and integer properties",
    count: 35,
  },
  {
    title: "Chaos Theory",
    description: "Sequences exhibiting chaotic behavior",
    count: 28,
  },
  {
    title: "Fibonacci Variants",
    description: "Variations on the famous Fibonacci sequence",
    count: 31,
  },
];

const Library = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1A1F2C] math-bg py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6 text-purple-300 hover:text-purple-200"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-300 mb-4">Mathematical Library</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
            <Input
              placeholder="Search sequences..."
              className="pl-10 bg-[#2A2F3C] border-purple-900/30 text-purple-200 placeholder:text-purple-900/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="bg-[#2A2F3C] border-purple-900/30 hover:border-purple-500/50 transition-colors cursor-pointer"
            >
              <CardHeader>
                <CardTitle className="flex items-center text-purple-300">
                  <BookOpen className="h-5 w-5 mr-2 text-purple-400" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-400">{category.count} sequences</span>
                  <Button variant="ghost" className="text-purple-300 hover:text-purple-200">
                    Explore
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
