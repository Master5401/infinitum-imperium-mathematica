
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Library = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1A1F2C] math-bg py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6 text-purple-300 hover:text-purple-200"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-300 mb-4">Mathematical Library</h1>
          <p className="text-purple-200">Content is dynamically generated based on user submissions and AI challenges.</p>
        </div>
      </div>
    </div>
  );
};

export default Library;
