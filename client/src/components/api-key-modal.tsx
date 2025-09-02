import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Save, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "./language-provider";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiKeyModal({ open, onOpenChange }: ApiKeyModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [keys, setKeys] = useState({
    weather: "",
    gemini: "",
    plantId: "",
    nasa: "",
    soilGrids: "",
  });

  const [showKey, setShowKey] = useState({
    weather: false,
    gemini: false,
    plantId: false,
    nasa: false,
    soilGrids: false,
  });

  const [loading, setLoading] = useState(false);

  const apiKeyTypes = [
    { 
      key: "weather" as const, 
      label: t("apiKeys.weather"), 
      description: "OpenWeatherMap or similar weather service API key" 
    },
    { 
      key: "gemini" as const, 
      label: t("apiKeys.gemini"), 
      description: "Google Gemini AI API key for intelligent recommendations" 
    },
    { 
      key: "plantId" as const, 
      label: t("apiKeys.plantId"), 
      description: "Plant.id API key for pest and disease detection" 
    },
    { 
      key: "nasa" as const, 
      label: t("apiKeys.nasa"), 
      description: "NASA API key for soil and environmental data" 
    },
    { 
      key: "soilGrids" as const, 
      label: t("apiKeys.soilGrids"), 
      description: "SoilGrids API key for soil analysis" 
    },
  ];

  const handleKeyChange = (keyType: keyof typeof keys, value: string) => {
    setKeys(prev => ({ ...prev, [keyType]: value }));
  };

  const toggleShowKey = (keyType: keyof typeof showKey) => {
    setShowKey(prev => ({ ...prev, [keyType]: !prev[keyType] }));
  };

  const handleSaveKey = async (keyType: keyof typeof keys) => {
    if (!keys[keyType].trim()) {
      toast({
        title: t("common.error"),
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: Add API call to save key to backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: t("apiKeys.success"),
        description: `${apiKeyTypes.find(type => type.key === keyType)?.label} ${t("apiKeys.success")}`,
      });
    } catch (error) {
      toast({
        title: t("apiKeys.error"),
        description: "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveKey = async (keyType: keyof typeof keys) => {
    if (window.confirm(t("apiKeys.confirm"))) {
      setLoading(true);
      try {
        // TODO: Add API call to remove key from backend
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        setKeys(prev => ({ ...prev, [keyType]: "" }));
        toast({
          title: t("apiKeys.success"),
          description: `${apiKeyTypes.find(type => type.key === keyType)?.label} removed successfully`,
        });
      } catch (error) {
        toast({
          title: t("apiKeys.error"),
          description: "Failed to remove API key",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{t("apiKeys.title")}</span>
          </DialogTitle>
          <DialogDescription>
            {t("apiKeys.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {apiKeyTypes.map((apiType) => (
            <Card key={apiType.key}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{apiType.label}</CardTitle>
                    <CardDescription className="text-sm">
                      {apiType.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        type={showKey[apiType.key] ? "text" : "password"}
                        placeholder={t("apiKeys.placeholder")}
                        value={keys[apiType.key]}
                        onChange={(e) => handleKeyChange(apiType.key, e.target.value)}
                        data-testid={`input-api-key-${apiType.key}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-7 w-7 p-0"
                        onClick={() => toggleShowKey(apiType.key)}
                        data-testid={`button-toggle-visibility-${apiType.key}`}
                      >
                        {showKey[apiType.key] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleSaveKey(apiType.key)}
                      disabled={loading || !keys[apiType.key].trim()}
                      data-testid={`button-save-${apiType.key}`}
                    >
                      <Save className="w-4 h-4 mr-1" />
                      {keys[apiType.key] ? t("apiKeys.update") : t("apiKeys.add")}
                    </Button>
                    
                    {keys[apiType.key] && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveKey(apiType.key)}
                        disabled={loading}
                        data-testid={`button-remove-${apiType.key}`}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {t("apiKeys.remove")}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-close-modal">
            {t("common.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}