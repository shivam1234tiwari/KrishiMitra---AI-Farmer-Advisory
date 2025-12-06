// Main Application JavaScript
class KrishiMitraApp {
    constructor() {
        this.currentUser = null;
        this.currentLanguage = 'en';
        this.currentTheme = 'light';
        this.isChatOpen = false;
        this.speechSynthesis = window.speechSynthesis;
        this.speechRecognition = null;
        this.isSpeaking = false;
        this.isListening = false;
        
        this.init();
    }
    
    init() {
        this.loadUserData();
        this.loadTheme();
        this.loadLanguage();
        this.setupEventListeners();
        this.animateElements();
        this.checkAuth();
    }
    
    // Load user data from localStorage
    loadUserData() {
        const userData = localStorage.getItem('krishimitra_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }
    
    // Save user data to localStorage
    saveUserData() {
        if (this.currentUser) {
            localStorage.setItem('krishimitra_user', JSON.stringify(this.currentUser));
        }
    }
    
    // Load theme preference
    loadTheme() {
        const savedTheme = localStorage.getItem('krishimitra_theme') || 'light';
        this.setTheme(savedTheme);
    }
    
    // Set theme
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('krishimitra_theme', theme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    // Toggle theme
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
    
    // Load language preference
    loadLanguage() {
        const savedLang = localStorage.getItem('krishimitra_language') || 'en';
        this.setLanguage(savedLang);
    }
    
    // Set language
    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('krishimitra_language', lang);
        
        const languageSelectors = document.querySelectorAll('#currentLanguage, #siteLanguage');
        languageSelectors.forEach(select => {
            if (select) select.value = lang;
        });
        
        // Update UI text based on language
        this.updateUIText(lang);
    }
    
    // Update UI text based on language
    updateUIText(lang) {
        const translations = {
            en: {
                'welcome': 'Welcome to KrishiMitra',
                'askQuestion': 'Ask Your Question',
                // Add more translations as needed
            },
            hi: {
                'welcome': 'कृषिमित्र में आपका स्वागत है',
                'askQuestion': 'अपना प्रश्न पूछें',
            },
            ml: {
                'welcome': 'കൃഷിമിത്രിലേക്ക് സ്വാഗതം',
                'askQuestion': 'നിങ്ങളുടെ ചോദ്യം ചോദിക്കുക',
            },
            ta: {
                'welcome': 'கிருஷிமித்ராவிற்கு வரவேற்கிறோம்',
                'askQuestion': 'உங்கள் கேள்வியைக் கேளுங்கள்',
            }
        };
        
        const langData = translations[lang] || translations.en;
        
        // Update elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (langData[key]) {
                element.textContent = langData[key];
            }
        });
    }
    
    // Check authentication status
    checkAuth() {
        const authRequiredPages = ['profile', 'support'];
        const currentPage = this.getCurrentPage();
        
        if (authRequiredPages.includes(currentPage) && !this.currentUser) {
            window.location.href = 'login.html';
            return;
        }
        
        this.updateAuthUI();
    }
    
    // Get current page name
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');
        return page === '' ? 'index' : page;
    }
    
    // Update authentication UI
    updateAuthUI() {
        const userProfile = document.getElementById('userProfile');
        const authButtons = document.getElementById('authButtons');
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        
        if (this.currentUser && userProfile) {
            if (authButtons) authButtons.style.display = 'none';
            userProfile.style.display = 'flex';
            
            if (userName) {
                userName.textContent = this.currentUser.name;
            }
            
            if (userAvatar) {
                userAvatar.textContent = this.currentUser.name.charAt(0).toUpperCase();
            }
        }
    }
    
    // Setup all event listeners
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Language selector
        const languageSelectors = document.querySelectorAll('#currentLanguage, #siteLanguage');
        languageSelectors.forEach(select => {
            if (select) {
                select.addEventListener('change', (e) => {
                    this.setLanguage(e.target.value);
                });
            }
        });
        
        // User profile dropdown
        const userProfile = document.getElementById('userProfile');
        if (userProfile) {
            userProfile.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = document.getElementById('profileDropdown');
                dropdown.classList.toggle('show');
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            const dropdown = document.getElementById('profileDropdown');
            if (dropdown) dropdown.classList.remove('show');
        });
        
        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                const navMenu = document.getElementById('navMenu');
                navMenu.classList.toggle('show');
            });
        }
        
        // AI Chat functionality
        this.setupChatFunctionality();
        
        // Signup form validation
        this.setupSignupForm();
        
        // Login form
        this.setupLoginForm();
        
        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        
        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = btn.getAttribute('data-page') || 'index';
                window.location.href = `${targetPage}.html`;
            });
        });
        
        // Resource cards
        document.querySelectorAll('.resource-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('a')) {
                    const resourceId = card.getAttribute('data-resource');
                    this.showResourceDetails(resourceId);
                }
            });
        });
        
        // Support buttons
        document.querySelectorAll('.support-card .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.textContent.toLowerCase();
                this.handleSupportAction(action);
            });
        });
        
        // Quick question buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                this.askQuestion(question);
            });
        });
        
        // Animation triggers
        this.setupAnimationObservers();
    }
    
    // Setup AI chat functionality
    setupChatFunctionality() {
        const askQuestionBtn = document.getElementById('askQuestionBtn');
        const closeChatBtn = document.getElementById('closeChatBtn');
        const sendMessageBtn = document.getElementById('sendMessageBtn');
        const chatInput = document.getElementById('chatInput');
        const inputMethods = document.querySelectorAll('.input-method');
        const voiceQueryBtn = document.getElementById('voiceQueryBtn');
        const imageUpload = document.getElementById('imageUpload');
        
        // Open chat
        if (askQuestionBtn) {
            askQuestionBtn.addEventListener('click', () => {
                this.openChat();
            });
        }
        
        // Close chat
        if (closeChatBtn) {
            closeChatBtn.addEventListener('click', () => {
                this.closeChat();
            });
        }
        
        // Send message
        if (sendMessageBtn && chatInput) {
            sendMessageBtn.addEventListener('click', () => {
                const message = chatInput.value.trim();
                if (message) {
                    this.sendMessage(message);
                    chatInput.value = '';
                }
            });
            
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const message = chatInput.value.trim();
                    if (message) {
                        this.sendMessage(message);
                        chatInput.value = '';
                    }
                }
            });
        }
        
        // Input method selection
        inputMethods.forEach(method => {
            method.addEventListener('click', () => {
                inputMethods.forEach(m => m.classList.remove('active'));
                method.classList.add('active');
                
                const type = method.getAttribute('data-type');
                this.setInputMethod(type);
            });
        });
        
        // Voice query
        if (voiceQueryBtn) {
            voiceQueryBtn.addEventListener('click', () => {
                this.startVoiceInput();
            });
        }
        
        // Image upload
        if (imageUpload) {
            imageUpload.addEventListener('change', (e) => {
                this.handleImageUpload(e.target.files[0]);
            });
        }
        
        // Read aloud buttons
        document.querySelectorAll('.ai-speak-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.closest('.resource-content').textContent;
                this.speakText(content);
            });
        });
    }
    
    // Open chat interface
    openChat() {
        const chatSection = document.getElementById('aiChatSection');
        if (chatSection) {
            chatSection.classList.add('show');
            this.isChatOpen = true;
            
            // Scroll to chat
            setTimeout(() => {
                chatSection.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    }
    
    // Close chat interface
    closeChat() {
        const chatSection = document.getElementById('aiChatSection');
        if (chatSection) {
            chatSection.classList.remove('show');
            this.isChatOpen = false;
        }
    }
    
    // Set input method
    setInputMethod(type) {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput) return;
        
        switch(type) {
            case 'voice':
                chatInput.placeholder = 'Click microphone to speak your question...';
                break;
            case 'image':
                chatInput.placeholder = 'Upload an image of your crop for analysis...';
                break;
            default:
                chatInput.placeholder = 'Type your farming question here... (e.g., How to treat leaf spot in banana?)';
        }
    }
    
    // Send message to AI
    async sendMessage(message) {
        const chatBody = document.getElementById('chatBody');
        if (!chatBody) return;
        
        // Add user message
        this.addMessage(message, 'user');
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Remove typing indicator
            this.removeTypingIndicator();
            
            // Add AI response
            this.addMessage(response, 'ai');
            
            // Auto-scroll to bottom
            chatBody.scrollTop = chatBody.scrollHeight;
            
            // Save to query history
            this.saveToQueryHistory(message, response);
            
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'ai');
            console.error('AI Response Error:', error);
        }
    }
    
    // Add message to chat
    addMessage(text, sender) {
        const chatBody = document.getElementById('chatBody');
        if (!chatBody) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <p>${this.escapeHtml(text)}</p>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    // Show typing indicator
    showTypingIndicator() {
        const chatBody = document.getElementById('chatBody');
        if (!chatBody) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        chatBody.appendChild(typingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    // Remove typing indicator
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Get AI response (simulated for demo)
    async getAIResponse(query) {
        // In a real application, this would call your backend API
        // For demo purposes, we'll simulate responses
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const responses = this.getMockAIResponse(query);
                resolve(responses);
            }, 1500);
        });
    }
    
    // Get mock AI response based on query
    getMockAIResponse(query) {
        const lowerQuery = query.toLowerCase();
        
        if (lowerQuery.includes('paddy') || lowerQuery.includes('rice')) {
            return `For paddy cultivation in Kerala, the best sowing time is:
            
1. **Viruppu (April-May)**: Sow in April-May, harvest in September-October
2. **Mundakan (August-September)**: Sow in August-September, harvest in December-January
3. **Puncha (December-January)**: Sow in December-January, harvest in April-May

**Current Recommendations**:
- Use high-yielding varieties like Jyothi, Uma, or MO 16
- Apply basal dose of NPK 60:30:30 kg/ha
- Maintain 2-5 cm water depth during vegetative stage
- Monitor for blast disease and stem borer`;
            
        } else if (lowerQuery.includes('banana') && lowerQuery.includes('leaf')) {
            return `Based on your query about banana leaf issues, here's my analysis:

**Likely Issue**: Sigatoka Leaf Spot Disease

**Symptoms**:
- Small yellow spots on leaves
- Spots enlarge and turn brown with yellow halo
- Leaves dry up and die prematurely

**Treatment**:
1. **Chemical Control**: Spray Mancozeb (2g/L) or Chlorothalonil (2g/L) at 15-day intervals
2. **Organic Control**: Apply neem oil spray (5ml/L) with soap solution
3. **Cultural Practice**: Remove infected leaves, ensure proper spacing (2m x 2m)

**Prevention**:
- Use disease-free planting material
- Avoid overhead irrigation
- Maintain field sanitation`;
            
        } else if (lowerQuery.includes('tomato') && lowerQuery.includes('worm')) {
            return `For tomato fruit worm control, here are effective organic methods:

**Organic Pesticides**:
1. **Neem Oil Spray**: Mix 5ml neem oil + 2ml soap in 1L water, spray weekly
2. **Garlic-Chilli Spray**: Blend 10 garlic cloves + 5 chillies in 1L water, strain and spray
3. **BT (Bacillus thuringiensis)**: Use 1g/L water, effective against caterpillars

**Cultural Control**:
- Handpick and destroy infected fruits
- Use yellow sticky traps for monitoring
- Practice crop rotation with non-solanaceous crops

**Recommended Timing**: Spray in evening hours for best results`;
            
        } else if (lowerQuery.includes('market') || lowerQuery.includes('price')) {
            return `Here are current market prices (approximate) for major crops:

**Kerala Market Prices (per kg)**:
- Coconut: ₹35-40
- Banana (Nendran): ₹25-30
- Rice (Ponni): ₹45-50
- Black Pepper: ₹450-500
- Rubber: ₹170-180

**Market Trends**:
- Coconut prices expected to rise by 10% in next month
- Banana demand increasing in urban markets
- Government MSP for paddy: ₹19/kg

**Selling Tips**:
- Sell coconut in bunches for better price
- Grade banana by size for premium pricing
- Check e-NAM portal for real-time prices`;
            
        } else if (lowerQuery.includes('weather') || lowerQuery.includes('rain')) {
            return `**Weather Advisory for Kerala**:

**Current Conditions**:
- Temperature: 28-32°C
- Humidity: 75-85%
- Rainfall: Expected 20-30mm in next 24 hours

**Farming Recommendations**:
1. **Rice Fields**: Maintain proper water level, drain excess water
2. **Vegetables**: Delay spraying operations, harvest mature produce
3. **Coconut**: Check for waterlogging, apply potash if heavy rains continue

**7-Day Forecast**:
- Tomorrow: Moderate rain (15-25mm)
- Day 3-4: Light showers (5-10mm)
- Day 5-7: Partly cloudy, good for field operations

**Alerts**: Yellow alert for heavy rain in northern districts`;
            
        } else {
            return `Thank you for your question about "${query}". 

As your KrishiMitra AI assistant, I can help you with:

🌱 **Crop Cultivation**: Best practices, sowing times, harvesting
🐛 **Pest & Disease Management**: Identification and treatment
🌧️ **Weather Advisory**: Localized weather and farming recommendations
💰 **Market Intelligence**: Prices, demand, selling strategies
🧪 **Soil Health**: Testing, fertilizer recommendations
📚 **Government Schemes**: Subsidies, loans, support programs

Please provide more details about your specific farming situation (crop type, location, problem description) for more precise advice.

You can also:
- Upload a photo of your crop for disease diagnosis
- Ask about current market prices
- Get weather-based farming recommendations`;
        }
    }
    
    // Save query to history
    saveToQueryHistory(question, answer) {
        if (!this.currentUser) return;
        
        const history = JSON.parse(localStorage.getItem('query_history') || '[]');
        
        const query = {
            id: Date.now(),
            question,
            answer,
            timestamp: new Date().toISOString(),
            language: this.currentLanguage
        };
        
        history.unshift(query);
        
        // Keep only last 50 queries
        if (history.length > 50) {
            history.pop();
        }
        
        localStorage.setItem('query_history', JSON.stringify(history));
    }
    
    // Start voice input
    startVoiceInput() {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            this.showToast('Voice recognition not supported in your browser', 'error');
            return;
        }
        
        if (this.isListening) {
            this.stopVoiceInput();
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.speechRecognition = new SpeechRecognition();
        
        this.speechRecognition.continuous = false;
        this.speechRecognition.interimResults = false;
        this.speechRecognition.lang = this.getSpeechLanguage();
        
        this.speechRecognition.onstart = () => {
            this.isListening = true;
            this.showToast('Listening... Speak now', 'info');
        };
        
        this.speechRecognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.value = transcript;
                this.sendMessage(transcript);
            }
        };
        
        this.speechRecognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.showToast('Error recognizing speech. Please try again.', 'error');
            this.isListening = false;
        };
        
        this.speechRecognition.onend = () => {
            this.isListening = false;
        };
        
        this.speechRecognition.start();
    }
    
    // Stop voice input
    stopVoiceInput() {
        if (this.speechRecognition) {
            this.speechRecognition.stop();
            this.isListening = false;
        }
    }
    
    // Get speech recognition language
    getSpeechLanguage() {
        const langMap = {
            'en': 'en-IN',
            'hi': 'hi-IN',
            'ml': 'ml-IN',
            'ta': 'ta-IN'
        };
        
        return langMap[this.currentLanguage] || 'en-IN';
    }
    
    // Handle image upload
    async handleImageUpload(file) {
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            this.showToast('Please select an image file', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            this.showToast('Image size should be less than 5MB', 'error');
            return;
        }
        
        // Show loading
        this.showToast('Analyzing image...', 'info');
        
        // In real app, upload to server and get AI analysis
        // For demo, simulate analysis
        setTimeout(() => {
            const analysis = this.analyzeImageDemo(file);
            this.addMessage(analysis, 'ai');
            this.showToast('Image analysis complete', 'success');
        }, 2000);
    }
    
    // Demo image analysis
    analyzeImageDemo(file) {
        const analyses = [
            "**Image Analysis Result**:\n\n**Identified**: Rice blast disease\n**Confidence**: 92%\n\n**Treatment**:\n1. Spray Tricyclazole 75% WP @ 0.6g/L\n2. Apply potash fertilizer @ 40kg/ha\n3. Avoid excess nitrogen application\n\n**Prevention**:\n- Use resistant varieties like IR 64\n- Maintain proper plant spacing\n- Avoid water stress",
            
            "**Image Analysis Result**:\n\n**Identified**: Banana Sigatoka leaf spot\n**Confidence**: 88%\n\n**Treatment**:\n1. Spray Mancozeb 2g/L every 15 days\n2. Remove severely infected leaves\n3. Improve air circulation\n\n**Organic Option**:\n- Neem oil 5ml/L + soap solution",
            
            "**Image Analysis Result**:\n\n**Identified**: Coconut red palm weevil damage\n**Confidence**: 95%\n\n**Emergency Treatment**:\n1. Inject Carbofuran 3G @ 10g per palm\n2. Apply neem cake @ 5kg per palm\n3. Remove and burn severely affected palms\n\n**Monitoring**:\n- Use pheromone traps\n- Regular inspection for oozing"
        ];
        
        return analyses[Math.floor(Math.random() * analyses.length)];
    }
    
    // Setup signup form validation
    setupSignupForm() {
        const signupForm = document.getElementById('signupForm');
        if (!signupForm) return;
        
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateSignupForm()) {
                this.handleSignup();
            }
        });
        
        // Real-time validation
        const inputs = signupForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }
    
    // Validate signup form
    validateSignupForm() {
        const form = document.getElementById('signupForm');
        let isValid = true;
        
        const fields = [
            { id: 'fullName', validator: this.validateName },
            { id: 'phone', validator: this.validatePhone },
            { id: 'state', validator: this.validateRequired },
            { id: 'language', validator: this.validateRequired },
            { id: 'password', validator: this.validatePassword },
            { id: 'confirmPassword', validator: (value, form) => this.validateConfirmPassword(value, form) }
        ];
        
        fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input && !field.validator(input.value, form)) {
                this.showFieldError(input, this.getErrorMessage(field.id));
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Validate individual field
    validateField(input) {
        let isValid = true;
        let errorMessage = '';
        
        switch(input.id) {
            case 'fullName':
                isValid = this.validateName(input.value);
                errorMessage = 'Please enter a valid full name (min 3 characters)';
                break;
            case 'phone':
                isValid = this.validatePhone(input.value);
                errorMessage = 'Please enter a valid 10-digit phone number';
                break;
            case 'password':
                isValid = this.validatePassword(input.value);
                errorMessage = 'Password must be at least 8 characters with letters and numbers';
                break;
            case 'confirmPassword':
                const password = document.getElementById('password')?.value;
                isValid = input.value === password;
                errorMessage = 'Passwords do not match';
                break;
            case 'state':
            case 'language':
                isValid = this.validateRequired(input.value);
                errorMessage = 'This field is required';
                break;
        }
        
        if (!isValid) {
            this.showFieldError(input, errorMessage);
        } else {
            this.clearFieldError(input);
        }
        
        return isValid;
    }
    
    // Show field error
    showFieldError(input, message) {
        const errorDiv = input.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
            input.style.borderColor = 'var(--danger)';
        }
    }
    
    // Clear field error
    clearFieldError(input) {
        const errorDiv = input.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.classList.remove('show');
            input.style.borderColor = '';
        }
    }
    
    // Validation methods
    validateName(name) {
        return name && name.trim().length >= 3;
    }
    
    validatePhone(phone) {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone);
    }
    
    validateRequired(value) {
        return value && value.trim() !== '';
    }
    
    validatePassword(password) {
        return password && password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);
    }
    
    validateConfirmPassword(confirmPassword, form) {
        const password = document.getElementById('password')?.value;
        return confirmPassword === password;
    }
    
    // Get error message
    getErrorMessage(fieldId) {
        const messages = {
            'fullName': 'Please enter a valid full name',
            'phone': 'Please enter a valid 10-digit phone number',
            'state': 'Please select your state',
            'language': 'Please select your preferred language',
            'password': 'Password must be at least 8 characters with letters and numbers',
            'confirmPassword': 'Passwords do not match'
        };
        
        return messages[fieldId] || 'This field is required';
    }
    
    // Handle signup
    handleSignup() {
        const form = document.getElementById('signupForm');
        const formData = new FormData(form);
        
        const user = {
            id: Date.now(),
            name: formData.get('fullName'),
            phone: formData.get('phone'),
            state: formData.get('state'),
            language: formData.get('language'),
            createdAt: new Date().toISOString(),
            queries: 0
        };
        
        // Save user
        this.currentUser = user;
        this.saveUserData();
        
        // Save login state
        localStorage.setItem('krishimitra_loggedIn', 'true');
        
        // Show success message
        this.showToast('Account created successfully! Redirecting...', 'success');
        
        // Redirect to main page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
    
    // Setup login form
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;
        
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }
    
    // Handle login
    handleLogin() {
        const phone = document.getElementById('loginPhone')?.value;
        const password = document.getElementById('loginPassword')?.value;
        
        // For demo, accept any valid phone and password
        if (phone && password) {
            // Check if user exists
            let user = this.currentUser;
            
            if (!user) {
                // Create demo user
                user = {
                    id: Date.now(),
                    name: 'Farmer User',
                    phone: phone,
                    state: 'kerala',
                    language: 'en',
                    createdAt: new Date().toISOString(),
                    queries: 5
                };
            }
            
            this.currentUser = user;
            this.saveUserData();
            localStorage.setItem('krishimitra_loggedIn', 'true');
            
            this.showToast('Login successful!', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            this.showToast('Please enter phone and password', 'error');
        }
    }
    
    // Handle logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('krishimitra_user');
        localStorage.removeItem('krishimitra_loggedIn');
        
        this.showToast('Logged out successfully', 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
    
    // Show resource details
    showResourceDetails(resourceId) {
        const resources = {
            'crop-guides': 'crop-guides.html',
            'pest-management': 'pest-management.html',
            'irrigation': 'irrigation.html',
            'organic-farming': 'organic-farming.html',
            'government-schemes': 'schemes.html',
            'market-prices': 'market.html'
        };
        
        if (resources[resourceId]) {
            window.location.href = resources[resourceId];
        } else {
            this.showToast('Resource page coming soon!', 'info');
        }
    }
    
    // Handle support action
    handleSupportAction(action) {
        switch(action) {
            case 'call now':
                window.location.href = 'tel:18001234567';
                break;
            case 'get directions':
                window.open('https://maps.google.com?q=Krishi+Bhavan', '_blank');
                break;
            case 'book appointment':
                this.showAppointmentModal();
                break;
        }
    }
    
    // Show appointment modal
    showAppointmentModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Book Expert Consultation</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="appointmentForm">
                        <div class="form-group">
                            <label>Select Date</label>
                            <input type="date" required min="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="form-group">
                            <label>Select Time Slot</label>
                            <select required>
                                <option value="">Choose time</option>
                                <option>9:00 AM - 10:00 AM</option>
                                <option>10:00 AM - 11:00 AM</option>
                                <option>11:00 AM - 12:00 PM</option>
                                <option>2:00 PM - 3:00 PM</option>
                                <option>3:00 PM - 4:00 PM</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Issue Description</label>
                            <textarea rows="3" placeholder="Briefly describe your farming issue"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Book Appointment</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Form submission
        modal.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.showToast('Appointment booked successfully! Our expert will contact you.', 'success');
            modal.remove();
        });
    }
    
    // Ask question from quick buttons
    askQuestion(question) {
        this.openChat();
        
        // Auto-fill and send after delay
        setTimeout(() => {
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.value = question;
                this.sendMessage(question);
            }
        }, 500);
    }
    
    // Speak text
    speakText(text) {
        if (this.isSpeaking) {
            speechSynthesis.cancel();
            this.isSpeaking = false;
            return;
        }
        
        if (!text.trim()) {
            this.showToast('No text to read', 'warning');
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.getSpeechLanguage();
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => {
            this.isSpeaking = true;
            this.showToast('Reading aloud...', 'info');
        };
        
        utterance.onend = () => {
            this.isSpeaking = false;
        };
        
        utterance.onerror = (error) => {
            console.error('Speech error:', error);
            this.isSpeaking = false;
            this.showToast('Error reading text', 'error');
        };
        
        speechSynthesis.speak(utterance);
    }
    
    // Setup animation observers
    setupAnimationObservers() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const animation = entry.target.getAttribute('data-animation');
                        if (animation) {
                            entry.target.classList.add('animate__animated', `animate__${animation}`);
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            document.querySelectorAll('[data-animation]').forEach(el => {
                observer.observe(el);
            });
        }
    }
    
    // Animate elements on load
    animateElements() {
        // Add floating animations to specific elements
        document.querySelectorAll('.feature-icon').forEach((icon, index) => {
            icon.style.animationDelay = `${index * 0.2}s`;
        });
    }
    
    // Show toast notification
    showToast(message, type = 'info') {
        const container = document.querySelector('.toast-container') || this.createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toast.innerHTML = `
            <i class="${icons[type] || icons.info}"></i>
            <div class="toast-content">
                <h4>${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                <p>${message}</p>
            </div>
        `;
        
        container.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 5000);
        
        // Click to dismiss
        toast.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
    }
    
    // Create toast container if not exists
    createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }
    
    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new KrishiMitraApp();
});