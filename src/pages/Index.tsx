
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { EnhancedBackground } from "@/components/EnhancedBackground";
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced Animated Background */}
      <EnhancedBackground />
      
      {/* Easter Egg Components */}
      <MathEasterEgg />
      <SecretsEasterEgg />
      
      {/* Main Content with enhanced animations */}
      <div className="relative z-10 container min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-5xl space-y-12">
          {/* Hero Section with enhanced entrance animation */}
          <div 
            className="text-center space-y-8 animate-[gentle-fade-in_1.5s_ease-out]"
          >
            <h1 className="text-6xl md:text-8xl font-futuristic font-bold text-gradient-primary leading-tight tracking-tight">
              <span className="inline-block animate-[neon-pulse_3s_ease-in-out_infinite]">Math</span>{" "}
              <span className="inline-block animate-[neon-pulse_3s_ease-in-out_infinite_0.5s]">Torcher</span>
            </h1>
            <p className="text-xl md:text-2xl font-space text-neutral-white max-w-3xl mx-auto leading-relaxed font-light animate-[gentle-fade-in_1s_ease-out_0.5s_both]">
              Where mathematics meets <span className="text-gradient-accent font-medium">infinite possibilities</span>
            </p>
            
            {/* Mathematical formula with enhanced styling */}
            <div className="inline-block glass-card px-8 py-4 hover-lift border-2 border-electric-blue/40 animate-[gentle-fade-in_1s_ease-out_0.8s_both]">
              <div className="text-lg font-mono text-electric-blue animate-[electric-glow_4s_ease-in-out_infinite]">
                ∫₋∞^∞ f(knowledge) dx = ∞
              </div>
            </div>
          </div>

          {/* Interactive Main Card with staggered animation */}
          <div className="animate-[gentle-fade-in_1s_ease-out_1s_both]">
            <div className="glass-card hover-lift p-8 border-2 border-electric-blue/30 transition-all duration-700 hover:border-electric-blue/60 hover:shadow-2xl hover:shadow-electric-blue/20">
              <InteractiveCard
                {...cardData}
                onGetStarted={() => navigate('/auth')}
              />
            </div>
          </div>

          {/* Quick Access Features with enhanced staggered animations */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Sequences", path: "/sequences", icon: "∑", description: "Explore mathematical sequences", gradient: "from-electric-blue/30 to-electric-purple/30", border: "border-electric-blue/50" },
              { title: "Special Numbers", path: "/special-numbers", icon: "π", description: "Discover unique numbers", gradient: "from-neon-green/30 to-electric-teal/30", border: "border-neon-green/50" },
              { title: "Graphing Tool", path: "/graphing", icon: "📈", description: "Visualize mathematics", gradient: "from-neon-pink/30 to-neon-orange/30", border: "border-neon-pink/50" }
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className={`group cursor-pointer glass-card hover-lift p-8 bg-gradient-to-br ${item.gradient} border-2 ${item.border} transition-all duration-700 hover:scale-105 hover:shadow-xl`}
                style={{ 
                  animation: `gentle-fade-in 0.8s ease-out ${1.2 + index * 0.2}s both` 
                }}
              >
                <div className="text-5xl mb-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:drop-shadow-lg">
                  {item.icon}
                </div>
                <h3 className="text-xl font-futuristic font-semibold text-neutral-white mb-3 group-hover:text-gradient-primary transition-all duration-500">
                  {item.title}
                </h3>
                <p className="font-space text-neutral-light text-sm group-hover:text-neutral-white transition-all duration-500 leading-relaxed">
                  {item.description}
                </p>
                
                {/* Enhanced hover effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Fun Fact Section */}
          <div className="text-center space-y-4 animate-[gentle-fade-in_0.8s_ease-out_2s_both]">
            <div className="inline-block glass-card px-8 py-6 hover-lift border-2 border-electric-purple/40 transition-all duration-500 hover:border-electric-purple/80 hover:shadow-lg hover:shadow-electric-purple/30">
              <p className="font-space text-neutral-white text-sm font-light">
                💡 <strong className="font-medium text-electric-cyan animate-pulse">Secrets await:</strong> Try the Konami code, draw with your mouse, or explore deeply!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-20">
        <button
          onClick={() => navigate('/auth')}
          className="group glass-card hover-lift p-5 border-2 border-electric-blue/50 transition-all duration-500 hover:border-electric-blue/80 hover:shadow-xl hover:shadow-electric-blue/30 animate-[gentle-float_6s_ease-in-out_infinite]"
        >
          <BookOpen className="h-7 w-7 text-electric-blue group-hover:text-neon-green transition-all duration-500 group-hover:rotate-12 group-hover:scale-110" />
        </button>
      </div>
    </div>
  );
};

export default Index;
