
import { useState, useEffect } from 'react';

const konami = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

export const MathEasterEgg = () => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const newSequence = [...sequence, event.code].slice(-konami.length);
      setSequence(newSequence);

      if (newSequence.length === konami.length && 
          newSequence.every((key, index) => key === konami[index])) {
        setActivated(true);
        
        // Create fireworks effect
        createFireworks();
        
        // Reset after 5 seconds
        setTimeout(() => {
          setActivated(false);
          setSequence([]);
        }, 5000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sequence]);

  const createFireworks = () => {
    const colors = ['#ff3c36', '#ffc107', '#4caf50', '#2196f3', '#9c27b0'];
    
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const firework = document.createElement('div');
        firework.className = 'fixed pointer-events-none z-50';
        firework.style.left = Math.random() * window.innerWidth + 'px';
        firework.style.top = Math.random() * window.innerHeight + 'px';
        firework.style.width = '4px';
        firework.style.height = '4px';
        firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        firework.style.borderRadius = '50%';
        firework.style.animation = 'explode 1s ease-out forwards';
        
        document.body.appendChild(firework);
        
        setTimeout(() => firework.remove(), 1000);
      }, i * 100);
    }
  };

  if (!activated) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="text-center animate-bounce">
        <div className="text-6xl font-bold font-cinzel bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent animate-pulse">
          🎉 KONAMI CODE! 🎉
        </div>
        <div className="text-2xl text-amber-400 mt-4 animate-pulse">
          You unlocked the mathematician's secret!
        </div>
        <div className="text-lg text-gray-300 mt-2">
          ∑∞ = Math is infinite! ∞∑
        </div>
      </div>
    </div>
  );
};
