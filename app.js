// DRMS Application JavaScript

// Application State
let currentUser = null;
let emergencyMap = null;
let requestMarkers = [];
let resourceMarkers = [];

// Sample Data
const emergencyRequests = [
    {
        id: "REQ001",
        location: "Downtown Medical Center",
        coordinates: [40.7128, -74.0060],
        description: "Multiple casualties from building collapse",
        individualsAffected: 25,
        severity: 5,
        status: "pending",
        timestamp: "2025-01-15 14:30:00",
        priorityScore: 17.0
    },
    {
        id: "REQ002", 
        location: "Riverside Elementary School",
        coordinates: [40.7589, -73.9851],
        description: "Flood damage, evacuation needed",
        individualsAffected: 150,
        severity: 4,
        status: "allocated",
        timestamp: "2025-01-15 13:45:00",
        priorityScore: 91.6
    },
    {
        id: "REQ003",
        location: "Central Park Area",
        coordinates: [40.7829, -73.9654],
        description: "Fire spreading through residential area",
        individualsAffected: 80,
        severity: 5,
        status: "pending",
        timestamp: "2025-01-15 15:00:00",
        priorityScore: 50.0
    },
    {
        id: "REQ004",
        location: "Harbor Bridge",
        coordinates: [40.7058, -74.0173],
        description: "Vehicle accident with injuries",
        individualsAffected: 8,
        severity: 3,
        status: "resolved",
        timestamp: "2025-01-15 12:30:00",
        priorityScore: 6.0
    },
    {
        id: "REQ005",
        location: "Industrial District",
        coordinates: [40.6892, -73.9442],
        description: "Chemical spill containment needed",
        individualsAffected: 45,
        severity: 4,
        status: "pending", 
        timestamp: "2025-01-15 16:15:00",
        priorityScore: 28.6
    },
    {
        id: "REQ006",
        location: "West Side Hospital",
        coordinates: [40.7505, -73.9934],
        description: "Power outage affecting critical care",
        individualsAffected: 120,
        severity: 4,
        status: "allocated",
        timestamp: "2025-01-15 11:20:00",
        priorityScore: 73.6
    },
    {
        id: "REQ007",
        location: "Shopping Mall Complex",
        coordinates: [40.7282, -73.9942],
        description: "Gas leak evacuation in progress",
        individualsAffected: 200,
        severity: 3,
        status: "pending",
        timestamp: "2025-01-15 17:00:00",
        priorityScore: 121.2
    },
    {
        id: "REQ008",
        location: "Residential Neighborhood",
        coordinates: [40.6829, -73.9789],
        description: "Fallen tree blocking emergency access",
        individualsAffected: 12,
        severity: 2,
        status: "resolved",
        timestamp: "2025-01-15 10:45:00",
        priorityScore: 8.0
    },
    {
        id: "REQ009",
        location: "University Campus",
        coordinates: [40.8075, -73.9626],
        description: "Student dormitory fire alarm",
        individualsAffected: 300,
        severity: 2,
        status: "allocated",
        timestamp: "2025-01-15 18:30:00",
        priorityScore: 180.8
    },
    {
        id: "REQ010",
        location: "Airport Terminal",
        coordinates: [40.6413, -73.7781],
        description: "Medical emergency passenger",
        individualsAffected: 5,
        severity: 4,
        status: "resolved",
        timestamp: "2025-01-15 09:15:00",
        priorityScore: 4.6
    }
];

