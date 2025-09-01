import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, TrendingUp, CloudRain, Activity, Calculator, Sprout } from "lucide-react";
import { useLanguage } from "./language-provider";
import { useLocation } from "wouter";

const tools = [
  {
    id: "crop-doctor",
    icon: Camera,
    titleKey: "tools.cropDoctor",
    description: "AI-powered pest and disease detection using your camera with organic solution recommendations.",
    color: "primary",
    route: "/crop-doctor"
  },
  {
    id: "price-tracker", 
    icon: TrendingUp,
    titleKey: "tools.priceTracker",
    description: "Real-time crop prices and AI-powered market predictions to maximize your profits.",
    color: "secondary",
    route: "/price-tracker"
  },
  {
    id: "weather-shield",
    icon: CloudRain,
    titleKey: "tools.weatherShield", 
    description: "Advanced weather alerts and risk predictions to protect your crops from extreme conditions.",
    color: "accent",
    route: "/weather-shield"
  },
  {
    id: "iot-dashboard",
    icon: Activity,
    titleKey: "tools.iotDashboard",
    description: "Real-time sensor data visualization with 3D effects and automated recommendations.",
    color: "primary",
    route: "/iot-dashboard"
  },
  {
    id: "profit-calculator",
    icon: Calculator,
    titleKey: "tools.profitCalculator",
    description: "AI-powered financial insights, cost analysis, and government subsidy information.",
    color: "secondary",
    route: "/profit-calculator"
  },
  {
    id: "crop-advisor",
    icon: Sprout,
    titleKey: "tools.cropAdvisor", 
    description: "Intelligent crop recommendations based on soil, weather, and market conditions.",
    color: "accent",
    route: "/crop-advisor"
  }
];

export function SmartTools() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return {
          icon: "bg-primary/10 text-primary",
          button: "bg-primary text-primary-foreground hover:bg-primary/90"
        };
      case "secondary":
        return {
          icon: "bg-secondary/10 text-secondary",
          button: "bg-secondary text-secondary-foreground hover:bg-secondary/90"
        };
      case "accent":
        return {
          icon: "bg-accent/10 text-accent",
          button: "bg-accent text-accent-foreground hover:bg-accent/90"
        };
      default:
        return {
          icon: "bg-primary/10 text-primary",
          button: "bg-primary text-primary-foreground hover:bg-primary/90"
        };
    }
  };

  return (
    <section id="tools" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {t("tools.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("tools.description")}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const colors = getColorClasses(tool.color);
            
            return (
              <Card key={tool.id} className="hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colors.icon}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">
                    {t(tool.titleKey)}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {tool.description}
                  </p>
                  <Button 
                    className={`w-full ${colors.button}`}
                    onClick={() => setLocation(tool.route)}
                    data-testid={`button-${tool.id}`}
                  >
                    Open Tool
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
