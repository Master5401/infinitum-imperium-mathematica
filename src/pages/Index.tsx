
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { InteractiveCard } from "@/components/InteractiveCard";
import { MathEasterEgg } from "@/components/MathEasterEgg";

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
      
      {/* Easter Egg Component */}
      <MathEasterEgg />
      
      {/* Main Content */}
      <div className="relative z-10 container min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-4xl space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold font-cinzel bg-gradient-to-r from-red-400 via-amber-400 to-red-400 bg-clip-text text-transparent animate-shimmer leading-tight">
              Math Torcher
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Where mathematics meets <span className="text-amber-400 font-semibold">infinite possibilities</span>
            </p>
            
            {/* Animated mathematical formula */}
            <div className="text-lg text-red-300 font-mono animate-pulse">
              ∫₋∞^∞ f(knowledge) dx = ∞
            </div>
          </div>

          {/* Interactive Main Card */}
          <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <InteractiveCard
              {...cardData}
              onGetStarted={() => navigate('/auth')}
            />
          </div>

          {/* Quick Access Features */}
          <div className="grid md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {[
              { title: "Sequences", path: "/sequences", icon: "∑", description: "Explore mathematical sequences" },
              { title: "Special Numbers", path: "/special-numbers", icon: "π", description: "Discover unique numbers" },
              { title: "Graphing Tool", path: "/graphing", icon: "📈", description: "Visualize mathematics" }
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className="group cursor-pointer p-6 rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/20"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-red-300 mb-2 group-hover:text-red-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Fun Fact Section */}
          <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <div className="inline-block p-4 rounded-lg bg-gradient-to-r from-red-900/20 to-amber-900/20 border border-red-700/30">
              <p className="text-gray-300 text-sm">
                💡 <strong>Did you know?</strong> Try the Konami code (↑↑↓↓←→←→BA) for a mathematical surprise!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-20">
        <button
          onClick={() => navigate('/auth')}
          className="group bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white p-4 rounded-full shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-110 animate-bounce"
        >
          <BookOpen className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default Index;
