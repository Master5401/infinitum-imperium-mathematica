
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface SecurityEvent {
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Security patterns to detect
const SECURITY_PATTERNS = {
  xss: [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+=/gi,
    /eval\(/gi,
    /Function\(/gi
  ],
  sqli: [
    /union.*select/gi,
    /drop.*table/gi,
    /delete.*from/gi,
    /insert.*into/gi,
    /update.*set/gi
  ],
  suspicious: [
    /\.\.\//g, // Path traversal
    /\/etc\/passwd/gi,
    /\/proc\//gi,
    /cmd\.exe/gi,
    /powershell/gi
  ]
};

function detectThreats(input: string): { threat: string; severity: SecurityEvent['severity'] }[] {
  const threats: { threat: string; severity: SecurityEvent['severity'] }[] = [];
  
  // Check for XSS
  for (const pattern of SECURITY_PATTERNS.xss) {
    if (pattern.test(input)) {
      threats.push({ threat: 'XSS attempt detected', severity: 'high' });
    }
  }
  
  // Check for SQL injection
  for (const pattern of SECURITY_PATTERNS.sqli) {
    if (pattern.test(input)) {
      threats.push({ threat: 'SQL injection attempt detected', severity: 'critical' });
    }
  }
  
  // Check for suspicious patterns
  for (const pattern of SECURITY_PATTERNS.suspicious) {
    if (pattern.test(input)) {
      threats.push({ threat: 'Suspicious activity detected', severity: 'medium' });
    }
  }
  
  return threats;
}

async function logSecurityEvent(event: SecurityEvent) {
  try {
    // In a real implementation, you'd store this in a security_logs table
    console.log('[SECURITY EVENT]', JSON.stringify(event, null, 2));
    
    // Send alert for high/critical severity events
    if (event.severity === 'high' || event.severity === 'critical') {
      // Here you could send notifications to security team
      console.warn('[CRITICAL SECURITY ALERT]', event);
    }
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { event_type, details, user_input } = await req.json();
    
    const userAgent = req.headers.get('user-agent') || '';
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    
    // Analyze user input for threats
    let threats: { threat: string; severity: SecurityEvent['severity'] }[] = [];
    if (user_input) {
      threats = detectThreats(user_input);
    }
    
    // Log security events
    for (const threat of threats) {
      const securityEvent: SecurityEvent = {
        event_type: `${event_type}_${threat.threat.toLowerCase().replace(/\s+/g, '_')}`,
        severity: threat.severity,
        details: {
          ...details,
          threat_description: threat.threat,
          user_input: user_input?.substring(0, 1000) // Limit logged input
        },
        ip_address: ipAddress,
        user_agent: userAgent,
        timestamp: new Date().toISOString()
      };
      
      await logSecurityEvent(securityEvent);
    }
    
    // Rate limiting check (simplified)
    const rateLimitKey = `${ipAddress}-${event_type}`;
    
    return new Response(
      JSON.stringify({ 
        success: true,
        threats_detected: threats.length,
        severity: threats.length > 0 ? Math.max(...threats.map(t => 
          t.severity === 'critical' ? 4 : 
          t.severity === 'high' ? 3 : 
          t.severity === 'medium' ? 2 : 1
        )) : 0
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Security monitor error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
