// AI Service Integration
class AIService {
    constructor() {
        this.baseURL = 'https://api.krishimitra.ai/v1'; // Replace with actual API endpoint
        this.apiKey = null;
        this.isSimulated = true; // For demo purposes
    }
    
    // Initialize with API key
    init(apiKey) {
        this.apiKey = apiKey;
        this.isSimulated = false;
    }
    
    // Get AI response for farming query
    async getResponse(query, language = 'en', context = {}) {
        if (this.isSimulated) {
            return this.getSimulatedResponse(query, language, context);
        }
        
        try {
            const response = await fetch(`${this.baseURL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    query,
                    language,
                    context,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.response;
            
        } catch (error) {
            console.error('AI Service Error:', error);
            // Fallback to simulated response
            return this.getSimulatedResponse(query, language, context);
        }
    }
    
    // Analyze crop image
    async analyzeImage(imageData, language = 'en') {
        if (this.isSimulated) {
            return this.getSimulatedImageAnalysis(imageData, language);
        }
        
        try {
            const response = await fetch(`${this.baseURL}/analyze-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: imageData
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.analysis;
            
        } catch (error) {
            console.error('Image Analysis Error:', error);
            return this.getSimulatedImageAnalysis(imageData, language);
        }
    }
    
    // Get weather advisory
    async getWeatherAdvisory(location, cropType, language = 'en') {
        if (this.isSimulated) {
            return this.getSimulatedWeatherAdvisory(location, cropType, language);
        }
        
        try {
            const response = await fetch(`${this.baseURL}/weather-advisory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    location,
                    crop_type: cropType,
                    language
                })
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.advisory;
            
        } catch (error) {
            console.error('Weather Advisory Error:', error);
            return this.getSimulatedWeatherAdvisory(location, cropType, language);
        }
    }
    
    // Get market prices
    async getMarketPrices(crop, location, language = 'en') {
        if (this.isSimulated) {
            return this.getSimulatedMarketPrices(crop, location, language);
        }
        
        try {
            const response = await fetch(`${this.baseURL}/market-prices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    crop,
                    location,
                    language
                })
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.prices;
            
        } catch (error) {
            console.error('Market Prices Error:', error);
            return this.getSimulatedMarketPrices(crop, location, language);
        }
    }
    
