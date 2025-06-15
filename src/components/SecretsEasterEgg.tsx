import { useState, useEffect } from 'react';

export const SecretsEasterEgg = () => {
  const [secretSequence, setSecretSequence] = useState<string[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollCount, setScrollCount] = useState(0);
  const [activated, setActivated] = useState(false);

  // Secret mouse pattern easter egg (draw a circle)
  useEffect(() => {
    let mousePositions: Array<{ x: number, y: number, time: number }> = [];
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      mousePositions.push({ x: e.clientX, y: e.clientY, time: now });
      
      // Keep only recent positions (last 3 seconds)
      mousePositions = mousePositions.filter(pos => now - pos.time < 3000);
      
      // Check if mouse drew a rough circle
      if (mousePositions.length > 50) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const radius = 100;
        
        let circlePoints = 0;
        mousePositions.forEach(pos => {
          const distance = Math.sqrt(Math.pow(pos.x - centerX, 2) + Math.pow(pos.y - centerY, 2));
          if (distance >= radius - 50 && distance <= radius + 50) {
            circlePoints++;
          }
        });
        
        if (circlePoints > 30) {
          triggerCircleEasterEgg();
          mousePositions = [];
        }
      }
      
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Secret scroll pattern
  useEffect(() => {
    const handleScroll = () => {
      setScrollCount(prev => prev + 1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll easter egg trigger
  useEffect(() => {
    if (scrollCount > 0 && scrollCount % 20 === 0) {
      triggerScrollEasterEgg();
    }
  }, [scrollCount]);

  // Double-click secret sequence
  useEffect(() => {
    let clickCount = 0;
    let clickTimer: NodeJS.Timeout;

    const handleDoubleClick = (e: MouseEvent) => {
      clickCount++;
      clearTimeout(clickTimer);
      
      clickTimer = setTimeout(() => {
        if (clickCount >= 5) {
          triggerClickEasterEgg();
        }
        clickCount = 0;
      }, 2000);
    };

    window.addEventListener('dblclick', handleDoubleClick);
    return () => {
      window.removeEventListener('dblclick', handleDoubleClick);
      clearTimeout(clickTimer);
    };
  }, []);

  const triggerCircleEasterEgg = () => {
    showEasterEggMessage("🎨 You drew the circle of mathematics! Perfection in motion.", "text-purple-400");
  };

  const triggerScrollEasterEgg = () => {
    const messages = [
      "📜 Ancient scrolls of wisdom revealed!",
      "🔍 Deep explorer of mathematical realms!",
      "⚡ Your curiosity knows no bounds!"
    ];
    showEasterEggMessage(messages[Math.floor(Math.random() * messages.length)], "text-blue-400");
  };

  const triggerClickEasterEgg = () => {
    showEasterEggMessage("⚡ Double-click master! Mathematics appreciates precision.", "text-green-400");
  };

  const showEasterEggMessage = (message: string, colorClass: string) => {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.className = `fixed z-50 ${colorClass} font-bold text-lg pointer-events-none transition-all duration-1000 opacity-0`;
    messageDiv.style.left = '50%';
    messageDiv.style.top = '25%';
    messageDiv.style.transform = 'translateX(-50%)';
    messageDiv.style.textShadow = '0 0 10px currentColor';
    document.body.appendChild(messageDiv);
    
    // Elegant appearance
    setTimeout(() => {
      messageDiv.style.opacity = '1';
      messageDiv.style.transform = 'translateX(-50%) translateY(-10px) scale(1.05)';
    }, 100);
    
    // Graceful exit
    setTimeout(() => {
      messageDiv.style.opacity = '0';
      messageDiv.style.transform = 'translateX(-50%) translateY(-30px) scale(0.95)';
    }, 3500);
    
    setTimeout(() => messageDiv.remove(), 4500);
  };

  return null; // This component doesn't render anything visible
};
