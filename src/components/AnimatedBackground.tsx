
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
      for (let i = 0; i < 12; i++) {
        newSymbols.push({
          id: i,
          symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 24 + 16,
          opacity: Math.random() * 0.06 + 0.02,
          duration: Math.random() * 40 + 30,
          delay: Math.random() * 10,
        });
      }
      setSymbols(newSymbols);
    };

    generateSymbols();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black" />
      
      {/* Very gentle animated gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-red-900/5 via-transparent to-amber-900/5"
        style={{
          animation: 'subtle-breathe 8s ease-in-out infinite'
        }}
      />
      
      {/* Refined grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,60,54,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,60,54,0.015)_1px,transparent_1px)] bg-[size:120px_120px]" />
      
      {/* Floating mathematical symbols with smoother animation */}
      {symbols.map((symbol) => (
        <div
          key={symbol.id}
          className="absolute font-cinzel text-red-400/20 select-none"
          style={{
            left: `${symbol.x}%`,
            top: `${symbol.y}%`,
            fontSize: `${symbol.size}px`,
            opacity: symbol.opacity,
            animation: `gentle-float ${symbol.duration}s ease-in-out infinite`,
            animationDelay: `${symbol.delay}s`,
          }}
        >
          {symbol.symbol}
        </div>
      ))}
      
      {/* Subtle particle effect */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-red-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `gentle-pulse ${Math.random() * 6 + 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
