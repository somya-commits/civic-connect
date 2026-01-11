// Global State Management
let currentUser = null;
let currentComplaint = {
    category: '',
    photo: null,
    location: '',
    title: '',
    description: '',
    urgency: 'medium',
    allowContact: true
};
let currentStep = 1;
let complaints = [
    {
        id: 'CC2025001',
        title: 'Pothole near PCMC building',
        category: 'pothole',
        status: 'progress',
        date: '2025-09-15',
        location: 'Pimpri-Chinchwad Municipal Corporation',
        urgency: 'high',
        lat: 44, lng: 48 // Approximately PCMC building area
    },
    {
        id: 'CC2025002',
        title: 'Broken Street Light at Thergaon',
        category: 'streetlight',
        status: 'resolved',
        date: '2025-09-12',
        location: 'Dange Chowk, Thergaon',
        urgency: 'medium',
        lat: 78, lng: 32 // Approximately Thergaon/Wakad area
    },
    {
        id: 'CC2025003',
        title: 'Garbage overflow at Wakad',
        category: 'garbage',
        status: 'pending',
        date: '2025-09-17',
        location: 'Near Bhumkar Chowk, Wakad',
        urgency: 'high',
        lat: 88, lng: 20 // Approximately near Bhumkar Chowk, Wakad
    },
    {
        id: 'CC2025004',
        title: 'Low water pressure at Nigdi',
        category: 'water',
        status: 'progress',
        date: '2025-09-16',
        location: 'Sector 25, Nigdi',
        urgency: 'medium',
        lat: 25, lng: 18 // Approximately Nigdi area
    },
    {
        id: 'CC2025005',
        title: 'Minor pipeline leak Akurdi',
        category: 'drainage',
        status: 'resolved',
        date: '2025-09-10',
        location: 'Akurdi Railway Station Road',
        urgency: 'low',
        lat: 38, lng: 35 // Approximately Akurdi area
    },
    {
        id: 'CC2025006',
        title: 'Illegal dumping near Spine Road',
        category: 'garbage',
        status: 'pending',
        date: '2025-09-19',
        location: 'Near Spine Road, Indrayani Nagar',
        urgency: 'high',
        lat: 22, lng: 55 // Approximately Spine Road area
    },
    {
        id: 'CC2025007',
        title: 'Damaged footpath in Pimple Saudagar',
        category: 'pothole',
        status: 'pending',
        date: '2025-09-19',
        location: 'Near Kokane Chowk, Pimple Saudagar',
        urgency: 'medium',
        lat: 68, lng: 55 // Approximately Pimple Saudagar area
    },
    {
        id: 'CC2025008',
        title: 'Blocked drainage at Chinchwadgaon',
        category: 'drainage',
        status: 'progress',
        date: '2025-09-18',
        location: 'Near Chinchwadgaon Police Station',
        urgency: 'high',
        lat: 55, lng: 40 // Approximately Chinchwadgaon area
    }
];
let currentRating = 0;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    showLoginPage();
    setupEventListeners();
    requestLocationPermission();
}

// Setup Event Listeners
function setupEventListeners() {
    // Photo upload handler
    const photoInput = document.getElementById('photoInput');
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoUpload);
    }
    
    // Form submissions
    document.addEventListener('submit', handleFormSubmissions);
    
    // Category selection
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => {
            const category = item.getAttribute('onclick').match(/'([^']+)'/)[1];
            selectCategory(category);
        });
    });
}

// Page Navigation Functions
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Load additional pages if needed
    loadAdditionalPages();
}

function showLoginPage() {
    showPage('loginPage');
}

function showUserLogin() {
    showPage('userLoginForm');
}

function showAdminLogin() {
    showPage('adminLoginForm');
}

function showAdminDashboard() {
    showPage('adminDashboardPage');
    loadAdminDashboard();
}

function showUserDashboard() {
    showPage('userDashboard');
    updateUserDashboard();
}

function showRegisterComplaint() {
    showPage('registerComplaintPage');
    resetComplaintForm();
}

function showTrackComplaint() {
    showPage('trackComplaintPage');
    loadComplaints();
}

