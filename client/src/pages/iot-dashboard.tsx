import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Sun, 
  Leaf,
  Plus,
  Settings,
  Wifi,
  WifiOff
} from "lucide-react";
import { getUserIoTData, getLatestIoTData } from "@/lib/api";
import { IoTModal } from "@/components/iot-modal";
import { useLanguage } from "@/components/language-provider";

// Mock user ID for demo
const DEMO_USER_ID = "demo-user-123";

export default function IoTDashboard() {
  const [showIoTModal, setShowIoTModal] = useState(false);
  const { t } = useLanguage();

  const { data: iotHistory, isLoading: loadingHistory } = useQuery({
    queryKey: ["/api/iot-data", DEMO_USER_ID],
    queryFn: () => getUserIoTData(DEMO_USER_ID, 20),
  });

  const { data: latestData, isLoading: loadingLatest } = useQuery({
    queryKey: ["/api/iot-data", DEMO_USER_ID, "latest"],
    queryFn: () => getLatestIoTData(DEMO_USER_ID),
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const sensorData = latestData || {
    soilMoisture: 68,
    temperature: 24,
    lightIntensity: 85,
    soilPh: 6.8,
    sensorType: "ESP32 Multi-Sensor",
    timestamp: new Date()
  };

  const mockSensors = [
    { id: "sensor-1", name: "Field Zone A", type: "ESP32 Multi-Sensor", status: "online", lastUpdate: "2 mins ago" },
    { id: "sensor-2", name: "Field Zone B", type: "Soil Moisture", status: "online", lastUpdate: "1 min ago" },
    { id: "sensor-3", name: "Greenhouse 1", type: "Climate Monitor", status: "offline", lastUpdate: "15 mins ago" },
    { id: "sensor-4", name: "Water Tank", type: "Level Sensor", status: "online", lastUpdate: "30 secs ago" },
  ];

  const getStatusColor = (status: string) => {
    return status === "online" ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground";
  };

  const getSensorIcon = (type: string) => {
    if (type.includes("Multi-Sensor") || type.includes("ESP32")) return Activity;
    if (type.includes("Moisture")) return Droplets;
    if (type.includes("Climate")) return Thermometer;
    return Settings;
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">IoT Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Real-time sensor monitoring and farm automation
          </p>
        </div>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Droplets className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground" data-testid="stat-soil-moisture">
                  {sensorData.soilMoisture}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Soil Moisture</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Thermometer className="w-8 h-8 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground" data-testid="stat-temperature">
                  {sensorData.temperature}°C
                </div>
                <div className="text-sm text-muted-foreground">Avg Temperature</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Sun className="w-8 h-8 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground" data-testid="stat-light">
                  {sensorData.lightIntensity}%
                </div>
                <div className="text-sm text-muted-foreground">Light Intensity</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Leaf className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground" data-testid="stat-ph">
                  {sensorData.soilPh}
                </div>
                <div className="text-sm text-muted-foreground">Soil pH</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Dashboard */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="live" className="space-y-6">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="live" data-testid="tab-live-data">Live Data</TabsTrigger>
                  <TabsTrigger value="history" data-testid="tab-history">History</TabsTrigger>
                  <TabsTrigger value="automation" data-testid="tab-automation">Automation</TabsTrigger>
                </TabsList>

                <TabsContent value="live">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle>Real-Time Sensor Data</CardTitle>
                      <Button 
                        onClick={() => setShowIoTModal(true)}
                        data-testid="button-add-sensor-data"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Data
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {loadingLatest ? (
                        <div className="grid grid-cols-2 gap-4">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="p-4 border border-border rounded-lg">
                              <Skeleton className="h-8 w-8 mb-2" />
                              <Skeleton className="h-6 w-16 mb-1" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <Droplets className="w-8 h-8 text-primary mx-auto mb-2" />
                            <div className="text-2xl font-bold text-foreground" data-testid="live-moisture">
                              {sensorData.soilMoisture}%
                            </div>
                            <div className="text-sm text-muted-foreground">Soil Moisture</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <Thermometer className="w-8 h-8 text-secondary mx-auto mb-2" />
                            <div className="text-2xl font-bold text-foreground" data-testid="live-temperature">
                              {sensorData.temperature}°C
                            </div>
                            <div className="text-sm text-muted-foreground">Temperature</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <Sun className="w-8 h-8 text-secondary mx-auto mb-2" />
                            <div className="text-2xl font-bold text-foreground" data-testid="live-light">
                              {sensorData.lightIntensity}%
                            </div>
                            <div className="text-sm text-muted-foreground">Light Intensity</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <Leaf className="w-8 h-8 text-primary mx-auto mb-2" />
                            <div className="text-2xl font-bold text-foreground" data-testid="live-ph">
                              {sensorData.soilPh}
                            </div>
                            <div className="text-sm text-muted-foreground">Soil pH</div>
                          </div>
                        </div>
                      )}

                      {/* Chart Visualization */}
                      <div className="mt-6 bg-muted/30 rounded-lg p-6 data-visualization">
                        <div className="h-48 flex items-center justify-center">
                          <div className="text-center">
                            <Activity className="w-12 h-12 text-primary mx-auto mb-2" />
                            <p className="text-muted-foreground">Real-time Data Visualization</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Interactive charts would display sensor trends here
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle>Historical Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingHistory ? (
                        <div className="space-y-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                          ))}
                        </div>
                      ) : iotHistory && iotHistory.length > 0 ? (
                        <div className="space-y-3">
                          {iotHistory.slice(0, 10).map((data: any, index: number) => (
                            <div key={data.id} className="p-4 border border-border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-foreground">
                                  {data.sensorType}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(data.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <div className="grid grid-cols-4 gap-4 text-sm">
                                <div className="text-center">
                                  <div className="font-medium" data-testid={`history-moisture-${index}`}>
                                    {data.soilMoisture}%
                                  </div>
                                  <div className="text-muted-foreground">Moisture</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-medium" data-testid={`history-temp-${index}`}>
                                    {data.temperature}°C
                                  </div>
                                  <div className="text-muted-foreground">Temp</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-medium" data-testid={`history-light-${index}`}>
                                    {data.lightIntensity}%
                                  </div>
                                  <div className="text-muted-foreground">Light</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-medium" data-testid={`history-ph-${index}`}>
                                    {data.soilPh}
                                  </div>
                                  <div className="text-muted-foreground">pH</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No historical data available</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Start collecting sensor data to see trends
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="automation">
                  <Card>
                    <CardHeader>
                      <CardTitle>Automation Rules</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">Auto Irrigation</h4>
                          <Badge className="bg-primary text-primary-foreground">Active</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Trigger irrigation when soil moisture drops below 40%
                        </p>
                      </div>
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">Temperature Alert</h4>
                          <Badge className="bg-secondary text-secondary-foreground">Active</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Send alert when temperature exceeds 35°C
                        </p>
                      </div>
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">pH Monitoring</h4>
                          <Badge variant="outline">Inactive</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Notify when soil pH goes outside 6.0-7.5 range
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sensor Status Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Connected Sensors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockSensors.map((sensor, index) => {
                    const Icon = getSensorIcon(sensor.type);
                    return (
                      <div key={sensor.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                        <Icon className="w-6 h-6 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate" data-testid={`sensor-name-${index}`}>
                            {sensor.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">{sensor.type}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(sensor.status)} data-testid={`sensor-status-${index}`}>
                            {sensor.status === "online" ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {sensor.lastUpdate}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium text-foreground">
                      Optimal Growing Conditions
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      All sensors showing ideal ranges for current crops
                    </p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                    <p className="text-sm font-medium text-foreground">
                      Irrigation Recommendation
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Zone B moisture dropping - schedule watering in 4 hours
                    </p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-sm font-medium text-foreground">
                      Energy Optimization
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reduce sensor frequency during stable conditions
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setShowIoTModal(true)}
                    data-testid="button-add-manual-reading"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Manual Reading
                  </Button>
                  <Button className="w-full justify-start" variant="outline" data-testid="button-calibrate-sensors">
                    <Settings className="w-4 h-4 mr-2" />
                    Calibrate Sensors
                  </Button>
                  <Button className="w-full justify-start" variant="outline" data-testid="button-export-data">
                    <Activity className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
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
    </div>
  );
}
