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
