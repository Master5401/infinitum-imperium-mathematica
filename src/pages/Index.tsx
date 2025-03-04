
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { OEISSequenceSearch } from "@/components/OEISSequenceSearch";
import { 
  Sparkles, 
  Brain, 
  BookOpen, 
  ChevronRight, 
  Sigma, 
  LineChart, 
  Pi 
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [animateIn, setAnimateIn] = useState(false);
  const [showOEIS, setShowOEIS] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Mathematical symbols for floating background
  const symbols = ["∑", "∫", "π", "∞", "√", "Δ", "∏", "φ", "λ", "θ", "Ω"];

  return (
    <div className="relative overflow-hidden min-h-screen w-full">
      {/* Floating mathematical symbols */}
      {symbols.map((symbol, index) => (
        <div
          key={index}
          className="absolute text-amber-900/10 latin-character"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 5 + 2}rem`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 10 + 5}s`
          }}
        >
          {symbol}
        </div>
      ))}

      <motion.div
        className="container mx-auto px-4 py-12 md:py-20"
        initial="hidden"
        animate={animateIn ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-shimmer font-cinzel">
            Mathematical Sequences Explorer
          </h1>
          <p className="text-xl text-amber-100/80 max-w-2xl mx-auto">
            Discover, analyze, and visualize the patterns that shape our mathematical universe.
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          <Link to="/daily-challenge">
            <div className="bg-[#1b1c22]/80 border border-amber-900/30 rounded-xl p-6 hover:border-amber-500/30 transition-all duration-300 hover:transform hover:scale-[1.02] hover-glow h-full">
              <div className="bg-amber-900/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <Brain className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-amber-300 mb-2 font-cinzel">Daily Challenge</h3>
              <p className="text-amber-100/70">
                Test your pattern recognition skills with our daily mathematical sequence challenges.
              </p>
              <Button variant="link" className="mt-4 text-amber-400 hover:text-amber-300">
                Try Today's Challenge <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </Link>

          <Link to="/library">
            <div className="bg-[#1b1c22]/80 border border-amber-900/30 rounded-xl p-6 hover:border-amber-500/30 transition-all duration-300 hover:transform hover:scale-[1.02] hover-glow h-full">
              <div className="bg-amber-900/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <BookOpen className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-amber-300 mb-2 font-cinzel">Sequence Library</h3>
              <p className="text-amber-100/70">
                Browse our collection of famous and obscure mathematical sequences.
              </p>
              <Button variant="link" className="mt-4 text-amber-400 hover:text-amber-300">
                Explore Library <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </Link>

          <Link to="/graphing">
            <div className="bg-[#1b1c22]/80 border border-amber-900/30 rounded-xl p-6 hover:border-amber-500/30 transition-all duration-300 hover:transform hover:scale-[1.02] hover-glow h-full">
              <div className="bg-amber-900/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <LineChart className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-amber-300 mb-2 font-cinzel">Sequence Graphing</h3>
              <p className="text-amber-100/70">
                Visualize and analyze mathematical sequences with interactive charts.
              </p>
              <Button variant="link" className="mt-4 text-amber-400 hover:text-amber-300">
                Start Graphing <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mb-12">
          <Button 
            onClick={() => setShowOEIS(!showOEIS)}
            className="bg-amber-900 hover:bg-amber-800 text-amber-100 py-6 px-8"
          >
            <Sigma className="h-5 w-5 mr-2" />
            {showOEIS ? "Hide OEIS Database" : "Explore OEIS Database"}
          </Button>
        </motion.div>

        {showOEIS && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <OEISSequenceSearch />
          </motion.div>
        )}

        <motion.div 
          variants={itemVariants} 
          className="mt-20 text-center p-6 bg-[#1b1c22]/70 border border-amber-900/20 rounded-lg max-w-3xl mx-auto"
        >
          <Sparkles className="h-6 w-6 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-300 mb-4 font-cinzel">Join Our Mathematical Community</h2>
          <p className="text-amber-100/80 mb-6">
            Share your own sequences, discuss patterns with fellow enthusiasts, and contribute to our growing database of mathematical wonders.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/auth">
              <Button className="bg-amber-900 hover:bg-amber-800 text-amber-100">
                Sign In to Contribute
              </Button>
            </Link>
            <Button variant="outline" className="border-amber-900/30 text-amber-300 hover:bg-amber-900/20">
              Learn More <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
