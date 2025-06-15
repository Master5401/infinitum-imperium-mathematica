
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles } from 'lucide-react';

interface InteractiveCardProps {
  title: string;
  description: string;
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  onGetStarted: () => void;
}

export const InteractiveCard = ({ title, description, features, onGetStarted }: InteractiveCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [timeOnPage, setTimeOnPage] = useState(0);

  // Time-based easter egg
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnPage(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Easter egg: After 30 seconds on page
  useEffect(() => {
    if (timeOnPage === 30) {
      const messages = [
        "🕐 You've been exploring for 30 seconds! Math waits for no one.",
        "⏰ Time flies when you're thinking mathematically!",
        "🎯 Dedicated learner detected! Keep exploring.",
      ];
      showFloatingMessage(messages[Math.floor(Math.random() * messages.length)]);
    }
  }, [timeOnPage]);

  const showFloatingMessage = (message: string) => {
    const floatingDiv = document.createElement('div');
    floatingDiv.textContent = message;
    floatingDiv.className = 'fixed z-50 text-amber-400 font-bold text-sm pointer-events-none transition-all duration-1000 opacity-0';
    floatingDiv.style.left = '50%';
    floatingDiv.style.top = '20%';
    floatingDiv.style.transform = 'translateX(-50%)';
    document.body.appendChild(floatingDiv);
    
    // Smooth fade in
    setTimeout(() => {
      floatingDiv.style.opacity = '1';
      floatingDiv.style.transform = 'translateX(-50%) translateY(-10px)';
    }, 100);
    
    // Smooth fade out
    setTimeout(() => {
      floatingDiv.style.opacity = '0';
      floatingDiv.style.transform = 'translateX(-50%) translateY(-20px)';
    }, 3000);
    
    setTimeout(() => {
      floatingDiv.remove();
    }, 4000);
  };

  const handleCardClick = () => {
    setClickCount(prev => prev + 1);
    
    // Reduced click threshold and smoother message
    if (clickCount >= 3) {
      const messages = [
        "🎯 Curious explorer found!",
        "🧮 Mathematics appreciates persistence",
        "∞ Your dedication is infinite!",
        "📐 Precision in exploration!",
        "🔢 You understand the pattern!"
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      showFloatingMessage(randomMessage);
      setClickCount(0);
    }
  };

  return (
    <Card 
      className={`relative overflow-hidden bg-gradient-to-br from-gray-900/40 to-gray-800/40 border-red-700/20 backdrop-blur-md transition-all duration-700 ease-out cursor-pointer group ${
        isHovered ? 'transform scale-[1.02] shadow-xl shadow-red-500/10' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Refined glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-red-500/10 via-amber-500/10 to-red-500/10 transition-opacity duration-700 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
      
      {/* Subtle shimmer effect */}
      <div className={`absolute inset-0 transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/3 to-transparent ${
        isHovered ? 'translate-x-full' : '-translate-x-full'
      }`} />
      
      <CardHeader className="relative z-10">
        <CardTitle className="text-3xl font-bold font-cinzel bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent flex items-center gap-2 transition-all duration-500">
          {title}
          {isHovered && <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />}
        </CardTitle>
        <CardDescription className="text-gray-300 text-lg transition-colors duration-300">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-6">
        <div className="grid gap-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg bg-gray-800/20 border border-gray-700/30 transition-all duration-500 ease-out ${
                isHovered ? 'transform translate-x-1 bg-gray-800/30' : ''
              }`}
              style={{ 
                transitionDelay: `${index * 80}ms` 
              }}
            >
              <span className="text-2xl transition-transform duration-300 hover:scale-110">{feature.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-red-300 transition-colors duration-300">{feature.title}</h4>
                <p className="text-sm text-gray-400 transition-colors duration-300">{feature.description}</p>
              </div>
              <ChevronRight className={`h-4 w-4 text-gray-500 transition-all duration-300 ${
                isHovered ? 'translate-x-1 text-gray-400' : ''
              }`} />
            </div>
          ))}
        </div>
        
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onGetStarted();
          }}
          className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold py-3 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-lg shadow-red-500/20"
        >
          <span className="flex items-center justify-center gap-2">
            Get Started
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Button>
      </CardContent>
    </Card>
  );
};
