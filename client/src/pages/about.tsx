import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Eye, 
  Zap, 
  Users, 
  Award,
  Globe,
  Brain,
  Leaf
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export default function About() {
  const { t } = useLanguage();

  const technologies = [
    { name: "AI/ML", color: "bg-primary text-primary-foreground" },
    { name: "IoT Integration", color: "bg-secondary text-secondary-foreground" },
    { name: "Weather APIs", color: "bg-accent text-accent-foreground" },
    { name: "Gemini AI", color: "bg-primary text-primary-foreground" },
    { name: "Market Data", color: "bg-secondary text-secondary-foreground" },
    { name: "Computer Vision", color: "bg-accent text-accent-foreground" },
  ];

  const team = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Agricultural Scientist",
      expertise: "Crop Science & Soil Health",
      icon: Leaf
    },
    {
      name: "Priya Sharma", 
      role: "AI/ML Engineer",
      expertise: "Machine Learning & Computer Vision",
      icon: Brain
    },
    {
      name: "Arjun Patel",
      role: "IoT Specialist", 
      expertise: "Sensor Networks & Automation",
      icon: Zap
    },
    {
      name: "Meera Singh",
      role: "Market Analyst",
      expertise: "Agricultural Economics & Policy",
      icon: Globe
    }
  ];

  const stats = [
    { label: "Active Farmers", value: "10,000+", icon: Users },
    { label: "Crop Analyses", value: "50,000+", icon: Brain },
    { label: "Cost Savings", value: "₹2 Cr+", icon: Award },
    { label: "Countries", value: "5+", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">About AgreeGrow</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering farmers with cutting-edge technology for sustainable and profitable agriculture
          </p>
        </div>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Use AI and IoT technology to make farming simple, profitable, and sustainable 
                for farmers worldwide. We believe that every farmer deserves access to modern 
                technology that can transform their agricultural practices.
              </p>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="w-6 h-6 text-secondary" />
                <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Build a comprehensive farming ecosystem that leverages real-time technology 
                to create smarter agricultural practices, reduce environmental impact, and 
                increase farmer prosperity globally.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Technology Stack</h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <Badge key={index} className={tech.color} data-testid={`tech-${index}`}>
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <img 
              src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Modern farmer using technology" 
              className="rounded-xl shadow-lg w-full h-auto"
            />
            
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-4 text-center">
                      <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-xl font-bold text-foreground" data-testid={`stat-value-${index}`}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Meet Our Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => {
                const Icon = member.icon;
                return (
                  <div key={index} className="text-center p-6 border border-border rounded-lg">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1" data-testid={`team-name-${index}`}>
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                    <p className="text-xs text-muted-foreground">{member.expertise}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-primary" />
                <span>AI-Powered Intelligence</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Advanced machine learning algorithms analyze your farm data to provide 
                personalized recommendations for optimal crop selection and management.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-secondary" />
                <span>Real-time Monitoring</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                IoT sensors provide continuous monitoring of soil conditions, weather patterns, 
                and crop health to enable proactive farm management decisions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-accent" />
                <span>Global Reach</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Multi-language support and region-specific insights make AgreeGrow 
                accessible to farmers across different countries and agricultural practices.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Get in Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-xl">📧</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Email Us</h3>
                <p className="text-muted-foreground">hello@agreegrow.com</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-secondary text-xl">📞</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Call Us</h3>
                <p className="text-muted-foreground">+91 98765 43210</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent text-xl">📍</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Visit Us</h3>
                <p className="text-muted-foreground">Mumbai, India</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
