
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';
import { SecurityAlert } from './SecurityAlert';
import { Shield, Eye, EyeOff, AlertTriangle, Lock } from "lucide-react";
import { getSecurityHeaders } from '@/utils/security';

export const SecurityDashboard = () => {
  const { alerts, dismissAlert, clearAllAlerts, isMonitoring, setIsMonitoring } = useSecurityMonitor();
  const [showHeaders, setShowHeaders] = useState(false);

  const securityHeaders = getSecurityHeaders();

  const getSecurityScore = () => {
    let score = 100;
    score -= alerts.filter(a => a.type === 'xss_attempt').length * 20;
    score -= alerts.filter(a => a.type === 'suspicious_activity').length * 10;
    score -= alerts.filter(a => a.type === 'rate_limit').length * 5;
    return Math.max(0, score);
  };

  const score = getSecurityScore();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card className="border-amber-700/30 bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-500">
            <Shield className="h-6 w-6 mr-2" />
            Security Dashboard
          </CardTitle>
          <CardDescription className="text-amber-100/70">
            Monitor and manage website security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                {score}%
              </div>
              <div className="text-amber-100/70 text-sm">Security Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500">
                {alerts.length}
              </div>
              <div className="text-amber-100/70 text-sm">Active Alerts</div>
            </div>
            <div className="text-center">
              <Badge variant={isMonitoring ? "default" : "secondary"} className="text-lg px-4 py-2">
                {isMonitoring ? "Monitoring" : "Paused"}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => setIsMonitoring(!isMonitoring)}
              variant={isMonitoring ? "destructive" : "default"}
              className="flex items-center"
            >
              {isMonitoring ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {isMonitoring ? "Pause Monitoring" : "Start Monitoring"}
            </Button>
            {alerts.length > 0 && (
              <Button onClick={clearAllAlerts} variant="outline">
                Clear All Alerts
              </Button>
            )}
          </div>

          <Tabs defaultValue="alerts" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
              <TabsTrigger value="headers">Security Headers</TabsTrigger>
              <TabsTrigger value="protection">Protection Status</TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="space-y-4">
              {alerts.length === 0 ? (
                <Card className="border-green-700/30 bg-green-950/20">
                  <CardContent className="pt-6">
                    <div className="text-center text-green-400">
                      <Shield className="h-12 w-12 mx-auto mb-2" />
                      <p>No security alerts. System is secure.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                alerts.map((alert) => (
                  <SecurityAlert
                    key={alert.id}
                    {...alert}
                    onDismiss={dismissAlert}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="headers" className="space-y-4">
              <Card className="border-amber-700/30 bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-amber-500">Security Headers Configuration</CardTitle>
                  <CardDescription>Currently applied security headers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(securityHeaders).map(([header, value]) => (
                      <div key={header} className="border border-amber-700/20 rounded p-2">
                        <div className="font-mono text-sm text-amber-500">{header}:</div>
                        <div className="font-mono text-xs text-amber-100/70 break-all">{value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="protection" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-green-700/30 bg-green-950/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center text-green-400 mb-2">
                      <Shield className="h-5 w-5 mr-2" />
                      <span className="font-semibold">XSS Protection</span>
                    </div>
                    <p className="text-sm text-green-300">Active input sanitization and content filtering</p>
                  </CardContent>
                </Card>

                <Card className="border-green-700/30 bg-green-950/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center text-green-400 mb-2">
                      <Lock className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Authentication</span>
                    </div>
                    <p className="text-sm text-green-300">Supabase secure authentication with RLS</p>
                  </CardContent>
                </Card>

                <Card className="border-green-700/30 bg-green-950/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center text-green-400 mb-2">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Rate Limiting</span>
                    </div>
                    <p className="text-sm text-green-300">Active rate limiting for API endpoints</p>
                  </CardContent>
                </Card>

                <Card className="border-green-700/30 bg-green-950/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center text-green-400 mb-2">
                      <Eye className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Real-time Monitoring</span>
                    </div>
                    <p className="text-sm text-green-300">Continuous threat detection and alerting</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
