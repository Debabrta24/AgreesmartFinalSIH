import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Sun, 
  Droplets, 
  Thermometer, 
  Leaf, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Info,
  Activity
} from "lucide-react";
import { getMarketPrices, getWeatherData, getLatestIoTData } from "@/lib/api";
import { IoTModal } from "./iot-modal";
import { useLanguage } from "./language-provider";

// Mock user ID for demo purposes
const DEMO_USER_ID = "demo-user-123";

export function Dashboard() {
  const [showIoTModal, setShowIoTModal] = useState(false);
  const { t } = useLanguage();

  const { data: marketPrices, isLoading: loadingPrices } = useQuery({
    queryKey: ["/api/market-prices"],
    queryFn: () => getMarketPrices(),
  });

  const { data: weatherData, isLoading: loadingWeather } = useQuery({
    queryKey: ["/api/weather", "Mumbai"],
    queryFn: () => getWeatherData("Mumbai"),
  });

  const { data: iotData, isLoading: loadingIoT } = useQuery({
    queryKey: ["/api/iot-data", DEMO_USER_ID, "latest"],
    queryFn: () => getLatestIoTData(DEMO_USER_ID),
  });

  const sensorData = iotData || {
    soilMoisture: 68,
    temperature: 24,
    lightIntensity: 85,
    soilPh: 6.8
  };

  const alerts = [
    {
      type: "warning",
      title: "High Wind Alert",
      description: "Strong winds expected tomorrow",
      icon: AlertTriangle
    },
    {
      type: "info",
      title: "Irrigation Reminder", 
      description: "Zone A needs watering in 2 hours",
      icon: Info
    }
  ];

  const cropHealth = [
    { zone: "Zone A - Wheat", status: "Excellent", color: "text-primary" },
    { zone: "Zone B - Rice", status: "Good", color: "text-secondary" },
    { zone: "Zone C - Corn", status: "Needs Attention", color: "text-destructive" }
  ];

  const recommendations = [
    {
      title: "Apply NPK fertilizer to Zone C",
      description: "Corn shows nitrogen deficiency",
      color: "bg-primary/10 border-primary/20"
    },
    {
      title: "Increase irrigation frequency",
      description: "Soil moisture below optimal levels", 
      color: "bg-accent/10 border-accent/20"
    },
    {
      title: "Harvest Zone A in 2 weeks",
      description: "Optimal market timing predicted",
      color: "bg-secondary/10 border-secondary/20"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {t("dashboard.title")}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t("dashboard.description")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Weather & Alerts */}
          <div className="lg:col-span-1 space-y-6">
            {/* Weather Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">{t("dashboard.weather")}</CardTitle>
                <Sun className="w-5 h-5 text-secondary" />
              </CardHeader>
              <CardContent>
                {loadingWeather ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t("weather.temperature")}</span>
                      <span className="font-medium" data-testid="weather-temperature">
                        {weatherData?.temperature || 28}°C
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t("weather.humidity")}</span>
                      <span className="font-medium" data-testid="weather-humidity">
                        {weatherData?.humidity || 65}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Wind Speed</span>
                      <span className="font-medium" data-testid="weather-wind">
                        {weatherData?.windSpeed || 12} km/h
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">UV Index</span>
                      <span className="font-medium" data-testid="weather-uv">
                        {weatherData?.uvIndex || 6}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Alerts Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Active Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((alert, index) => (
                  <Alert key={index} className={alert.type === "warning" ? "border-destructive/20 bg-destructive/10" : "border-secondary/20 bg-secondary/10"}>
                    <alert.icon className={`h-4 w-4 ${alert.type === "warning" ? "text-destructive" : "text-secondary"}`} />
                    <AlertDescription>
                      <div className="font-medium">{alert.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{alert.description}</div>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>

            {/* Market Prices Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Market Prices</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingPrices ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {marketPrices?.slice(0, 3).map((price: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-muted-foreground">{price.cropName}</span>
                        <div className="text-right">
                          <span className="font-medium" data-testid={`price-${price.cropName.toLowerCase()}`}>
                            ₹{price.price}/{price.unit}
                          </span>
                          <span className={`text-xs ml-1 ${price.trend === "up" ? "text-primary" : price.trend === "down" ? "text-destructive" : "text-muted-foreground"}`}>
                            {price.trend === "up" ? "↗" : price.trend === "down" ? "↘" : "→"} {Math.abs(price.trendPercentage || 0).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* IoT Sensor Data */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">IoT Sensor Data</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowIoTModal(true)}
                  data-testid="button-add-iot-data"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Add IoT Data
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Droplets className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-card-foreground" data-testid="sensor-moisture">
                      {sensorData.soilMoisture}%
                    </div>
                    <div className="text-sm text-muted-foreground">Soil Moisture</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Thermometer className="w-8 h-8 text-secondary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-card-foreground" data-testid="sensor-temperature">
                      {sensorData.temperature}°C
                    </div>
                    <div className="text-sm text-muted-foreground">Temperature</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Sun className="w-8 h-8 text-secondary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-card-foreground" data-testid="sensor-light">
                      {sensorData.lightIntensity}%
                    </div>
                    <div className="text-sm text-muted-foreground">Light Intensity</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Leaf className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-card-foreground" data-testid="sensor-ph">
                      {sensorData.soilPh}
                    </div>
                    <div className="text-sm text-muted-foreground">Soil pH</div>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="bg-muted/30 rounded-lg p-6 data-visualization">
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="w-12 h-12 text-primary mx-auto mb-2" />
                      <p className="text-muted-foreground">Sensor Data Visualization</p>
                      <p className="text-xs text-muted-foreground mt-1">Real-time charts would display here</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bottom Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Crop Health Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Crop Health Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cropHealth.map((crop, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${crop.color === "text-primary" ? "bg-primary" : crop.color === "text-secondary" ? "bg-secondary" : "bg-destructive"}`}></div>
                        <span className="text-muted-foreground">{crop.zone}</span>
                      </div>
                      <span className={`text-sm font-medium ${crop.color}`} data-testid={`crop-health-${index}`}>
                        {crop.status}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* AI Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div key={index} className={`p-3 border rounded-lg ${rec.color}`}>
                      <p className="text-sm text-card-foreground font-medium" data-testid={`recommendation-${index}`}>
                        {rec.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <IoTModal 
        open={showIoTModal} 
        onOpenChange={setShowIoTModal}
        userId={DEMO_USER_ID}
      />
    </section>
  );
}
