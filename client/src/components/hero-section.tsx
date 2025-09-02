import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "./language-provider";

interface HeroSectionProps {
  onStartFarming: () => void;
  onWatchDemo: () => void;
}

export function HeroSection({ onStartFarming, onWatchDemo }: HeroSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="gradient-bg text-primary-foreground py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              {t("hero.title")}<br />
              <span className="text-secondary">{t("hero.subtitle")}</span>
            </h1>
            <p className="text-xl text-primary-foreground/90">
              {t("hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                onClick={onStartFarming}
                data-testid="button-start-farming"
              >
                {t("hero.start")}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={onWatchDemo}
                data-testid="button-watch-demo"
              >
                {t("hero.demo")}
              </Button>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-secondary" />
                <span>{t("hero.aiPowered")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-secondary" />
                <span>{t("hero.iotIntegration")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-secondary" />
                <span>{t("hero.multiLanguage")}</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Smart farming with IoT technology" 
              className="rounded-xl shadow-2xl animate-float w-full h-auto"
            />
            <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <div>
                  <div className="text-sm font-medium text-card-foreground">24°C</div>
                  <div className="text-xs text-muted-foreground">{t("weather.temperature")}</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-card p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <div>
                  <div className="text-sm font-medium text-card-foreground">68%</div>
                  <div className="text-xs text-muted-foreground">{t("iot.soilMoisture")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
