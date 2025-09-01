import { apiRequest } from "./queryClient";

export interface LoginRequest {
  email: string;
  username?: string;
}

export interface CropRecommendationRequest {
  userId: string;
  location: string;
  soilType: string;
  climate: string;
  season: string;
}

export interface PestDetectionRequest {
  userId: string;
  description?: string;
}

export interface IoTDataRequest {
  userId: string;
  sensorType: string;
  soilMoisture?: number;
  temperature?: number;
  lightIntensity?: number;
  soilPh?: number;
  location?: string;
}

export interface CommunityPostRequest {
  userId: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
}

// Authentication
export async function login(data: LoginRequest) {
  const response = await apiRequest("POST", "/api/auth/login", data);
  return response.json();
}

export async function getCurrentUser(userId: string) {
  const response = await apiRequest("GET", `/api/auth/me/${userId}`);
  return response.json();
}

export async function updateUser(userId: string, data: Partial<LoginRequest>) {
  const response = await apiRequest("PATCH", `/api/auth/me/${userId}`, data);
  return response.json();
}

// Weather
export async function getWeatherData(location: string) {
  const response = await apiRequest("GET", `/api/weather/${encodeURIComponent(location)}`);
  return response.json();
}

// Market Prices
export async function getMarketPrices(crop?: string) {
  const url = crop ? `/api/market-prices?crop=${encodeURIComponent(crop)}` : "/api/market-prices";
  const response = await apiRequest("GET", url);
  return response.json();
}

// Crop Recommendations
export async function getCropRecommendations(data: CropRecommendationRequest) {
  const response = await apiRequest("POST", "/api/crop-recommendations", data);
  return response.json();
}

export async function getUserCropRecommendations(userId: string) {
  const response = await apiRequest("GET", `/api/crop-recommendations/${userId}`);
  return response.json();
}

// Pest Detection
export async function uploadPestImage(userId: string, imageFile: File, description?: string) {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("userId", userId);
  if (description) {
    formData.append("description", description);
  }

  const response = await fetch("/api/pest-detection", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text}`);
  }

  return response.json();
}

export async function getUserPestDetections(userId: string) {
  const response = await apiRequest("GET", `/api/pest-detections/${userId}`);
  return response.json();
}

// IoT Data
export async function submitIoTData(data: IoTDataRequest) {
  const response = await apiRequest("POST", "/api/iot-data", data);
  return response.json();
}

export async function getUserIoTData(userId: string, limit?: number) {
  const url = limit ? `/api/iot-data/${userId}?limit=${limit}` : `/api/iot-data/${userId}`;
  const response = await apiRequest("GET", url);
  return response.json();
}

export async function getLatestIoTData(userId: string) {
  const response = await apiRequest("GET", `/api/iot-data/${userId}/latest`);
  return response.json();
}

// Community
export async function getCommunityPosts(category?: string) {
  const url = category ? `/api/community?category=${encodeURIComponent(category)}` : "/api/community";
  const response = await apiRequest("GET", url);
  return response.json();
}

export async function createCommunityPost(data: CommunityPostRequest) {
  const response = await apiRequest("POST", "/api/community", data);
  return response.json();
}

export async function likeCommunityPost(postId: string) {
  const response = await apiRequest("POST", `/api/community/${postId}/like`);
  return response.json();
}
