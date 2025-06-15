
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
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Main Content */}
      <div className="relative z-10 container min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-5xl space-y-12">
          {/* Hero Section with futuristic typography */}
          <div className="text-center space-y-8" style={{ animation: 'gentle-fade-in 1.2s ease-out' }}>
            <h1 className="text-6xl md:text-8xl font-futuristic font-bold text-gradient-primary leading-tight tracking-tight">
              Math Torcher
            </h1>
            <p className="text-xl md:text-2xl font-space text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              Where mathematics meets <span className="text-gradient-accent font-medium">infinite possibilities</span>
            </p>
            
            {/* Refined mathematical formula with futuristic styling */}
            <div className="inline-block glass-card px-6 py-3 hover-lift">
              <div className="text-lg font-mono text-purple-300 animate-fluid-glow">
                ∫₋∞^∞ f(knowledge) dx = ∞
              </div>
            </div>
          </div>

          {/* Interactive Main Card with glass morphism */}
          <div style={{ animation: 'gentle-fade-in 1s ease-out 0.3s both' }}>
            <div className="glass-card hover-lift p-8">
              <InteractiveCard
                {...cardData}
                onGetStarted={() => navigate('/auth')}
              />
            </div>
          </div>

          {/* Quick Access Features with modern cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Sequences", path: "/sequences", icon: "∑", description: "Explore mathematical sequences", color: "from-violet-500/20 to-purple-500/20" },
              { title: "Special Numbers", path: "/special-numbers", icon: "π", description: "Discover unique numbers", color: "from-blue-500/20 to-cyan-500/20" },
              { title: "Graphing Tool", path: "/graphing", icon: "📈", description: "Visualize mathematics", color: "from-emerald-500/20 to-teal-500/20" }
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className={`group cursor-pointer glass-card hover-lift p-8 bg-gradient-to-br ${item.color} border border-white/10 transition-all duration-500`}
                style={{ 
                  animation: `gentle-fade-in 0.8s ease-out ${0.6 + index * 0.1}s both` 
                }}
              >
                <div className="text-5xl mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-futuristic font-semibold text-white mb-3 group-hover:text-gradient-primary transition-all duration-300">
                  {item.title}
                </h3>
                <p className="font-space text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Fun Fact Section with minimal design */}
          <div className="text-center space-y-4" style={{ animation: 'gentle-fade-in 0.8s ease-out 1.2s both' }}>
            <div className="inline-block glass-card px-6 py-4 hover-lift border border-purple-500/20">
              <p className="font-space text-slate-300 text-sm font-light">
                💡 <strong className="font-medium">Secrets await:</strong> Try the Konami code, draw with your mouse, or explore deeply!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Minimalistic Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-20">
        <button
          onClick={() => navigate('/auth')}
          className="group glass-card hover-lift p-4 border border-purple-500/30 transition-all duration-500 animate-fluid-glow"
        >
          <BookOpen className="h-6 w-6 text-purple-300 group-hover:text-white transition-all duration-500 group-hover:rotate-12" />
        </button>
      </div>
    </div>
  );
};

export default Index;
