
import { Button } from "@/components/ui/button";
import { SequenceCard } from "@/components/SequenceCard";
import { SubmitSequence } from "@/components/SubmitSequence";
import { useState, useEffect } from "react";
import { Sigma, PlusCircle, Sparkles, Lightbulb, Trophy, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [showSubmit, setShowSubmit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const formulas = [
      "E = mc²",
      "∮ E·dℓ = -dΦB/dt",
      "eiπ + 1 = 0",
      "∇ × E = -∂B/∂t",
      "Principia Mathematica",
      "Ad Infinitum Et Ultra",
      "Ars Magna",
      "Quantum Entanglement",
      "∫ e^x dx = e^x + C",
      "lim(x→∞) (1 + 1/x)^x = e",
      "∑(n=1→∞) 1/n²= π²/6",
      "Cogito, Ergo Sum",
      "Ex Nihilo, Omnia",
      "∇ × B = μ₀J + ε₀μ₀∂E/∂t",
      "∇ · E = ρ/ε₀",
      "dx/dt = f(x,t)",
      "∂ψ/∂t = (-ℏ²/2m)∇²ψ",
      "Carpe Mathematica",
      "Veritas in Numeros",
    ];

    const createFloatingFormula = () => {
      const formula = document.createElement("div");
      formula.className = "floating-formula";
      formula.textContent = formulas[Math.floor(Math.random() * formulas.length)];
      formula.style.setProperty("--y", `${Math.random() * 100}vh`);
      
      // Add click handler for the easter egg glow effect
      formula.addEventListener("click", () => {
        formula.classList.add("glow");
      });
      
      document.body.appendChild(formula);

      formula.addEventListener("animationend", () => {
        formula.remove();
      });
    };

    // Create particle effect on mouse move
    const createParticle = (e: MouseEvent) => {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = e.clientX + "px";
      particle.style.top = e.clientY + "px";
      particle.style.width = "100px";
      particle.style.height = "100px";
      particle.style.setProperty("--x", `${(Math.random() - 0.5) * 100}px`);
      particle.style.setProperty("--y", `${(Math.random() - 0.5) * 100}px`);
      document.body.appendChild(particle);

      setTimeout(() => particle.remove(), 4000);
    };

    const interval = setInterval(createFloatingFormula, 3000);
    document.addEventListener("mousemove", createParticle);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousemove", createParticle);
    };
  }, []);

  const sampleSequences = [
    {
      title: "The Mystical Fibonacci Variant",
      description: "A sequence where each number is the sum of the previous two, multiplied by the golden ratio's decimal places at that position",
      formula: "a(n) = φ_n(a_{n-1} + a_{n-2}), a_0 = 0, a_1 = 1",
      author: "Enigmatic_Math",
      votes: 42,
      comments: 15,
    },
    {
      title: "Quantum Prime Spiral",
      description: "A sequence that maps prime numbers onto a spiral pattern in complex space, revealing hidden symmetries",
      formula: "z_n = p_n * e^(2πi * sqrt(p_n)), where p_n is the nth prime",
      author: "QuantumSeeker",
      votes: 38,
      comments: 12,
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A1F2C] math-bg">
      <header className="bg-[#221F26] shadow-lg border-b border-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Sigma className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                Imperium Infinitum Mathematica
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20"
                onClick={() => navigate("/daily-challenge")}
              >
                <Trophy className="h-5 w-5 mr-2" />
                Daily Challenge
              </Button>
              <Button
                variant="ghost"
                className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20"
                onClick={() => navigate("/library")}
              >
                <Book className="h-5 w-5 mr-2" />
                Library
              </Button>
              <Button
                variant="ghost"
                className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20"
                onClick={() => navigate("/learn")}
              >
                <Lightbulb className="h-5 w-5 mr-2" />
                Learn
              </Button>
              <Button
                onClick={() => setShowSubmit(!showSubmit)}
                className="flex items-center space-x-2 bg-purple-900 hover:bg-purple-800 text-purple-100"
              >
                {showSubmit ? <Sparkles className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
                <span>{showSubmit ? "View Sequences" : "Submit Sequence"}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {showSubmit ? (
          <div className="flex justify-center mb-8">
            <SubmitSequence />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl text-purple-300 mb-2">Discover the Unknown</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Explore mathematical sequences that bridge the gap between the known and the mysterious.
                Each submission is verified by our AI to ensure uniqueness and significance.
              </p>
            </div>
            {sampleSequences.map((sequence, index) => (
              <div key={index} className="flex justify-center">
                <SequenceCard {...sequence} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
