
import { useEffect, useState } from 'react';
import { logSecurityEvent } from '@/utils/security';

interface SecurityAlert {
  id: string;
  type: 'xss_attempt' | 'rate_limit' | 'suspicious_activity' | 'session_expired';
  message: string;
  timestamp: number;
}

export const useSecurityMonitor = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    if (!isMonitoring) return;

    // Monitor for suspicious patterns in URL
    const checkURL = () => {
      const url = window.location.href;
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+=/i,
        /eval\(/i,
        /union.*select/i
      ];

      if (suspiciousPatterns.some(pattern => pattern.test(url))) {
        const alert: SecurityAlert = {
          id: Date.now().toString(),
          type: 'xss_attempt',
          message: 'Suspicious content detected in URL',
          timestamp: Date.now()
        };
        setAlerts(prev => [...prev, alert]);
        logSecurityEvent('XSS_ATTEMPT', { url });
      }
    };

    // Monitor for rapid navigation (potential bot behavior)
    let navigationCount = 0;
    const navigationTimer = setInterval(() => {
      navigationCount = 0;
    }, 60000); // Reset every minute

    const handleNavigation = () => {
      navigationCount++;
      if (navigationCount > 30) { // More than 30 navigations per minute
        const alert: SecurityAlert = {
          id: Date.now().toString(),
          type: 'suspicious_activity',
          message: 'Rapid navigation detected',
          timestamp: Date.now()
        };
        setAlerts(prev => [...prev, alert]);
        logSecurityEvent('RAPID_NAVIGATION', { count: navigationCount });
      }
    };

    // Monitor console access (potential debugging attempt)
    const originalConsole = console.log;
    console.log = (...args) => {
      if (args.some(arg => typeof arg === 'string' && arg.includes('auth'))) {
        logSecurityEvent('CONSOLE_AUTH_ACCESS', { args });
      }
      originalConsole.apply(console, args);
    };

    // Monitor for dev tools
    let devtools = { open: false };
    const threshold = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          logSecurityEvent('DEVTOOLS_OPENED', {});
        }
      } else {
        devtools.open = false;
      }
    }, 500);

    checkURL();
    window.addEventListener('beforeunload', handleNavigation);

    return () => {
      clearInterval(navigationTimer);
      window.removeEventListener('beforeunload', handleNavigation);
      console.log = originalConsole;
    };
  }, [isMonitoring]);

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  return {
    alerts,
    dismissAlert,
    clearAllAlerts,
    isMonitoring,
    setIsMonitoring
  };
};
