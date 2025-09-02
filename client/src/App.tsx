import { Switch, Route } from "wouter";
import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { Navigation } from "@/components/navigation";
import { LoginModal } from "@/components/login-modal";
import { LanguageModal } from "@/components/language-modal";
import Home from "@/pages/home";
import CropDoctor from "@/pages/crop-doctor";
import PriceTracker from "@/pages/price-tracker";
import WeatherShield from "@/pages/weather-shield";
import IoTDashboard from "@/pages/iot-dashboard";
import ProfitCalculator from "@/pages/profit-calculator";
import CropAdvisor from "@/pages/crop-advisor";
import About from "@/pages/about";
import ProjectIdea from "@/pages/project-idea";
import Community from "@/pages/community";
import Medicine from "@/pages/medicine";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/crop-doctor" component={CropDoctor} />
      <Route path="/price-tracker" component={PriceTracker} />
      <Route path="/weather-shield" component={WeatherShield} />
      <Route path="/iot-dashboard" component={IoTDashboard} />
      <Route path="/profit-calculator" component={ProfitCalculator} />
      <Route path="/crop-advisor" component={CropAdvisor} />
      <Route path="/about" component={About} />
      <Route path="/project-idea" component={ProjectIdea} />
      <Route path="/community" component={Community} />
      <Route path="/medicine" component={Medicine} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    // Show login modal after a short delay on first visit
    const hasVisited = localStorage.getItem("agreegrow-visited");
    if (!hasVisited) {
      setTimeout(() => {
        setShowLoginModal(true);
      }, 1000);
      localStorage.setItem("agreegrow-visited", "true");
    }
  }, []);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    // Show language selection after successful login
    setTimeout(() => {
      setShowLanguageModal(true);
    }, 500);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="agreegrow-theme">
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <div className="min-h-screen bg-background">
              <Navigation user={user} />
              <Router />
              <Toaster />
              
              <LoginModal
                open={showLoginModal}
                onOpenChange={setShowLoginModal}
                onSuccess={handleLoginSuccess}
              />
              
              <LanguageModal
                open={showLanguageModal}
                onOpenChange={setShowLanguageModal}
              />
            </div>
          </TooltipProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
