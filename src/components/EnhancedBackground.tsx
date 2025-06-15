
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
      for (let i = 0; i < 20; i++) {
        newSymbols.push({
          id: i,
          symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 32 + 12,
          opacity: Math.random() * 0.15 + 0.05,
          duration: Math.random() * 60 + 40,
          delay: Math.random() * 20,
          direction: Math.random() * 360,
          speed: Math.random() * 0.5 + 0.2,
        });
      }
      setSymbols(newSymbols);
    };

    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const colors = ['#00D4FF', '#8B5CF6', '#39FF14', '#FF1493', '#FF6B35'];
      
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random() * 100 + 50,
          maxLife: Math.random() * 100 + 50,
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

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 1,
        vx: particle.vx + (Math.random() - 0.5) * 0.02,
        vy: particle.vy + (Math.random() - 0.5) * 0.02,
      })).filter(p => p.life > 0));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Enhanced gradient background with more depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg" />
      
      {/* Dynamic aurora effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 212, 255, 0.1) 0%, rgba(139, 92, 246, 0.05) 30%, transparent 60%)`,
          transition: 'background 0.3s ease-out'
        }}
      />
      
      {/* Animated wave overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(0, 212, 255, 0.03) 50%, transparent 70%)',
          animation: 'wave-move 15s ease-in-out infinite'
        }}
      />
      
      {/* Enhanced grid pattern with glow */}
      <div className="absolute inset-0 opacity-40">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 212, 255, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.08) 1px, transparent 1px),
              radial-gradient(circle at 50% 50%, rgba(57, 255, 20, 0.03) 0%, transparent 50%)
            `,
            backgroundSize: '60px 60px, 60px 60px, 200px 200px',
            animation: 'grid-glow 8s ease-in-out infinite'
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
            color: '#00D4FF',
            textShadow: '0 0 10px currentColor',
            animation: `
              symbol-float ${symbol.duration}s ease-in-out infinite,
              symbol-glow 4s ease-in-out infinite,
              symbol-drift ${symbol.duration * 2}s linear infinite
            `,
            animationDelay: `${symbol.delay}s`,
            transform: `rotate(${symbol.direction}deg)`,
          }}
        >
          {symbol.symbol}
        </div>
      ))}
      
      {/* Dynamic particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            backgroundColor: particle.color,
            opacity: particle.life / particle.maxLife,
            boxShadow: `0 0 ${particle.life / 10}px ${particle.color}`,
            animation: 'particle-twinkle 2s ease-in-out infinite'
          }}
        />
      ))}
      
      {/* Constellation lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#39FF14" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {symbols.slice(0, 8).map((symbol, index) => {
          const nextSymbol = symbols[(index + 1) % 8];
          return (
            <line
              key={`line-${index}`}
              x1={`${symbol.x}%`}
              y1={`${symbol.y}%`}
              x2={`${nextSymbol.x}%`}
              y2={`${nextSymbol.y}%`}
              stroke="url(#lineGradient)"
              strokeWidth="0.5"
              className="animate-pulse"
            />
          );
        })}
      </svg>
    </div>
  );
};
