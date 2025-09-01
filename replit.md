# AgreeGrow - Smart Farming Platform

## Overview

AgreeGrow is a comprehensive smart farming platform that leverages AI, IoT sensors, and real-time data to revolutionize agricultural practices. The platform provides farmers with intelligent tools for crop management, pest detection, market insights, and weather monitoring. Built as a full-stack web application, it combines modern React frontend with Express.js backend, utilizing Google's Gemini AI for agricultural intelligence and PostgreSQL with Drizzle ORM for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds
- **Internationalization**: Custom translation system supporting English, Hindi, Bengali, and Tamil

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules for modern JavaScript features
- **API Pattern**: RESTful APIs with structured route organization
- **File Upload**: Multer middleware for handling image uploads (pest detection)
- **Error Handling**: Centralized error handling with custom error responses
- **Development**: Hot module replacement and development middleware integration

### Data Storage Solutions
- **Database**: PostgreSQL as the primary relational database
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Connection**: Neon Database serverless PostgreSQL for cloud deployment
- **Migrations**: Drizzle Kit for database schema migrations
- **Session Storage**: PostgreSQL-based session storage with connect-pg-simple

### Database Schema Design
- **Users**: Authentication and profile management
- **Crop Recommendations**: AI-generated crop suggestions with confidence scores
- **Pest Detections**: Image analysis results with organic treatment recommendations
- **Market Prices**: Real-time pricing data with trend analysis
- **Weather Data**: Historical and current weather information
- **IoT Sensor Data**: Real-time environmental monitoring data
- **Community Posts**: User-generated content and knowledge sharing

### Authentication and Authorization
- **Approach**: Simplified email-based authentication for demonstration purposes
- **Session Management**: Server-side session storage with PostgreSQL backend
- **User Creation**: Automatic user registration on first login attempt
- **Security**: Basic session-based authentication suitable for prototype environment

### AI and Machine Learning Integration
- **Primary AI**: Google Gemini AI for agricultural intelligence and analysis
- **Computer Vision**: Pest and disease detection from uploaded crop images
- **Natural Language Processing**: Multilingual support and content generation
- **Recommendation Engine**: AI-powered crop recommendations based on environmental conditions
- **Market Analysis**: Predictive analytics for pricing trends and market insights

## External Dependencies

### AI and Machine Learning Services
- **Google Gemini AI**: Core intelligence engine for crop recommendations, pest detection, and agricultural insights
- **Computer Vision APIs**: Image analysis for pest and disease identification

### Weather and Environmental Data
- **OpenWeather API**: Real-time weather data and forecasting
- **Agricultural APIs**: Soil condition monitoring and environmental data integration

### IoT and Hardware Integration
- **ESP32 Compatibility**: Support for popular IoT development boards
- **Sensor Networks**: Integration with soil moisture, temperature, pH, and light sensors
- **Real-time Data Streaming**: Live sensor data visualization and alerts

### Development and Deployment Tools
- **Replit Platform**: Development environment with integrated deployment
- **Vite Plugins**: Development experience enhancements and error overlays
- **TypeScript Compiler**: Type checking and code quality assurance

### Frontend Libraries and Components
- **Radix UI**: Accessible primitive components for complex UI patterns
- **Lucide React**: Comprehensive icon library for consistent visual design
- **React Hook Form**: Form validation and state management
- **Date-fns**: Date manipulation and formatting utilities
- **Class Variance Authority**: Dynamic CSS class generation for component variants

### Database and Storage
- **Neon Database**: Serverless PostgreSQL for scalable data storage
- **Drizzle ORM**: Type-safe database operations and query building
- **Connect PG Simple**: PostgreSQL session store for user authentication