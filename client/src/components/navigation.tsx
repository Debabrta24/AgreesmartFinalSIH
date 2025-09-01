import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Leaf, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useLanguage } from "./language-provider";
import { useIsMobile } from "@/hooks/use-mobile";

const languages = [
  { code: "en", name: "🇺🇸 EN" },
  { code: "hi", name: "🇮🇳 हिंदी" },
  { code: "bn", name: "🇧🇩 বাংলা" },
  { code: "ta", name: "🇮🇳 தமிழ்" },
];

interface NavigationProps {
  user?: any;
}

export function Navigation({ user }: NavigationProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [location] = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { path: "/", label: t("nav.home") },
    { path: "/project-idea", label: t("nav.project") },
    { path: "/about", label: t("nav.about") },
    { path: "/tools", label: t("nav.tools") },
  ];

  const NavItems = ({ className = "", onItemClick }: { className?: string; onItemClick?: () => void }) => (
    <div className={`flex space-x-6 ${className}`}>
      {navItems.map((item) => (
        <Link key={item.path} href={item.path}>
          <button
            className={`text-muted-foreground hover:text-primary transition-colors ${
              location === item.path ? "text-primary font-medium" : ""
            }`}
            onClick={onItemClick}
            data-testid={`nav-link-${item.path.replace("/", "") || "home"}`}
          >
            {item.label}
          </button>
        </Link>
      ))}
    </div>
  );

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer" data-testid="logo">
                <Leaf className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold text-card-foreground">AgreeGrow</span>
              </div>
            </Link>
            {!isMobile && <NavItems />}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-auto border-0 bg-transparent" data-testid="language-selector">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              data-testid="theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile Menu */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="mobile-menu-trigger">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col space-y-4 mt-6">
                    <NavItems 
                      className="flex-col space-x-0 space-y-4" 
                      onItemClick={() => {
                        // Close sheet after navigation
                        document.body.click();
                      }}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
