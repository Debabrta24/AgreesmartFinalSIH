import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Thermometer, 
  Droplets, 
  Eye,
  AlertTriangle,
  Info,
  MapPin
} from "lucide-react";
import { getWeatherData } from "@/lib/api";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useLanguage } from "@/components/language-provider";

export default function WeatherShield() {
  const [location, setLocation] = useState("Mumbai");
  const [customLocation, setCustomLocation] = useState("");
  const { t } = useLanguage();
  const { latitude, longitude, error: locationError, getCurrentPosition } = useGeolocation();

  const { data: weatherData, isLoading, error } = useQuery({
    queryKey: ["/api/weather", location],
    queryFn: () => getWeatherData(location),
  });

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLocation.trim()) {
      setLocation(customLocation.trim());
    }
  };

  const handleUseCurrentLocation = () => {
    if (latitude && longitude) {
      // For demo, use a nearby city name
      setLocation("Current Location");
    } else {
      getCurrentPosition();
    }
  };

  const getAlertVariant = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
      case "severe":
        return "border-destructive/20 bg-destructive/10";
      case "medium":
      case "moderate":
        return "border-secondary/20 bg-secondary/10";
      default:
        return "border-accent/20 bg-accent/10";
    }
  };

  const mockAlerts = [
    {
      type: "severe",
      title: "Heavy Rainfall Warning",
      description: "Intense rainfall expected in next 6 hours. Secure crops and equipment.",
      validUntil: "2024-12-02T18:00:00Z",
      icon: CloudRain
    },
    {
      type: "moderate", 
      title: "High Wind Advisory",
      description: "Wind speeds up to 45 km/h. Monitor tall crops for damage.",
      validUntil: "2024-12-02T22:00:00Z", 
      icon: Wind
    },
    {
      type: "info",
      title: "Optimal Harvesting Conditions",
      description: "Clear skies and low humidity perfect for harvesting operations.",
      validUntil: "2024-12-03T12:00:00Z",
      icon: Sun
    }
  ];

  const forecast = [
    { day: "Today", high: 32, low: 24, condition: "Sunny", icon: Sun, rain: 0 },
    { day: "Tomorrow", high: 29, low: 22, condition: "Cloudy", icon: CloudRain, rain: 60 },
    { day: "Wednesday", high: 27, low: 20, condition: "Rainy", icon: CloudRain, rain: 85 },
    { day: "Thursday", high: 30, low: 23, condition: "Partly Cloudy", icon: Sun, rain: 20 },
    { day: "Friday", high: 33, low: 25, condition: "Sunny", icon: Sun, rain: 5 },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Weather Shield</h1>
          <p className="text-xl text-muted-foreground">
            Advanced weather monitoring and crop protection alerts
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Weather Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Location Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLocationSubmit} className="flex space-x-2">
                  <Input
                    placeholder="Enter city name..."
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    data-testid="input-location"
                  />
                  <Button type="submit" data-testid="button-search-location">
                    Search
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleUseCurrentLocation}
                    data-testid="button-use-current-location"
                  >
                    Use GPS
                  </Button>
                </form>
                {locationError && (
                  <p className="text-sm text-destructive mt-2">{locationError}</p>
                )}
              </CardContent>
            </Card>

            {/* Current Weather */}
            <Card>
              <CardHeader>
                <CardTitle>Current Weather - {location}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </div>
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <p className="text-muted-foreground">Failed to load weather data</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Thermometer className="w-4 h-4 text-destructive" />
                          <span className="text-muted-foreground">Temperature</span>
                        </div>
                        <span className="font-medium" data-testid="current-temperature">
                          {weatherData?.temperature || 28}°C
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Droplets className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">Humidity</span>
                        </div>
                        <span className="font-medium" data-testid="current-humidity">
                          {weatherData?.humidity || 65}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Wind className="w-4 h-4 text-accent" />
                          <span className="text-muted-foreground">Wind Speed</span>
                        </div>
                        <span className="font-medium" data-testid="current-wind">
                          {weatherData?.windSpeed || 12} km/h
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4 text-secondary" />
                          <span className="text-muted-foreground">UV Index</span>
                        </div>
                        <span className="font-medium" data-testid="current-uv">
                          {weatherData?.uvIndex || 6}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-center p-6 bg-muted/30 rounded-lg">
                      <Sun className="w-16 h-16 text-secondary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {weatherData?.description || "Partly Cloudy"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Perfect conditions for outdoor farming activities
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 5-Day Forecast */}
            <Card>
              <CardHeader>
                <CardTitle>5-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {forecast.map((day, index) => {
                    const Icon = day.icon;
                    return (
                      <div key={index} className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-sm font-medium text-foreground mb-2">
                          {day.day}
                        </div>
                        <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                        <div className="text-xs text-muted-foreground mb-1">
                          {day.high}°/{day.low}°
                        </div>
                        <div className="text-xs text-accent">
                          {day.rain}% rain
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts Sidebar */}
          <div className="space-y-6">
            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span>Active Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAlerts.map((alert, index) => {
                  const Icon = alert.icon;
                  return (
                    <Alert key={index} className={getAlertVariant(alert.type)}>
                      <Icon className="h-4 w-4" />
                      <AlertDescription>
                        <div className="font-medium" data-testid={`alert-title-${index}`}>
                          {alert.title}
                        </div>
                        <div className="text-xs mt-1" data-testid={`alert-description-${index}`}>
                          {alert.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Valid until {new Date(alert.validUntil).toLocaleTimeString()}
                        </div>
                      </AlertDescription>
                    </Alert>
                  );
                })}
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Crop Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Drought Risk</span>
                    <Badge className="bg-primary text-primary-foreground">Low</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Flood Risk</span>
                    <Badge className="bg-secondary text-secondary-foreground">Medium</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Frost Risk</span>
                    <Badge className="bg-primary text-primary-foreground">Low</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Heat Stress</span>
                    <Badge className="bg-destructive text-destructive-foreground">High</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Farming Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Weather-Based Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium text-foreground">
                    Increase irrigation before heat wave
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    High temperatures predicted for next 3 days
                  </p>
                </div>
                <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                  <p className="text-sm font-medium text-foreground">
                    Apply mulch to retain moisture
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Prevent soil water loss during dry period
                  </p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium text-foreground">
                    Harvest early morning hours
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Avoid midday heat stress on workers
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
