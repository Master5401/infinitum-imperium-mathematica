
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
import { BookOpen, ChevronRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Math Torcher - Home";
  }, []);

  return (
    <div className="container min-h-[calc(100vh-3.5rem)] flex items-center justify-center py-12">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Explore Mathematical Concepts
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Discover the fascinating world of mathematics through interactive tools and resources.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              What is Math Torcher?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Math Torcher is an interactive platform designed to help you learn,
              practice, and master various mathematical concepts. Whether you're a
              student, a teacher, or simply a math enthusiast, our platform offers
              a wide range of resources to enhance your mathematical skills.
            </p>
          </div>

          <div className="grid gap-4">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Key Features
            </h3>
            <ul className="grid gap-3">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 p-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </span>
                <div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">Daily Challenges:</span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">Test your skills with new problems every day.</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 p-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </span>
                <div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">Comprehensive Library:</span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">Access a vast collection of mathematical topics and sequences.</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 p-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </span>
                <div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">Interactive Graphing:</span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">Visualize functions and equations with our powerful graphing tool.</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 p-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </span>
                <div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">Personalized Learning:</span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">Track your progress and tailor your learning experience.</span>
                </div>
              </li>
            </ul>
          </div>
        </CardContent>
        <div className="flex items-center justify-center p-6 pt-0">
          <Button 
            onClick={() => navigate('/auth')} 
            className="px-6 py-2 text-base font-medium bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2">
            Get Started
            <BookOpen className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Index;
