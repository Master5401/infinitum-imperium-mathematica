
import { useEffect, useState } from 'react';

const mathSymbols = ['∑', '∫', '∂', 'π', '∞', '√', 'Δ', 'θ', 'α', 'β', 'γ', 'λ', '∇', '⊕', '∅', '∈', '∀', '∃', 'ℝ', 'ℕ', 'ℤ', 'ℚ'];

interface FloatingSymbol {
  id: number;
  symbol: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export const AnimatedBackground = () => {
  const [symbols, setSymbols] = useState<FloatingSymbol[]>([]);

  useEffect(() => {
    const generateSymbols = () => {
      const newSymbols: FloatingSymbol[] = [];
      for (let i = 0; i < 15; i++) {
        newSymbols.push({
          id: i,
          symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 40 + 20,
          opacity: Math.random() * 0.1 + 0.02,
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 5,
        });
      }
      setSymbols(newSymbols);
    };

    generateSymbols();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black" />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-amber-900/10 animate-pulse" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,60,54,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,60,54,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
      
      {/* Floating mathematical symbols */}
      {symbols.map((symbol) => (
        <div
          key={symbol.id}
          className="absolute font-cinzel text-red-400/20 select-none"
          style={{
            left: `${symbol.x}%`,
            top: `${symbol.y}%`,
            fontSize: `${symbol.size}px`,
            opacity: symbol.opacity,
            animation: `float ${symbol.duration}s ease-in-out infinite`,
            animationDelay: `${symbol.delay}s`,
          }}
        >
          {symbol.symbol}
        </div>
      ))}
      
      {/* Particles effect */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 4 + 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