function showComplaintDetailsPage() {
    showPage('complaintDetailsPage');
}

function showSendReminder() {
    showPage('sendReminderPage');
}

function showFeedback() {
    showPage('feedbackPage');
}

function showAboutUs() {
    showPage('aboutUsPage');
}

function showUserDetails() {
    showPage('userDetailsPage');
    loadUserProfile();
}

// Load Additional Pages
function loadAdditionalPages() {
    const additionalPages = [
        'sendReminderPage',
        'feedbackPage', 
        'aboutUsPage',
        'userDetailsPage'
    ];
    
    additionalPages.forEach(pageId => {
        if (!document.getElementById(pageId)) {
            loadPageContent(pageId);
        }
    });
}

function loadPageContent(pageId) {
    fetch('pages/additional-pages.html')
        .then(response => response.text())
        .then(html => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const pageElement = tempDiv.querySelector(`#${pageId}`);
            if (pageElement) {
                document.body.appendChild(pageElement);
            }
        })
        .catch(error => {
            console.error('Error loading page content:', error);
        });
}

// Authentication Functions
function handleUserLogin(event) {
    event.preventDefault();
    const phone = document.getElementById('userPhone').value;
    const password = document.getElementById('userPassword').value;
    
    if (validateLogin(phone, password)) {
        currentUser = {
            name: 'Devankit Yadav',
            phone: phone,
            type: 'user',
            location: 'Pimpri-Chinchwad, Maharashtra'
        };
        showSuccessMessage('Login successful!');
        setTimeout(() => {
            showUserDashboard();
        }, 1000);
    } else {
        showErrorMessage('Invalid credentials. Please try again.');
    }
}

function handleAdminLogin(event) {
    event.preventDefault();
    const adminId = document.getElementById('adminId').value;
    const password = document.getElementById('adminPassword').value;
    
    if (adminId === 'admin' && password === 'admin123') {
        currentUser = {
            name: 'Admin',
            adminId: adminId,
            type: 'admin'
        };
        showSuccessMessage('Admin login successful!');
        setTimeout(() => {
            showAdminDashboard();
        }, 1000);
    } else {
        showErrorMessage('Invalid admin credentials.');
    }
}

function validateLogin(phone, password) {
    // Simple validation for prototype
    return phone.length >= 10 && password.length >= 6;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        currentComplaint = {
            category: '',
            photo: null,
            location: '',
            title: '',
            description: '',
            urgency: 'medium',
            allowContact: true
        };
        showSuccessMessage('Logged out successfully!');
        setTimeout(() => {
            showLoginPage();
        }, 1000);
    }
}

// Dashboard Functions
function updateUserDashboard() {
    if (currentUser) {
        const userNameElement = document.getElementById('userName');
        const userLocationElement = document.getElementById('userLocation');
        
        if (userNameElement) {
            userNameElement.textContent = `Welcome, ${currentUser.name}!`;
        }
        if (userLocationElement) {
            userLocationElement.textContent = currentUser.location || 'Location not set';
        }
    }
}

// Admin Dashboard Functions
function loadAdminDashboard(filteredComplaints = complaints) {
    const feed = document.getElementById('adminComplaintFeed');
    const map = document.getElementById('mapContainer');

    if (!feed || !map) return;

    feed.innerHTML = '';
    map.innerHTML = '';

    if (filteredComplaints.length === 0) {
        feed.innerHTML = '<p class="no-results">No complaints to display.</p>';
        return;
    }

    filteredComplaints.forEach(complaint => {
        const card = createAdminComplaintCard(complaint);
        feed.appendChild(card);
        plotComplaintOnMap(complaint);
    });
}

function createAdminComplaintCard(complaint) {
    const card = document.createElement('div');
    card.className = `admin-complaint-card urgency-${complaint.urgency}`;
    card.innerHTML = `
        <h5>${complaint.title}</h5>
        <p><i class="fas fa-id-badge"></i> ${complaint.id}</p>
        <p><i class="fas fa-map-marker-alt"></i> ${complaint.location}</p>
    `;
    return card;
}

