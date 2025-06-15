
import { useEffect, useState } from 'react';

const mathSymbols = ['∑', '∫', '∂', 'π', '∞', '√', 'Δ', 'θ', 'α', 'β', 'γ', 'λ', '∇', '⊕', '∅', '∈', '∀', '∃', 'ℝ', 'ℕ', 'ℤ', 'ℚ', 'Ω', 'Φ', 'Ψ', 'ε', 'δ', 'σ', 'τ', 'ρ'];

interface FloatingSymbol {
  id: number;
  symbol: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  direction: number;
  speed: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export const EnhancedBackground = () => {
  const [symbols, setSymbols] = useState<FloatingSymbol[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const generateSymbols = () => {
      const newSymbols: FloatingSymbol[] = [];
      for (let i = 0; i < 15; i++) {
        newSymbols.push({
          id: i,
          symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 28 + 14,
          opacity: Math.random() * 0.12 + 0.06,
          duration: Math.random() * 50 + 35,
          delay: Math.random() * 15,
          direction: Math.random() * 360,
          speed: Math.random() * 0.3 + 0.2,
        });
      }
      setSymbols(newSymbols);
    };

    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const colors = ['#a67cff', '#0ea5e9', '#5a6f5a', '#f59e0b', '#9fb09f'];
      
      for (let i = 0; i < 10; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          life: Math.random() * 120 + 60,
          maxLife: Math.random() * 120 + 60,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      setParticles(newParticles);
    };

    generateSymbols();
    generateParticles();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animate particles with gentler movement
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 1,
        vx: particle.vx + (Math.random() - 0.5) * 0.01,
        vy: particle.vy + (Math.random() - 0.5) * 0.01,
      })).filter(p => p.life > 0));
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Warmer gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-surface to-dark-elevated" />
      
      {/* Gentle aurora effect with warmer colors */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(166, 124, 255, 0.08) 0%, rgba(245, 158, 11, 0.04) 30%, transparent 60%)`,
          transition: 'background 0.4s ease-out'
        }}
      />
      
      {/* Smoother wave overlay */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(166, 124, 255, 0.06) 50%, transparent 70%)',
          animation: 'wave-motion 18s ease-in-out infinite'
        }}
      />
      
      {/* Enhanced grid pattern with subtle glow */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(166, 124, 255, 0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(166, 124, 255, 0.06) 1px, transparent 1px),
              radial-gradient(circle at 50% 50%, rgba(90, 111, 90, 0.04) 0%, transparent 50%)
            `,
            backgroundSize: '80px 80px, 80px 80px, 240px 240px',
            animation: 'grid-breathe 10s ease-in-out infinite'
          }}
        />
      </div>
      
      {/* Floating mathematical symbols with enhanced movement */}
      {symbols.map((symbol) => (
        <div
          key={symbol.id}
          className="absolute font-futuristic select-none transition-all duration-1000"
          style={{
            left: `${symbol.x}%`,
            top: `${symbol.y}%`,
            fontSize: `${symbol.size}px`,
            opacity: symbol.opacity,
            color: '#a67cff',
            textShadow: '0 0 8px currentColor',
            animation: `
              gentle-float ${symbol.duration}s ease-in-out infinite,
              warm-pulse 5s ease-in-out infinite,
              symbol-drift ${symbol.duration * 1.5}s linear infinite
            `,
            animationDelay: `${symbol.delay}s`,
            transform: `rotate(${symbol.direction}deg)`,
          }}
        >
          {symbol.symbol}
        </div>
      ))}
      
      {/* Gentler dynamic particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            backgroundColor: particle.color,
            opacity: (particle.life / particle.maxLife) * 0.6,
            boxShadow: `0 0 ${particle.life / 12}px ${particle.color}`,
            animation: 'particle-dance 3s ease-in-out infinite'
          }}
        />
      ))}
      
      {/* Softer constellation lines */}
      <svg className="absolute inset-0 w-full h-full opacity-15">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a67cff" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {symbols.slice(0, 6).map((symbol, index) => {
          const nextSymbol = symbols[(index + 1) % 6];
          return (
            <line
              key={`line-${index}`}
              x1={`${symbol.x}%`}
              y1={`${symbol.y}%`}
              x2={`${nextSymbol.x}%`}
              y2={`${nextSymbol.y}%`}
              stroke="url(#lineGradient)"
              strokeWidth="0.8"
              className="animate-pulse"
            />
          );
        })}
      </svg>
      
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(166, 124, 255, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(245, 158, 11, 0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(90, 111, 90, 0.04) 0%, transparent 50%)
            `
          }}
        />
      </div>
    </div>
  );
};
