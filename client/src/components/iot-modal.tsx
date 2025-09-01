import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Activity } from "lucide-react";
import { submitIoTData } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface IoTModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

interface SensorData {
  sensorType: string;
  soilMoisture: string;
  temperature: string;
  lightIntensity: string;
  soilPh: string;
  location: string;
}

export function IoTModal({ open, onOpenChange, userId }: IoTModalProps) {
  const [sensorData, setSensorData] = useState<SensorData>({
    sensorType: "",
    soilMoisture: "",
    temperature: "",
    lightIntensity: "",
    soilPh: "",
    location: ""
  });
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: submitIoTData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/iot-data"] });
      onOpenChange(false);
      setSensorData({
        sensorType: "",
        soilMoisture: "",
        temperature: "",
        lightIntensity: "",
        soilPh: "",
        location: ""
      });
      toast({
        title: "Data Submitted",
        description: "IoT sensor data has been successfully recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit sensor data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      userId,
      sensorType: sensorData.sensorType,
      soilMoisture: parseFloat(sensorData.soilMoisture) || undefined,
      temperature: parseFloat(sensorData.temperature) || undefined, 
      lightIntensity: parseFloat(sensorData.lightIntensity) || undefined,
      soilPh: parseFloat(sensorData.soilPh) || undefined,
      location: sensorData.location || undefined
    };

    submitMutation.mutate(data);
  };

  const handleInputChange = (field: keyof SensorData, value: string) => {
    setSensorData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Add IoT Sensor Data</span>
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)}
            data-testid="button-close-iot-modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="sensorType">Sensor Type</Label>
            <Select value={sensorData.sensorType} onValueChange={(value) => handleInputChange("sensorType", value)}>
              <SelectTrigger data-testid="select-sensor-type">
                <SelectValue placeholder="Select sensor type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ESP32 Multi-Sensor">ESP32 Multi-Sensor</SelectItem>
                <SelectItem value="Soil Moisture Sensor">Soil Moisture Sensor</SelectItem>
                <SelectItem value="Temperature Sensor">Temperature Sensor</SelectItem>
                <SelectItem value="Light Sensor">Light Sensor</SelectItem>
                <SelectItem value="pH Sensor">pH Sensor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="soilMoisture">Soil Moisture (%)</Label>
              <Input
                id="soilMoisture"
                type="number"
                min="0"
                max="100"
                placeholder="0-100"
                value={sensorData.soilMoisture}
                onChange={(e) => handleInputChange("soilMoisture", e.target.value)}
                data-testid="input-soil-moisture"
              />
            </div>
            <div>
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                min="-50"
                max="60"
                placeholder="Temperature"
                value={sensorData.temperature}
                onChange={(e) => handleInputChange("temperature", e.target.value)}
                data-testid="input-temperature"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lightIntensity">Light Intensity (%)</Label>
              <Input
                id="lightIntensity"
                type="number"
                min="0"
                max="100"
                placeholder="0-100"
                value={sensorData.lightIntensity}
                onChange={(e) => handleInputChange("lightIntensity", e.target.value)}
                data-testid="input-light-intensity"
              />
            </div>
            <div>
              <Label htmlFor="soilPh">Soil pH</Label>
              <Input
                id="soilPh"
                type="number"
                min="0"
                max="14"
                step="0.1"
                placeholder="6.5"
                value={sensorData.soilPh}
                onChange={(e) => handleInputChange("soilPh", e.target.value)}
                data-testid="input-soil-ph"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              placeholder="Field location or zone name"
              value={sensorData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              data-testid="input-sensor-location"
            />
          </div>

          <div className="flex space-x-2">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={submitMutation.isPending || !sensorData.sensorType}
              data-testid="button-submit-iot-data"
            >
              {submitMutation.isPending ? "Submitting..." : "Update Sensor Data"}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-iot-data"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
