import { HeroSection } from "@/components/hero-section";
import { SmartTools } from "@/components/smart-tools";
import { Dashboard } from "@/components/dashboard";
import { Features } from "@/components/features";
import { ApiKeyModal } from "@/components/api-key-modal";
import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export default function Home() {
  const [, setLocation] = useLocation();
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const { t } = useLanguage();

  const handleStartFarming = () => {
    setLocation("/crop-advisor");
  };

  const handleWatchDemo = () => {
    // Scroll to dashboard section
    document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col">
      <HeroSection onStartFarming={handleStartFarming} onWatchDemo={handleWatchDemo} />
      <SmartTools />
      <div id="dashboard">
        <Dashboard />
      </div>
      <Features />
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold text-card-foreground">AgreeGrow</span>
              </div>
              <p className="text-muted-foreground">{t("hero.subtitle")}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-card-foreground mb-4">{t("footer.features")}</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>{t("tools.cropDoctor")}</li>
                <li>Pest Detection</li>
                <li>Market Intelligence</li>
                <li>Weather Alerts</li>
                <li>IoT Integration</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-card-foreground mb-4">{t("footer.resources")}</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Community Forum</li>
                <li>Support</li>
                <li>Blog</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-card-foreground mb-4">{t("footer.contact")}</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>hello@agreegrow.com</li>
                <li>+91 98765 43210</li>
                <li>Mumbai, India</li>
              </ul>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setApiKeyModalOpen(true)}
                  className="w-full"
                  data-testid="button-manage-api-keys"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {t("footer.manageKeys")}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2024 AgreeGrow. {t("footer.rights")}</p>
          </div>
        </div>
      </footer>
      
      <ApiKeyModal 
        open={apiKeyModalOpen} 
        onOpenChange={setApiKeyModalOpen} 
      />
    </div>
  );
}
