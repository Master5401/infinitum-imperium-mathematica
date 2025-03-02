
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ActionButtons: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      className="mb-6 text-amber-300 hover:text-amber-200 transition-all duration-300"
      onClick={() => navigate("/")}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Home
    </Button>
  );
};

export default ActionButtons;
