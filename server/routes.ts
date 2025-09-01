import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { enhancedAgricultureAPIs } from "./services/enhanced-agriculture-apis";
import { webScraperService } from "./services/web-scraper";
import { 
  getCropRecommendations, 
  analyzePestImage, 
  generateWeatherInsights,
  generateMarketPredictions 
} from "./services/gemini";
import { 
  insertUserSchema,
  insertCropRecommendationSchema,
  insertPestDetectionSchema,
  insertIotSensorDataSchema,
  insertCommunityPostSchema
} from "@shared/schema";

// Helper function to get coordinates from location
async function getCoordinatesForLocation(location: string): Promise<{lat: number, lon: number} | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.length === 0) return null;
    
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    };
  } catch (error: any) {
    console.warn("Geocoding failed:", error.message);
    return null;
  }
}

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // User authentication (fake login for demo)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, username } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create new user for demo
        const userData = insertUserSchema.parse({
          email,
          username: username || email.split('@')[0],
          language: "en",
        });
        user = await storage.createUser(userData);
      }

      res.json({ user, message: "Login successful" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Get current user
  app.get("/api/auth/me/:userId", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Update user profile
  app.patch("/api/auth/me/:userId", async (req, res) => {
    try {
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.userId, updates);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Weather data
  app.get("/api/weather/:location", async (req, res) => {
    try {
      const { location } = req.params;
      
      // Check if we have cached data
      let weatherData = await storage.getWeatherData(location);
      
      // If no cached data or data is older than 1 hour, fetch new data
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (!weatherData || !weatherData.updatedAt || weatherData.updatedAt < oneHourAgo) {
        
        // Try to fetch from enhanced API (multiple real sources)
        const apiData = await enhancedAgricultureAPIs.getWeatherData(location);
        
        if (apiData) {
          weatherData = await storage.createWeatherData({
            location,
            temperature: apiData.temperature,
            humidity: apiData.humidity,
            windSpeed: apiData.windSpeed,
            uvIndex: apiData.uvIndex,
            rainfall: apiData.rainfall,
            pressure: apiData.pressure,
            description: `${apiData.description} (Source: ${apiData.source})`,
            alerts: apiData.alerts
          });
        } else {
          // Only use Gemini AI if all real APIs fail
          const geminiWeather = await generateWeatherInsights(location);
          weatherData = await storage.createWeatherData({
            location,
            ...geminiWeather,
            description: `${geminiWeather.description} (AI-generated due to API failure)`
          });
        }
      }

      res.json(weatherData);
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ message: "Failed to get weather data" });
    }
  });

  // Market prices
  app.get("/api/market-prices", async (req, res) => {
    try {
      const { crop } = req.query;
      
      let prices;
      if (crop) {
        prices = await storage.getMarketPricesByCrop(crop as string);
      } else {
        prices = await storage.getMarketPrices();
      }

      // If no prices available, fetch from enhanced API with web scraping
      if (prices.length === 0) {
        const crops = ["wheat", "rice", "corn", "sugarcane", "cotton"];
        
        // Try enhanced APIs first (real market data)
        const apiPrices = await enhancedAgricultureAPIs.getMarketPrices(crops);
        
        if (apiPrices.length > 0) {
          for (const price of apiPrices) {
            await storage.createMarketPrice({
              cropName: price.crop,
              price: price.price,
              unit: price.unit,
              market: `${price.market} (${price.source})`,
              location: price.location,
              trend: price.change > 0 ? "up" : price.change < 0 ? "down" : "stable",
              trendPercentage: price.change
            });
          }
          prices = await storage.getMarketPrices();
        } else {
          // Try web scraping as backup
          const scrapedPrices = await webScraperService.scrapeAgriculturalMarketData(crops);
          
          if (scrapedPrices.length > 0) {
            for (const price of scrapedPrices) {
              await storage.createMarketPrice({
                cropName: price.crop,
                price: price.price,
                unit: price.unit,
                market: `${price.market} (${price.source})`,
                location: price.location,
                trend: price.change > 0 ? "up" : price.change < 0 ? "down" : "stable",
                trendPercentage: price.change
              });
            }
            prices = await storage.getMarketPrices();
          } else {
            // Last resort: Gemini-generated market insights
            const predictions = await generateMarketPredictions(crops);
            res.json(predictions.map(p => ({...p, market: `${p.market} (AI-generated due to data unavailability)`})));
            return;
          }
        }
      }

      res.json(prices);
    } catch (error) {
      console.error("Market prices error:", error);
      res.status(500).json({ message: "Failed to get market prices" });
    }
  });

  // Crop recommendations
  app.post("/api/crop-recommendations", async (req, res) => {
    try {
      const { userId, location, soilType, climate, season } = req.body;
      
      // Get real data from enhanced APIs
      const coordinates = await getCoordinatesForLocation(location);
      const lat = coordinates?.lat || 28.6139; // Default to Delhi
      const lon = coordinates?.lon || 77.2090;
      
      const weatherData = await enhancedAgricultureAPIs.getWeatherData(location);
      const soilData = await enhancedAgricultureAPIs.getSoilData(lat, lon);
      
      let recommendations;
      
      if (weatherData && soilData) {
        // Use real API data for scientific recommendations
        recommendations = await enhancedAgricultureAPIs.getCropRecommendations(soilData, weatherData, location);
      }
      
      if (!recommendations) {
        // Fallback to Gemini AI only if all real data sources fail
        recommendations = await getCropRecommendations({
          soilType,
          climate,
          season,
          location,
          temperature: weatherData?.temperature || 25,
          humidity: weatherData?.humidity || 65,
          rainfall: weatherData?.rainfall || 0
        });
      }

      // Store recommendation
      const cropRec = await storage.createCropRecommendation({
        userId,
        cropType: recommendations.recommendedCrops.join(", "),
        soilType,
        climate,
        season,
        confidence: 0.85,
        recommendations: recommendations
      });

      res.json(cropRec);
    } catch (error) {
      console.error("Crop recommendations error:", error);
      res.status(500).json({ message: "Failed to generate crop recommendations" });
    }
  });

  // Get user's crop recommendations
  app.get("/api/crop-recommendations/:userId", async (req, res) => {
    try {
      const recommendations = await storage.getCropRecommendations(req.params.userId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // Pest detection with image upload
  app.post("/api/pest-detection", upload.single("image"), async (req, res) => {
    try {
      const { userId, description } = req.body;
      const imageFile = req.file;

      if (!imageFile) {
        return res.status(400).json({ message: "Image file is required" });
      }

      const imageBase64 = imageFile.buffer.toString('base64');
      
      // Try Plant.id API first
      let pestData = await enhancedAgricultureAPIs.detectPestFromImage(imageBase64);
      
      if (!pestData) {
        // Fallback to Gemini AI
        pestData = await analyzePestImage(imageBase64, description || "");
      }

      // Store detection result
      const detection = await storage.createPestDetection({
        userId,
        imageUrl: `data:${imageFile.mimetype};base64,${imageBase64.substring(0, 100)}...`, // Store truncated for demo
        detectedPest: pestData.pest,
        severity: pestData.severity,
        organicSolution: pestData.organicSolution,
        ayurvedicRemedy: pestData.ayurvedicRemedy,
        confidence: pestData.confidence
      });

      res.json(detection);
    } catch (error) {
      console.error("Pest detection error:", error);
      res.status(500).json({ message: "Failed to analyze image" });
    }
  });

  // Get user's pest detections
  app.get("/api/pest-detections/:userId", async (req, res) => {
    try {
      const detections = await storage.getPestDetections(req.params.userId);
      res.json(detections);
    } catch (error) {
      res.status(500).json({ message: "Failed to get pest detections" });
    }
  });

  // IoT sensor data
  app.post("/api/iot-data", async (req, res) => {
    try {
      const sensorData = insertIotSensorDataSchema.parse(req.body);
      const data = await storage.createIotSensorData(sensorData);
      res.json(data);
    } catch (error) {
      console.error("IoT data error:", error);
      res.status(400).json({ message: "Invalid sensor data" });
    }
  });

  // Get user's IoT sensor data
  app.get("/api/iot-data/:userId", async (req, res) => {
    try {
      const { limit } = req.query;
      let data = await storage.getIotSensorData(req.params.userId);
      
      if (limit) {
        data = data.slice(0, parseInt(limit as string));
      }
      
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to get IoT data" });
    }
  });

  // Get latest IoT sensor reading
  app.get("/api/iot-data/:userId/latest", async (req, res) => {
    try {
      const data = await storage.getLatestIotSensorData(req.params.userId);
      res.json(data || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to get latest IoT data" });
    }
  });

  // Community posts
  app.get("/api/community", async (req, res) => {
    try {
      const { category } = req.query;
      
      let posts;
      if (category) {
        posts = await storage.getCommunityPostsByCategory(category as string);
      } else {
        posts = await storage.getCommunityPosts();
      }
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get community posts" });
    }
  });

  app.post("/api/community", async (req, res) => {
    try {
      const postData = insertCommunityPostSchema.parse(req.body);
      const post = await storage.createCommunityPost(postData);
      res.json(post);
    } catch (error) {
      console.error("Community post error:", error);
      res.status(400).json({ message: "Invalid post data" });
    }
  });

  app.post("/api/community/:id/like", async (req, res) => {
    try {
      const post = await storage.likeCommunityPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
