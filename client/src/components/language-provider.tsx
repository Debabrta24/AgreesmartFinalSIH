import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "hi" | "bn" | "ta";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.project": "Project Idea", 
    "nav.about": "About Us",
    "nav.tools": "Smart Tools",
    
    // Hero section
    "hero.title": "Smart Farming.",
    "hero.subtitle": "Smarter Future.",
    "hero.description": "Revolutionize your farming with AI-powered crop recommendations, real-time IoT monitoring, and intelligent market insights.",
    "hero.start": "Start Smart Farming",
    "hero.demo": "Watch Demo",
    
    // Tools
    "tools.title": "Smart Farming Tools",
    "tools.description": "Comprehensive suite of AI-powered tools to optimize your farming operations",
    "tools.cropDoctor": "Crop Doctor",
    "tools.priceTracker": "Price Tracker",
    "tools.weatherShield": "Weather Shield",
    "tools.iotDashboard": "IoT Dashboard",
    "tools.profitCalculator": "Profit Calculator",
    "tools.cropAdvisor": "Crop Advisor",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "Error occurred",
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.close": "Close",
  },
  hi: {
    // Navigation
    "nav.home": "मुख्य",
    "nav.project": "परियोजना विचार",
    "nav.about": "हमारे बारे में",
    "nav.tools": "स्मार्ट उपकरण",
    
    // Hero section  
    "hero.title": "स्मार्ट खेती।",
    "hero.subtitle": "स्मार्ट भविष्य।",
    "hero.description": "AI-संचालित फसल सिफारिशों, रीयल-टाइम IoT निगरानी और बुद्धिमान बाजार अंतर्दृष्टि के साथ अपनी खेती में क्रांति लाएं।",
    "hero.start": "स्मार्ट खेती शुरू करें",
    "hero.demo": "डेमो देखें",
    
    // Tools
    "tools.title": "स्मार्ट खेती उपकरण",
    "tools.description": "आपकी खेती के संचालन को अनुकूलित करने के लिए AI-संचालित उपकरणों का व्यापक सूट",
    "tools.cropDoctor": "फसल चिकित्सक",
    "tools.priceTracker": "मूल्य ट्रैकर",
    "tools.weatherShield": "मौसम शील्ड",
    "tools.iotDashboard": "IoT डैशबोर्ड",
    "tools.profitCalculator": "लाभ कैलकुलेटर",
    "tools.cropAdvisor": "फसल सलाहकार",
    
    // Common
    "common.loading": "लोड हो रहा है...",
    "common.error": "त्रुटि हुई",
    "common.submit": "जमा करें",
    "common.cancel": "रद्द करें",
    "common.save": "सेव करें",
    "common.close": "बंद करें",
  },
  bn: {
    // Navigation
    "nav.home": "হোম",
    "nav.project": "প্রকল্প ধারণা",
    "nav.about": "আমাদের সম্পর্কে",
    "nav.tools": "স্মার্ট টুলস",
    
    // Hero section
    "hero.title": "স্মার্ট চাষাবাদ।",
    "hero.subtitle": "স্মার্ট ভবিষ্যৎ।",
    "hero.description": "AI-চালিত ফসল সুপারিশ, রিয়েল-টাইম IoT মনিটরিং এবং বুদ্ধিমান বাজার অন্তর্দৃষ্টি দিয়ে আপনার চাষাবাদে বিপ্লব আনুন।",
    "hero.start": "স্মার্ট চাষাবাদ শুরু করুন",
    "hero.demo": "ডেমো দেখুন",
    
    // Tools
    "tools.title": "স্মার্ট চাষাবাদ টুলস",
    "tools.description": "আপনার চাষাবাদের কার্যক্রম অপ্টিমাইজ করার জন্য AI-চালিত টুলসের বিস্তৃত সংগ্রহ",
    "tools.cropDoctor": "ফসল ডাক্তার",
    "tools.priceTracker": "দাম ট্র্যাকার",
    "tools.weatherShield": "আবহাওয়া শিল্ড",
    "tools.iotDashboard": "IoT ড্যাশবোর্ড",
    "tools.profitCalculator": "লাভ ক্যালকুলেটর",
    "tools.cropAdvisor": "ফসল উপদেষ্টা",
    
    // Common
    "common.loading": "লোড হচ্ছে...",
    "common.error": "ত্রুটি ঘটেছে",
    "common.submit": "জমা দিন",
    "common.cancel": "বাতিল",
    "common.save": "সেভ করুন",
    "common.close": "বন্ধ করুন",
  },
  ta: {
    // Navigation
    "nav.home": "முகப்பு",
    "nav.project": "திட்ட யோசனை",
    "nav.about": "எங்களைப் பற்றி",
    "nav.tools": "ஸ்மார்ட் கருவிகள்",
    
    // Hero section
    "hero.title": "ஸ்மார்ட் விவசாயம்।",
    "hero.subtitle": "ஸ்மார்ட் எதிர்காலம்।",
    "hero.description": "AI-இயங்கும் பயிர் பரிந்துரைகள், நிகழ்நேர IoT கண்காணிப்பு மற்றும் அறிவார்ந்த சந்தை நுண்ணறிவுகளுடன் உங்கள் விவசாயத்தில் புரட்சி செய்யுங்கள்।",
    "hero.start": "ஸ்மார்ட் விவசாயத்தைத் தொடங்குங்கள்",
    "hero.demo": "டெமோவைப் பார்க்கவும்",
    
    // Tools
    "tools.title": "ஸ்மார்ட் விவசாய கருவிகள்",
    "tools.description": "உங்கள் விவசாய செயல்பாடுகளை மேம்படுத்த AI-இயங்கும் கருவிகளின் விரிவான தொகுப்பு",
    "tools.cropDoctor": "பயிர் மருத்துவர்",
    "tools.priceTracker": "விலை ட்ராக்கர்",
    "tools.weatherShield": "வானிலை கவசம்",
    "tools.iotDashboard": "IoT டாஷ்போர்டு",
    "tools.profitCalculator": "லாப கணிப்பான்",
    "tools.cropAdvisor": "பயிர் ஆலோசகர்",
    
    // Common
    "common.loading": "ஏற்றுகிறது...",
    "common.error": "பிழை ஏற்பட்டது",
    "common.submit": "சமர்பிக்கவும்",
    "common.cancel": "ரத்து செய்",
    "common.save": "சேமிக்கவும்",
    "common.close": "மூடு",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
