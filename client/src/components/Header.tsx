import { Button } from "@/components/ui/button";
import { APP_TITLE } from "@/const";
import { useTheme } from "@/contexts/ThemeContext";
import { BookOpen, Home, Moon, Settings, Sun } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-card-foreground">{APP_TITLE}</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <Link href="/catalog">
              <Button 
                variant={location.startsWith("/catalog") || location.startsWith("/course") ? "default" : "ghost"}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Courses
              </Button>
            </Link>
            <Link href="/admin">
              <Button 
                variant={location === "/admin" ? "default" : "ghost"}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Mobile menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <Link href="/">
                    <DropdownMenuItem>
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/catalog">
                    <DropdownMenuItem>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Courses
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/admin">
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
