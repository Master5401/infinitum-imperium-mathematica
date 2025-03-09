
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, FunctionSquare, ArrowLeft, ArrowRight, Sigma, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Library = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950/40 via-gray-900 to-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6 text-red-300 hover:text-red-200"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-red-300 mb-6 font-cinzel">Mathematical Library</h1>
          <p className="text-red-200/90 max-w-2xl mx-auto text-lg font-sorts-mill">
            Explore our collections of mathematical sequences and special numbers, or contribute your own discoveries.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-red-600/30 bg-gradient-to-b from-gray-900/90 to-gray-950 shadow-xl rounded-xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-amber-500/5 opacity-70 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl text-red-300 flex items-center font-cinzel">
                <Sigma className="h-6 w-6 mr-3 text-red-400" />
                Mathematical Sequences
              </CardTitle>
              <CardDescription className="text-red-200/80 font-sorts-mill">
                Discover patterns, formulas, and properties of various mathematical sequences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <p className="text-red-200/90">
                Explore a vast collection of number sequences, including:
              </p>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                <li className="flex items-center text-red-200/80 space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
                  <span>Fibonacci numbers</span>
                </li>
                <li className="flex items-center text-red-200/80 space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
                  <span>Prime numbers</span>
                </li>
                <li className="flex items-center text-red-200/80 space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
                  <span>Arithmetic progressions</span>
                </li>
                <li className="flex items-center text-red-200/80 space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
                  <span>Geometric progressions</span>
                </li>
                <li className="flex items-center text-red-200/80 space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
                  <span>OEIS database sequences</span>
                </li>
                <li className="flex items-center text-red-200/80 space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
                  <span>User-submitted sequences</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-3 relative z-10">
              <Button 
                className="w-full bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white shadow-md"
                onClick={() => navigate("/sequences")}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Submit Sequence
              </Button>
              <Button 
                className="w-full bg-gray-800/90 text-red-300 hover:bg-gray-800 hover:text-red-200 border border-red-700/30"
                onClick={() => navigate("/sequences")}
              >
                Browse Sequences
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-amber-600/30 bg-gradient-to-b from-gray-900/90 to-gray-950 shadow-xl rounded-xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/5 to-amber-500/5 opacity-70 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl text-amber-300 flex items-center font-cinzel">
                <Hash className="h-6 w-6 mr-3 text-amber-400" />
                Special Numbers
              </CardTitle>
              <CardDescription className="text-amber-200/80 font-sorts-mill">
                Discover numbers with unique mathematical properties and significance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <p className="text-amber-200/90">
                Explore our dictionary of special numbers, including:
              </p>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                <li className="flex items-center text-amber-200/80 space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                  <span>Perfect numbers</span>
                </li>
                <li className="flex items-center text-amber-200/80 space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                  <span>Armstrong numbers</span>
                </li>
                <li className="flex items-center text-amber-200/80 space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                  <span>Harshad numbers</span>
                </li>
                <li className="flex items-center text-amber-200/80 space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                  <span>Kaprekar numbers</span>
                </li>
                <li className="flex items-center text-amber-200/80 space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                  <span>Narcissistic numbers</span>
                </li>
                <li className="flex items-center text-amber-200/80 space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                  <span>User-submitted numbers</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-3 relative z-10">
              <Button 
                className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white shadow-md"
                onClick={() => navigate("/special-numbers")}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Submit Number
              </Button>
              <Button 
                className="w-full bg-gray-800/90 text-amber-300 hover:bg-gray-800 hover:text-amber-200 border border-amber-700/30"
                onClick={() => navigate("/special-numbers/browse")}
              >
                Browse Numbers
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400/70 font-sorts-mill italic">
            "Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding." — William Paul Thurston
          </p>
        </div>
      </div>
    </div>
  );
};

export default Library;
