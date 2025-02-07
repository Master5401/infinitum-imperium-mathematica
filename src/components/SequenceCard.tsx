import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, MessageSquare, Code, Sparkles } from "lucide-react";
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
    <Card className="sequence-card w-full max-w-2xl bg-[#2A2F3C] border-purple-900/30 shadow-xl hover:shadow-purple-900/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-purple-300">{title}</CardTitle>
            <CardDescription className="text-gray-400">by {author}</CardDescription>
          </div>
          <Sparkles className="h-5 w-5 text-purple-400/40" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-gray-300 mb-4">{description}</p>
          <div className="p-4 bg-[#1A1F2C] rounded-md overflow-x-auto border border-purple-900/20">
            <BlockMath>{formula}</BlockMath>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20">
                <ArrowUp className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-purple-300">{votes}</span>
              <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20">
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>{comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20">
              <Code className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};