function plotComplaintOnMap(complaint) {
    const map = document.getElementById('mapContainer');
    if (!map || !complaint.lat || !complaint.lng) return;

    const marker = document.createElement('div');
    marker.className = `complaint-marker urgency-${complaint.urgency}`;
    marker.style.top = `${complaint.lat}%`;
    marker.style.left = `${complaint.lng}%`;
    marker.title = `${complaint.title} (${complaint.urgency})`;
    
    map.appendChild(marker);
}

function filterAdminComplaints(severity) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (severity === 'all') {
        loadAdminDashboard(complaints);
    } else {
        const filtered = complaints.filter(c => c.urgency === severity);
        loadAdminDashboard(filtered);
    }
}


// Complaint Registration Functions
function resetComplaintForm() {
    currentStep = 1;
    currentComplaint = {
        category: '',
        photo: null,
        location: '',
        title: '',
        description: '',
        urgency: 'medium',
        allowContact: true
    };
    
    updateStepIndicator();
    showStep(1);
    clearForm();
}

function selectCategory(category) {
    currentComplaint.category = category;
    
    // Update UI
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    event.target.closest('.category-item').classList.add('selected');
    
    // Enable next button
    const nextBtn = document.getElementById('step1Next');
    if (nextBtn) {
        nextBtn.disabled = false;
    }
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        currentComplaint.photo = file;
        
        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            const placeholder = document.getElementById('uploadPlaceholder');
            const preview = document.getElementById('previewImage');
            
            if (placeholder && preview) {
                placeholder.style.display = 'none';
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    }
}

function getCurrentLocation() {
    const locationInput = document.getElementById('locationInput');
    const locationBtn = document.querySelector('.location-btn');
    
    if (locationBtn) {
        locationBtn.innerHTML = '<div class="loading"></div>';
    }
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Simulate reverse geocoding
                const location = `Pimpri, Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
                currentComplaint.location = location;
                
                if (locationInput) {
                    locationInput.value = location;
                }
                
                if (locationBtn) {
                    locationBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
                }
                
                showSuccessMessage('Location detected successfully!');
            },
            (error) => {
                showErrorMessage('Unable to get location. Please enter manually.');
                if (locationInput) {
                    locationInput.removeAttribute('readonly');
                    locationInput.placeholder = 'Enter your location manually';
                }
                if (locationBtn) {
                    locationBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
                }
            }
        );
    } else {
        showErrorMessage('Geolocation not supported by this browser.');
        if (locationInput) {
            locationInput.removeAttribute('readonly');
            locationInput.placeholder = 'Enter your location manually';
        }
        if (locationBtn) {
            locationBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
        }
    }
}

function nextStep() {
    if (validateCurrentStep()) {
        currentStep++;
        if (currentStep <= 3) {
            updateStepIndicator();
            showStep(currentStep);
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepIndicator();
        showStep(currentStep);
    }
}

function showStep(step) {
    document.querySelectorAll('.form-step').forEach(stepElement => {
        stepElement.classList.remove('active');
    });
    
    const targetStep = document.getElementById(`formStep${step}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }
}

function updateStepIndicator() {
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < currentStep) {
            step.classList.add('completed');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            if (!currentComplaint.category) {
                showErrorMessage('Please select an issue category.');
                return false;
            }
            return true;
        case 2:
            if (!currentComplaint.location) {
                getCurrentLocation();
                return false;
            }
            return true;
        case 3:
            const title = document.getElementById('complaintTitle').value;
            if (!title.trim()) {
                showErrorMessage('Please enter an issue title.');
                return false;
            }
            return true;
        default:
            return true;
    }
}

