
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Easter Egg Components */}
      <MathEasterEgg />
      <SecretsEasterEgg />
      
      {/* Main Content */}
      <div className="relative z-10 container min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-4xl space-y-8">
          {/* Hero Section with refined animations */}
          <div className="text-center space-y-6" style={{ animation: 'gentle-fade-in 1.2s ease-out' }}>
            <h1 className="text-6xl md:text-8xl font-bold font-cinzel bg-gradient-to-r from-red-400 via-amber-400 to-red-400 bg-clip-text text-transparent leading-tight">
              Math Torcher
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed transition-all duration-700 hover:text-gray-200">
              Where mathematics meets <span className="text-amber-400 font-semibold">infinite possibilities</span>
            </p>
            
            {/* Refined mathematical formula */}
            <div className="text-lg text-red-300 font-mono" style={{ animation: 'gentle-pulse 4s ease-in-out infinite' }}>
              ∫₋∞^∞ f(knowledge) dx = ∞
            </div>
          </div>

          {/* Interactive Main Card */}
          <div style={{ animation: 'gentle-scale-in 1s ease-out 0.3s both' }}>
            <InteractiveCard
              {...cardData}
              onGetStarted={() => navigate('/auth')}
            />
          </div>

          {/* Quick Access Features with staggered animation */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Sequences", path: "/sequences", icon: "∑", description: "Explore mathematical sequences" },
              { title: "Special Numbers", path: "/special-numbers", icon: "π", description: "Discover unique numbers" },
              { title: "Graphing Tool", path: "/graphing", icon: "📈", description: "Visualize mathematics" }
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className="group cursor-pointer p-6 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/40 backdrop-blur-sm hover:border-red-500/30 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/10"
                style={{ 
                  animation: `gentle-fade-in 0.8s ease-out ${0.6 + index * 0.1}s both` 
                }}
              >
                <div className="text-4xl mb-3 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-red-300 mb-2 group-hover:text-red-200 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Fun Fact Section */}
          <div className="text-center space-y-4" style={{ animation: 'gentle-fade-in 0.8s ease-out 1.2s both' }}>
            <div className="inline-block p-4 rounded-lg bg-gradient-to-r from-red-900/15 to-amber-900/15 border border-red-700/20 backdrop-blur-sm">
              <p className="text-gray-300 text-sm">
                💡 <strong>Secrets await:</strong> Try the Konami code, draw with your mouse, or explore deeply!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Refined Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-20">
        <button
          onClick={() => navigate('/auth')}
          className="group bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white p-4 rounded-full shadow-xl hover:shadow-red-500/30 transition-all duration-500 transform hover:scale-105"
          style={{ animation: 'gentle-bounce 3s ease-in-out infinite' }}
        >
          <BookOpen className="h-6 w-6 group-hover:rotate-12 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
};

export default Index;
