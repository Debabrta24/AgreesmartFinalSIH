import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Sprout, 
  MapPin, 
  Thermometer, 
  CloudRain,
  Leaf,
  Calendar,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import { getCropRecommendations, getUserCropRecommendations } from "@/lib/api";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useLanguage } from "@/components/language-provider";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import GoogleMaps from "@/components/GoogleMaps";

// Mock user ID for demo
const DEMO_USER_ID = "demo-user-123";

interface FormData {
  location: string;
  soilType: string;
  climate: string;
  season: string;
}

export default function CropAdvisor() {
  const [formData, setFormData] = useState<FormData>({
    location: "",
    soilType: "",
    climate: "",
    season: ""
  });
  const [recommendations, setRecommendations] = useState<any>(null);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { latitude, longitude, getCurrentPosition } = useGeolocation();

  const { data: pastRecommendations, isLoading: loadingPast } = useQuery({
    queryKey: ["/api/crop-recommendations", DEMO_USER_ID],
    queryFn: () => getUserCropRecommendations(DEMO_USER_ID),
  });

  const recommendationMutation = useMutation({
    mutationFn: getCropRecommendations,
    onSuccess: (data) => {
      setRecommendations(data);
      queryClient.invalidateQueries({ queryKey: ["/api/crop-recommendations", DEMO_USER_ID] });
      toast({
        title: "Recommendations Generated",
        description: "AI has analyzed your conditions and provided crop recommendations.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location || !formData.soilType || !formData.climate || !formData.season) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    recommendationMutation.mutate({
      userId: DEMO_USER_ID,
      ...formData
    });
  };

  const handleUseCurrentLocation = () => {
    if (latitude && longitude) {
      setFormData(prev => ({ ...prev, location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}` }));
    } else {
      getCurrentPosition();
    }
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 5) return "summer";
    if (month >= 6 && month <= 9) return "monsoon";
    return "winter";
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Crop Advisor</h1>
          <p className="text-xl text-muted-foreground">
            AI-powered crop recommendations based on local conditions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sprout className="w-5 h-5" />
                  <span>Farm Conditions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="location"
                        placeholder="Enter city or coordinates"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        data-testid="input-location"
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleUseCurrentLocation}
                        data-testid="button-use-gps"
                      >
                        <MapPin className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="soilType">Soil Type</Label>
                      <Select value={formData.soilType} onValueChange={(value) => setFormData(prev => ({ ...prev, soilType: value }))}>
                        <SelectTrigger data-testid="select-soil-type">
                          <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clay">Clay Soil</SelectItem>
                          <SelectItem value="sandy">Sandy Soil</SelectItem>
                          <SelectItem value="loamy">Loamy Soil</SelectItem>
                          <SelectItem value="silty">Silty Soil</SelectItem>
                          <SelectItem value="chalky">Chalky Soil</SelectItem>
                          <SelectItem value="peaty">Peaty Soil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="climate">Climate</Label>
                      <Select value={formData.climate} onValueChange={(value) => setFormData(prev => ({ ...prev, climate: value }))}>
                        <SelectTrigger data-testid="select-climate">
                          <SelectValue placeholder="Select climate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tropical">Tropical</SelectItem>
                          <SelectItem value="subtropical">Subtropical</SelectItem>
                          <SelectItem value="temperate">Temperate</SelectItem>
                          <SelectItem value="arid">Arid</SelectItem>
                          <SelectItem value="semiarid">Semi-arid</SelectItem>
                          <SelectItem value="humid">Humid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="season">Season</Label>
                    <Select value={formData.season} onValueChange={(value) => setFormData(prev => ({ ...prev, season: value }))}>
                      <SelectTrigger data-testid="select-season">
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spring">Spring (March-May)</SelectItem>
                        <SelectItem value="summer">Summer (June-August)</SelectItem>
                        <SelectItem value="monsoon">Monsoon (July-September)</SelectItem>
                        <SelectItem value="winter">Winter (October-February)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current season: {getCurrentSeason()}
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={recommendationMutation.isPending}
                    data-testid="button-get-recommendations"
                  >
                    {recommendationMutation.isPending ? (
                      "Generating Recommendations..."
                    ) : (
                      "Get AI Recommendations"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recommendations Results */}
            {recommendations && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>AI Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Recommended Crops */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Recommended Crops</h3>
                    <div className="flex flex-wrap gap-2">
                      {recommendations.recommendations?.recommendedCrops?.map((crop: string, index: number) => (
                        <Badge key={index} className="bg-primary text-primary-foreground" data-testid={`recommended-crop-${index}`}>
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Fertilizer Advice */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Fertilizer Recommendations</h3>
                    <div className="space-y-2">
                      {recommendations.recommendations?.fertilizerAdvice?.map((advice: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                          <p className="text-sm text-muted-foreground" data-testid={`fertilizer-advice-${index}`}>
                            {advice}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Maintenance Schedule */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Maintenance Schedule</h3>
                    <div className="space-y-2">
                      {recommendations.recommendations?.maintenanceSchedule?.map((task: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Calendar className="w-4 h-4 text-secondary mt-0.5" />
                          <p className="text-sm text-muted-foreground" data-testid={`maintenance-task-${index}`}>
                            {task}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Seasonal Tips */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Seasonal Tips</h3>
                    <div className="space-y-2">
                      {recommendations.recommendations?.seasonalTips?.map((tip: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Leaf className="w-4 h-4 text-accent mt-0.5" />
                          <p className="text-sm text-muted-foreground" data-testid={`seasonal-tip-${index}`}>
                            {tip}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Condition Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Location</span>
                  </div>
                  <span className="font-medium text-foreground" data-testid="condition-location">
                    {formData.location || "Not set"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Leaf className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Soil Type</span>
                  </div>
                  <span className="font-medium text-foreground" data-testid="condition-soil">
                    {formData.soilType || "Not set"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Climate</span>
                  </div>
                  <span className="font-medium text-foreground" data-testid="condition-climate">
                    {formData.climate || "Not set"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Season</span>
                  </div>
                  <span className="font-medium text-foreground" data-testid="condition-season">
                    {formData.season || "Not set"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Past Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Previous Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingPast ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : pastRecommendations && pastRecommendations.length > 0 ? (
                  <div className="space-y-3">
                    {pastRecommendations.slice(0, 5).map((rec: any, index: number) => (
                      <div key={rec.id} className="p-3 border border-border rounded-lg">
                        <div className="font-medium text-sm mb-1" data-testid={`past-recommendation-${index}`}>
                          {rec.cropType}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {rec.soilType} • {rec.climate}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(rec.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Sprout className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No recommendations yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Fill the form to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">High Demand</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Organic vegetables showing 25% premium in urban markets
                  </p>
                </div>
                <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium text-foreground">Export Opportunity</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Quinoa and millets gaining international market traction
                  </p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <div className="flex items-center space-x-2 mb-1">
                    <CloudRain className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-foreground">Weather Impact</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Late monsoon may affect kharif crop prices by 8-12%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Display */}
          <div className="space-y-6">
            {recommendationMutation.isPending && (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">AI is analyzing your conditions...</p>
                </CardContent>
              </Card>
            )}

            {recommendations && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Recommendation Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Best Crops for You</h4>
                    <div className="flex flex-wrap gap-1">
                      {recommendations.recommendations?.recommendedCrops?.slice(0, 3).map((crop: string, index: number) => (
                        <Badge key={index} className="bg-primary text-primary-foreground text-xs">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Confidence Score</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(recommendations.confidence || 0) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium" data-testid="recommendation-confidence">
                        {Math.round((recommendations.confidence || 0) * 100)}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Next Steps</h4>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-primary" />
                        <span className="text-xs text-muted-foreground">Review fertilizer needs</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-primary" />
                        <span className="text-xs text-muted-foreground">Check market prices</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-primary" />
                        <span className="text-xs text-muted-foreground">Plan irrigation schedule</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Seasonal Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Calendar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <h4 className="font-medium text-foreground mb-1">Kharif Season</h4>
                  <p className="text-xs text-muted-foreground">June-October: Rice, Cotton, Sugarcane</p>
                </div>
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <h4 className="font-medium text-foreground mb-1">Rabi Season</h4>
                  <p className="text-xs text-muted-foreground">November-April: Wheat, Barley, Peas</p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <h4 className="font-medium text-foreground mb-1">Zaid Season</h4>
                  <p className="text-xs text-muted-foreground">April-June: Watermelon, Fodder crops</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