function handleComplaintSubmission(event) {
    event.preventDefault();
    
    // Collect form data
    currentComplaint.title = document.getElementById('complaintTitle').value;
    currentComplaint.description = document.getElementById('complaintDescription').value;
    currentComplaint.urgency = document.getElementById('urgencyLevel').value;
    currentComplaint.allowContact = document.getElementById('allowContact').checked;
    
    // Generate complaint ID
    const complaintId = `CC${new Date().getFullYear()}${String(complaints.length + 1).padStart(3, '0')}`;
    
    // Create complaint object
    const newComplaint = {
        id: complaintId,
        title: currentComplaint.title,
        category: currentComplaint.category,
        description: currentComplaint.description,
        location: currentComplaint.location,
        urgency: currentComplaint.urgency,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        allowContact: currentComplaint.allowContact,
        photo: currentComplaint.photo,
        lat: Math.floor(Math.random() * 80) + 10, // Random lat for map
        lng: Math.floor(Math.random() * 80) + 10  // Random lng for map
    };
    
    // Add to complaints array
    complaints.unshift(newComplaint);
    
    // Show success message
    showSuccessMessage(`Complaint registered successfully! Your complaint ID is: ${complaintId}`);
    
    // Redirect to dashboard after delay
    setTimeout(() => {
        showUserDashboard();
    }, 3000);
}

// Tracking Functions
function loadComplaints() {
    const complaintsList = document.getElementById('complaintsList');
    if (!complaintsList) return;
    
    complaintsList.innerHTML = '';
    
    complaints.forEach(complaint => {
        const complaintElement = createComplaintElement(complaint);
        complaintsList.appendChild(complaintElement);
    });
}

function createComplaintElement(complaint) {
    const div = document.createElement('div');
    div.className = 'complaint-item';
    div.innerHTML = `
        <div class="complaint-info">
            <h4>${complaint.title}</h4>
            <p class="complaint-id">ID: ${complaint.id}</p>
            <p class="complaint-date">Submitted: ${formatDate(complaint.date)}</p>
        </div>
        <div class="status-badge status-${complaint.status}">
            <i class="fas fa-${getStatusIcon(complaint.status)}"></i>
            ${capitalizeFirst(complaint.status)}
        </div>
    `;
    
    div.addEventListener('click', () => {
        showComplaintDetails(complaint);
    });
    
    return div;
}

function searchComplaints() {
    const searchTerm = document.getElementById('complaintSearch').value.toLowerCase();
    const filteredComplaints = complaints.filter(complaint => 
        complaint.id.toLowerCase().includes(searchTerm) ||
        complaint.title.toLowerCase().includes(searchTerm) ||
        complaint.category.toLowerCase().includes(searchTerm)
    );
    
    const complaintsList = document.getElementById('complaintsList');
    if (!complaintsList) return;
    
    complaintsList.innerHTML = '';
    
    if (filteredComplaints.length === 0) {
        complaintsList.innerHTML = '<p class="no-results">No complaints found matching your search.</p>';
        return;
    }
    
    filteredComplaints.forEach(complaint => {
        const complaintElement = createComplaintElement(complaint);
        complaintsList.appendChild(complaintElement);
    });
}

function showComplaintDetails(complaint) {
    const detailsContent = document.getElementById('complaintDetailsContent');
    if (!detailsContent) return;

    // Dummy data for timeline
    const timelineData = [
        { status: 'Resolved', date: '2025-09-18', icon: 'fa-check' },
        { status: 'In Progress', date: '2025-09-16', icon: 'fa-spinner' },
        { status: 'Submitted', date: complaint.date, icon: 'fa-paper-plane' }
    ];

    let timelineHTML = '<div class="timeline"><h4>Status Timeline</h4>';
    timelineData.forEach(item => {
        if (complaint.status === 'progress' && item.status === 'Resolved') return;
        if (complaint.status === 'pending' && (item.status === 'Resolved' || item.status === 'In Progress')) return;
        timelineHTML += `
            <div class="timeline-item">
                <div class="timeline-icon"><i class="fas ${item.icon}"></i></div>
                <div class="timeline-content">
                    <h5>${item.status}</h5>
                    <p>${formatDate(item.date)}</p>
                </div>
            </div>
        `;
    });
    timelineHTML += '</div>';

    detailsContent.innerHTML = `
        <div class="details-header">
            <h3>${complaint.title}</h3>
            <div class="details-meta">
                <span><i class="fas fa-tag"></i> ${capitalizeFirst(complaint.category)}</span>
                <span><i class="fas fa-id-badge"></i> ID: ${complaint.id}</span>
            </div>
        </div>
        
        <img src="https://via.placeholder.com/400x250.png?text=Issue+Photo" alt="Complaint Photo" class="details-image">
        
        <div class="details-grid">
            <div class="detail-item">
                <label>Location</label>
                <p>${complaint.location}</p>
            </div>
            <div class="detail-item">
                <label>Description</label>
                <p>${complaint.description || 'No detailed description provided.'}</p>
            </div>
            <div class="detail-item">
                <label>Urgency</label>
                <p>${capitalizeFirst(complaint.urgency || 'medium')}</p>
            </div>
        </div>
        ${timelineHTML}
    `;
    showComplaintDetailsPage();
}

