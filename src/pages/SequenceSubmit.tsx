
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code } from "lucide-react";
import { SequenceForm } from "@/components/sequence-submit/SequenceForm";
import { ExampleSequences } from "@/components/sequence-submit/ExampleSequences";
import { SubmissionTips } from "@/components/sequence-submit/SubmissionTips";

const SequenceSubmit = () => {
  const navigate = useNavigate();

  const handleSubmitSuccess = () => {
    navigate("/library");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950/60 via-gray-900 to-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            className="text-red-300 hover:text-red-200"
            onClick={() => navigate("/library")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-red-700/40 bg-red-900/30 text-red-300 hover:bg-red-900/40 hover:text-red-200"
              onClick={() => window.open("https://en.wikipedia.org/wiki/List_of_mathematical_symbols", "_blank")}
            >
              <Code className="h-4 w-4 mr-2" />
              Symbol Reference
            </Button>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-red-300 mb-2 font-cinzel">Sequence Submission</h1>
          <p className="text-red-200/90 max-w-2xl mx-auto font-sorts-mill">
            Add your mathematical sequences to our growing collection for others to discover and explore.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <SequenceForm onSubmitSuccess={handleSubmitSuccess} />
          <div className="space-y-6">
            <ExampleSequences />
            <SubmissionTips />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceSubmit;
