
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LightbulbIcon } from "lucide-react";

export const SubmissionTips = () => {
  return (
    <Card className="border-blue-200 bg-white/80 dark:border-slate-600 dark:bg-slate-800/80 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-blue-500" />
          Submission Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="text-sm text-slate-700 dark:text-slate-300 rounded-lg p-4 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors border border-blue-100 dark:border-slate-600">
          <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Clear Description
          </p>
          <p>Provide a concise but informative description of your sequence and its mathematical significance.</p>
        </div>
        <div className="text-sm text-slate-700 dark:text-slate-300 rounded-lg p-4 hover:bg-cyan-50 dark:hover:bg-slate-700/50 transition-colors border border-cyan-100 dark:border-slate-600">
          <p className="font-semibold text-cyan-700 dark:text-cyan-400 mb-2 flex items-center">
            <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
            Accurate Formula
          </p>
          <p>Use standard mathematical notation or specify recurrence relations clearly and precisely.</p>
        </div>
        <div className="text-sm text-slate-700 dark:text-slate-300 rounded-lg p-4 hover:bg-indigo-50 dark:hover:bg-slate-700/50 transition-colors border border-indigo-100 dark:border-slate-600">
          <p className="font-semibold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            Include Context
          </p>
          <p>Mention where the sequence appears in mathematics or real-world applications to help others understand its importance.</p>
        </div>
      </CardContent>
    </Card>
  );
};
