import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Brain, 
  TrendingUp, 
  Zap,
  CloudRain,
  Leaf,
  Activity,
  Shield,
  Globe,
  Smartphone
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export default function ProjectIdea() {
  const { t } = useLanguage();

  const dataFlow = [
    {
      title: "Data Collection",
      icon: Database,
      color: "bg-secondary text-secondary-foreground",
      items: [
        "IoT sensors (ESP32)",
        "Weather APIs", 
        "Soil condition monitoring",
        "Market price feeds",
        "Camera-based analysis"
      ]
    },
    {
      title: "AI Processing", 
      icon: Brain,
      color: "bg-accent text-accent-foreground",
      items: [
        "Gemini AI analysis",
        "Crop recommendation engine",
        "Pest detection algorithms", 
        "Market prediction models",
        "Risk assessment AI"
      ]
    },
    {
      title: "Smart Recommendations",
      icon: TrendingUp,
      color: "bg-primary text-primary-foreground", 
      items: [
        "Crop selection guidance",
        "Fertilizer recommendations",
        "Irrigation scheduling",
        "Market timing advice",
        "Risk mitigation strategies"
      ]
    }
  ];

  const apiIntegrations = [
    { name: "Weather Data", apis: "OpenWeatherMap, Tomorrow.io", icon: CloudRain },
    { name: "Soil Analysis", apis: "NASA POWER, Open-Meteo", icon: Leaf },
    { name: "Market Prices", apis: "Agmarknet, Government APIs", icon: TrendingUp },
    { name: "Plant Health", apis: "Plant.id, Computer Vision", icon: Activity }
  ];

  const innovations = [
    {
      title: "Digital Twin Technology",
      description: "3D virtual plant models that reflect real soil and crop conditions",
      icon: Globe,
      color: "bg-primary/10 border-primary/20"
    },
    {
      title: "Gemini AI Fallback System", 
      description: "Intelligent backup ensuring 100% uptime even when primary APIs fail",
      icon: Shield,
      color: "bg-accent/10 border-accent/20"
    },
    {
      title: "IoT Integration Framework",
      description: "Seamless connection with ESP32 and other agricultural sensors",
      icon: Zap,
      color: "bg-secondary/10 border-secondary/20"
    },
    {
      title: "Multi-Modal AI Analysis",
      description: "Computer vision + natural language processing for comprehensive insights",
      icon: Brain,
      color: "bg-primary/10 border-primary/20"
    },
    {
      title: "AR Farming Assistant",
      description: "Augmented reality overlays for real-time farming guidance",
      icon: Smartphone,
      color: "bg-accent/10 border-accent/20"
    },
    {
      title: "Predictive Analytics",
      description: "Market timing and yield predictions using advanced ML models", 
      icon: TrendingUp,
      color: "bg-secondary/10 border-secondary/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="gradient-bg text-primary-foreground py-20 rounded-2xl mb-12">
          <div className="text-center max-w-4xl mx-auto px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Project Architecture</h1>
            <p className="text-xl text-primary-foreground/90 mb-8">
              How AgreeGrow brings together cutting-edge technology to revolutionize agriculture
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-primary-foreground/20 text-primary-foreground">AI-Powered</Badge>
              <Badge className="bg-primary-foreground/20 text-primary-foreground">IoT Enabled</Badge>
              <Badge className="bg-primary-foreground/20 text-primary-foreground">Multi-Language</Badge>
              <Badge className="bg-primary-foreground/20 text-primary-foreground">Real-time</Badge>
            </div>
          </div>
        </div>

        {/* Data Flow Architecture */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            System Architecture & Data Flow
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {dataFlow.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <Card key={index} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 ${stage.color.replace('text-', 'bg-').split(' ')[0]}`}></div>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stage.color.replace('text-', 'bg-').replace('foreground', '10')}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span data-testid={`stage-title-${index}`}>{stage.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {stage.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-muted-foreground" data-testid={`stage-item-${index}-${itemIndex}`}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* API Integration Strategy */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-center text-2xl">API Integration Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-8">
              <p className="text-muted-foreground max-w-4xl mx-auto">
                AgreeGrow seamlessly integrates multiple free APIs for comprehensive data collection, 
                with Gemini AI as an intelligent fallback system that ensures uninterrupted service 
                even when primary APIs are unavailable.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {apiIntegrations.map((integration, index) => {
                const Icon = integration.icon;
                return (
                  <div key={index} className="text-center p-6 border border-border rounded-lg">
                    <Icon className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2" data-testid={`api-name-${index}`}>
                      {integration.name}
                    </h3>
                    <p className="text-sm text-muted-foreground" data-testid={`api-sources-${index}`}>
                      {integration.apis}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-accent/10 rounded-lg border border-accent/20">
              <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
                🧠 Gemini AI Fallback System
              </h3>
              <p className="text-muted-foreground text-center max-w-2xl mx-auto">
                When primary APIs are unavailable, Gemini AI intelligently generates accurate, 
                contextual recommendations ensuring farmers never face service interruptions. 
                This creates a robust, always-available farming assistant.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Key Innovations */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Innovative Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {innovations.map((innovation, index) => {
              const Icon = innovation.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${innovation.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3" data-testid={`innovation-title-${index}`}>
                      {innovation.title}
                    </h3>
                    <p className="text-sm text-muted-foreground" data-testid={`innovation-description-${index}`}>
                      {innovation.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technical Implementation */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Frontend Technologies</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">React 18 with TypeScript</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Tailwind CSS with dark mode</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Shadcn UI component library</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Camera API with flash controls</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Real-time data visualization</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Backend Technologies</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-muted-foreground">Express.js with TypeScript</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-muted-foreground">Google Gemini AI integration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-muted-foreground">Multiple agriculture APIs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-muted-foreground">Image processing with Multer</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-muted-foreground">In-memory data storage</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Future Roadmap */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Future Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
                <h3 className="font-semibold text-foreground mb-3">Phase 1 - Foundation</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Core AI recommendations</li>
                  <li>• Basic IoT integration</li>
                  <li>• Multi-language support</li>
                  <li>• Mobile responsive design</li>
                </ul>
              </div>
              <div className="p-6 bg-secondary/10 rounded-lg border border-secondary/20">
                <h3 className="font-semibold text-foreground mb-3">Phase 2 - Enhancement</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Advanced analytics dashboard</li>
                  <li>• Community marketplace</li>
                  <li>• AR farming assistant</li>
                  <li>• Financial planning tools</li>
                </ul>
              </div>
              <div className="p-6 bg-accent/10 rounded-lg border border-accent/20">
                <h3 className="font-semibold text-foreground mb-3">Phase 3 - Scale</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Global market expansion</li>
                  <li>• Blockchain supply chain</li>
                  <li>• Drone integration</li>
                  <li>• Carbon credit tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