const resources = [
    {
        id: "RES001",
        name: "Ambulance Unit Alpha",
        quantity: 3,
        location: "Central Station",
        category: "Medical",
        status: "Available",
        coordinates: [40.7306, -73.9352]
    },
    {
        id: "RES002",
        name: "Fire Engine Team 1",
        quantity: 2,
        location: "Fire Station North",
        category: "Equipment", 
        status: "Deployed",
        coordinates: [40.7831, -73.9712]
    },
    {
        id: "RES003",
        name: "Emergency Food Supplies",
        quantity: 500,
        location: "Warehouse District",
        category: "Food/Water",
        status: "Available",
        coordinates: [40.6734, -74.0047]
    },
    {
        id: "RES004",
        name: "Paramedic Team A",
        quantity: 6,
        location: "Downtown Hospital",
        category: "Personnel",
        status: "Available",
        coordinates: [40.7128, -74.0060]
    },
    {
        id: "RES005",
        name: "Water Purification Units",
        quantity: 8,
        location: "Emergency Depot",
        category: "Equipment",
        status: "Available",
        coordinates: [40.7282, -73.9857]
    },
    {
        id: "RES006",
        name: "Medical Supplies Kit",
        quantity: 50,
        location: "Regional Medical Center",
        category: "Medical",
        status: "Available",
        coordinates: [40.7505, -73.9934]
    },
    {
        id: "RES007",
        name: "Search & Rescue Team",
        quantity: 8,
        location: "Emergency Headquarters",
        category: "Personnel",
        status: "Standby",
        coordinates: [40.7484, -73.9857]
    },
    {
        id: "RES008",
        name: "Emergency Shelter Kits",
        quantity: 100,
        location: "Supply Warehouse",
        category: "Equipment",
        status: "Available",
        coordinates: [40.6967, -73.9903]
    },
    {
        id: "RES009",
        name: "Bottled Water Supply",
        quantity: 1000,
        location: "Distribution Center",
        category: "Food/Water",
        status: "Available",
        coordinates: [40.7061, -74.0089]
    },
    {
        id: "RES010",
        name: "Mobile Command Unit",
        quantity: 1,
        location: "Emergency Base",
        category: "Equipment",
        status: "Deployed",
        coordinates: [40.7589, -73.9851]
    }
];

// DOM Elements
const navbar = document.getElementById('navbar');
const mainContent = document.getElementById('mainContent');
const userRoleElement = document.getElementById('userRole');
const flashMessages = document.getElementById('flashMessages');

// Page mapping to fix navigation
const pageMapping = {
    'requests': 'requestsPage',
    'view': 'viewPage', 
    'submit_request': 'submitRequestPage',
    'add': 'addPage'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    showLoginPage();
});

// Event Listeners Setup
function setupEventListeners() {
    // Role selection buttons
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const role = e.currentTarget.getAttribute('data-role');
            login(role);
        });
    });

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.getAttribute('data-page');
            navigateToPage(page);
        });
    });

    // Emergency form submission
    const emergencyForm = document.getElementById('emergencyForm');
    if (emergencyForm) {
        emergencyForm.addEventListener('submit', handleEmergencySubmission);
    }

    // Resource form submission
    const resourceForm = document.getElementById('resourceForm');
    if (resourceForm) {
        resourceForm.addEventListener('submit', handleResourceSubmission);
    }
}

// Authentication Functions
function login(role) {
    currentUser = { role: role };
    userRoleElement.textContent = role.charAt(0).toUpperCase() + role.slice(1);
    userRoleElement.className = `user-role ${role}`;
    
    // Update UI based on role
    updateRoleBasedUI();
    
    // Show navbar and navigate to dashboard
    navbar.style.display = 'block';
    navigateToPage('requests');
    
    showFlashMessage(`Logged in as ${role}`, 'success');
}

function logout() {
    currentUser = null;
    navbar.style.display = 'none';
    showLoginPage();
    showFlashMessage('Role switched successfully', 'info');
}

function updateRoleBasedUI() {
    const adminElements = document.querySelectorAll('.admin-only');
    
    if (currentUser && currentUser.role === 'admin') {
        adminElements.forEach(el => el.style.display = '');
    } else {
        adminElements.forEach(el => el.style.display = 'none');
    }
}

// Navigation Functions
function showLoginPage() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById('loginPage').classList.add('active');
}

