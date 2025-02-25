
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Loader2, Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import 'katex/dist/katex.min.css';
import katex from 'katex';

export const LatexConverter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = async () => {
    setIsConverting(true);
    try {
      // Simulated AI conversion - In production, this would call an AI service
      // This is a basic example that converts some common mathematical phrases
      const convertedText = input
        .replace(/square root of/g, '\\sqrt{')
        .replace(/squared/g, '^2')
        .replace(/cubed/g, '^3')
        .replace(/infinity/g, '\\infty')
        .replace(/sum of/g, '\\sum')
        .replace(/integral of/g, '\\int')
        .replace(/pi/g, '\\pi')
        .replace(/theta/g, '\\theta')
        .replace(/alpha/g, '\\alpha')
        .replace(/beta/g, '\\beta')
        .replace(/delta/g, '\\delta');

      setTimeout(() => {
        setOutput(convertedText);
        setIsConverting(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Conversion Error",
        description: "Failed to convert text to LaTeX. Please try again.",
        variant: "destructive",
      });
      setIsConverting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "LaTeX formula copied to clipboard",
      className: "bg-purple-900 text-purple-100",
    });
  };

  return (
    <div className="w-full max-w-2xl bg-[#2A2F3C] p-6 rounded-lg border border-purple-900/30 shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-xl text-purple-300 mb-2">Mathematical Oracle</h2>
        <p className="text-gray-400">Transform your words into sacred mathematical notation</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-purple-300">
            Enter your text
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 'the square root of x squared plus y squared'"
            className="bg-[#1A1F2C] border-purple-900/30 text-purple-100 placeholder:text-purple-900/50 min-h-[100px]"
          />
        </div>
        <Button
          onClick={handleConvert}
          className="w-full bg-purple-900 hover:bg-purple-800 text-purple-100"
          disabled={isConverting || !input}
        >
          {isConverting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Transmuting...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Convert to LaTeX
            </>
          )}
        </Button>
        {output && (
          <div className="mt-4 space-y-2">
            <label className="block text-sm font-medium text-purple-300">
              LaTeX Formula
            </label>
            <div className="p-4 bg-[#1A1F2C] rounded-md overflow-x-auto border border-purple-900/20 font-mono text-purple-200 relative group">
              {output}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Preview
              </label>
              <div className="p-4 bg-[#1A1F2C] rounded-md border border-purple-900/20 flex items-center justify-center min-h-[60px]">
                <div
                  dangerouslySetInnerHTML={{
                    __html: katex.renderToString(output, { throwOnError: false }),
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
