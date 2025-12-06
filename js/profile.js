// Profile Page JavaScript
class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.queryHistory = [];
        this.savedItems = [];
        
        this.init();
    }
    
    init() {
        this.loadUserData();
        this.loadQueryHistory();
        this.loadSavedItems();
        this.setupEventListeners();
        this.renderProfileData();
        this.renderQueryHistory();
        this.renderSavedItems();
    }
    
    loadUserData() {
        const userData = localStorage.getItem('krishimitra_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        } else {
            // Redirect to login if not authenticated
            window.location.href = 'login.html';
        }
    }
    
    loadQueryHistory() {
        const history = localStorage.getItem('query_history');
        this.queryHistory = history ? JSON.parse(history) : [];
    }
    
    loadSavedItems() {
        const saved = localStorage.getItem('saved_resources');
        this.savedItems = saved ? JSON.parse(saved) : [];
    }
    
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
        
        // Query filters
        document.getElementById('filterQueriesBtn')?.addEventListener('click', () => {
            const filters = document.getElementById('queryFilters');
            filters.style.display = filters.style.display === 'none' ? 'grid' : 'none';
        });
        
        // Clear history
        document.getElementById('clearHistoryBtn')?.addEventListener('click', () => {
            this.clearQueryHistory();
        });
        
        // Load more queries
        document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
            this.loadMoreQueries();
        });
        
        // Category filtering for saved items
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.getAttribute('data-category');
                this.filterSavedItems(category);
            });
        });
        
        // Settings form submission
        document.getElementById('profileSettingsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfileSettings();
        });
        
        // Change password
        document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
            this.showChangePasswordModal();
        });
        
        // Delete account
        document.getElementById('deleteAccountBtn')?.addEventListener('click', () => {
            this.showDeleteAccountModal();
        });
        
        // Notification settings save
        document.getElementById('saveNotificationSettingsBtn')?.addEventListener('click', () => {
            this.saveNotificationSettings();
        });
        
        // Language preferences save
        document.getElementById('saveLanguageBtn')?.addEventListener('click', () => {
            this.saveLanguagePreferences();
        });
    }
    
    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Show corresponding tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabName}-tab`) {
                content.classList.add('active');
            }
        });
    }
    
    renderProfileData() {
        if (!this.currentUser) return;
        
        // Update profile header
        document.getElementById('profileName').textContent = this.currentUser.name;
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userAvatar').textContent = this.currentUser.name.charAt(0).toUpperCase();
        
        // Update profile location
        const stateMap = {
            'kerala': 'Kerala',
            'tamilnadu': 'Tamil Nadu',
            'karnataka': 'Karnataka',
            'maharashtra': 'Maharashtra',
            'punjab': 'Punjab'
        };
        
        const location = stateMap[this.currentUser.state] || this.currentUser.state;
        document.getElementById('profileLocation').innerHTML = `
            <i class="fas fa-map-marker-alt"></i> ${location}
        `;
        
        // Update member since
        const joinDate = new Date(this.currentUser.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long'
        });
        document.getElementById('memberSince').innerHTML = `
            <i class="fas fa-calendar-alt"></i> Member since ${joinDate}
        `;
        
        // Update stats
        document.getElementById('totalQueries').textContent = this.queryHistory.length;
        document.getElementById('savedResources').textContent = this.savedItems.length;
        document.getElementById('aiInteractions').textContent = this.currentUser.queries || 0;
        
        // Update usage stats
        document.getElementById('weeklyUsage').textContent = this.getWeeklyUsage();
        document.getElementById('monthlyUsage').textContent = this.getMonthlyUsage();
        document.getElementById('totalUsage').textContent = this.queryHistory.length;
        
        // Populate settings form
        this.populateSettingsForm();
    }
    
    getWeeklyUsage() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        return this.queryHistory.filter(query => {
            return new Date(query.timestamp) >= oneWeekAgo;
        }).length;
    }
    
    getMonthlyUsage() {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        return this.queryHistory.filter(query => {
            return new Date(query.timestamp) >= oneMonthAgo;
        }).length;
    }
    
    renderQueryHistory() {
        const queriesList = document.getElementById('queriesList');
        if (!queriesList) return;
        
        if (this.queryHistory.length === 0) {
            queriesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-question-circle"></i>
                    <h4>No queries yet</h4>
                    <p>Your farming questions and AI responses will appear here</p>
                    <a href="index.html" class="btn btn-primary">
                        <i class="fas fa-robot"></i> Ask AI Now
                    </a>
                </div>
            `;
            return;
        }
        
        // Show only first 10 queries initially
        const visibleQueries = this.queryHistory.slice(0, 10);
        
        queriesList.innerHTML = visibleQueries.map(query => this.createQueryHTML(query)).join('');
        
        // Show load more button if there are more queries
        const loadMoreDiv = document.getElementById('loadMoreQueries');
        if (this.queryHistory.length > 10) {
            loadMoreDiv.style.display = 'block';
        }
    }
    
    createQueryHTML(query) {
        const date = new Date(query.timestamp).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        
        const time = new Date(query.timestamp).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="query-history-item">
                <h4>${this.truncateText(query.question, 100)}</h4>
                <p>${this.truncateText(query.answer, 200)}</p>
                <div class="query-history-footer">
                    <span>${date} • ${time}</span>
                    <span>${this.getLanguageName(query.language)}</span>
                </div>
            </div>
        `;
    }
    
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
    
    getLanguageName(code) {
        const languages = {
            'en': 'English',
            'hi': 'Hindi',
            'ml': 'Malayalam',
            'ta': 'Tamil',
            'te': 'Telugu',
            'kn': 'Kannada'
        };
        return languages[code] || code;
    }
    
    loadMoreQueries() {
        // Implementation for loading more queries
        // This would typically load the next batch of queries from server
        // For demo, we'll just show all remaining queries
        const queriesList = document.getElementById('queriesList');
        const allQueries = this.queryHistory.map(query => this.createQueryHTML(query)).join('');
        queriesList.innerHTML = allQueries;
        document.getElementById('loadMoreQueries').style.display = 'none';
    }
    
    clearQueryHistory() {
        if (confirm('Are you sure you want to clear all your query history? This action cannot be undone.')) {
            this.queryHistory = [];
            localStorage.removeItem('query_history');
            this.renderQueryHistory();
            this.renderProfileData(); // Update stats
            window.app.showToast('Query history cleared successfully', 'success');
        }
    }
    
    renderSavedItems() {
        const savedGrid = document.getElementById('savedItemsGrid');
        if (!savedGrid) return;
        
        if (this.savedItems.length === 0) {
            savedGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bookmark"></i>
                    <h4>No saved items</h4>
                    <p>Save useful resources by clicking the bookmark icon</p>
                    <a href="resources.html" class="btn btn-primary">
                        <i class="fas fa-book"></i> Browse Resources
                    </a>
                </div>
            `;
            return;
        }
        
        savedGrid.innerHTML = this.savedItems.map(item => this.createSavedItemHTML(item)).join('');
    }
    
    createSavedItemHTML(item) {
        return `
            <div class="saved-item" data-category="${item.category}">
                <div class="saved-item-header">
                    <i class="fas fa-${this.getCategoryIcon(item.category)}"></i>
                    <div>
                        <h4>${item.title}</h4>
                        <span class="resource-tag">${item.category}</span>
                    </div>
                    <button class="btn btn-icon btn-sm remove-saved-btn" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <p>${item.description}</p>
                <div class="saved-item-footer">
                    <span class="saved-date">Saved on ${new Date(item.savedAt).toLocaleDateString()}</span>
                    <a href="${item.link}" class="view-btn">
                        View <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    }
    
    getCategoryIcon(category) {
        const icons = {
            'guides': 'book',
            'pests': 'bug',
            'schemes': 'file-contract',
            'market': 'chart-line',
            'soil': 'vial',
            'irrigation': 'tint'
        };
        return icons[category] || 'bookmark';
    }
    
    filterSavedItems(category) {
        const items = document.querySelectorAll('.saved-item');
        items.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    populateSettingsForm() {
        if (!this.currentUser) return;
        
        document.getElementById('settingsName').value = this.currentUser.name;
        document.getElementById('settingsPhone').value = this.currentUser.phone;
        document.getElementById('settingsState').value = this.currentUser.state;
        document.getElementById('settingsLanguage').value = this.currentUser.language;
        
        // Load additional settings from localStorage
        const settings = JSON.parse(localStorage.getItem('user_settings') || '{}');
        
        if (settings.district) {
            document.getElementById('settingsDistrict').value = settings.district;
        }
        
        if (settings.village) {
            document.getElementById('settingsVillage').value = settings.village;
        }
        
        if (settings.units) {
            document.getElementById('settingsUnits').value = settings.units;
        }
        
        if (settings.currency) {
            document.getElementById('settingsCurrency').value = settings.currency;
        }
        
        // Load notification settings
        const notifications = JSON.parse(localStorage.getItem('notification_settings') || '{}');
        
        document.getElementById('weatherAlertsToggle').checked = notifications.weather !== false;
        document.getElementById('priceUpdatesToggle').checked = notifications.prices !== false;
        document.getElementById('aiTipsToggle').checked = notifications.tips !== false;
        document.getElementById('schemeUpdatesToggle').checked = notifications.schemes !== false;
        document.getElementById('appointmentRemindersToggle').checked = notifications.appointments !== false;
        
        // Load privacy settings
        const privacy = JSON.parse(localStorage.getItem('privacy_settings') || '{}');
        
        document.getElementById('twoFactorToggle').checked = privacy.twoFactor || false;
        document.getElementById('dataSharingSelect').value = privacy.dataSharing || 'anonymous';
        document.getElementById('accountVisibilitySelect').value = privacy.visibility || 'public';
    }
    
    saveProfileSettings() {
        const settings = {
            name: document.getElementById('settingsName').value,
            phone: document.getElementById('settingsPhone').value,
            state: document.getElementById('settingsState').value,
            district: document.getElementById('settingsDistrict').value,
            village: document.getElementById('settingsVillage').value
        };
        
        // Update current user
        this.currentUser = { ...this.currentUser, ...settings };
        localStorage.setItem('krishimitra_user', JSON.stringify(this.currentUser));
        
        // Save additional settings
        const userSettings = {
            district: settings.district,
            village: settings.village
        };
        localStorage.setItem('user_settings', JSON.stringify(userSettings));
        
        // Update UI
        this.renderProfileData();
        window.app.showToast('Profile updated successfully', 'success');
    }
    
    saveLanguagePreferences() {
        const preferences = {
            language: document.getElementById('settingsLanguage').value,
            units: document.getElementById('settingsUnits').value,
            currency: document.getElementById('settingsCurrency').value
        };
        
        localStorage.setItem('user_preferences', JSON.stringify(preferences));
        
        // Update app language
        window.app.setLanguage(preferences.language);
        
        window.app.showToast('Preferences saved successfully', 'success');
    }
    
    saveNotificationSettings() {
        const settings = {
            weather: document.getElementById('weatherAlertsToggle').checked,
            prices: document.getElementById('priceUpdatesToggle').checked,
            tips: document.getElementById('aiTipsToggle').checked,
            schemes: document.getElementById('schemeUpdatesToggle').checked,
            appointments: document.getElementById('appointmentRemindersToggle').checked
        };
        
        localStorage.setItem('notification_settings', JSON.stringify(settings));
        window.app.showToast('Notification settings saved', 'success');
    }
    
    showChangePasswordModal() {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Change Password</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="passwordChangeModalForm">
                        <div class="form-group">
                            <label>Current Password</label>
                            <input type="password" id="currentPassword" required>
                        </div>
                        <div class="form-group">
                            <label>New Password</label>
                            <input type="password" id="newPassword" required minlength="8">
                            <small>Minimum 8 characters with letters and numbers</small>
                        </div>
                        <div class="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" id="confirmNewPassword" required>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">
                            Update Password
                        </button>
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
            this.changePassword(
                document.getElementById('currentPassword').value,
                document.getElementById('newPassword').value,
                document.getElementById('confirmNewPassword').value
            );
            modal.remove();
        });
    }
    
    changePassword(current, newPass, confirm) {
        if (newPass !== confirm) {
            window.app.showToast('New passwords do not match', 'error');
            return;
        }
        
        if (newPass.length < 8) {
            window.app.showToast('Password must be at least 8 characters', 'error');
            return;
        }
        
        // In a real app, this would verify current password with server
        // For demo, we'll just show success
        window.app.showToast('Password changed successfully', 'success');
        
        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
    }
    
    showDeleteAccountModal() {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Delete Account</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="warning-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h4>Warning: This action is irreversible</h4>
                        <p>All your data including query history, saved items, and profile information will be permanently deleted.</p>
                    </div>
                    
                    <div class="form-group">
                        <label>Enter your password to confirm</label>
                        <input type="password" id="confirmDeletePassword" required>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn btn-danger" id="confirmDeleteModalBtn">
                            Permanently Delete Account
                        </button>
                        <button class="btn btn-outline" id="cancelDeleteModalBtn">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal buttons
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('#cancelDeleteModalBtn').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Confirm delete
        modal.querySelector('#confirmDeleteModalBtn').addEventListener('click', () => {
            const password = document.getElementById('confirmDeletePassword').value;
            if (password) {
                this.deleteAccount(password);
                modal.remove();
            } else {
                window.app.showToast('Please enter your password', 'error');
            }
        });
    }
    
    deleteAccount(password) {
        // In a real app, this would verify password with server
        // For demo, we'll simulate account deletion
        
        // Clear all user data
        localStorage.removeItem('krishimitra_user');
        localStorage.removeItem('krishimitra_loggedIn');
        localStorage.removeItem('query_history');
        localStorage.removeItem('saved_resources');
        localStorage.removeItem('user_settings');
        localStorage.removeItem('user_preferences');
        localStorage.removeItem('notification_settings');
        localStorage.removeItem('privacy_settings');
        
        window.app.showToast('Account deleted successfully', 'success');
        
        // Redirect to login after delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
}

// Initialize profile manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
});