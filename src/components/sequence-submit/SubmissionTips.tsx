
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SubmissionTips = () => {
  return (
    <Card className="border-red-600/20 bg-gradient-to-b from-gray-900/90 to-gray-950 shadow-lg shadow-red-900/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-red-300">Submission Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-red-200/80">
          <p className="font-medium text-red-300 mb-1">📌 Clear Description</p>
          <p>Provide a concise but informative description of your sequence.</p>
        </div>
        <div className="text-sm text-red-200/80">
          <p className="font-medium text-red-300 mb-1">📌 Accurate Formula</p>
          <p>Use standard mathematical notation or specify recurrence relations clearly.</p>
        </div>
        <div className="text-sm text-red-200/80">
          <p className="font-medium text-red-300 mb-1">📌 Include Context</p>
          <p>Mention where the sequence appears in mathematics or real-world applications.</p>
        </div>
      </CardContent>
    </Card>
  );
};