function navigateToPage(pageId) {
    // Check if user has permission to access the page
    if (pageId === 'add' && (!currentUser || currentUser.role !== 'admin')) {
        showFlashMessage('Access denied. Admin role required.', 'error');
        return;
    }
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const navLink = document.querySelector(`[data-page="${pageId}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
    
    // Show page using correct mapping
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const actualPageId = pageMapping[pageId] || pageId + 'Page';
    const targetPage = document.getElementById(actualPageId);
    
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Initialize page-specific functionality
        switch(pageId) {
            case 'requests':
                initializeRequestsPage();
                break;
            case 'view':
                initializeInventoryPage();
                break;
            case 'submit_request':
                initializeSubmitRequestPage();
                break;
            case 'add':
                initializeAddResourcePage();
                break;
        }
    } else {
        showFlashMessage(`Page not found: ${pageId}`, 'error');
    }
}

// Requests Board Page
function initializeRequestsPage() {
    updateDashboardStats();
    loadRequestsTable();
    initializeMap();
}

function updateDashboardStats() {
    const totalRequests = emergencyRequests.length;
    const activeRequests = emergencyRequests.filter(req => req.status !== 'resolved').length;
    const availableResources = resources.filter(res => res.status === 'Available').length;
    
    document.getElementById('totalRequests').textContent = totalRequests;
    document.getElementById('activeRequests').textContent = activeRequests;
    document.getElementById('availableResources').textContent = availableResources;
}

function loadRequestsTable() {
    const tableBody = document.getElementById('requestsTableBody');
    
    // Sort by priority score (highest first)
    const sortedRequests = [...emergencyRequests].sort((a, b) => b.priorityScore - a.priorityScore);
    
    tableBody.innerHTML = sortedRequests.map(request => {
        const priorityClass = getPriorityClass(request.priorityScore);
        const statusClass = `status-${request.status}`;
        
        return `
            <tr data-request-id="${request.id}">
                <td>
                    <div class="priority-score ${priorityClass}">
                        ${request.priorityScore.toFixed(1)}
                    </div>
                </td>
                <td><strong>${request.id}</strong></td>
                <td>${request.location}</td>
                <td>${request.individualsAffected}</td>
                <td>${request.severity}/5</td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${request.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        ${getActionButtons(request)}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function getPriorityClass(score) {
    if (score >= 100) return 'priority-high';
    if (score >= 50) return 'priority-medium';
    return 'priority-low';
}

function getActionButtons(request) {
    if (!currentUser || currentUser.role !== 'admin') return '';
    
    let buttons = '';
    
    if (request.status === 'pending') {
        buttons += `<button class="btn btn--xs btn--info" onclick="updateRequestStatus('${request.id}', 'allocated')">Allocate</button>`;
    }
    
    if (request.status === 'allocated') {
        buttons += `<button class="btn btn--xs btn--success" onclick="updateRequestStatus('${request.id}', 'resolved')">Resolve</button>`;
    }
    
    if (request.status === 'resolved') {
        buttons += `<span class="status-badge status-resolved">Completed</span>`;
    }
    
    return buttons;
}

function updateRequestStatus(requestId, newStatus) {
    const request = emergencyRequests.find(req => req.id === requestId);
    if (request) {
        request.status = newStatus;
        loadRequestsTable();
        updateMapMarkers();
        updateDashboardStats();
        showFlashMessage(`Request ${requestId} status updated to ${newStatus}`, 'success');
    }
}

function filterRequests() {
    const filter = document.getElementById('statusFilter').value;
    const tableBody = document.getElementById('requestsTableBody');
    const rows = tableBody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const status = row.querySelector('.status-badge').textContent.trim();
        if (filter === 'all' || status === filter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Map Functions
function initializeMap() {
    if (emergencyMap) {
        emergencyMap.remove();
    }
    
    emergencyMap = L.map('emergencyMap').setView([40.7306, -73.9352], 11);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(emergencyMap);
    
    addRequestMarkers();
    addResourceMarkers();
}

function addRequestMarkers() {
    requestMarkers.forEach(marker => emergencyMap.removeLayer(marker));
    requestMarkers = [];
    
    emergencyRequests.forEach(request => {
        const color = getMarkerColor(request.status, request.priorityScore);
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        const marker = L.marker(request.coordinates, { icon })
            .bindPopup(`
                <div class="popup-content">
                    <h4>${request.id}</h4>
                    <p><strong>Location:</strong> ${request.location}</p>
                    <p><strong>Description:</strong> ${request.description}</p>
                    <p><strong>Affected:</strong> ${request.individualsAffected} people</p>
                    <p><strong>Severity:</strong> ${request.severity}/5</p>
                    <p><strong>Priority Score:</strong> ${request.priorityScore.toFixed(1)}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${request.status}">${request.status}</span></p>
                </div>
            `)
            .addTo(emergencyMap);
        
        requestMarkers.push(marker);
    });
}

function addResourceMarkers() {
    resourceMarkers.forEach(marker => emergencyMap.removeLayer(marker));
    resourceMarkers = [];
    
    resources.forEach(resource => {
        const color = resource.status === 'Available' ? '#28a745' : 
                     resource.status === 'Deployed' ? '#ffc107' : '#6c757d';
        
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        
        const marker = L.marker(resource.coordinates, { icon })
            .bindPopup(`
                <div class="popup-content">
                    <h4>${resource.name}</h4>
                    <p><strong>Category:</strong> ${resource.category}</p>
                    <p><strong>Quantity:</strong> ${resource.quantity}</p>
                    <p><strong>Location:</strong> ${resource.location}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${resource.status.toLowerCase()}">${resource.status}</span></p>
                </div>
            `)
            .addTo(emergencyMap);
        
        resourceMarkers.push(marker);
    });
}

function getMarkerColor(status, priorityScore) {
    if (status === 'resolved') return '#28a745';
    if (status === 'allocated') return '#007bff';
    
    // For pending requests, color by priority
    if (priorityScore >= 100) return '#dc3545';
    if (priorityScore >= 50) return '#fd7e14';
    return '#ffc107';
}

function updateMapMarkers() {
    addRequestMarkers();
    addResourceMarkers();
}

function optimizeRoutes() {
    showFlashMessage('Calculating optimal routes...', 'info');
    
    // Simulate route optimization calculation
    setTimeout(() => {
        const activeRequests = emergencyRequests.filter(req => req.status !== 'resolved');
        const availableResources = resources.filter(res => res.status === 'Available');
        
        if (activeRequests.length === 0) {
            showFlashMessage('No active requests requiring route optimization', 'info');
            return;
        }
        
        if (availableResources.length === 0) {
            showFlashMessage('No available resources for deployment', 'warning');
            return;
        }
        
        // Simulate Dijkstra's algorithm result
        const estimatedTime = Math.floor(Math.random() * 20) + 5; // 5-25 minutes
        const highestPriorityRequest = activeRequests.reduce((prev, current) => 
            (prev.priorityScore > current.priorityScore) ? prev : current
        );
        
        showFlashMessage(
            `Optimized route calculated! Estimated shortest travel time to ${highestPriorityRequest.location}: ${estimatedTime} minutes`,
            'success'
        );
    }, 2000);
}

// Inventory Page
function initializeInventoryPage() {
    loadResourcesTable();
}

function loadResourcesTable() {
    const tableBody = document.getElementById('resourcesTableBody');
    
    tableBody.innerHTML = resources.map(resource => {
        const statusClass = `status-${resource.status.toLowerCase()}`;
        
        return `
            <tr data-resource-id="${resource.id}">
                <td><strong>${resource.name}</strong></td>
                <td>${resource.quantity}</td>
                <td>${resource.location}</td>
                <td>${resource.category}</td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${resource.status}
                    </span>
                </td>
                ${currentUser && currentUser.role === 'admin' ? `
                <td>
                    <div class="action-buttons">
                        <button class="btn btn--xs btn--outline" onclick="editResource('${resource.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn--xs btn--outline" onclick="deleteResource('${resource.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
                ` : ''}
            </tr>
        `;
    }).join('');
}

function searchResources() {
    const searchTerm = document.getElementById('resourceSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const tableBody = document.getElementById('resourcesTableBody');
    const rows = tableBody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const resourceName = row.cells[0].textContent.toLowerCase();
        const location = row.cells[2].textContent.toLowerCase();
        const category = row.cells[3].textContent;
        
        const matchesSearch = resourceName.includes(searchTerm) || location.includes(searchTerm);
        const matchesCategory = categoryFilter === 'All' || category === categoryFilter;
        
        if (matchesSearch && matchesCategory) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function filterResources() {
    searchResources(); // Reuse the same logic
}

function editResource(resourceId) {
    showFlashMessage(`Edit functionality for ${resourceId} would open edit dialog`, 'info');
}

function deleteResource(resourceId) {
    if (confirm('Are you sure you want to delete this resource?')) {
        const index = resources.findIndex(res => res.id === resourceId);
        if (index > -1) {
            resources.splice(index, 1);
            loadResourcesTable();
            updateDashboardStats();
            showFlashMessage(`Resource ${resourceId} deleted successfully`, 'success');
        }
    }
}

// Submit Request Page
function initializeSubmitRequestPage() {
    // Clear form
    const form = document.getElementById('emergencyForm');
    if (form) {
        form.reset();
    }
    
    const priorityDisplay = document.getElementById('priorityDisplay');
    if (priorityDisplay) {
        priorityDisplay.style.display = 'none';
    }
}

function calculatePriority() {
    const affected = parseInt(document.getElementById('requestAffected').value) || 0;
    const severity = parseInt(document.getElementById('requestSeverity').value) || 0;
    
    if (affected > 0 && severity > 0) {
        const priorityScore = (affected * 0.6) + (severity * 0.4);
        document.getElementById('priorityScore').textContent = priorityScore.toFixed(1);
        document.getElementById('priorityDisplay').style.display = 'block';
    } else {
        document.getElementById('priorityDisplay').style.display = 'none';
    }
}

function handleEmergencySubmission(e) {
    e.preventDefault();
    
    const location = document.getElementById('requestLocation').value;
    const description = document.getElementById('requestDescription').value;
    const affected = parseInt(document.getElementById('requestAffected').value);
    const severity = parseInt(document.getElementById('requestSeverity').value);
    
    const priorityScore = (affected * 0.6) + (severity * 0.4);
    const requestId = `REQ${String(emergencyRequests.length + 1).padStart(3, '0')}`;
    
    const newRequest = {
        id: requestId,
        location: location,
        coordinates: [40.7306 + (Math.random() - 0.5) * 0.1, -73.9352 + (Math.random() - 0.5) * 0.1], // Random nearby coordinates
        description: description,
        individualsAffected: affected,
        severity: severity,
        status: "pending",
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        priorityScore: priorityScore
    };
    
    emergencyRequests.push(newRequest);
    
    // Clear form and show success
    document.getElementById('emergencyForm').reset();
    document.getElementById('priorityDisplay').style.display = 'none';
    
    showFlashMessage(`Emergency request ${requestId} submitted successfully! Priority score: ${priorityScore.toFixed(1)}`, 'success');
    
    // Update dashboard if on requests page
    if (document.getElementById('requestsPage').classList.contains('active')) {
        updateDashboardStats();
        loadRequestsTable();
        updateMapMarkers();
    }
}

// Add Resource Page
function initializeAddResourcePage() {
    // Clear form
    const form = document.getElementById('resourceForm');
    if (form) {
        form.reset();
    }
}

function handleResourceSubmission(e) {
    e.preventDefault();
    
    const name = document.getElementById('resourceName').value;
    const quantity = parseInt(document.getElementById('resourceQuantity').value);
    const category = document.getElementById('resourceCategory').value;
    const location = document.getElementById('resourceLocation').value;
    
    const resourceId = `RES${String(resources.length + 1).padStart(3, '0')}`;
    
    const newResource = {
        id: resourceId,
        name: name,
        quantity: quantity,
        location: location,
        category: category,
        status: "Available",
        coordinates: [40.7306 + (Math.random() - 0.5) * 0.1, -73.9352 + (Math.random() - 0.5) * 0.1] // Random nearby coordinates
    };
    
    resources.push(newResource);
    
    // Clear form and show success
    document.getElementById('resourceForm').reset();
    
    showFlashMessage(`Resource ${resourceId} added successfully!`, 'success');
    
    // Navigate to inventory page
    navigateToPage('view');
}

// Utility Functions
function showFlashMessage(message, type = 'info') {
    const flashDiv = document.createElement('div');
    flashDiv.className = `flash-message ${type}`;
    flashDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-${getFlashIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    flashMessages.appendChild(flashDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (flashMessages.contains(flashDiv)) {
            flashMessages.removeChild(flashDiv);
        }
    }, 5000);
    
    // Allow manual close on click
    flashDiv.addEventListener('click', () => {
        if (flashMessages.contains(flashDiv)) {
            flashMessages.removeChild(flashDiv);
        }
    });
}

function getFlashIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-triangle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Global functions for HTML onclick handlers
window.login = login;
window.logout = logout;
window.navigateToPage = navigateToPage;
window.updateRequestStatus = updateRequestStatus;
window.filterRequests = filterRequests;
window.searchResources = searchResources;
window.filterResources = filterResources;
window.editResource = editResource;
window.deleteResource = deleteResource;
window.calculatePriority = calculatePriority;
window.optimizeRoutes = optimizeRoutes;
window.handleEmergencySubmission = handleEmergencySubmission;
window.handleResourceSubmission = handleResourceSubmission;