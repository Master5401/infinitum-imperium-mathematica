
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Book, Star, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const courses = [
  {
    title: "Fundamentals of Sequences",
    description: "Learn the basics of mathematical sequences and their applications",
    duration: "4 weeks",
    difficulty: "Beginner",
    enrolled: 1234,
  },
  {
    title: "Advanced Pattern Recognition",
    description: "Master the art of identifying complex mathematical patterns",
    duration: "6 weeks",
    difficulty: "Advanced",
    enrolled: 856,
  },
  {
    title: "Number Theory Deep Dive",
    description: "Explore the fascinating world of number theory and its sequences",
    duration: "8 weeks",
    difficulty: "Intermediate",
    enrolled: 967,
  },
];

const Learn = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1A1F2C] math-bg py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6 text-purple-300 hover:text-purple-200"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-300">Learning Center</h1>
          <p className="text-purple-200 mt-2">Master the art of mathematical sequences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Card
              key={index}
              className="bg-[#2A2F3C] border-purple-900/30 hover:border-purple-500/50 transition-colors"
            >
              <CardHeader>
                <CardTitle className="text-xl text-purple-300">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200 mb-6">{course.description}</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-400">Duration</span>
                    <span className="text-purple-200">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-400">Difficulty</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-purple-400 mr-1" />
                      <span className="text-purple-200">{course.difficulty}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-400">Enrolled</span>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-purple-400 mr-1" />
                      <span className="text-purple-200">{course.enrolled}</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-purple-900 hover:bg-purple-800 text-purple-100">
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-[#2A2F3C] border-purple-900/30">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-purple-300 mb-2">
                  Ready for a Challenge?
                </h3>
                <p className="text-purple-200">
                  Test your knowledge with our daily mathematical puzzles
                </p>
              </div>
              <Button
                onClick={() => navigate("/daily-challenge")}
                className="bg-purple-900 hover:bg-purple-800 text-purple-100"
              >
                <Trophy className="h-5 w-5 mr-2" />
                Try Daily Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Learn;
