
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LightbulbIcon } from "lucide-react";

export const SubmissionTips = () => {
  return (
    <Card className="border-gray-600/30 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          Submission Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="text-sm text-gray-700 dark:text-gray-300 rounded-md p-2 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors">
          <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">📌 Clear Description</p>
          <p>Provide a concise but informative description of your sequence.</p>
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300 rounded-md p-2 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors">
          <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">📌 Accurate Formula</p>
          <p>Use standard mathematical notation or specify recurrence relations clearly.</p>
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300 rounded-md p-2 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors">
          <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">📌 Include Context</p>
          <p>Mention where the sequence appears in mathematics or real-world applications.</p>
        </div>
      </CardContent>
    </Card>
  );
};
