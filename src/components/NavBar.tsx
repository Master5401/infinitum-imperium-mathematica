
import { Link } from "react-router-dom";
import { Home, BookOpen, PenTool, Compass, Hash } from "lucide-react";
import { UserButton } from "@/components/auth/UserButton";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-700/30 bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-amber-500">Math Torcher</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/" className="transition-colors hover:text-amber-400 text-amber-100/90 flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link to="/daily-challenge" className="transition-colors hover:text-amber-400 text-amber-100/90 flex items-center gap-1">
              <Compass className="h-4 w-4" />
              <span>Daily Challenge</span>
            </Link>
            <Link to="/library" className="transition-colors hover:text-amber-400 text-amber-100/90 flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>Library</span>
            </Link>
            <Link to="/special-numbers" className="transition-colors hover:text-amber-400 text-amber-100/90 flex items-center gap-1">
              <Hash className="h-4 w-4" />
              <span>Special Numbers</span>
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
