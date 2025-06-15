
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen">
      {/* Transition overlay */}
      <div 
        className={`fixed inset-0 z-50 pointer-events-none transition-all duration-300 ${
          isTransitioning 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-105'
        }`}
        style={{
          background: 'linear-gradient(45deg, rgba(0, 212, 255, 0.1), rgba(139, 92, 246, 0.1), rgba(57, 255, 20, 0.1))',
          backdropFilter: 'blur(10px)'
        }}
      />
      
      {/* Page content */}
      <div 
        className={`transition-all duration-500 ease-out ${
          isTransitioning 
            ? 'opacity-0 transform translate-y-4 scale-95' 
            : 'opacity-100 transform translate-y-0 scale-100'
        }`}
      >
        {displayChildren}
      </div>
    </div>
  );
};