// Reminder Functions
function sendReminder() {
    const complaintId = document.getElementById('reminderComplaintId').value;
    const message = document.getElementById('reminderMessage').value;
    
    if (!complaintId.trim()) {
        showErrorMessage('Please enter a complaint ID.');
        return;
    }
    
    const complaint = complaints.find(c => c.id.toUpperCase() === complaintId.toUpperCase());
    
    if (!complaint) {
        showErrorMessage('Complaint not found. Please check the ID.');
        return;
    }
    
    if (complaint.status === 'resolved') {
        showErrorMessage('This complaint has already been resolved.');
        return;
    }
    
    showSuccessMessage(`Reminder sent successfully for complaint ${complaintId}`);
    
    // Clear form
    document.getElementById('reminderComplaintId').value = '';
    document.getElementById('reminderMessage').value = '';
}

// Feedback Functions
function showFeedbackTab(tabType) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.feedback-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    if (tabType === 'give') {
        document.getElementById('giveFeedbackTab').classList.add('active');
    } else {
        document.getElementById('feedbackHistoryTab').classList.add('active');
    }
}

function setRating(rating) {
    currentRating = rating;
    const stars = document.querySelectorAll('.star-rating i');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
}

function submitFeedback(event) {
    event.preventDefault();
    
    const complaintId = document.getElementById('feedbackComplaintId').value;
    const category = document.getElementById('feedbackCategory').value;
    const feedbackText = document.getElementById('feedbackText').value;
    
    if (currentRating === 0) {
        showErrorMessage('Please select a rating.');
        return;
    }
    
    if (!feedbackText.trim()) {
        showErrorMessage('Please enter your feedback.');
        return;
    }
    
    showSuccessMessage('Thank you for your feedback! It has been submitted successfully.');
    
    // Clear form
    document.getElementById('feedbackComplaintId').value = '';
    document.getElementById('feedbackText').value = '';
    currentRating = 0;
    document.querySelectorAll('.star-rating i').forEach(star => {
        star.classList.remove('filled');
    });
}

// Profile Functions
function loadUserProfile() {
    if (currentUser) {
        const profileUserName = document.getElementById('profileUserName');
        const profileFullName = document.getElementById('profileFullName');
        
        if (profileUserName) {
            profileUserName.textContent = currentUser.name;
        }
        if (profileFullName) {
            profileFullName.value = currentUser.name;
        }
    }
}

function updateProfile(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('profileFullName').value;
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;
    
    if (currentUser) {
        currentUser.name = fullName;
        currentUser.email = email;
        currentUser.phone = phone;
    }
    
    showSuccessMessage('Profile updated successfully!');
}

function changePassword() {
    const newPassword = prompt('Enter new password (minimum 6 characters):');
    
    if (newPassword) {
        if (newPassword.length < 6) {
            showErrorMessage('Password must be at least 6 characters long.');
            return;
        }
        showSuccessMessage('Password changed successfully!');
    }
}

function deactivateAccount() {
    if (confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
        if (confirm('This will permanently delete your account and all data. Continue?')) {
            showSuccessMessage('Account deactivated successfully.');
            setTimeout(() => {
                logout();
            }, 2000);
        }
    }
}

