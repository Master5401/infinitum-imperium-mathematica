
import { SecurityDashboard } from "@/components/SecurityDashboard";

const Security = () => {
  return (
    <div className="min-h-screen bg-gray-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-gray-900 to-gray-950 p-4">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-500 mb-4">Security Center</h1>
          <p className="text-amber-100/70 text-lg max-w-2xl mx-auto">
            Monitor and manage the security of your Math Torcher experience. 
            View real-time security alerts, protection status, and security configurations.
          </p>
        </div>
        <SecurityDashboard />
      </div>
    </div>
  );
};

export default Security;
