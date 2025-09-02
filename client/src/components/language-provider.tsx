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
    "nav.tools": "Buy Medicine",
    
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
    
    // Dashboard
    "dashboard.title": "Farm Intelligence Dashboard",
    "dashboard.description": "Real-time insights powered by AI and IoT sensors",
    "dashboard.weather": "Weather Today",
    "dashboard.alerts": "Active Alerts",
    "dashboard.prices": "Market Prices",
    "dashboard.sensors": "IoT Sensor Data",
    "dashboard.cropHealth": "Crop Health Status",
    "dashboard.recommendations": "AI Recommendations",
    
    // Features
    "features.title": "Innovative Features",
    "features.description": "Advanced technology for modern farming excellence",
    
    // Footer
    "footer.features": "Features",
    "footer.resources": "Resources",
    "footer.contact": "Contact",
    "footer.apiKeys": "API Keys",
    "footer.manageKeys": "Manage API Keys",
    "footer.rights": "All rights reserved",
    
    // API Keys
    "apiKeys.title": "API Key Management",
    "apiKeys.description": "Configure your external service API keys",
    "apiKeys.weather": "Weather API Key",
    "apiKeys.gemini": "Gemini AI Key",
    "apiKeys.plantId": "Plant ID Key",
    "apiKeys.nasa": "NASA API Key",
    "apiKeys.soilGrids": "SoilGrids Key",
    "apiKeys.add": "Add Key",
    "apiKeys.update": "Update",
    "apiKeys.remove": "Remove",
    "apiKeys.placeholder": "Enter API key...",
    "apiKeys.success": "API key updated successfully",
    "apiKeys.error": "Failed to update API key",
    "apiKeys.confirm": "Are you sure you want to remove this API key?",
    
    // Medicine Store
    "medicine.title": "Agricultural Medicine Store",
    "medicine.description": "Quality organic and chemical solutions for your crop protection needs",
    "medicine.cart": "Cart",
    "medicine.addToCart": "Add to Cart",
    "medicine.addedToCart": "Added to Cart",
    "medicine.cartUpdated": "Cart updated successfully",
    "medicine.cartError": "Failed to update cart",
    "medicine.allCategories": "All Categories",
    "medicine.organic": "Organic",
    "medicine.chemical": "Chemical",
    "medicine.ayurvedic": "Ayurvedic",
    "medicine.searchPlaceholder": "Search medicines, pests, or ingredients...",
    "medicine.effectiveAgainst": "Effective Against",
    "medicine.inStock": "In Stock",
    "medicine.outOfStock": "Out of Stock",
    "medicine.noResults": "No medicines found matching your criteria",
    "medicine.emptyCart": "Your cart is empty",
    "medicine.total": "Total",
    "medicine.checkout": "Proceed to Checkout",
    "medicine.deliveryDetails": "Delivery Details",
    "medicine.orderSummary": "Order Summary",
    "medicine.fullName": "Full Name",
    "medicine.enterFullName": "Enter your full name",
    "medicine.phone": "Phone Number",
    "medicine.enterPhone": "Enter phone number",
    "medicine.address": "Address",
    "medicine.enterAddress": "Enter your complete address",
    "medicine.pincode": "PIN Code",
    "medicine.enterPincode": "Enter 6-digit PIN code",
    "medicine.state": "State",
    "medicine.selectState": "Select state",
    "medicine.city": "City",
    "medicine.selectCity": "Select city",
    "medicine.district": "District",
    "medicine.enterDistrict": "Enter district",
    "medicine.placeOrder": "Place Order",
    "medicine.placingOrder": "Placing Order...",
    "medicine.orderPlaced": "Order Placed Successfully",
    "medicine.orderSuccess": "Your order has been placed and will be delivered soon",
    "medicine.orderError": "Failed to place order. Please try again",
    "medicine.incompleteForm": "Incomplete Information",
    "medicine.fillAllFields": "Please fill all required fields",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "Error occurred",
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.close": "Close",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.viewAll": "View All",
    "common.viewMore": "View More",
    
    // Login
    "login.title": "Welcome to AgreeGrow",
    "login.subtitle": "Smart Farming. Smarter Future.",
    "login.email": "Email",
    "login.username": "Name (Optional)",
    "login.signin": "Sign In",
    "login.demo": "Demo: Use any email to access the platform",
    
    // Language
    "language.title": "Select Your Language",
    "language.english": "English",
    "language.hindi": "Hindi", 
    "language.bengali": "Bengali",
    "language.tamil": "Tamil",
  },
  hi: {
    // Navigation
    "nav.home": "मुख्य",
    "nav.project": "परियोजना विचार",
    "nav.about": "हमारे बारे में",
    "nav.tools": "दवा खरीदें",
    
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
    
    // Dashboard
    "dashboard.title": "कृषि बुद्धिमत्ता डैशबोर्ड",
    "dashboard.description": "AI और IoT सेंसर द्वारा संचालित रीयल-टाइम अंतर्दृष्टि",
    "dashboard.weather": "आज का मौसम",
    "dashboard.alerts": "सक्रिय अलर्ट",
    "dashboard.prices": "बाजार मूल्य",
    "dashboard.sensors": "IoT सेंसर डेटा",
    "dashboard.cropHealth": "फसल स्वास्थ्य स्थिति",
    "dashboard.recommendations": "AI सिफारिशें",
    
    // Features
    "features.title": "नवाचार सुविधाएं",
    "features.description": "आधुनिक खेती की उत्कृष्टता के लिए उन्नत प्रौद्योगिकी",
    
    // Footer
    "footer.features": "सुविधाएं",
    "footer.resources": "संसाधन",
    "footer.contact": "संपर्क",
    "footer.apiKeys": "API कुंजियां",
    "footer.manageKeys": "API कुंजियां प्रबंधित करें",
    "footer.rights": "सभी अधिकार सुरक्षित",
    
    // API Keys
    "apiKeys.title": "API कुंजी प्रबंधन",
    "apiKeys.description": "अपनी बाहरी सेवा API कुंजियों को कॉन्फ़िगर करें",
    "apiKeys.weather": "मौसम API कुंजी",
    "apiKeys.gemini": "Gemini AI कुंजी",
    "apiKeys.plantId": "Plant ID कुंजी",
    "apiKeys.nasa": "NASA API कुंजी",
    "apiKeys.soilGrids": "SoilGrids कुंजी",
    "apiKeys.add": "कुंजी जोड़ें",
    "apiKeys.update": "अपडेट करें",
    "apiKeys.remove": "हटाएं",
    "apiKeys.placeholder": "API कुंजी दर्ज करें...",
    "apiKeys.success": "API कुंजी सफलतापूर्वक अपडेट की गई",
    "apiKeys.error": "API कुंजी अपडेट करने में विफल",
    "apiKeys.confirm": "क्या आप वाकई इस API कुंजी को हटाना चाहते हैं?",
    
    // Medicine Store
    "medicine.title": "कृषि दवा स्टोर",
    "medicine.description": "आपकी फसल सुरक्षा आवश्यकताओं के लिए गुणवत्तापूर्ण जैविक और रासायनिक समाधान",
    "medicine.cart": "कार्ट",
    "medicine.addToCart": "कार्ट में डालें",
    "medicine.addedToCart": "कार्ट में डाला गया",
    "medicine.cartUpdated": "कार्ट सफलतापूर्वक अपडेट हुआ",
    "medicine.cartError": "कार्ट अपडेट नहीं हो सका",
    "medicine.allCategories": "सभी श्रेणियां",
    "medicine.organic": "जैविक",
    "medicine.chemical": "रासायनिक",
    "medicine.ayurvedic": "आयुर्वेदिक",
    "medicine.searchPlaceholder": "दवाएं, कीट या तत्व खोजें...",
    "medicine.effectiveAgainst": "प्रभावी है",
    "medicine.inStock": "स्टॉक में",
    "medicine.outOfStock": "स्टॉक खत्म",
    "medicine.noResults": "आपके मापदंडों से मेल खाने वाली कोई दवा नहीं मिली",
    "medicine.emptyCart": "आपका कार्ट खाली है",
    "medicine.total": "कुल",
    "medicine.checkout": "चेकआउट पर जाएं",
    "medicine.deliveryDetails": "डिलीवरी विवरण",
    "medicine.orderSummary": "ऑर्डर सारांश",
    "medicine.fullName": "पूरा नाम",
    "medicine.enterFullName": "अपना पूरा नाम दर्ज करें",
    "medicine.phone": "फोन नंबर",
    "medicine.enterPhone": "फोन नंबर दर्ज करें",
    "medicine.address": "पता",
    "medicine.enterAddress": "अपना पूरा पता दर्ज करें",
    "medicine.pincode": "पिन कोड",
    "medicine.enterPincode": "6 अंकीय पिन कोड दर्ज करें",
    "medicine.state": "राज्य",
    "medicine.selectState": "राज्य चुनें",
    "medicine.city": "शहर",
    "medicine.selectCity": "शहर चुनें",
    "medicine.district": "जिला",
    "medicine.enterDistrict": "जिला दर्ज करें",
    "medicine.placeOrder": "ऑर्डर दें",
    "medicine.placingOrder": "ऑर्डर दिया जा रहा है...",
    "medicine.orderPlaced": "ऑर्डर सफलतापूर्वक दिया गया",
    "medicine.orderSuccess": "आपका ऑर्डर दिया गया है और जल्द ही डिलीवर होगा",
    "medicine.orderError": "ऑर्डर देने में विफल। कृपया पुनः प्रयास करें",
    "medicine.incompleteForm": "अधूरी जानकारी",
    "medicine.fillAllFields": "कृपया सभी आवश्यक फ़ील्ड भरें",
    
    // Common
    "common.loading": "लोड हो रहा है...",
    "common.error": "त्रुटि हुई",
    "common.submit": "जमा करें",
    "common.cancel": "रद्द करें",
    "common.save": "सेव करें", 
    "common.close": "बंद करें",
    "common.search": "खोजें",
    "common.filter": "फिल्टर",
    "common.viewAll": "सभी देखें",
    "common.viewMore": "और देखें",
    
    // Login
    "login.title": "AgreeGrow में आपका स्वागत है",
    "login.subtitle": "स्मार्ट खेती। स्मार्ट भविष्य।",
    "login.email": "ईमेल",
    "login.username": "नाम (वैकल्पिक)",
    "login.signin": "साइन इन करें",
    "login.demo": "डेमो: प्लेटफॉर्म तक पहुंचने के लिए कोई भी ईमेल का उपयोग करें",
    
    // Language
    "language.title": "अपनी भाषा चुनें",
    "language.english": "अंग्रेजी",
    "language.hindi": "हिंदी",
    "language.bengali": "बंगाली", 
    "language.tamil": "तमिल",
  },
  bn: {
    // Navigation
    "nav.home": "হোম",
    "nav.project": "প্রকল্প ধারণা",
    "nav.about": "আমাদের সম্পর্কে",
    "nav.tools": "ওষুধ কিনুন",
    
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
    
    // Dashboard
    "dashboard.title": "কৃষি বুদ্ধিমত্তা ড্যাশবোর্ড",
    "dashboard.description": "AI এবং IoT সেন্সর দ্বারা চালিত রিয়েল-টাইম অন্তর্দৃষ্টি",
    "dashboard.weather": "আজকের আবহাওয়া",
    "dashboard.alerts": "সক্রিয় সতর্কতা",
    "dashboard.prices": "বাজার মূল্য",
    "dashboard.sensors": "IoT সেন্সর ডেটা",
    "dashboard.cropHealth": "ফসলের স্বাস্থ্য অবস্থা",
    "dashboard.recommendations": "AI সুপারিশ",
    
    // Features
    "features.title": "উদ্ভাবনী বৈশিষ্ট্য",
    "features.description": "আধুনিক চাষাবাদের উৎকর্ষতার জন্য উন্নত প্রযুক্তি",
    
    // Footer
    "footer.features": "বৈশিষ্ট্য",
    "footer.resources": "সম্পদ",
    "footer.contact": "যোগাযোগ",
    "footer.apiKeys": "API চাবি",
    "footer.manageKeys": "API চাবি পরিচালনা করুন",
    "footer.rights": "সকল অধিকার সংরক্ষিত",
    
    // API Keys
    "apiKeys.title": "API চাবি পরিচালনা",
    "apiKeys.description": "আপনার বাহ্যিক সেবা API চাবি কনফিগার করুন",
    "apiKeys.weather": "আবহাওয়া API চাবি",
    "apiKeys.gemini": "Gemini AI চাবি",
    "apiKeys.plantId": "Plant ID চাবি",
    "apiKeys.nasa": "NASA API চাবি",
    "apiKeys.soilGrids": "SoilGrids চাবি",
    "apiKeys.add": "চাবি যোগ করুন",
    "apiKeys.update": "আপডেট করুন",
    "apiKeys.remove": "সরান",
    "apiKeys.placeholder": "API চাবি লিখুন...",
    "apiKeys.success": "API চাবি সফলভাবে আপডেট হয়েছে",
    "apiKeys.error": "API চাবি আপডেট করতে ব্যর্থ",
    "apiKeys.confirm": "আপনি কি নিশ্চিত এই API চাবি সরাতে চান?",
    
    // Medicine Store
    "medicine.title": "কৃষি ওষুধ দোকান",
    "medicine.description": "আপনার ফসল সুরক্ষার প্রয়োজনে মানসম্মত জৈব এবং রাসায়নিক সমাধান",
    "medicine.cart": "কার্ট",
    "medicine.addToCart": "কার্টে যোগ করুন",
    "medicine.addedToCart": "কার্টে যোগ করা হয়েছে",
    "medicine.cartUpdated": "কার্ট সফলভাবে আপডেট হয়েছে",
    "medicine.cartError": "কার্ট আপডেট করতে ব্যর্থ",
    "medicine.allCategories": "সব ক্যাটাগরি",
    "medicine.organic": "জৈব",
    "medicine.chemical": "রাসায়নিক",
    "medicine.ayurvedic": "আয়ুর্বেদিক",
    "medicine.searchPlaceholder": "ওষুধ, কীটপতঙ্গ বা উপাদান খুঁজুন...",
    "medicine.effectiveAgainst": "কার্যকর",
    "medicine.inStock": "স্টকে আছে",
    "medicine.outOfStock": "স্টক নেই",
    "medicine.noResults": "আপনার মাপদণ্ডের সাথে মিলে এমন কোনো ওষুধ পাওয়া যায়নি",
    "medicine.emptyCart": "আপনার কার্ট খালি",
    "medicine.total": "মোট",
    "medicine.checkout": "চেকআউটে যান",
    "medicine.deliveryDetails": "ডেলিভারি বিবরণ",
    "medicine.orderSummary": "অর্ডার সারাংশ",
    "medicine.fullName": "পূর্ণ নাম",
    "medicine.enterFullName": "আপনার পূর্ণ নাম লিখুন",
    "medicine.phone": "ফোন নম্বর",
    "medicine.enterPhone": "ফোন নম্বর লিখুন",
    "medicine.address": "ঠিকানা",
    "medicine.enterAddress": "আপনার সম্পূর্ণ ঠিকানা লিখুন",
    "medicine.pincode": "পিন কোড",
    "medicine.enterPincode": "৬ সংখ্যার পিন কোড লিখুন",
    "medicine.state": "রাজ্য",
    "medicine.selectState": "রাজ্য নির্বাচন করুন",
    "medicine.city": "শহর",
    "medicine.selectCity": "শহর নির্বাচন করুন",
    "medicine.district": "জেলা",
    "medicine.enterDistrict": "জেলা লিখুন",
    "medicine.placeOrder": "অর্ডার দিন",
    "medicine.placingOrder": "অর্ডার দেওয়া হচ্ছে...",
    "medicine.orderPlaced": "অর্ডার সফলভাবে দেওয়া হয়েছে",
    "medicine.orderSuccess": "আপনার অর্ডার দেওয়া হয়েছে এবং শীঘ্রই ডেলিভার হবে",
    "medicine.orderError": "অর্ডার দিতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন",
    "medicine.incompleteForm": "অসম্পূর্ণ তথ্য",
    "medicine.fillAllFields": "অনুগ্রহ করে সব প্রয়োজনীয় ক্ষেত্র পূরণ করুন",
    
    // Common
    "common.loading": "লোড হচ্ছে...",
    "common.error": "ত্রুটি ঘটেছে",
    "common.submit": "জমা দিন",
    "common.cancel": "বাতিল",
    "common.save": "সেভ করুন",
    "common.close": "বন্ধ করুন",
    "common.search": "অনুসন্ধান",
    "common.filter": "ফিল্টার",
    "common.viewAll": "সব দেখুন",
    "common.viewMore": "আরো দেখুন",
    
    // Login
    "login.title": "AgreeGrow এ আপনাকে স্বাগতম",
    "login.subtitle": "স্মার্ট চাষাবাদ। স্মার্ট ভবিষ্যৎ।",
    "login.email": "ইমেইল",
    "login.username": "নাম (ঐচ্ছিক)",
    "login.signin": "সাইন ইন করুন",
    "login.demo": "ডেমো: প্ল্যাটফর্ম অ্যাক্সেস করতে যেকোনো ইমেইল ব্যবহার করুন",
    
    // Language
    "language.title": "আপনার ভাষা নির্বাচন করুন",
    "language.english": "ইংরেজি",
    "language.hindi": "হিন্দি",
    "language.bengali": "বাংলা",
    "language.tamil": "তামিল",
  },
  ta: {
    // Navigation
    "nav.home": "முகப்பு",
    "nav.project": "திட்ட யோசனை",
    "nav.about": "எங்களைப் பற்றி",
    "nav.tools": "மருந்து வாங்கவும்",
    
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
    
    // Dashboard
    "dashboard.title": "கৃষি நுண்ணறிவு டாஷ்போர்டு",
    "dashboard.description": "AI மற்றும் IoT சென்சர்களால் இயக்கப்படும் நிகழ்நேர நுண்ணறிவுகள்",
    "dashboard.weather": "இன்றைய வானிலை",
    "dashboard.alerts": "செயலில் உள்ள எச்சரிக்கைகள்",
    "dashboard.prices": "சந்தை விலைகள்",
    "dashboard.sensors": "IoT சென்சர் தரவு",
    "dashboard.cropHealth": "பயிர் ஆரோக்கிய நிலை",
    "dashboard.recommendations": "AI பரிந்துரைகள்",
    
    // Features
    "features.title": "புதுமையான அம்சங்கள்",
    "features.description": "நவீன விவசாய சிறப்புக்கான மேம்பட்ட தொழில்நுட்பம்",
    
    // Footer
    "footer.features": "அம்சங்கள்",
    "footer.resources": "வளங்கள்",
    "footer.contact": "தொடர்பு",
    "footer.apiKeys": "API விசைகள்",
    "footer.manageKeys": "API விசைகளை நிர்வகிக்கவும்",
    "footer.rights": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை",
    
    // API Keys
    "apiKeys.title": "API விசை நிர்வகிப்பு",
    "apiKeys.description": "உங்கள் வெளிப்புற சேவை API விசைகளை கॉन्फিगर করவும்",
    "apiKeys.weather": "வானிலை API விசை",
    "apiKeys.gemini": "Gemini AI விசை",
    "apiKeys.plantId": "Plant ID விசை",
    "apiKeys.nasa": "NASA API விசை",
    "apiKeys.soilGrids": "SoilGrids விசை",
    "apiKeys.add": "விசை சேர்க்கவும்",
    "apiKeys.update": "புதுப்பிக்கவும்",
    "apiKeys.remove": "அகற்றவும்",
    "apiKeys.placeholder": "API விசையை உள்ளிடவும்...",
    "apiKeys.success": "API விசை வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
    "apiKeys.error": "API விசையை புதुப்பிக்க முडियવিল్లం",
    "apiKeys.confirm": "இந்த API விசையை அகற்ற நீங்கள் உறுதியாக இருக்கிறீர்களா?",
    
    // Medicine Store
    "medicine.title": "விவசாய மருந்து கடை",
    "medicine.description": "உங்கள் பயிர் பாதுகாப்பு தேவைகளுக்கு தரமான இயற்கை மற்றும் ரசாயன தீர்வுகள்",
    "medicine.cart": "கூடை",
    "medicine.addToCart": "கூடையில் சேர்க்கவும்",
    "medicine.addedToCart": "கூடையில் சேர்க்கப்பட்டது",
    "medicine.cartUpdated": "கூடை வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
    "medicine.cartError": "கூடை புதுப்பிக்க முடியவில்லை",
    "medicine.allCategories": "அனைத்து வகைகள்",
    "medicine.organic": "இயற்கை",
    "medicine.chemical": "ரசாயன",
    "medicine.ayurvedic": "ஆயுர்வேத",
    "medicine.searchPlaceholder": "மருந்துகள், பூச்சிகள் அல்லது பொருட்களை தேடுங்கள்...",
    "medicine.effectiveAgainst": "பயனுள்ளது",
    "medicine.inStock": "கையிருப்பில் உள்ளது",
    "medicine.outOfStock": "கையிருப்பில் இல்லை",
    "medicine.noResults": "உங்கள் நிபந்தனைகளுக்கு பொருந்தும் மருந்துகள் எதுவும் கிடைக்கவில்லை",
    "medicine.emptyCart": "உங்கள் கூடை காலியாக உள்ளது",
    "medicine.total": "மொத்தம்",
    "medicine.checkout": "செலுத்துவதற்கு செல்லவும்",
    "medicine.deliveryDetails": "டெலிவரி விவரங்கள்",
    "medicine.orderSummary": "ஆர்டர் சுருக்கம்",
    "medicine.fullName": "முழு பெயர்",
    "medicine.enterFullName": "உங்கள் முழு பெயரை உள்ளிடவும்",
    "medicine.phone": "ஃபோன் எண்",
    "medicine.enterPhone": "ஃபோன் எண்ணை உள்ளிடவும்",
    "medicine.address": "முகவரி",
    "medicine.enterAddress": "உங்கள் முழு முகவரியை உள்ளிடவும்",
    "medicine.pincode": "பின் கோட்",
    "medicine.enterPincode": "6 இலக்க பின் கோட்டை உள்ளிடவும்",
    "medicine.state": "மாநிலம்",
    "medicine.selectState": "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
    "medicine.city": "நகரம்",
    "medicine.selectCity": "நகரத்தைத் தேர்ந்தெடுக்கவும்",
    "medicine.district": "மாவட்டம்",
    "medicine.enterDistrict": "மாவட்டத்தை உள்ளிடவும்",
    "medicine.placeOrder": "ஆர்டர் செய்யவும்",
    "medicine.placingOrder": "ஆர்டர் செய்யப்படுகிறது...",
    "medicine.orderPlaced": "ஆர்டர் வெற்றிகரமாக செய்யப்பட்டது",
    "medicine.orderSuccess": "உங்கள் ஆர்டர் செய்யப்பட்டு விரைவில் டெலிவர் செய்யப்படும்",
    "medicine.orderError": "ஆர்டர் செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்",
    "medicine.incompleteForm": "முழுமையற்ற தகவல்",
    "medicine.fillAllFields": "தயவு செய்து அனைத்து அவசியமான புலங்களையும் நிரப்பவும்",
    
    // Common
    "common.loading": "ஏற்றுகிறது...",
    "common.error": "பிழை ஏற்பட்டது",
    "common.submit": "சமர்பிக்கவும்",
    "common.cancel": "ரத்து செய்",
    "common.save": "சேமிக்கவும்",
    "common.close": "மூடு",
    "common.search": "தேடல்",
    "common.filter": "வடிகட்டி",
    "common.viewAll": "அனைத்தையும் பார்க்கவும்",
    "common.viewMore": "மேலும் பார்க்கவும்",
    
    // Login
    "login.title": "AgreeGrow க்கு வரவேற்கிறோம்",
    "login.subtitle": "ஸ்மார்ட் விவசாயம். ஸ்மார்ட் எதிர்காலம்।",
    "login.email": "மின்னஞ்சல்",
    "login.username": "பெயர் (விருப்பமானது)",
    "login.signin": "உள்நுழைக",
    "login.demo": "டெமோ: தளத்தை அணுக எந்த மின்னஞ்சலையும் பயன்படுத்தவும்",
    
    // Language
    "language.title": "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    "language.english": "ஆங்கிலம்",
    "language.hindi": "ஹிந்தி",
    "language.bengali": "বাংলা",
    "language.tamil": "தமிழ்",
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
