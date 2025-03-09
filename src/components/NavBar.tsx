
import { Link } from "react-router-dom";
import { Home, BookOpen, Hash, Calculator, Sigma } from "lucide-react";
import { UserButton } from "@/components/auth/UserButton";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-red-700/30 bg-gradient-to-r from-gray-950 to-gray-900 backdrop-blur-md">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-8 flex items-center space-x-2">
            <span className="font-bold text-2xl font-cinzel bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
              MathTorcher
            </span>
          </Link>
          <nav className="flex items-center gap-8 text-sm">
            <Link to="/" className="transition-all duration-200 text-red-100/90 hover:text-red-400 flex items-center gap-1 group">
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Home</span>
            </Link>
            <Link to="/daily-challenge" className="transition-all duration-200 text-red-100/90 hover:text-red-400 flex items-center gap-1 group">
              <Calculator className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Daily Challenge</span>
            </Link>
            <Link to="/library" className="transition-all duration-200 text-red-100/90 hover:text-red-400 flex items-center gap-1 group">
              <BookOpen className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Library</span>
            </Link>
            <Link to="/sequences" className="transition-all duration-200 text-red-100/90 hover:text-red-400 flex items-center gap-1 group">
              <Sigma className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Sequences</span>
            </Link>
            <Link to="/special-numbers" className="transition-all duration-200 text-red-100/90 hover:text-red-400 flex items-center gap-1 group">
              <Hash className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Special Numbers</span>
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
