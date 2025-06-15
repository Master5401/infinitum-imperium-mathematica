
import { useState } from 'react';
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

  const handleCardClick = () => {
    setClickCount(prev => prev + 1);
    
    // Easter egg: After 5 clicks, show a special message
    if (clickCount >= 4) {
      const messages = [
        "🎉 You found the click easter egg!",
        "🧮 Math is everywhere!",
        "∞ Keep exploring mathematics!",
        "🔢 Numbers never lie!",
        "📐 Geometry is beautiful!"
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      // Create floating message
      const floatingDiv = document.createElement('div');
      floatingDiv.textContent = randomMessage;
      floatingDiv.className = 'fixed z-50 text-amber-400 font-bold text-lg pointer-events-none animate-bounce';
      floatingDiv.style.left = '50%';
      floatingDiv.style.top = '30%';
      floatingDiv.style.transform = 'translateX(-50%)';
      document.body.appendChild(floatingDiv);
      
      setTimeout(() => {
        floatingDiv.remove();
      }, 3000);
      
      setClickCount(0);
    }
  };

  return (
    <Card 
      className={`relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-red-700/30 backdrop-blur-md transition-all duration-500 cursor-pointer group ${
        isHovered ? 'transform scale-105 shadow-2xl shadow-red-500/20' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Animated border glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-amber-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="text-3xl font-bold font-cinzel bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent flex items-center gap-2">
          {title}
          {isHovered && <Sparkles className="h-6 w-6 text-amber-400 animate-spin" />}
        </CardTitle>
        <CardDescription className="text-gray-300 text-lg">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-6">
        <div className="grid gap-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 transition-all duration-300 ${
                isHovered ? 'transform translate-x-2' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-2xl">{feature.icon}</span>
              <div>
                <h4 className="font-semibold text-red-300">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
              <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${
                isHovered ? 'translate-x-1' : ''
              }`} />
            </div>
          ))}
        </div>
        
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onGetStarted();
          }}
          className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold py-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          <span className="flex items-center justify-center gap-2">
            Get Started
            <ChevronRight className="h-4 w-4" />
          </span>
        </Button>
      </CardContent>
    </Card>
  );
};
