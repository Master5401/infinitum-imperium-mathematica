
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Math Torcher - Home";
  }, []);

  return (
    <div className="container math-pattern min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-gray-900 to-gray-950 border-amber-700/20">
        <CardHeader className="space-y-2.5">
          <CardTitle className="text-3xl font-bold text-amber-500 animate-shimmer">
            Unleash Your Mathematical Potential
          </CardTitle>
          <CardDescription className="text-amber-200/80">
            Ignite your passion for numbers and explore the fascinating world of
            mathematics.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <h3 className="scroll-m-20 border-b pb-2 text-3xl tracking-tight first:mt-0 font-semibold text-amber-400">
              What is Math Torcher?
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-2 text-amber-100/70">
              Math Torcher is an interactive platform designed to help you learn,
              practice, and master various mathematical concepts. Whether you're a
              student, a teacher, or simply a math enthusiast, our platform offers
              a wide range of resources to enhance your mathematical skills.
            </p>
          </div>

          <div className="grid gap-2">
            <h3 className="scroll-m-20 border-b pb-2 text-3xl tracking-tight first:mt-0 font-semibold text-amber-400">
              Key Features
            </h3>
            <ul className="list-disc pl-5 [&:not(:first-child)]:mt-2 text-amber-100/70">
              <li>
                <span className="font-bold text-amber-300">Daily Challenges:</span>{" "}
                Test your skills with new problems every day.
              </li>
              <li>
                <span className="font-bold text-amber-300">Comprehensive Library:</span>{" "}
                Access a vast collection of mathematical topics and sequences.
              </li>
              <li>
                <span className="font-bold text-amber-300">Interactive Graphing:</span>{" "}
                Visualize functions and equations with our powerful graphing tool.
              </li>
              <li>
                <span className="font-bold text-amber-300">Personalized Learning:</span>{" "}
                Track your progress and tailor your learning experience.
              </li>
            </ul>
          </div>

          <div className="grid gap-2">
            <h3 className="scroll-m-20 border-b pb-2 text-3xl tracking-tight first:mt-0 font-semibold text-amber-400">
              Get Started Today
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-2 text-amber-100/70">
              Ready to dive in? Sign up now and start your mathematical journey
              with Math Torcher!
            </p>
          </div>
        </CardContent>
        <div className="flex items-center justify-center p-6">
          <Button 
            onClick={() => navigate('/auth')} 
            className="px-8 py-6 text-lg font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl hover:translate-y-[-2px] transition-transform">
            Get Started
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Index;
