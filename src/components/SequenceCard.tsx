import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, MessageSquare, Code } from "lucide-react";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

interface SequenceCardProps {
  title: string;
  description: string;
  formula: string;
  author: string;
  votes: number;
  comments: number;
}

export const SequenceCard = ({
  title,
  description,
  formula,
  author,
  votes,
  comments,
}: SequenceCardProps) => {
  return (
    <Card className="sequence-card w-full max-w-2xl bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription>by {author}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          <div className="p-4 bg-gray-50 rounded-md overflow-x-auto">
            <BlockMath>{formula}</BlockMath>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <ArrowUp className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{votes}</span>
              <Button variant="ghost" size="sm">
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>{comments}</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Code className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};