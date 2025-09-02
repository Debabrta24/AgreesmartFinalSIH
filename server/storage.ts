import { 
  type User, 
  type InsertUser,
  type CropRecommendation,
  type InsertCropRecommendation,
  type PestDetection,
  type InsertPestDetection,
  type MarketPrice,
  type InsertMarketPrice,
  type WeatherData,
  type InsertWeatherData,
  type IotSensorData,
  type InsertIotSensorData,
  type CommunityPost,
  type InsertCommunityPost,
  type ApiKey,
  type InsertApiKey
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Crop recommendations
  getCropRecommendations(userId: string): Promise<CropRecommendation[]>;
  createCropRecommendation(recommendation: InsertCropRecommendation): Promise<CropRecommendation>;

  // Pest detection
  getPestDetections(userId: string): Promise<PestDetection[]>;
  createPestDetection(detection: InsertPestDetection): Promise<PestDetection>;

  // Market prices
  getMarketPrices(): Promise<MarketPrice[]>;
  getMarketPricesByCrop(cropName: string): Promise<MarketPrice[]>;
  createMarketPrice(price: InsertMarketPrice): Promise<MarketPrice>;

  // Weather data
  getWeatherData(location: string): Promise<WeatherData | undefined>;
  createWeatherData(weather: InsertWeatherData): Promise<WeatherData>;

  // IoT sensor data
  getIotSensorData(userId: string): Promise<IotSensorData[]>;
  getLatestIotSensorData(userId: string): Promise<IotSensorData | undefined>;
  createIotSensorData(data: InsertIotSensorData): Promise<IotSensorData>;

  // Community posts
  getCommunityPosts(): Promise<CommunityPost[]>;
  getCommunityPostsByCategory(category: string): Promise<CommunityPost[]>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  likeCommunityPost(id: string): Promise<CommunityPost | undefined>;

  // API Key management
  getApiKeys(userId: string): Promise<ApiKey[]>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  updateApiKey(id: string, updates: Partial<InsertApiKey>): Promise<ApiKey | undefined>;
  deleteApiKey(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private cropRecommendations: Map<string, CropRecommendation> = new Map();
  private pestDetections: Map<string, PestDetection> = new Map();
  private marketPrices: Map<string, MarketPrice> = new Map();
  private weatherData: Map<string, WeatherData> = new Map();
  private iotSensorData: Map<string, IotSensorData> = new Map();
  private communityPosts: Map<string, CommunityPost> = new Map();
  private apiKeys: Map<string, ApiKey> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize with some sample market prices
    const samplePrices: InsertMarketPrice[] = [
      { cropName: "Wheat", price: 2150, unit: "quintal", market: "Delhi Mandi", location: "Delhi", trend: "up", trendPercentage: 2.3 },
      { cropName: "Rice", price: 3200, unit: "quintal", market: "Mumbai Mandi", location: "Mumbai", trend: "down", trendPercentage: -1.1 },
      { cropName: "Corn", price: 1850, unit: "quintal", market: "Pune Mandi", location: "Pune", trend: "up", trendPercentage: 0.8 },
      { cropName: "Sugarcane", price: 350, unit: "quintal", market: "Kolkata Mandi", location: "Kolkata", trend: "stable", trendPercentage: 0.2 },
      { cropName: "Cotton", price: 5200, unit: "quintal", market: "Ahmedabad Mandi", location: "Ahmedabad", trend: "up", trendPercentage: 3.5 },
    ];

    samplePrices.forEach(price => {
      const id = randomUUID();
      this.marketPrices.set(id, { 
        ...price, 
        id, 
        unit: price.unit || null,
        market: price.market || null,
        location: price.location || null,
        trend: price.trend || null,
        trendPercentage: price.trendPercentage || null,
        updatedAt: new Date() 
      });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      location: insertUser.location || null,
      language: insertUser.language || null,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getCropRecommendations(userId: string): Promise<CropRecommendation[]> {
    return Array.from(this.cropRecommendations.values()).filter(rec => rec.userId === userId);
  }

  async createCropRecommendation(recommendation: InsertCropRecommendation): Promise<CropRecommendation> {
    const id = randomUUID();
    const rec: CropRecommendation = { 
      ...recommendation, 
      id, 
      userId: recommendation.userId || null,
      soilType: recommendation.soilType || null,
      climate: recommendation.climate || null,
      season: recommendation.season || null,
      confidence: recommendation.confidence || null,
      recommendations: recommendation.recommendations || null,
      createdAt: new Date() 
    };
    this.cropRecommendations.set(id, rec);
    return rec;
  }

  async getPestDetections(userId: string): Promise<PestDetection[]> {
    return Array.from(this.pestDetections.values()).filter(det => det.userId === userId);
  }

  async createPestDetection(detection: InsertPestDetection): Promise<PestDetection> {
    const id = randomUUID();
    const det: PestDetection = { 
      ...detection, 
      id, 
      userId: detection.userId || null,
      imageUrl: detection.imageUrl || null,
      detectedPest: detection.detectedPest || null,
      severity: detection.severity || null,
      organicSolution: detection.organicSolution || null,
      ayurvedicRemedy: detection.ayurvedicRemedy || null,
      confidence: detection.confidence || null,
      createdAt: new Date() 
    };
    this.pestDetections.set(id, det);
    return det;
  }

  async getMarketPrices(): Promise<MarketPrice[]> {
    return Array.from(this.marketPrices.values());
  }

  async getMarketPricesByCrop(cropName: string): Promise<MarketPrice[]> {
    return Array.from(this.marketPrices.values()).filter(price => 
      price.cropName.toLowerCase().includes(cropName.toLowerCase())
    );
  }

  async createMarketPrice(price: InsertMarketPrice): Promise<MarketPrice> {
    const id = randomUUID();
    const marketPrice: MarketPrice = { 
      ...price, 
      id, 
      unit: price.unit || null,
      market: price.market || null,
      location: price.location || null,
      trend: price.trend || null,
      trendPercentage: price.trendPercentage || null,
      updatedAt: new Date() 
    };
    this.marketPrices.set(id, marketPrice);
    return marketPrice;
  }

  async getWeatherData(location: string): Promise<WeatherData | undefined> {
    return Array.from(this.weatherData.values()).find(weather => 
      weather.location.toLowerCase() === location.toLowerCase()
    );
  }

  async createWeatherData(weather: InsertWeatherData): Promise<WeatherData> {
    const id = randomUUID();
    const weatherData: WeatherData = { 
      ...weather, 
      id, 
      temperature: weather.temperature || null,
      humidity: weather.humidity || null,
      windSpeed: weather.windSpeed || null,
      uvIndex: weather.uvIndex || null,
      rainfall: weather.rainfall || null,
      pressure: weather.pressure || null,
      description: weather.description || null,
      alerts: weather.alerts || null,
      updatedAt: new Date() 
    };
    this.weatherData.set(id, weatherData);
    return weatherData;
  }

  async getIotSensorData(userId: string): Promise<IotSensorData[]> {
    return Array.from(this.iotSensorData.values()).filter(data => data.userId === userId);
  }

  async getLatestIotSensorData(userId: string): Promise<IotSensorData | undefined> {
    const userSensorData = await this.getIotSensorData(userId);
    return userSensorData.sort((a, b) => 
      (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0)
    )[0];
  }

  async createIotSensorData(data: InsertIotSensorData): Promise<IotSensorData> {
    const id = randomUUID();
    const sensorData: IotSensorData = { 
      ...data, 
      id, 
      userId: data.userId || null,
      soilMoisture: data.soilMoisture || null,
      temperature: data.temperature || null,
      lightIntensity: data.lightIntensity || null,
      soilPh: data.soilPh || null,
      location: data.location || null,
      timestamp: new Date() 
    };
    this.iotSensorData.set(id, sensorData);
    return sensorData;
  }

  async getCommunityPosts(): Promise<CommunityPost[]> {
    return Array.from(this.communityPosts.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getCommunityPostsByCategory(category: string): Promise<CommunityPost[]> {
    return Array.from(this.communityPosts.values()).filter(post => 
      post.category === category
    );
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const id = randomUUID();
    const communityPost: CommunityPost = { 
      ...post, 
      id, 
      userId: post.userId || null,
      category: post.category || null,
      tags: post.tags || null,
      likes: 0,
      createdAt: new Date() 
    };
    this.communityPosts.set(id, communityPost);
    return communityPost;
  }

  async likeCommunityPost(id: string): Promise<CommunityPost | undefined> {
    const post = this.communityPosts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, likes: (post.likes || 0) + 1 };
    this.communityPosts.set(id, updatedPost);
    return updatedPost;
  }

  async getApiKeys(userId: string): Promise<ApiKey[]> {
    return Array.from(this.apiKeys.values()).filter(key => key.userId === userId);
  }

  async createApiKey(apiKey: InsertApiKey): Promise<ApiKey> {
    const id = randomUUID();
    const newApiKey: ApiKey = {
      ...apiKey,
      id,
      userId: apiKey.userId || null,
      description: apiKey.description || null,
      createdAt: new Date()
    };
    this.apiKeys.set(id, newApiKey);
    return newApiKey;
  }

  async updateApiKey(id: string, updates: Partial<InsertApiKey>): Promise<ApiKey | undefined> {
    const apiKey = this.apiKeys.get(id);
    if (!apiKey) return undefined;
    
    const updatedApiKey = { ...apiKey, ...updates };
    this.apiKeys.set(id, updatedApiKey);
    return updatedApiKey;
  }

  async deleteApiKey(id: string): Promise<boolean> {
    return this.apiKeys.delete(id);
  }
}

export const storage = new MemStorage();
