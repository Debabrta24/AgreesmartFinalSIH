import { Card, CardContent } from "@/components/ui/card";
import { 
  Box, 
  Users, 
  Smartphone, 
  Leaf, 
  IndianRupee, 
  Brain,
  Globe,
  Shield,
  Zap
} from "lucide-react";
import { useLanguage } from "./language-provider";

const features = [
  {
    id: "digital-twin",
    icon: Box,
    title: "Digital Twin 3D Model",
    description: "Virtual plant representation reflecting real soil and crop conditions with visual health indicators.",
    color: "bg-primary/10 text-primary"
  },
  {
    id: "community",
    icon: Users,
    title: "Community Forum", 
    description: "Connect with fellow farmers to share tips, ask questions, and trade goods locally.",
    color: "bg-secondary/10 text-secondary"
  },
  {
    id: "ar-assistant",
    icon: Smartphone,
    title: "AR Farming Assistant",
    description: "Augmented reality overlays suggest optimal watering, fertilizing, and planting locations.",
    color: "bg-accent/10 text-accent"
  },
  {
    id: "sustainability",
    icon: Leaf,
    title: "Sustainability Index",
    description: "Track and improve your farming practices with eco-friendly recommendations and water usage optimization.",
    color: "bg-primary/10 text-primary"
  },
  {
    id: "financial",
    icon: IndianRupee,
    title: "Financial Insights",
    description: "Cost vs yield analysis, profit optimization, and government subsidy information.",
    color: "bg-secondary/10 text-secondary"
  },
  {
    id: "gemini-ai",
    icon: Brain,
    title: "Gemini AI Fallback",
    description: "Intelligent backup system ensures reliable recommendations even when primary APIs are unavailable.",
    color: "bg-accent/10 text-accent"
  },
  {
    id: "multi-language",
    icon: Globe,
    title: "Multi-Language Support",
    description: "Available in English, Hindi, Bengali, Tamil and more languages for global accessibility.",
    color: "bg-primary/10 text-primary"
  },
  {
    id: "data-security",
    icon: Shield,
    title: "Data Security",
    description: "Enterprise-grade security ensuring your farm data and insights remain private and protected.",
    color: "bg-secondary/10 text-secondary"
  },
  {
    id: "real-time",
    icon: Zap,
    title: "Real-time Processing",
    description: "Instant analysis and recommendations with live IoT data streaming and immediate alerts.",
    color: "bg-accent/10 text-accent"
  }
];

export function Features() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Innovative Features</h2>
          <p className="text-xl text-muted-foreground">
            Advanced technology for modern farming excellence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3" data-testid={`feature-title-${index}`}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground" data-testid={`feature-description-${index}`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Technology Showcase */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Powered by Cutting-Edge Technology
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                AgreeGrow combines the best of artificial intelligence, Internet of Things, 
                and modern web technologies to deliver a comprehensive farming solution 
                that adapts to your unique needs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-card rounded-lg border border-border">
                  <Brain className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Google Gemini AI</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-card rounded-lg border border-border">
                  <Zap className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-medium">ESP32 IoT Sensors</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-card rounded-lg border border-border">
                  <Globe className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">Weather APIs</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-card rounded-lg border border-border">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Computer Vision</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
