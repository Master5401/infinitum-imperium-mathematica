
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
            onClick={() => navigate("/library")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-gray-300 bg-white/80 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700/80"
              onClick={() => window.open("https://en.wikipedia.org/wiki/List_of_mathematical_symbols", "_blank")}
            >
              <Code className="h-4 w-4 mr-2" />
              Symbol Reference
            </Button>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 font-cinzel">Sequence Submission</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-sorts-mill">
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
