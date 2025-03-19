
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LightbulbIcon } from "lucide-react";

export const SubmissionTips = () => {
  return (
    <Card className="border-red-600/30 bg-gradient-to-b from-gray-900 to-gray-950 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-red-300 flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-red-400" />
          Submission Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="text-sm text-red-200/90 rounded-md p-2 hover:bg-red-950/30 transition-colors">
          <p className="font-medium text-red-300 mb-1">📌 Clear Description</p>
          <p>Provide a concise but informative description of your sequence.</p>
        </div>
        <div className="text-sm text-red-200/90 rounded-md p-2 hover:bg-red-950/30 transition-colors">
          <p className="font-medium text-red-300 mb-1">📌 Accurate Formula</p>
          <p>Use standard mathematical notation or specify recurrence relations clearly.</p>
        </div>
        <div className="text-sm text-red-200/90 rounded-md p-2 hover:bg-red-950/30 transition-colors">
          <p className="font-medium text-red-300 mb-1">📌 Include Context</p>
          <p>Mention where the sequence appears in mathematics or real-world applications.</p>
        </div>
      </CardContent>
    </Card>
  );
};