// Utility Functions
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showInfoMessage(message) {
    showMessage(message, 'info');
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                type === 'error' ? 'exclamation-triangle' : 'info-circle';
    
    messageDiv.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    // Insert at top of current page
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        const container = activePage.querySelector('.form-container, .dashboard-container, .admin-dashboard-container');
        if (container) {
            container.insertBefore(messageDiv, container.firstChild);
        }
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getStatusIcon(status) {
    switch (status) {
        case 'pending':
            return 'clock';
        case 'progress':
            return 'spinner';
        case 'resolved':
            return 'check';
        default:
            return 'circle';
    }
}

function clearForm() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (form.closest('#registerComplaintPage')) {
            form.reset();
        }
    });
    
    // Clear photo preview
    const preview = document.getElementById('previewImage');
    const placeholder = document.getElementById('uploadPlaceholder');
    if (preview && placeholder) {
        preview.style.display = 'none';
        placeholder.style.display = 'block';
    }
    
    // Clear category selection
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Disable next button
    const nextBtn = document.getElementById('step1Next');
    if (nextBtn) {
        nextBtn.disabled = true;
    }
}

function requestLocationPermission() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            () => {
                console.log('Location permission granted');
            },
            () => {
                console.log('Location permission denied');
            }
        );
    }
}

function handleFormSubmissions(event) {
    if (event.target.tagName === 'FORM') {
        event.preventDefault();
        
        if (event.target.onsubmit) {
            event.target.onsubmit(event);
        }
    }
}

// Registration Functions (for new users)
function showUserRegistration() {
    alert('User registration feature will be implemented in the full version.');
}

function showForgotPassword() {
    const phone = prompt('Enter your registered mobile number:');
    if (phone && phone.length >= 10) {
        showSuccessMessage('Password reset link sent to your mobile number via SMS.');
    } else if (phone) {
        showErrorMessage('Please enter a valid mobile number.');
    }
}

// Help Functions
function showPrivacyPolicy() {
    alert('Privacy Policy: CivicConnect respects your privacy and protects your personal information according to applicable laws and regulations.');
}

function showTermsOfService() {
    alert('Terms of Service: By using CivicConnect, you agree to report genuine civic issues and provide accurate information.');
}

function showHelp() {
    alert(`
        Help & FAQ:
        
        Q: How do I report an issue?
        A: Click "Register Complaint" and follow the 3-step process.
        
        Q: How can I track my complaint?
        A: Use "Track Complaint" with your complaint ID.
        
        Q: What if my issue isn't resolved?
        A: Use "Send Reminder" to follow up on pending complaints.
        
        For more help, contact: support@civicconnect.gov
    `);
}

// Export functions for global access
window.showLoginPage = showLoginPage;
window.showUserLogin = showUserLogin;
window.showAdminLogin = showAdminLogin;
window.showUserDashboard = showUserDashboard;
window.showRegisterComplaint = showRegisterComplaint;
window.showTrackComplaint = showTrackComplaint;
window.showSendReminder = showSendReminder;
window.showFeedback = showFeedback;
window.showAboutUs = showAboutUs;
window.showUserDetails = showUserDetails;
window.handleUserLogin = handleUserLogin;
window.handleAdminLogin = handleAdminLogin;
window.logout = logout;
window.selectCategory = selectCategory;
window.handlePhotoUpload = handlePhotoUpload;
window.getCurrentLocation = getCurrentLocation;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.handleComplaintSubmission = handleComplaintSubmission;
window.searchComplaints = searchComplaints;
window.sendReminder = sendReminder;
window.showFeedbackTab = showFeedbackTab;
window.setRating = setRating;
window.submitFeedback = submitFeedback;
window.updateProfile = updateProfile;
window.changePassword = changePassword;
window.deactivateAccount = deactivateAccount;
window.showUserRegistration = showUserRegistration;
window.showForgotPassword = showForgotPassword;
window.showPrivacyPolicy = showPrivacyPolicy;
window.showTermsOfService = showTermsOfService;
window.showHelp = showHelp;
window.showComplaintDetailsPage = showComplaintDetailsPage;
window.showAdminDashboard = showAdminDashboard;
window.filterAdminComplaints = filterAdminComplaints;
