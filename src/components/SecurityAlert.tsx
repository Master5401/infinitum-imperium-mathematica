
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Shield, X } from "lucide-react";

interface SecurityAlertProps {
  id: string;
  type: 'xss_attempt' | 'rate_limit' | 'suspicious_activity' | 'session_expired';
  message: string;
  timestamp: number;
  onDismiss: (id: string) => void;
}

export const SecurityAlert = ({ id, type, message, timestamp, onDismiss }: SecurityAlertProps) => {
  const getAlertColor = () => {
    switch (type) {
      case 'xss_attempt':
      case 'session_expired':
        return 'border-red-500 bg-red-950/50';
      case 'suspicious_activity':
        return 'border-orange-500 bg-orange-950/50';
      case 'rate_limit':
        return 'border-yellow-500 bg-yellow-950/50';
      default:
        return 'border-amber-500 bg-amber-950/50';
    }
  };

  return (
    <Alert className={`${getAlertColor()} text-amber-100 mb-2`}>
      <Shield className="h-4 w-4" />
      <AlertDescription className="flex justify-between items-center">
        <div>
          <strong>Security Alert:</strong> {message}
          <div className="text-xs text-amber-300 mt-1">
            {new Date(timestamp).toLocaleTimeString()}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDismiss(id)}
          className="text-amber-300 hover:text-amber-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
