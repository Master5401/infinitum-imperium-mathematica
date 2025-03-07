
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, FunctionSquare, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Library = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 py-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-gray-950">
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
          <p className="text-purple-200/80">Explore our collections of mathematical sequences and special numbers.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-purple-600/20 bg-gradient-to-b from-gray-900/90 to-gray-950 shadow-lg shadow-purple-900/10">
            <CardHeader>
              <CardTitle className="text-xl text-purple-300 flex items-center">
                <FunctionSquare className="h-5 w-5 mr-2 text-purple-400" />
                Mathematical Sequences
              </CardTitle>
              <CardDescription className="text-purple-200/70">
                Discover patterns, formulas, and properties of various mathematical sequences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-purple-200/80">
                Explore a vast collection of number sequences, including:
              </p>
              <ul className="list-disc list-inside text-sm text-purple-200/80 space-y-1">
                <li>Fibonacci numbers</li>
                <li>Prime numbers</li>
                <li>Arithmetic and geometric progressions</li>
                <li>OEIS database sequences</li>
                <li>User-submitted sequences</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => navigate("/sequences")}
              >
                Browse Sequences
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-amber-600/20 bg-gradient-to-b from-gray-900/90 to-gray-950 shadow-lg shadow-amber-900/10">
            <CardHeader>
              <CardTitle className="text-xl text-amber-300 flex items-center">
                <Hash className="h-5 w-5 mr-2 text-amber-400" />
                Special Numbers
              </CardTitle>
              <CardDescription className="text-amber-200/70">
                Discover numbers with unique mathematical properties and significance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-amber-200/80">
                Explore our dictionary of special numbers, including:
              </p>
              <ul className="list-disc list-inside text-sm text-amber-200/80 space-y-1">
                <li>Perfect numbers</li>
                <li>Armstrong numbers</li>
                <li>Harshad numbers</li>
                <li>Kaprekar numbers</li>
                <li>User-submitted special numbers</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => navigate("/special-numbers/browse")}
              >
                Browse Special Numbers
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Library;
