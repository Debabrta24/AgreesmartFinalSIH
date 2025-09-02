import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, real, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  language: text("language").default("en"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cropRecommendations = pgTable("crop_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  cropType: text("crop_type").notNull(),
  soilType: text("soil_type"),
  climate: text("climate"),
  season: text("season"),
  confidence: real("confidence"),
  recommendations: json("recommendations"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pestDetections = pgTable("pest_detections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  imageUrl: text("image_url"),
  detectedPest: text("detected_pest"),
  severity: text("severity"),
  organicSolution: text("organic_solution"),
  ayurvedicRemedy: text("ayurvedic_remedy"),
  confidence: real("confidence"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketPrices = pgTable("market_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cropName: text("crop_name").notNull(),
  price: real("price").notNull(),
  unit: text("unit").default("quintal"),
  market: text("market"),
  location: text("location"),
  trend: text("trend"), // up, down, stable
  trendPercentage: real("trend_percentage"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const weatherData = pgTable("weather_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  temperature: real("temperature"),
  humidity: real("humidity"),
  windSpeed: real("wind_speed"),
  uvIndex: real("uv_index"),
  rainfall: real("rainfall"),
  pressure: real("pressure"),
  description: text("description"),
  alerts: json("alerts"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const iotSensorData = pgTable("iot_sensor_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  sensorType: text("sensor_type").notNull(),
  soilMoisture: real("soil_moisture"),
  temperature: real("temperature"),
  lightIntensity: real("light_intensity"),
  soilPh: real("soil_ph"),
  location: text("location"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category"), // tips, questions, trade
  tags: text("tags").array(),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  keyName: text("key_name").notNull(), // weather, gemini, plantId, nasa, soilGrids
  keyValue: text("key_value").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const medicines = pgTable("medicines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  category: text("category").notNull(), // organic, chemical, ayurvedic
  brand: text("brand"),
  imageUrl: text("image_url"),
  inStock: boolean("in_stock").default(true),
  stockQuantity: integer("stock_quantity").default(100),
  pestTargets: text("pest_targets").array(), // array of pests this medicine treats
  activeIngredients: text("active_ingredients").array(),
  usage: text("usage"), // instructions for use
  createdAt: timestamp("created_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  medicineId: varchar("medicine_id").references(() => medicines.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  totalAmount: real("total_amount").notNull(),
  status: text("status").default("pending"), // pending, confirmed, shipped, delivered
  deliveryAddress: text("delivery_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id),
  medicineId: varchar("medicine_id").references(() => medicines.id),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(), // price at time of order
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  language: true,
  location: true,
});

export const insertCropRecommendationSchema = createInsertSchema(cropRecommendations).omit({
  id: true,
  createdAt: true,
});

export const insertPestDetectionSchema = createInsertSchema(pestDetections).omit({
  id: true,
  createdAt: true,
});

export const insertMarketPriceSchema = createInsertSchema(marketPrices).omit({
  id: true,
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({
  id: true,
});

export const insertIotSensorDataSchema = createInsertSchema(iotSensorData).omit({
  id: true,
  timestamp: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  createdAt: true,
  likes: true,
});

export const insertApiKeySchema = createInsertSchema(apiKeys).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMedicineSchema = createInsertSchema(medicines).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type CropRecommendation = typeof cropRecommendations.$inferSelect;
export type InsertCropRecommendation = z.infer<typeof insertCropRecommendationSchema>;
export type PestDetection = typeof pestDetections.$inferSelect;
export type InsertPestDetection = z.infer<typeof insertPestDetectionSchema>;
export type MarketPrice = typeof marketPrices.$inferSelect;
export type InsertMarketPrice = z.infer<typeof insertMarketPriceSchema>;
export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
export type IotSensorData = typeof iotSensorData.$inferSelect;
export type InsertIotSensorData = z.infer<typeof insertIotSensorDataSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type Medicine = typeof medicines.$inferSelect;
export type InsertMedicine = z.infer<typeof insertMedicineSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
