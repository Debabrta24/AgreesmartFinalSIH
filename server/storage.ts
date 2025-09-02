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
  type InsertApiKey,
  type Medicine,
  type InsertMedicine,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem
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

  // Medicine management
  getMedicines(): Promise<Medicine[]>;
  getMedicine(id: string): Promise<Medicine | undefined>;
  getMedicinesByCategory(category: string): Promise<Medicine[]>;
  getMedicinesByPestTarget(pestTarget: string): Promise<Medicine[]>;
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;
  updateMedicine(id: string, updates: Partial<InsertMedicine>): Promise<Medicine | undefined>;

  // Cart management
  getCartItems(userId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;

  // Order management
  getOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
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
  private medicines: Map<string, Medicine> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private orders: Map<string, Order> = new Map();
  private orderItems: Map<string, OrderItem> = new Map();

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

    // Initialize with sample medicines
    const sampleMedicines: InsertMedicine[] = [
      {
        name: "BioNeem Oil",
        description: "Organic neem-based pesticide for aphids, whiteflies, and mites",
        price: 450,
        category: "organic",
        brand: "EcoFarm",
        imageUrl: "https://images.unsplash.com/photo-1584462841516-0c82e5b6e5e1?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 50,
        pestTargets: ["aphids", "whiteflies", "spider mites", "thrips"],
        activeIngredients: ["Azadirachtin", "Neem oil"],
        usage: "Dilute 5ml in 1 liter of water. Spray in evening hours."
      },
      {
        name: "Copper Fungicide",
        description: "Effective copper-based fungicide for blight and leaf spot diseases",
        price: 320,
        category: "chemical",
        brand: "CropGuard",
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 75,
        pestTargets: ["blight", "leaf spot", "downy mildew", "bacterial diseases"],
        activeIngredients: ["Copper Hydroxide 77%"],
        usage: "Mix 2-3g per liter of water. Apply as foliar spray."
      },
      {
        name: "Turmeric Powder Pesticide",
        description: "Traditional ayurvedic remedy for soil-borne diseases and pests",
        price: 180,
        category: "ayurvedic",
        brand: "AyurAgri",
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 100,
        pestTargets: ["root rot", "cutworms", "soil pests", "fungal diseases"],
        activeIngredients: ["Curcumin", "Essential oils"],
        usage: "Mix 50g in 5 liters of water. Apply around root zone."
      },
      {
        name: "Bt Organic Spray",
        description: "Bacillus thuringiensis based organic caterpillar control",
        price: 680,
        category: "organic",
        brand: "BioCrop",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 40,
        pestTargets: ["caterpillars", "bollworm", "armyworm", "cabbage worm"],
        activeIngredients: ["Bacillus thuringiensis"],
        usage: "Apply 2ml per liter during early larval stage."
      },
      {
        name: "Imidacloprid 17.8% SL",
        description: "Systemic insecticide for sucking pests and soil insects",
        price: 890,
        category: "chemical",
        brand: "AgroTech",
        imageUrl: "https://images.unsplash.com/photo-1628187235627-340f19408f6d?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 60,
        pestTargets: ["aphids", "jassids", "whiteflies", "thrips", "termites"],
        activeIngredients: ["Imidacloprid 17.8%"],
        usage: "Use 0.5ml per liter for foliar spray or soil drench."
      },
      {
        name: "Panchgavya Organic",
        description: "Traditional five-ingredient organic growth promoter and pest deterrent",
        price: 250,
        category: "ayurvedic",
        brand: "VedicFarm",
        imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f0e1f4d2?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 80,
        pestTargets: ["general pests", "plant stress", "nutrient deficiency"],
        activeIngredients: ["Cow dung", "Cow urine", "Milk", "Ghee", "Curd"],
        usage: "Dilute 30ml in 1 liter water. Spray weekly."
      }
    ];

    sampleMedicines.forEach(medicine => {
      const id = randomUUID();
      this.medicines.set(id, {
        ...medicine,
        id,
        brand: medicine.brand || null,
        imageUrl: medicine.imageUrl || null,
        inStock: medicine.inStock ?? null,
        stockQuantity: medicine.stockQuantity || null,
        pestTargets: medicine.pestTargets || null,
        activeIngredients: medicine.activeIngredients || null,
        usage: medicine.usage || null,
        createdAt: new Date()
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
      isActive: apiKey.isActive || null,
      createdAt: new Date(),
      updatedAt: new Date()
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

  // Medicine management methods
  async getMedicines(): Promise<Medicine[]> {
    return Array.from(this.medicines.values());
  }

  async getMedicine(id: string): Promise<Medicine | undefined> {
    return this.medicines.get(id);
  }

  async getMedicinesByCategory(category: string): Promise<Medicine[]> {
    return Array.from(this.medicines.values()).filter(med => med.category === category);
  }

  async getMedicinesByPestTarget(pestTarget: string): Promise<Medicine[]> {
    return Array.from(this.medicines.values()).filter(med => 
      med.pestTargets && med.pestTargets.some(target => 
        target.toLowerCase().includes(pestTarget.toLowerCase())
      )
    );
  }

  async createMedicine(medicine: InsertMedicine): Promise<Medicine> {
    const id = randomUUID();
    const newMedicine: Medicine = {
      ...medicine,
      id,
      brand: medicine.brand || null,
      imageUrl: medicine.imageUrl || null,
      inStock: medicine.inStock ?? null,
      stockQuantity: medicine.stockQuantity || null,
      pestTargets: medicine.pestTargets || null,
      activeIngredients: medicine.activeIngredients || null,
      usage: medicine.usage || null,
      createdAt: new Date()
    };
    this.medicines.set(id, newMedicine);
    return newMedicine;
  }

  async updateMedicine(id: string, updates: Partial<InsertMedicine>): Promise<Medicine | undefined> {
    const medicine = this.medicines.get(id);
    if (!medicine) return undefined;
    
    const updatedMedicine = { ...medicine, ...updates };
    this.medicines.set(id, updatedMedicine);
    return updatedMedicine;
  }

  // Cart management methods
  async getCartItems(userId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      cartItem => cartItem.userId === item.userId && cartItem.medicineId === item.medicineId
    );

    if (existingItem) {
      // Update quantity if item already exists
      const updatedItem = { ...existingItem, quantity: (existingItem.quantity || 0) + (item.quantity || 1) };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    } else {
      // Add new item
      const id = randomUUID();
      const cartItem: CartItem = {
        ...item,
        id,
        userId: item.userId || null,
        medicineId: item.medicineId || null,
        quantity: item.quantity || 1,
        createdAt: new Date()
      };
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<boolean> {
    const userItems = Array.from(this.cartItems.entries()).filter(
      ([_, item]) => item.userId === userId
    );
    
    userItems.forEach(([id]) => {
      this.cartItems.delete(id);
    });
    
    return true;
  }

  // Order management methods
  async getOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const newOrder: Order = {
      ...order,
      id,
      userId: order.userId || null,
      status: order.status || null,
      deliveryAddress: order.deliveryAddress || null,
      createdAt: new Date()
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const newOrderItem: OrderItem = {
      ...orderItem,
      id,
      orderId: orderItem.orderId || null,
      medicineId: orderItem.medicineId || null,
      createdAt: new Date()
    };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }
}

export const storage = new MemStorage();
