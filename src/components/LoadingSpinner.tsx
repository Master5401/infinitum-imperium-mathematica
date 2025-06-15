
export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center neural-network">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-24 h-24 border-4 border-electric-blue/30 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-6 h-6 bg-electric-blue rounded-full animate-pulse"></div>
        </div>
        
        {/* Inner ring */}
        <div className="absolute inset-2 w-16 h-16 border-4 border-neon-green/30 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}>
          <div className="absolute top-0 left-0 w-4 h-4 bg-neon-green rounded-full animate-pulse"></div>
        </div>
        
        {/* Center symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-electric-purple text-2xl font-futuristic animate-pulse">∞</span>
        </div>
        
        {/* Loading text */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <span className="text-neutral-white font-space text-sm animate-pulse">Loading...</span>
        </div>
      </div>
    </div>
  );
};
