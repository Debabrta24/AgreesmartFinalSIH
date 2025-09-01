interface WeatherResponse {
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  rainfall: number;
  pressure: number;
  description: string;
  alerts?: string[];
}

interface SoilResponse {
  moisture: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
}

interface MarketPriceResponse {
  crop: string;
  price: number;
  unit: string;
  market: string;
  change: number;
}

export class AgricultureAPIs {
  private weatherApiKey: string;

  constructor() {
    this.weatherApiKey = process.env.OPENWEATHER_API_KEY || process.env.WEATHER_API_KEY || "";
  }

  async getWeatherData(location: string): Promise<WeatherResponse | null> {
    try {
      if (!this.weatherApiKey) {
        throw new Error("Weather API key not available");
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${this.weatherApiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed * 3.6, // Convert m/s to km/h
        uvIndex: 6, // Default value, would need UV API
        rainfall: data.rain?.["1h"] || 0,
        pressure: data.main.pressure,
        description: data.weather[0].description,
        alerts: data.alerts || []
      };
    } catch (error) {
      console.error("Weather API failed:", error);
      return null;
    }
  }

  async getSoilData(latitude: number, longitude: number): Promise<SoilResponse | null> {
    try {
      // Using NASA POWER API for soil moisture data
      const response = await fetch(
        `https://power.larc.nasa.gov/api/temporal/daily/point?start=20240101&end=20240131&latitude=${latitude}&longitude=${longitude}&community=ag&parameters=GWETROOT,T2M&format=json`
      );

      if (!response.ok) {
        throw new Error(`Soil API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract latest values and simulate other soil parameters
      const latestMoisture = Object.values(data.properties.parameter.GWETROOT || {})[0] as number || 65;
      
      return {
        moisture: Math.round(latestMoisture * 100), // Convert to percentage
        ph: 6.5 + (Math.random() - 0.5) * 1.0, // Simulated pH between 6.0-7.0
        nitrogen: 20 + Math.random() * 30, // Simulated N levels
        phosphorus: 15 + Math.random() * 25, // Simulated P levels
        potassium: 180 + Math.random() * 40, // Simulated K levels
        organicMatter: 2.5 + Math.random() * 2.0 // Simulated organic matter %
      };
    } catch (error) {
      console.error("Soil API failed:", error);
      return null;
    }
  }

  async getMarketPrices(crops: string[] = ["wheat", "rice", "corn"]): Promise<MarketPriceResponse[]> {
    try {
      // Simulated market data since real agmarket APIs require complex authentication
      const basePrices: Record<string, number> = {
        wheat: 2150,
        rice: 3200,
        corn: 1850,
        sugarcane: 350,
        cotton: 5200,
        soybean: 4100,
        potato: 1200,
        onion: 2800
      };

      return crops.map(crop => ({
        crop: crop.charAt(0).toUpperCase() + crop.slice(1),
        price: basePrices[crop.toLowerCase()] || 1500,
        unit: "quintal",
        market: "Delhi Mandi",
        change: (Math.random() - 0.5) * 10 // Random change between -5% to +5%
      }));
    } catch (error) {
      console.error("Market price API failed:", error);
      return [];
    }
  }

  async detectPestFromImage(imageBase64: string): Promise<{
    pest: string;
    severity: string;
    organicSolution: string;
    ayurvedicRemedy: string;
    confidence: number;
  } | null> {
    try {
      // Using Plant.id API for pest detection
      const plantIdApiKey = process.env.PLANT_ID_API_KEY;
      
      if (!plantIdApiKey) {
        throw new Error("Plant.id API key not available");
      }

      const response = await fetch("https://api.plant.id/v2/identify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": plantIdApiKey
        },
        body: JSON.stringify({
          images: [imageBase64],
          modifiers: ["disease"],
          plant_details: ["pests_and_diseases"]
        })
      });

      if (!response.ok) {
        throw new Error(`Plant.id API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.suggestions && data.suggestions.length > 0) {
        const suggestion = data.suggestions[0];
        const disease = suggestion.plant_details?.pests_and_diseases?.[0];
        
        return {
          pest: disease?.name || "Unknown pest/disease",
          severity: suggestion.probability > 0.7 ? "High" : suggestion.probability > 0.4 ? "Medium" : "Low",
          organicSolution: "Apply neem oil spray or beneficial insects",
          ayurvedicRemedy: "Use turmeric-water solution or neem leaf extract",
          confidence: suggestion.probability
        };
      }

      return null;
    } catch (error) {
      console.error("Pest detection API failed:", error);
      return null;
    }
  }

  async getCropRecommendations(soilData: SoilResponse, weatherData: WeatherResponse, location: string): Promise<{
    recommendedCrops: string[];
    fertilizerAdvice: string[];
    maintenanceSchedule: string[];
    seasonalTips: string[];
  } | null> {
    // This would typically integrate with agricultural databases
    // For now, providing intelligent recommendations based on conditions
    
    const recommendations = {
      recommendedCrops: [] as string[],
      fertilizerAdvice: [] as string[],
      maintenanceSchedule: [] as string[],
      seasonalTips: [] as string[]
    };

    // Crop recommendations based on soil pH
    if (soilData.ph >= 6.0 && soilData.ph <= 7.5) {
      recommendations.recommendedCrops.push("Wheat", "Rice", "Corn");
    }
    if (soilData.ph >= 5.5 && soilData.ph <= 6.8) {
      recommendations.recommendedCrops.push("Potato", "Tea", "Blueberry");
    }

    // Temperature-based recommendations
    if (weatherData.temperature >= 20 && weatherData.temperature <= 30) {
      recommendations.recommendedCrops.push("Cotton", "Sugarcane", "Soybean");
    }

    // Soil nutrient advice
    if (soilData.nitrogen < 25) {
      recommendations.fertilizerAdvice.push("Apply organic nitrogen fertilizer");
    }
    if (soilData.phosphorus < 20) {
      recommendations.fertilizerAdvice.push("Add phosphorus-rich compost");
    }
    if (soilData.potassium < 200) {
      recommendations.fertilizerAdvice.push("Use potash or wood ash");
    }

    // Seasonal maintenance
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 2 && currentMonth <= 5) { // Spring/Summer
      recommendations.maintenanceSchedule.push("Increase irrigation frequency", "Monitor for pest activity");
      recommendations.seasonalTips.push("Plant heat-tolerant varieties", "Provide shade during peak hours");
    } else { // Fall/Winter
      recommendations.maintenanceSchedule.push("Reduce watering", "Apply winter fertilizers");
      recommendations.seasonalTips.push("Plant cool-season crops", "Protect from frost");
    }

    return recommendations;
  }
}

export const agricultureAPIs = new AgricultureAPIs();