    // Get crop recommendations
    async getCropRecommendations(soilType, season, location, language = 'en') {
        if (this.isSimulated) {
            return this.getSimulatedCropRecommendations(soilType, season, location, language);
        }
        
        try {
            const response = await fetch(`${this.baseURL}/crop-recommendations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    soil_type: soilType,
                    season,
                    location,
                    language
                })
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.recommendations;
            
        } catch (error) {
            console.error('Crop Recommendations Error:', error);
            return this.getSimulatedCropRecommendations(soilType, season, location, language);
        }
    }
    
    // Simulated responses for demo
    getSimulatedResponse(query, language, context) {
        const responses = {
            en: this.getEnglishResponses(),
            hi: this.getHindiResponses(),
            ml: this.getMalayalamResponses(),
            ta: this.getTamilResponses()
        };
        
        const langResponses = responses[language] || responses.en;
        
        // Find matching response based on keywords
        const lowerQuery = query.toLowerCase();
        
        for (const [keywords, response] of Object.entries(langResponses)) {
            const keywordList = keywords.split(',');
            if (keywordList.some(keyword => lowerQuery.includes(keyword.trim()))) {
                return response;
            }
        }
        
        return langResponses.default;
    }
    
    getSimulatedImageAnalysis(imageData, language) {
        const analyses = {
            en: [
                "**Image Analysis Complete**\n\n**Diagnosis**: Rice blast disease confirmed\n**Confidence**: 94%\n\n**Recommended Action**:\n1. Spray Tricyclazole 75% WP @ 0.6g/L immediately\n2. Apply potash fertilizer @ 40kg/ha\n3. Drain excess water from field\n4. Monitor for 7 days, repeat spray if needed",
                
                "**Image Analysis Complete**\n\n**Diagnosis**: Banana Sigatoka leaf spot\n**Confidence**: 89%\n\n**Recommended Action**:\n1. Remove severely infected leaves\n2. Spray Mancozeb 2g/L at 15-day intervals\n3. Improve air circulation around plants\n4. Avoid overhead irrigation",
                
                "**Image Analysis Complete**\n\n**Diagnosis**: Coconut red palm weevil infestation\n**Confidence**: 96%\n\n**Emergency Treatment**:\n1. Inject Carbofuran 3G @ 10g per palm\n2. Apply neem cake @ 5kg per palm\n3. Remove and burn severely affected palms\n4. Install pheromone traps around field"
            ],
            hi: [
                "**छवि विश्लेषण पूर्ण**\n\n**निदान**: धान का ब्लास्ट रोग\n**विश्वसनीयता**: 94%\n\n**अनुशंसित कार्रवाई**:\n1. तुरंत ट्राइसाइक्लाजोल 75% WP @ 0.6g/L छिड़कें\n2. पोटाश उर्वरक @ 40kg/ha डालें\n3. खेत से अतिरिक्त पानी निकालें",
                
                "**छवि विश्लेषण पूर्ण**\n\n**निदान**: केले का सिगाटोका पत्ती धब्बा\n**विश्वसनीयता**: 89%\n\n**अनुशंसित कार्रवाई**:\n1. गंभीर रूप से संक्रमित पत्तियाँ हटाएं\n2. मैन्कोजेब 2g/L 15 दिन के अंतराल पर छिड़कें",
                
                "**छवि विश्लेषण पूर्ण**\n\n**निदान**: नारियल का लाल ताड़ वीविल संक्रमण\n**विश्वसनीयता**: 96%\n\n**आपातकालीन उपचार**:\n1. कार्बोफ्यूरन 3G @ 10g प्रति पेड़ इंजेक्ट करें\n2. नीम केक @ 5kg प्रति पेड़ डालें"
            ]
        };
        
        const langAnalyses = analyses[language] || analyses.en;
        return langAnalyses[Math.floor(Math.random() * langAnalyses.length)];
    }
    
    getSimulatedWeatherAdvisory(location, cropType, language) {
        const advisories = {
            en: `**Weather Advisory for ${location}**\n\n**Current Conditions**:\n- Temperature: 28-32°C\n- Humidity: 75-85%\n- Rainfall: Expected 20-30mm in next 24 hours\n\n**Recommendations for ${cropType}**:\n1. ${cropType === 'rice' ? 'Maintain proper water level, drain excess' : 'Delay spraying operations'}\n2. Harvest mature produce if available\n3. Check for waterlogging issues\n\n**Next 3 Days**:\n- Tomorrow: Moderate rain\n- Day 2: Light showers\n- Day 3: Partly cloudy\n\n**Alert**: Yellow alert for heavy rain`,
            
            hi: `**${location} के लिए मौसम सलाह**\n\n**वर्तमान स्थिति**:\n- तापमान: 28-32°C\n- आर्द्रता: 75-85%\n- वर्षा: अगले 24 घंटे में 20-30mm की संभावना\n\n**${cropType} के लिए सिफारिशें**:\n1. ${cropType === 'rice' ? 'उचित जल स्तर बनाए रखें' : 'छिड़काव कार्य स्थगित करें'}\n2. परिपक्व उपज की कटाई करें\n3. जलभराव की जांच करें\n\n**अगले 3 दिन**:\n- कल: मध्यम वर्षा\n- दिन 2: हल्की बौछारें\n- दिन 3: आंशिक रूप से बादल`
        };
        
        return advisories[language] || advisories.en;
    }
    
    getSimulatedMarketPrices(crop, location, language) {
        const prices = {
            en: `**Market Prices for ${crop} in ${location}**\n\n**Current Rates (per kg)**:\n- Wholesale: ₹${Math.floor(Math.random() * 20) + 20}\n- Retail: ₹${Math.floor(Math.random() * 30) + 30}\n- MSP: ₹${crop === 'paddy' ? '19' : '25'}\n\n**Trend Analysis**:\n- Prices increased by 5% this week\n- Expected to rise further by 3-5%\n- High demand in urban markets\n\n**Best Selling Time**:\n- Early morning: 6-8 AM\n- Avoid weekend afternoons\n\n**Government Support**:\n- MSP available for ${crop}\n- Transport subsidy applicable`,
            
            hi: `**${location} में ${crop} के बाजार भाव**\n\n**वर्तमान दरें (प्रति किलो)**:\n- थोक: ₹${Math.floor(Math.random() * 20) + 20}\n- खुदरा: ₹${Math.floor(Math.random() * 30) + 30}\n- एमएसपी: ₹${crop === 'paddy' ? '19' : '25'}\n\n**रुझान विश्लेषण**:\n- इस सप्ताह कीमतों में 5% की वृद्धि\n- और 3-5% बढ़ने की उम्मीद\n- शहरी बाजारों में अधिक मांग\n\n**सर्वोत्तम बिक्री समय**:\n- सुबह 6-8 बजे\n- सप्ताहांत दोपहर से बचें`
        };
        
        return prices[language] || prices.en;
    }
    
    getSimulatedCropRecommendations(soilType, season, location, language) {
        const recommendations = {
            en: `**Crop Recommendations for ${location}**\n\n**Based on**:\n- Soil Type: ${soilType}\n- Season: ${season}\n- Location: ${location}\n\n**Recommended Crops**:\n1. **Rice**: High-yielding varieties like IR 64\n2. **Vegetables**: Tomato, Brinjal, Okra\n3. **Pulses**: Green gram, Black gram\n4. **Commercial**: Sugarcane, Cotton\n\n**Fertilizer Plan**:\n- NPK: 120:60:40 kg/ha\n- Organic: 10 tons FYM/ha\n- Micronutrients: ZnSO4 @ 25kg/ha\n\n**Irrigation**:\n- Drip irrigation recommended\n- Water requirement: 500-600mm\n\n**Expected Yield**:\n- Rice: 4-5 tons/ha\n- Vegetables: 15-20 tons/ha`,
            
            hi: `**${location} के लिए फसल सिफारिशें**\n\n**आधार पर**:\n- मिट्टी का प्रकार: ${soilType}\n- मौसम: ${season}\n- स्थान: ${location}\n\n**अनुशंसित फसलें**:\n1. **धान**: आईआर 64 जैसी उच्च उपज देने वाली किस्में\n2. **सब्जियां**: टमाटर, बैंगन, भिंडी\n3. **दलहन**: मूंग, उड़द\n4. **वाणिज्यिक**: गन्ना, कपास\n\n**उर्वरक योजना**:\n- एनपीके: 120:60:40 kg/ha\n- जैविक: 10 टन FYM/ha\n- सूक्ष्म पोषक तत्व: ZnSO4 @ 25kg/ha`
        };
        
        return recommendations[language] || recommendations.en;
    }
    
    // Language-specific response templates
    getEnglishResponses() {
        return {
            'paddy,rice,sowing,time': `For paddy cultivation, the optimal sowing times are:\n\n**Kerala Seasons**:\n1. **Viruppu (April-May)**: Sow in April-May\n2. **Mundakan (August-September)**: Sow in Aug-Sep\n3. **Puncha (December-January)**: Sow in Dec-Jan\n\n**Recommendations**:\n- Use certified seeds\n- Prepare seedbed properly\n- Maintain 20x15 cm spacing\n- Apply basal dose of NPK`,
            
            'banana,leaf,spot,disease': `**Banana Leaf Spot Management**:\n\n**Symptoms**: Yellow spots turning brown\n**Causes**: Fungal infection (Sigatoka)\n\n**Treatment**:\n1. Remove infected leaves\n2. Spray Mancozeb 2g/L\n3. Apply neem oil weekly\n\n**Prevention**:\n- Proper spacing (2m x 2m)\n- Good drainage\n- Regular monitoring`,
            
            'tomato,worms,pest,control': `**Tomato Fruit Worm Control**:\n\n**Organic Methods**:\n1. Neem oil spray (5ml/L)\n2. Garlic-chilli extract\n3. BT (Bacillus thuringiensis)\n\n**Cultural Control**:\n- Crop rotation\n- Clean cultivation\n- Trapping with pheromones\n\n**Chemical (if severe)**:\n- Spinosad 45% SC @ 0.4ml/L`,
            
            'coconut,yield,fertilizer': `**Coconut Yield Enhancement**:\n\n**Fertilizer Schedule**:\n- Year 1-3: 500g NPK 19:19:19/palm\n- Year 4+: 1kg NPK + 1kg organic\n\n**Management**:\n- Irrigation: Twice weekly in summer\n- Pest control: Regular monitoring\n- Intercropping: Pineapple, banana\n\n**Expected Yield**:\n- Hybrid: 150-200 nuts/palm/year\n- Traditional: 80-100 nuts/palm/year`,
            
            'weather,rain,irrigation': `**Weather-Based Irrigation Guide**:\n\n**Rainy Season**:\n- Reduce irrigation\n- Ensure drainage\n- Monitor for diseases\n\n**Summer**:\n- Increase frequency\n- Drip irrigation recommended\n- Mulching to retain moisture\n\n**General Rule**:\n- Rice: 2-5 cm water depth\n- Vegetables: Light and frequent\n- Coconut: Basin irrigation`,
            
            'market,price,selling': `**Market Intelligence**:\n\n**Best Selling Practices**:\n1. **Timing**: Early morning (6-8 AM)\n2. **Grading**: Sort by quality and size\n3. **Packaging**: Use clean containers\n\n**Price Trends**:\n- Seasonal variations observed\n- Festive season brings higher prices\n- Government MSP provides safety\n\n**Digital Platforms**:\n- e-NAM for online trading\n- KrishiMitra price alerts\n- Local mandi apps`,
            
            'government,scheme,subsidy': `**Government Schemes for Farmers**:\n\n**Major Schemes**:\n1. **PM-KISAN**: ₹6,000/year direct benefit\n2. **KCC**: Credit up to ₹3 lakhs at 4%\n3. **PMFBY**: Crop insurance premium subsidy\n\n**State Schemes**:\n- Subsidy on seeds and fertilizers\n- Free soil testing\n- Training programs\n\n**How to Apply**:\n- Visit local agriculture office\n- Use Kisan Call Center\n- KrishiMitra assistance available`,
            
            'soil,testing,health': `**Soil Health Management**:\n\n**Testing Frequency**: Every 2-3 years\n**Parameters**: N, P, K, pH, organic carbon\n\n**Amendment Recommendations**:\n- **Acidic soil**: Apply lime\n- **Alkaline soil**: Gypsum application\n- **Low organic matter**: FYM/compost\n\n**Balanced Fertilization**:\n- Based on soil test results\n- Integrated nutrient management\n- Micronutrient application if deficient`,
            
            'default': `Welcome to KrishiMitra AI! I can help you with:\n\n🌱 **Crop Management**: Best practices, sowing times\n🐛 **Pest Control**: Identification and treatment\n🌧️ **Weather Advisory**: Farming recommendations\n💰 **Market Info**: Prices, selling strategies\n🧪 **Soil Health**: Testing and fertilization\n📚 **Govt Schemes**: Subsidies and support\n\nPlease ask your specific farming question for detailed advice.`
        };
    }
    
    getHindiResponses() {
        return {
            'paddy,rice,sowing,time': `धान की खेती के लिए उत्तम बुआई समय:\n\n**केरल के मौसम**:\n1. **विरुप्पु (अप्रैल-मई)**: अप्रैल-मई में बोएं\n2. **मुंडकन (अगस्त-सितंबर)**: अगस्त-सितंबर में बोएं\n3. **पुन्चा (दिसंबर-जनवरी)**: दिसंबर-जनवरी में बोएं\n\n**सिफारिशें**:\n- प्रमाणित बीज का उपयोग करें\n- बीज बिस्तर ठीक से तैयार करें\n- 20x15 सेमी की दूरी बनाए रखें`,
            
            'banana,leaf,spot,disease': `**केले के पत्तों के धब्बे का प्रबंधन**:\n\n**लक्षण**: पीले धब्बे जो भूरे हो जाते हैं\n**कारण**: फंगल संक्रमण\n\n**उपचार**:\n1. संक्रमित पत्तियाँ हटाएं\n2. मैन्कोजेब 2g/L छिड़कें\n3. साप्ताहिक नीम तेल लगाएं\n\n**रोकथाम**:\n- उचित दूरी (2m x 2m)\n- अच्छी जल निकासी`,
            
            'default': `कृषिमित्र एआई में आपका स्वागत है! मैं आपकी मदद कर सकता हूं:\n\n🌱 **फसल प्रबंधन**: उत्तम तरीके, बुआई समय\n🐛 **कीट नियंत्रण**: पहचान और उपचार\n🌧️ **मौसम सलाह**: खेती की सिफारिशें\n💰 **बाजार जानकारी**: कीमतें, बिकनी रणनीतियाँ\n\nकृपया विस्तृत सलाह के लिए अपना विशेष खेती संबंधी प्रश्न पूछें।`
        };
    }
    
    getMalayalamResponses() {
        return {
            'paddy,rice,sowing,time': `നെൽകൃഷിക്ക് ഉത്തമ വിതയ്ക്കൽ സമയം:\n\n**കേരള സീസണുകൾ**:\n1. **വിരുപ്പ് (ഏപ്രിൽ-മെയ്)**: ഏപ്രിൽ-മെയ് മാസങ്ങളിൽ\n2. **മുണ്ടകൻ (ഓഗസ്റ്റ്-സെപ്റ്റംബർ)**: ഓഗ-സെപ്റ്റിൽ\n3. **പുഞ്ച (ഡിസംബർ-ജനുവരി)**: ഡിസം-ജനുവരിയിൽ\n\n**ശുപാർശകൾ**:\n- സർട്ടിഫൈഡ് വിത്തുകൾ ഉപയോഗിക്കുക\n- ശരിയായി മണ്ണൊരുക്കുക\n- 20x15 സെ.മീ. ഇടവേള`,
            
            'default': `കൃഷിമിത്ര AI-യിലേക്ക് സ്വാഗതം! എനിക്ക് നിങ്ങളെ സഹായിക്കാം:\n\n🌱 **കൃഷി മാനേജ്മെന്റ്**: ഉത്തമ രീതികൾ\n🐛 **പുഴു നിയന്ത്രണം**: തിരിച്ചറിയൽ, ചികിത്സ\n🌧️ **കാലാവസ്ഥാ ഉപദേശം**: കൃഷി ശുപാർശകൾ\n💰 **മാർക്കറ്റ് വിവരം**: വിലകൾ, വിൽപ്പന തന്ത്രങ്ങൾ\n\nവിശദമായ ഉപദേശത്തിന് നിങ്ങളുടെ പ്രത്യേക കൃഷി ചോദ്യം ചോദിക്കുക.`
        };
    }
    
    getTamilResponses() {
        return {
            'paddy,rice,sowing,time': `நெல் சாகுபடிக்கு சிறந்த விதைக்கும் நேரம்:\n\n**கேர�ா பருவங்கள்**:\n1. **விருப்பு (ஏப்ரல்-மே)**: ஏப்ரல்-மே மாதங்களில்\n2. **முண்டகன் (ஆகஸ்ட்-செப்டம்பர்)**: ஆக-செப் மாதங்களில்\n3. **புஞ்ச (டிசம்பர்-ஜனவரி)**: டிசம்-ஜனவரியில்\n\n**பரிந்துரைகள்**:\n- சான்றிதழ் விதைகள் பயன்படுத்தவும்\n- சரியாக மண் தயாரிக்கவும்\n- 20x15 செ.மீ. இடைவெளி`,
            
            'default': `கிருஷிமித்ர AI-க்கு வரவேற்கிறோம்! நான் உங்களுக்கு உதவ முடியும்:\n\n🌱 **பயிர் மேலாண்மை**: சிறந்த முறைகள்\n🐛 **பூச்சி கட்டுப்பாடு**: அடையாளம் காணுதல், சிகிச்சை\n🌧️ **வானிலை ஆலோசனை**: விவசாய பரிந்துரைகள்\n💰 **சந்தை தகவல்**: விலைகள், விற்பனை உத்திகள்\n\nவிரிவான ஆலோசனைக்கு உங்கள் குறிப்பிட்ட விவசாய கேள்வியைக் கேளுங்கள்.`
        };
    }
}

// Export for use in main script
window.AIService = AIService;

// Initialize AI Service
const aiService = new AIService();

// For demo purposes, we'll use simulated responses
// In production, initialize with actual API key
// aiService.init('YOUR_API_KEY_HERE');