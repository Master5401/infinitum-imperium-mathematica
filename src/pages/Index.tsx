
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { InteractiveCard } from "@/components/InteractiveCard";
import { MathEasterEgg } from "@/components/MathEasterEgg";
import { SecretsEasterEgg } from "@/components/SecretsEasterEgg";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Math Torcher - Explore Mathematical Infinity";
  }, []);

  const cardData = {
    title: "Explore Mathematical Concepts",
    description: "Discover the fascinating world of mathematics through interactive tools and resources.",
    features: [
      {
        title: "Daily Challenges",
        description: "Test your skills with new problems every day",
        icon: "🎯"
      },
      {
        title: "Comprehensive Library",
        description: "Access a vast collection of mathematical topics and sequences",
        icon: "📚"
      },
      {
        title: "Interactive Graphing",
        description: "Visualize functions and equations with our powerful graphing tool",
        icon: "📊"
      },
      {
        title: "Personalized Learning",
        description: "Track your progress and tailor your learning experience",
        icon: "🎓"
      }
    ]
  };

  return (
    <div className="relative min-h-screen overflow-hidden neural-network">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Easter Egg Components */}
      <MathEasterEgg />
      <SecretsEasterEgg />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      
      {/* Main Content */}
      <div className="relative z-10 container min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-5xl space-y-12">
          {/* Hero Section with high-contrast typography */}
          <div className="text-center space-y-8" style={{ animation: 'gentle-fade-in 1.2s ease-out' }}>
            <h1 className="text-6xl md:text-8xl font-futuristic font-bold text-gradient-primary leading-tight tracking-tight animate-neon-pulse">
              Math Torcher
            </h1>
            <p className="text-xl md:text-2xl font-space text-neutral-white max-w-3xl mx-auto leading-relaxed font-light">
              Where mathematics meets <span className="text-gradient-accent font-medium animate-neon-pulse">infinite possibilities</span>
            </p>
            
            {/* Mathematical formula with electric styling */}
            <div className="inline-block glass-card px-6 py-3 hover-lift animate-electric-glow">
              <div className="text-lg font-mono text-electric-blue">
                ∫₋∞^∞ f(knowledge) dx = ∞
              </div>
            </div>
          </div>

          {/* Interactive Main Card with enhanced glass morphism */}
          <div style={{ animation: 'gentle-fade-in 1s ease-out 0.3s both' }}>
            <div className="glass-card hover-lift p-8 border-2 border-electric-blue/30">
              <InteractiveCard
                {...cardData}
                onGetStarted={() => navigate('/auth')}
              />
            </div>
          </div>

          {/* Quick Access Features with high-contrast cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Sequences", path: "/sequences", icon: "∑", description: "Explore mathematical sequences", gradient: "from-electric-blue/30 to-electric-purple/30", border: "border-electric-blue/50" },
              { title: "Special Numbers", path: "/special-numbers", icon: "π", description: "Discover unique numbers", gradient: "from-neon-green/30 to-electric-teal/30", border: "border-neon-green/50" },
              { title: "Graphing Tool", path: "/graphing", icon: "📈", description: "Visualize mathematics", gradient: "from-neon-pink/30 to-neon-orange/30", border: "border-neon-pink/50" }
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className={`group cursor-pointer glass-card hover-lift p-8 bg-gradient-to-br ${item.gradient} border-2 ${item.border} transition-all duration-500`}
                style={{ 
                  animation: `gentle-fade-in 0.8s ease-out ${0.6 + index * 0.1}s both` 
                }}
              >
                <div className="text-5xl mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-futuristic font-semibold text-neutral-white mb-3 group-hover:text-gradient-primary transition-all duration-300">
                  {item.title}
                </h3>
                <p className="font-space text-neutral-light text-sm group-hover:text-neutral-white transition-colors duration-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Fun Fact Section with electric styling */}
          <div className="text-center space-y-4" style={{ animation: 'gentle-fade-in 0.8s ease-out 1.2s both' }}>
            <div className="inline-block glass-card px-6 py-4 hover-lift border-2 border-electric-purple/40 animate-electric-glow">
              <p className="font-space text-neutral-white text-sm font-light">
                💡 <strong className="font-medium text-electric-cyan">Secrets await:</strong> Try the Konami code, draw with your mouse, or explore deeply!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Electric Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-20">
        <button
          onClick={() => navigate('/auth')}
          className="group glass-card hover-lift p-4 border-2 border-electric-blue/50 transition-all duration-500 animate-electric-glow"
        >
          <BookOpen className="h-6 w-6 text-electric-blue group-hover:text-neon-green transition-all duration-500 group-hover:rotate-12" />
        </button>
      </div>
    </div>
  );
};

export default Index;
