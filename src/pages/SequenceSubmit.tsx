
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-all"
            onClick={() => navigate("/library")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
          <Button
            variant="outline"
            className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 shadow-sm transition-all"
            onClick={() => window.open("https://en.wikipedia.org/wiki/List_of_mathematical_symbols", "_blank")}
          >
            <Code className="h-4 w-4 mr-2" />
            Symbol Reference
          </Button>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4 font-cinzel">
            Sequence Submission
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-sorts-mill">
            Contribute to our mathematical community by sharing your sequence discoveries with researchers and enthusiasts worldwide.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SequenceForm onSubmitSuccess={handleSubmitSuccess} />
          </div>
          <div className="space-y-8">
            <ExampleSequences />
            <SubmissionTips />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceSubmit;
