
import { useEffect, useState } from 'react';
import { sanitizeInput, sanitizeFormula, rateLimiter, logSecurityEvent } from '@/utils/security';

interface SecureFormWrapperProps {
  children: React.ReactNode;
  onSubmit: (data: any) => void;
  rateLimitKey: string;
  maxAttempts?: number;
}

export const SecureFormWrapper = ({ 
  children, 
  onSubmit, 
  rateLimitKey, 
  maxAttempts = 5 
}: SecureFormWrapperProps) => {
  const [isBlocked, setIsBlocked] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Rate limiting
    if (!rateLimiter.isAllowed(rateLimitKey, maxAttempts)) {
      setIsBlocked(true);
      logSecurityEvent('FORM_RATE_LIMITED', { key: rateLimitKey });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const sanitizedData: any = {};

    // Sanitize all form inputs
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        if (key.includes('formula') || key.includes('equation')) {
          sanitizedData[key] = sanitizeFormula(value);
        } else {
          sanitizedData[key] = sanitizeInput(value);
        }
      } else {
        sanitizedData[key] = value;
      }
    }

    onSubmit(sanitizedData);
  };

  useEffect(() => {
    if (isBlocked) {
      const timer = setTimeout(() => setIsBlocked(false), 60000); // Unblock after 1 minute
      return () => clearTimeout(timer);
    }
  }, [isBlocked]);

  if (isBlocked) {
    return (
      <div className="p-4 border border-red-700/30 bg-red-950/20 rounded text-red-400 text-center">
        Form submission temporarily blocked due to too many attempts. Please wait.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {children}
    </form>
  );
};
