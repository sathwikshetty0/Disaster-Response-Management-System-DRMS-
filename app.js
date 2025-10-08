// Enhanced Disaster Relief Management System - Mangalore
// Sahyadri College of Engineering & Management Emergency Response System

// Application State
let currentUserRole = 'user';
let mangaloreMap = null;
let requestMap = null; 
let resourceMarkers = [];
let requestMarkers = [];
let routeControl = null; // Global route control for OSRM routing
let mapLayersVisible = { resources: true, requests: true };

// Base Location - Sahyadri College of Engineering & Management
const BASE_LOCATION = {
    name: "Sahyadri College of Engineering & Management",
    coordinates: [12.8650354, 74.9257386],
    address: "Adyar, Mangalore, Karnataka 575007"
};

// Enhanced Application Data
let resources = [
    {
        "id": "RES001",
        "type": "Beds",
        "total": 50,
        "available": 50,
        "location": "Sahyadri College Hostel",
        "coordinates": [12.865835, 74.927000],
        "contact": "hostel@sahyadri.edu.in",
        "status": "Available"
    },
    {
        "id": "RES002", 
        "type": "Food Packages",
        "total": 200,
        "available": 150,
        "location": "College Canteen",
        "coordinates": [12.866600, 74.926111],
        "contact": "canteen@sahyadri.edu.in",
        "status": "Partial"
    },
    {
        "id": "RES003",
        "type": "Medical Team",
        "total": 2,
        "available": 2,
        "location": "College Medical Center",
        "coordinates": [12.864900, 74.924900],
        "contact": "medical@sahyadri.edu.in",
        "status": "Available"
    },
    {
        "id": "RES004",
        "type": "Rescue Team",
        "total": 3,
        "available": 1,
        "location": "Main Gate Security",
        "coordinates": [12.865200, 74.925800],
        "contact": "security@sahyadri.edu.in",
        "status": "Partial"
    },
    {
        "id": "RES005",
        "type": "Water Supply",
        "total": 500,
        "available": 350,
        "location": "Water Treatment Plant",
        "coordinates": [12.866000, 74.925000],
        "contact": "water@sahyadri.edu.in",
        "status": "Available"
    },
    {
        "id": "RES006",
        "type": "Shelter Tents",
        "total": 30,
        "available": 30,
        "location": "Sports Ground",
        "coordinates": [12.865600, 74.924250],
        "contact": "sports@sahyadri.edu.in",
        "status": "Available"
    },
    {
        "id": "RES007",
        "type": "Fishing Boats",
        "total": 5,
        "available": 5,
        "location": "Nethravathi River Dock",
        "coordinates": [12.859500, 74.925900],
        "contact": "fisheries@sahyadri.edu.in",
        "status": "Available"
    },
    {
        "id": "RES008",
        "type": "Agriculture Equipment",
        "total": 3,
        "available": 2,
        "location": "Campus Farm",
        "coordinates": [12.864500, 74.926500],
        "contact": "agri@sahyadri.edu.in",
        "status": "Partial"
    }
];

let activeRequests = [
    {
        "id": "REQ001",
        "type": "Beds",
        "quantity": 100,
        "location": "Adyar Village Center",
        "coordinates": [12.870000, 74.929000],
        "severity": 4,
        "individualsAffected": 75,
        "status": "partial",
        "allocated": 50,
        "pending": 50,
        "followUpContact": "relief@sahyadri.edu.in",
        "timestamp": "2025-10-08T14:30:00",
        "priority": 46.6
    },
    {
        "id": "REQ002",
        "type": "Food Packages", 
        "quantity": 300,
        "location": "Kankanady Market Area",
        "coordinates": [12.875000, 74.930000],
        "severity": 5,
        "individualsAffected": 200,
        "status": "partial",
        "allocated": 150,
        "pending": 150,
        "followUpContact": "canteen@sahyadri.edu.in",
        "timestamp": "2025-10-08T13:45:00",
        "priority": 122.0
    },
    {
        "id": "REQ003",
        "type": "Rescue Team",
        "quantity": 2,
        "location": "Panambur Beach",
        "coordinates": [12.890000, 74.910000],
        "severity": 5,
        "individualsAffected": 15,
        "status": "allocated",
        "allocated": 2,
        "pending": 0,
        "followUpContact": "",
        "timestamp": "2025-10-08T15:00:00",
        "priority": 11.0
    },
    {
        "id": "REQ004",
        "type": "Water Supply",
        "quantity": 200,
        "location": "Ullal Fishing Village",
        "coordinates": [12.806000, 74.865000],
        "severity": 3,
        "individualsAffected": 80,
        "status": "allocated",
        "allocated": 200,
        "pending": 0,
        "followUpContact": "",
        "timestamp": "2025-10-08T12:20:00",
        "priority": 49.2
    }
];

const mlPredictions = [
    {
        "type": "Beds",
        "predictedDemand": 130,
        "trend": "+15%",
        "confidence": "High",
        "basis": "Cyclone season analysis + village population density"
    },
    {
        "type": "Food Packages",
        "predictedDemand": 275,
        "trend": "+23%",
        "confidence": "Very High", 
        "basis": "Tsunami risk assessment + coastal community needs"
    },
    {
        "type": "Rescue Team",
        "predictedDemand": 4,
        "trend": "+33%",
        "confidence": "Medium",
        "basis": "Fisheries risk patterns + weather forecast data"
    },
    {
        "type": "Agriculture Equipment",
        "predictedDemand": 8,
        "trend": "+167%",
        "confidence": "High",
        "basis": "Agricultural season + flood impact modeling"
    }
];

// Priority calculation thresholds
const PRIORITY_THRESHOLDS = {
    low: { min: 0, max: 30, color: '#14B8A6' },
    medium: { min: 30, max: 80, color: '#F59E0B' }, 
    high: { min: 80, max: 200, color: '#EF4444' }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    showFlashMessage('🚨 Enhanced Emergency Response System Online - Base: Sahyadri College, Mangalore', 'success');
    
    updateRoleDisplay();
    updateDashboardStats();
    initializeMangaloreMap();
    loadRequestsTable();
    loadResourcesTable();
    loadMLPredictions();
    
    // Auto-update every 30 seconds
    setInterval(() => {
        updateDashboardStats();
        updateMapMarkers();
    }, 30000);
}

// Mobile Navigation
function toggleMobileMenu() {
    const navActions = document.getElementById('navActions');
    navActions.classList.toggle('show');
}

// Role Management System
function showAdminLogin() {
    document.getElementById('adminLoginModal').classList.remove('hidden');
    document.getElementById('adminPassword').focus();
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').classList.add('hidden');
    document.getElementById('adminLoginForm').reset();
}

function handleAdminLogin(event) {
    event.preventDefault();
    const password = document.getElementById('adminPassword').value;
    
    if (password === '121212') {
        currentUserRole = 'admin';
        updateRoleDisplay();
        closeAdminLogin();
        showFlashMessage('🔐 Administrator access granted - Full system control enabled', 'success');
        
        // Refresh UI to show admin controls
        loadRequestsTable();
        loadResourcesTable();
        updateMapMarkers();
    } else {
        showFlashMessage('❌ Invalid admin password. Access denied.', 'error');
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminPassword').focus();
    }
}

function switchToUserMode() {
    currentUserRole = 'user';
    updateRoleDisplay();
    showFlashMessage('👤 Switched to User Dashboard mode', 'info');
    
    loadRequestsTable();
    loadResourcesTable();
}

function updateRoleDisplay() {
    const roleIndicator = document.getElementById('currentUserRole');
    const adminBtn = document.querySelector('.nav-actions .btn');
    const body = document.body;
    
    if (currentUserRole === 'admin') {
        roleIndicator.textContent = '🔒 Administrator Dashboard';
        roleIndicator.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
        roleIndicator.style.color = '#EF4444';
        roleIndicator.onclick = switchToUserMode;
        roleIndicator.title = 'Click to switch to User mode';
        body.classList.remove('user-mode');
        
        adminBtn.innerHTML = '<i class="fas fa-user"></i> Switch to User';
        adminBtn.onclick = switchToUserMode;
    } else {
        roleIndicator.textContent = '👤 User Dashboard';
        roleIndicator.style.backgroundColor = 'rgba(37, 99, 235, 0.15)';
        roleIndicator.style.color = '#2563EB';
        roleIndicator.onclick = null;
        roleIndicator.title = '';
        body.classList.add('user-mode');
        
        adminBtn.innerHTML = '<i class="fas fa-shield-alt"></i> Admin Login';
        adminBtn.onclick = showAdminLogin;
    }
}

// Dashboard Statistics
function updateDashboardStats() {
    const totalRequests = activeRequests.length;
    const pendingRequests = activeRequests.filter(req => req.pending > 0).length;
    const availableResources = resources.filter(res => res.available > 0).length;
    
    // Calculate allocation success rate
    const totalAllocated = activeRequests.reduce((sum, req) => sum + req.allocated, 0);
    const totalRequested = activeRequests.reduce((sum, req) => sum + req.quantity, 0);
    const allocationRate = totalRequested > 0 ? Math.round((totalAllocated / totalRequested) * 100) : 0;
    
    document.getElementById('totalRequests').textContent = totalRequests;
    document.getElementById('pendingRequests').textContent = pendingRequests;
    document.getElementById('availableResources').textContent = availableResources;
    document.getElementById('allocationRate').textContent = allocationRate + '%';
    
    // Update table counts
    document.getElementById('requestsCount').textContent = `${totalRequests} active requests`;
    document.getElementById('resourcesCount').textContent = `${resources.length} total resources`;
}

// Enhanced Interactive Mangalore Map
function initializeMangaloreMap() {
    if (mangaloreMap) {
        mangaloreMap.remove();
    }
    
    mangaloreMap = L.map('mangaloreMap').setView(BASE_LOCATION.coordinates, 13);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors | Enhanced DRMS Sahyadri College'
    }).addTo(mangaloreMap);
    
    // Add base headquarters marker
    const baseIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: linear-gradient(45deg, #2563EB, #1d4ed8); width: 36px; height: 36px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4); display: flex; align-items: center; justify-content: center; position: relative;">
                   <i class="fas fa-home" style="color: white; font-size: 16px;"></i>
                   <div style="position: absolute; top: -10px; right: -10px; background: #14B8A6; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center;">
                       <i class="fas fa-check" style="color: white; font-size: 10px;"></i>
                   </div>
               </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
    });
    
    L.marker(BASE_LOCATION.coordinates, { icon: baseIcon })
        .bindPopup(`
            <div class="popup-content" style="min-width: 250px;">
                <h4 style="margin: 0 0 8px 0; color: #2563EB;"><i class="fas fa-university"></i> Emergency Response HQ</h4>
                <p style="margin: 4px 0;"><strong>${BASE_LOCATION.name}</strong></p>
                <p style="margin: 4px 0;"><i class="fas fa-map-marker-alt"></i> ${BASE_LOCATION.address}</p>
                <p style="margin: 4px 0;"><i class="fas fa-phone"></i> Emergency: +91-824-2274722</p>
                <p style="margin: 8px 0 0;"><strong>Status:</strong> <span class="status-badge status-live">Operational 24/7</span></p>
            </div>
        `)
        .addTo(mangaloreMap);
    
    updateMapMarkers();
}

function updateMapMarkers() {
    // Clear existing markers
    resourceMarkers.forEach(marker => mangaloreMap.removeLayer(marker));
    requestMarkers.forEach(marker => mangaloreMap.removeLayer(marker));
    resourceMarkers = [];
    requestMarkers = [];
    
    // Add resource markers
    if (mapLayersVisible.resources) {
        resources.forEach(resource => {
            const { color, icon } = getResourceMarkerStyle(resource);
            
            const resourceIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: ${color}; width: 22px; height: 22px; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; border-radius: ${resource.type.includes('Boat') ? '20% 80%' : '50%'};">
                           <i class="fas fa-${icon}" style="color: white; font-size: 11px;"></i>
                       </div>`,
                iconSize: [22, 22],
                iconAnchor: [11, 11]
            });
            
            const marker = L.marker(resource.coordinates, { icon: resourceIcon })
                .bindPopup(`
                    <div class="popup-content" style="min-width: 200px;">
                        <h4 style="margin: 0 0 8px 0; color: #14B8A6;"><i class="fas fa-box"></i> ${resource.type}</h4>
                        <p style="margin: 4px 0;"><strong>ID:</strong> ${resource.id}</p>
                        <p style="margin: 4px 0;"><strong>Location:</strong> ${resource.location}</p>
                        <p style="margin: 4px 0;"><strong>Availability:</strong> ${resource.available}/${resource.total}</p>
                        <p style="margin: 4px 0;"><strong>Status:</strong> <span class="status-badge status-${resource.status.toLowerCase()}">${resource.status}</span></p>
                        <p style="margin: 4px 0;"><strong>Contact:</strong> <a href="mailto:${resource.contact}">${resource.contact}</a></p>
                        <div style="margin: 8px 0;">
                            <div class="utilization-bar">
                                <div class="utilization-fill ${getUtilizationClass(resource)}" style="width: ${(resource.available/resource.total)*100}%"></div>
                            </div>
                        </div>
                        ${currentUserRole === 'admin' ? `
                            <button class="btn btn--xs btn--primary" onclick="quickAllocate('${resource.id}')" style="margin-top: 8px;">
                                <i class="fas fa-paper-plane"></i> Quick Allocate
                            </button>
                        ` : ''}
                    </div>
                `)
                .addTo(mangaloreMap);
            
            resourceMarkers.push(marker);
        });
    }
    
    // Add request markers
    if (mapLayersVisible.requests) {
        activeRequests.forEach(request => {
            const { color, pulseClass } = getRequestMarkerStyle(request);
            
            const requestIcon = L.divIcon({
                className: `custom-marker ${pulseClass}`,
                html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
                           <i class="fas fa-exclamation" style="color: white; font-size: 14px;"></i>
                       </div>`,
                iconSize: [28, 28],
                iconAnchor: [14, 14]
            });
            
            const marker = L.marker(request.coordinates, { icon: requestIcon })
                .bindPopup(`
                    <div class="popup-content" style="min-width: 250px;">
                        <h4 style="margin: 0 0 8px 0; color: #EF4444;"><i class="fas fa-exclamation-triangle"></i> ${request.type} Request</h4>
                        <p style="margin: 4px 0;"><strong>ID:</strong> ${request.id}</p>
                        <p style="margin: 4px 0;"><strong>Location:</strong> ${request.location}</p>
                        <p style="margin: 4px 0;"><strong>Priority:</strong> <span class="priority-badge priority-${getPriorityLevel(request.priority)}">${request.priority.toFixed(1)}</span></p>
                        <p style="margin: 4px 0;"><strong>Severity:</strong> Level ${request.severity}/5</p>
                        <p style="margin: 4px 0;"><strong>Affected:</strong> ${request.individualsAffected} individuals</p>
                        <p style="margin: 4px 0;"><strong>Requested:</strong> ${request.quantity}</p>
                        <p style="margin: 4px 0;"><strong>Fulfilled:</strong> ${request.allocated} (${((request.allocated/request.quantity)*100).toFixed(1)}%)</p>
                        <p style="margin: 4px 0;"><strong>Pending:</strong> ${request.pending}</p>
                        ${request.pending > 0 ? `<p style="margin: 4px 0;"><strong>Follow-up:</strong> <a href="mailto:${request.followUpContact}">${request.followUpContact}</a></p>` : ''}
                        <div style="margin: 8px 0;">
                            <div class="progress-bar">
                                <div class="progress-fill ${request.pending > 0 ? 'partial' : 'complete'}" style="width: ${(request.allocated/request.quantity)*100}%"></div>
                            </div>
                        </div>
                        <div style="margin-top: 10px; display: flex; gap: 4px; flex-wrap: wrap;">
                            <button class="btn btn--xs btn--success" onclick="showOnRoadRoute('${request.id}')" style="margin-right: 4px;">
                                <i class="fas fa-route"></i> Route
                            </button>
                            ${currentUserRole === 'admin' && request.pending > 0 ? `
                                <button class="btn btn--xs btn--primary" onclick="allocateFromMap('${request.id}')">
                                    <i class="fas fa-plus"></i> Allocate
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `)
                .addTo(mangaloreMap);
            
            requestMarkers.push(marker);
        });
    }
}

// Enhanced On-Road Routing with OSRM
function showOnRoadRoute(requestId) {
    const request = activeRequests.find(req => req.id === requestId);
    if (!request) {
        showFlashMessage('❌ Request not found', 'error');
        return;
    }
    
    // Show spinner
    const spinner = document.getElementById('mapSpinner');
    spinner.classList.remove('hidden');
    
    // Clear previous route
    if (routeControl) {
        mangaloreMap.removeControl(routeControl);
        routeControl = null;
    }
    
    showFlashMessage(`🗺️ Calculating optimal route to ${request.location}...`, 'info');
    
    // Show route info modal
    showRouteInfoModal();
    
    // Create route using OSRM
    const waypoints = [
        L.latLng(BASE_LOCATION.coordinates[0], BASE_LOCATION.coordinates[1]),
        L.latLng(request.coordinates[0], request.coordinates[1])
    ];
    
    routeControl = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: false,
        show: false,
        createMarker: function() { return null; }, // Don't create additional markers
        router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1'
        }),
        lineOptions: {
            styles: [
                { color: '#2563EB', weight: 8, opacity: 0.8 },
                { color: '#ffffff', weight: 5, opacity: 1 }
            ]
        },
        addWaypoints: false,
        routeWhileDragging: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true
    }).on('routesfound', function(e) {
        spinner.classList.add('hidden');
        
        const routes = e.routes;
        const summary = routes[0].summary;
        const totalDistance = (summary.totalDistance / 1000).toFixed(1);
        const totalTimeMinutes = Math.round(summary.totalTime / 60);
        const totalTimeHours = Math.floor(totalTimeMinutes / 60);
        const remainingMinutes = totalTimeMinutes % 60;
        
        let timeDisplay;
        if (totalTimeHours > 0) {
            timeDisplay = `${totalTimeHours}h ${remainingMinutes}m`;
        } else {
            timeDisplay = `${totalTimeMinutes} minutes`;
        }
        
        // Update route info modal
        const routeInfoContent = document.getElementById('routeInfoContent');
        routeInfoContent.innerHTML = `
            <div style="text-align: center;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 20px;">
                    <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #2563EB, #14B8A6); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-route" style="color: white; font-size: 24px;"></i>
                    </div>
                </div>
                
                <h4 style="margin: 0 0 16px 0; color: #2563EB;">Route to ${request.location}</h4>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                    <div style="background: rgba(37, 99, 235, 0.1); padding: 16px; border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: #2563EB; margin-bottom: 4px;">${totalDistance} km</div>
                        <div style="font-size: 14px; color: #6b7280;">Total Distance</div>
                    </div>
                    <div style="background: rgba(20, 184, 166, 0.1); padding: 16px; border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: #14B8A6; margin-bottom: 4px;">${timeDisplay}</div>
                        <div style="font-size: 14px; color: #6b7280;">Estimated Time</div>
                    </div>
                </div>
                
                <div style="background: rgba(245, 158, 11, 0.1); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <div style="font-weight: bold; color: #F59E0B; margin-bottom: 8px;">
                        <i class="fas fa-info-circle"></i> Route Details
                    </div>
                    <div style="font-size: 14px; color: #6b7280; line-height: 1.5;">
                        <strong>From:</strong> ${BASE_LOCATION.name}<br>
                        <strong>To:</strong> ${request.location}<br>
                        <strong>Request:</strong> ${request.type} (${request.quantity} units)<br>
                        <strong>Priority:</strong> ${getPriorityLevel(request.priority).toUpperCase()}
                    </div>
                </div>
                
                <div style="display: flex; gap: 8px; justify-content: center;">
                    <button class="btn btn--primary btn--sm" onclick="closeRouteInfoModal()">
                        <i class="fas fa-check"></i> Got It
                    </button>
                    <button class="btn btn--outline btn--sm" onclick="clearRoute()">
                        <i class="fas fa-times"></i> Clear Route
                    </button>
                </div>
            </div>
        `;
        
        showFlashMessage(
            `✅ Route calculated: ${totalDistance}km to ${request.location}, ~${timeDisplay} travel time`,
            'success'
        );
        
        // Auto-remove route after 45 seconds
        setTimeout(() => {
            clearRoute();
        }, 45000);
        
    }).on('routingerror', function(e) {
        spinner.classList.add('hidden');
        showFlashMessage('❌ Unable to calculate route. Please try again or check connectivity.', 'error');
        closeRouteInfoModal();
        console.error('Routing error:', e);
    }).addTo(mangaloreMap);
}

function clearRoute() {
    if (routeControl) {
        mangaloreMap.removeControl(routeControl);
        routeControl = null;
        showFlashMessage('🗺️ Route cleared from map', 'info');
    }
    closeRouteInfoModal();
}

function showRouteInfoModal() {
    document.getElementById('routeInfoModal').classList.remove('hidden');
}

function closeRouteInfoModal() {
    document.getElementById('routeInfoModal').classList.add('hidden');
}

function getResourceMarkerStyle(resource) {
    const availability = resource.available / resource.total;
    
    if (resource.status === 'Available' && availability === 1) {
        return { color: '#14B8A6', icon: 'check' }; // Teal - fully available
    } else if (resource.status === 'Partial' || availability < 1) {
        return { color: '#F59E0B', icon: 'minus' }; // Amber - partially available  
    } else {
        return { color: '#6b7280', icon: 'times' }; // Gray - deployed/unavailable
    }
}

function getRequestMarkerStyle(request) {
    const priority = getPriorityLevel(request.priority);
    let color, pulseClass = '';
    
    if (request.pending === 0) {
        color = '#14B8A6'; // Teal - complete
    } else if (request.allocated > 0) {
        color = '#fd7e14'; // Orange - partial
        pulseClass = 'marker-pulse';
    } else {
        color = '#EF4444'; // Red - unfulfilled
        pulseClass = priority === 'high' ? 'high-priority' : 'marker-pulse';
    }
    
    return { color, pulseClass };
}

function getPriorityLevel(priority) {
    if (priority >= PRIORITY_THRESHOLDS.high.min) return 'high';
    if (priority >= PRIORITY_THRESHOLDS.medium.min) return 'medium';
    return 'low';
}

function getUtilizationClass(resource) {
    const utilization = 1 - (resource.available / resource.total);
    if (utilization >= 0.8) return 'utilization-high';
    if (utilization >= 0.5) return 'utilization-medium';
    return 'utilization-low';
}

function toggleMapLayer(layerType) {
    mapLayersVisible[layerType] = !mapLayersVisible[layerType];
    updateMapMarkers();
    
    const button = document.getElementById(`${layerType}Toggle`);
    if (mapLayersVisible[layerType]) {
        button.classList.remove('btn--outline');
        button.classList.add('btn--primary');
    } else {
        button.classList.remove('btn--primary');
        button.classList.add('btn--outline');
    }
    
    showFlashMessage(`${layerType.charAt(0).toUpperCase() + layerType.slice(1)} layer ${mapLayersVisible[layerType] ? 'enabled' : 'disabled'}`, 'info');
}

// Enhanced Route Optimization
function optimizeAllRoutes() {
    if (routeControl) {
        mangaloreMap.removeControl(routeControl);
        routeControl = null;
    }
    
    showFlashMessage('🗺️ Calculating optimal multi-stop route from Sahyadri College...', 'info');
    
    const pendingRequests = activeRequests.filter(req => req.pending > 0);
    
    if (pendingRequests.length === 0) {
        showFlashMessage('✅ No pending requests - all resources optimally allocated!', 'success');
        return;
    }
    
    // Show spinner
    const spinner = document.getElementById('mapSpinner');
    spinner.classList.remove('hidden');
    
    // Sort by priority (highest first)
    const sortedRequests = pendingRequests.sort((a, b) => b.priority - a.priority);
    const waypoints = [L.latLng(BASE_LOCATION.coordinates[0], BASE_LOCATION.coordinates[1])];
    
    sortedRequests.forEach(request => {
        waypoints.push(L.latLng(request.coordinates[0], request.coordinates[1]));
    });
    
    // Add return to base
    waypoints.push(L.latLng(BASE_LOCATION.coordinates[0], BASE_LOCATION.coordinates[1]));
    
    routeControl = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: false,
        show: false,
        createMarker: function() { return null; },
        router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1'
        }),
        lineOptions: {
            styles: [
                { color: '#2563EB', weight: 8, opacity: 0.8 },
                { color: '#ffffff', weight: 5, opacity: 1 }
            ]
        }
    }).on('routesfound', function(e) {
        spinner.classList.add('hidden');
        
        const routes = e.routes;
        const summary = routes[0].summary;
        const totalDistance = (summary.totalDistance / 1000).toFixed(1);
        const totalTime = Math.round(summary.totalTime / 60);
        
        showFlashMessage(
            `🚗 Optimal multi-stop route: ${sortedRequests.length} locations, ${totalDistance}km, ~${totalTime} minutes total`,
            'success'
        );
        
        // Auto-remove route after 30 seconds
        setTimeout(() => {
            if (routeControl) {
                mangaloreMap.removeControl(routeControl);
                routeControl = null;
                showFlashMessage('Route visualization cleared', 'info');
            }
        }, 30000);
        
    }).on('routingerror', function(e) {
        spinner.classList.add('hidden');
        showFlashMessage('❌ Unable to calculate optimization route. Trying alternative...', 'warning');
        console.error('Route optimization error:', e);
    }).addTo(mangaloreMap);
}

// Enhanced Request Management
function loadRequestsTable() {
    const tableBody = document.getElementById('requestsTableBody');
    
    if (activeRequests.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" class="loading-row">No active requests at this time</td></tr>';
        return;
    }
    
    // Sort by priority (highest first)
    const sortedRequests = [...activeRequests].sort((a, b) => b.priority - a.priority);
    
    const tableHTML = sortedRequests.map(request => {
        const priorityLevel = getPriorityLevel(request.priority);
        const progressPercentage = (request.allocated / request.quantity) * 100;
        
        return `
            <tr data-request-id="${request.id}" class="${priorityLevel === 'high' ? 'high-priority' : ''}">
                <td><strong>${request.id}</strong></td>
                <td>${request.type}</td>
                <td>${request.quantity}</td>
                <td>${request.location}</td>
                <td>
                    <span class="priority-badge priority-${priorityLevel}">
                        ${priorityLevel.toUpperCase()} (${request.priority.toFixed(1)})
                    </span>
                </td>
                <td>
                    <span class="status-badge status-${request.pending === 0 ? 'complete' : (request.allocated > 0 ? 'partial' : 'pending')}">
                        ${request.pending === 0 ? 'Complete' : (request.allocated > 0 ? 'Partial' : 'Pending')}
                    </span>
                </td>
                <td>
                    <div class="progress-container">
                        <div class="progress-text">${request.allocated}/${request.quantity} (${progressPercentage.toFixed(1)}%)</div>
                        <div class="progress-bar">
                            <div class="progress-fill ${request.pending > 0 ? (request.allocated > 0 ? 'partial' : '') : 'complete'}" 
                                 style="width: ${progressPercentage}%"></div>
                        </div>
                        ${request.pending > 0 ? `
                            <div class="follow-up-indicator">
                                <i class="fas fa-phone"></i>
                                <span>Pending: ${request.pending}</span>
                            </div>
                            <div class="contact-info">${request.followUpContact}</div>
                        ` : ''}
                    </div>
                </td>
                <td>
                    <button class="btn btn--xs btn--success" onclick="showOnRoadRoute('${request.id}')">
                        <i class="fas fa-route"></i> Route
                    </button>
                </td>
                <td class="admin-only">
                    <div class="action-buttons">
                        ${getRequestActionButtons(request)}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    tableBody.innerHTML = tableHTML;
}

function getRequestActionButtons(request) {
    let buttons = '';
    
    if (currentUserRole === 'admin') {
        if (request.pending > 0) {
            buttons += `<button class="btn btn--xs btn--primary" onclick="allocateFromTable('${request.id}')">
                            <i class="fas fa-plus"></i> Allocate
                        </button>`;
        }
        
        if (request.pending > 0 && request.followUpContact) {
            buttons += `<button class="btn btn--xs btn--warning" onclick="markFollowupComplete('${request.id}')">
                            <i class="fas fa-check"></i> Follow-up
                        </button>`;
        }
        
        buttons += `<button class="btn btn--xs btn--info" onclick="showRequestDetails('${request.id}')">
                        <i class="fas fa-eye"></i> Details
                    </button>`;
    }
    
    return buttons;
}

// Enhanced Resource Management
function loadResourcesTable() {
    const tableBody = document.getElementById('resourcesTableBody');
    
    const tableHTML = resources.map(resource => {
        const utilizationPercentage = ((resource.total - resource.available) / resource.total) * 100;
        
        return `
            <tr data-resource-id="${resource.id}">
                <td><strong>${resource.id}</strong></td>
                <td>${resource.type}</td>
                <td>${resource.total}</td>
                <td>${resource.available}</td>
                <td>${resource.location}</td>
                <td>
                    <span class="status-badge status-${resource.status.toLowerCase()}">
                        ${resource.status}
                    </span>
                </td>
                <td>
                    <div class="progress-container">
                        <div class="progress-text">${utilizationPercentage.toFixed(1)}% utilized</div>
                        <div class="utilization-bar">
                            <div class="utilization-fill ${getUtilizationClass(resource)}" 
                                 style="width: ${utilizationPercentage}%"></div>
                        </div>
                    </div>
                </td>
                <td class="admin-only">
                    <div class="action-buttons">
                        ${currentUserRole === 'admin' ? `
                            <button class="btn btn--xs btn--primary" onclick="editResource('${resource.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn--xs btn--warning" onclick="adjustInventory('${resource.id}')">
                                <i class="fas fa-plus-minus"></i> Adjust
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    tableBody.innerHTML = tableHTML;
}

// ML Predictions
function loadMLPredictions() {
    const predictionsGrid = document.getElementById('predictionsGrid');
    
    predictionsGrid.innerHTML = mlPredictions.map(prediction => `
        <div class="prediction-card">
            <h4>
                <i class="fas fa-chart-line"></i>
                ${prediction.type} Demand
            </h4>
            <div class="prediction-value">
                ${prediction.predictedDemand}
                <span class="prediction-trend">${prediction.trend}</span>
            </div>
            <div class="prediction-basis">
                <strong>Confidence:</strong> ${prediction.confidence}<br>
                <strong>Analysis:</strong> ${prediction.basis}
            </div>
        </div>
    `).join('');
}

// Quick Request Submission
function handleQuickRequest(event) {
    event.preventDefault();
    
    const type = document.getElementById('quickResourceType').value;
    const quantity = parseInt(document.getElementById('quickQuantity').value);
    const severity = parseInt(document.getElementById('quickSeverity').value);
    const individuals = parseInt(document.getElementById('quickIndividuals').value);
    
    // Enhanced priority calculation
    const priority = (individuals * 0.6) + (severity * 0.4);
    
    // Generate coordinates near Mangalore
    const coordinates = [
        BASE_LOCATION.coordinates[0] + (Math.random() - 0.5) * 0.05,
        BASE_LOCATION.coordinates[1] + (Math.random() - 0.5) * 0.05
    ];
    
    const newRequest = {
        id: `REQ${String(activeRequests.length + 1).padStart(3, '0')}`,
        type: type,
        quantity: quantity,
        location: `Emergency Area ${activeRequests.length + 1}`,
        coordinates: coordinates,
        severity: severity,
        individualsAffected: individuals,
        status: 'pending',
        allocated: 0,
        pending: quantity,
        followUpContact: 'emergency@sahyadri.edu.in',
        timestamp: new Date().toISOString(),
        priority: priority
    };
    
    // Try immediate allocation
    processResourceAllocation(newRequest);
    
    activeRequests.push(newRequest);
    
    // Reset form
    document.getElementById('quickRequestForm').reset();
    
    // Update UI
    updateDashboardStats();
    loadRequestsTable();
    updateMapMarkers();
    
    const priorityLevel = getPriorityLevel(priority);
    showFlashMessage(
        `🚨 Emergency request ${newRequest.id} submitted! Priority: ${priorityLevel.toUpperCase()} (${priority.toFixed(1)}) - ${newRequest.allocated > 0 ? `${newRequest.allocated} allocated immediately` : 'Added to pending queue'}`,
        priorityLevel === 'high' ? 'warning' : 'success'
    );
}

// Advanced Request Modal
function showAdvancedRequestModal() {
    document.getElementById('advancedRequestModal').classList.remove('hidden');
    initializeRequestMap();
}

function closeAdvancedRequestModal() {
    document.getElementById('advancedRequestModal').classList.add('hidden');
    document.getElementById('advancedRequestForm').reset();
    document.getElementById('pinnedCoordinates').value = '';
    if (requestMap) {
        requestMap.remove();
        requestMap = null;
    }
}

function initializeRequestMap() {
    if (requestMap) {
        requestMap.remove();
    }
    
    requestMap = L.map('requestMapContainer').setView(BASE_LOCATION.coordinates, 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(requestMap);
    
    // Add base marker
    const baseIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: #2563EB; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
                   <i class="fas fa-home" style="color: white; font-size: 10px;"></i>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
    
    L.marker(BASE_LOCATION.coordinates, { icon: baseIcon })
        .bindPopup('Sahyadri College - Emergency Base')
        .addTo(requestMap);
    
    // Add existing markers for context
    resources.forEach(resource => {
        const { color } = getResourceMarkerStyle(resource);
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%;"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });
        L.marker(resource.coordinates, { icon }).addTo(requestMap);
    });
    
    // Enhanced click handler for location pinning
    let locationMarker = null;
    
    requestMap.on('click', function(e) {
        if (locationMarker) {
            requestMap.removeLayer(locationMarker);
        }
        
        const coords = [e.latlng.lat, e.latlng.lng];
        document.getElementById('pinnedCoordinates').value = coords.join(',');
        
        const pinIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: #EF4444; width: 32px; height: 32px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
                       <i class="fas fa-map-pin" style="color: white; font-size: 16px;"></i>
                   </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        
        locationMarker = L.marker(coords, { icon: pinIcon })
            .bindPopup('📍 Emergency Request Location<br>Click elsewhere to move')
            .addTo(requestMap);
            
        showFlashMessage('📍 Location pinned! Coordinates: ' + coords.map(c => c.toFixed(6)).join(', '), 'info');
    });
}

function handleAdvancedRequest(event) {
    event.preventDefault();
    
    const type = document.getElementById('advancedResourceType').value;
    const quantity = parseInt(document.getElementById('advancedQuantity').value);
    const severity = parseInt(document.getElementById('advancedSeverity').value);
    const individuals = parseInt(document.getElementById('advancedIndividuals').value);
    const location = document.getElementById('advancedLocation').value;
    const coordinatesStr = document.getElementById('pinnedCoordinates').value;
    
    let coordinates;
    if (coordinatesStr) {
        coordinates = coordinatesStr.split(',').map(coord => parseFloat(coord.trim()));
    } else {
        // Default to area near college if no pin
        coordinates = [
            BASE_LOCATION.coordinates[0] + (Math.random() - 0.5) * 0.02,
            BASE_LOCATION.coordinates[1] + (Math.random() - 0.5) * 0.02
        ];
    }
    
    const priority = (individuals * 0.6) + (severity * 0.4);
    
    const newRequest = {
        id: `REQ${String(activeRequests.length + 1).padStart(3, '0')}`,
        type: type,
        quantity: quantity,
        location: location,
        coordinates: coordinates,
        severity: severity,
        individualsAffected: individuals,
        status: 'pending',
        allocated: 0,
        pending: quantity,
        followUpContact: 'emergency@sahyadri.edu.in',
        timestamp: new Date().toISOString(),
        priority: priority
    };
    
    // Process allocation
    processResourceAllocation(newRequest);
    
    activeRequests.push(newRequest);
    
    closeAdvancedRequestModal();
    
    updateDashboardStats();
    loadRequestsTable();
    updateMapMarkers();
    
    showFlashMessage(
        `🎯 Detailed request ${newRequest.id} submitted for ${location}! ${newRequest.allocated > 0 ? `${newRequest.allocated}/${quantity} allocated` : 'Added to processing queue'}`,
        'success'
    );
}

// Smart Resource Allocation Engine
function processResourceAllocation(request) {
    const availableResource = resources.find(res => res.type === request.type && res.available > 0);
    
    if (!availableResource) {
        return;
    }
    
    const canAllocate = Math.min(request.pending, availableResource.available);
    
    if (canAllocate > 0) {
        // Update resource
        availableResource.available -= canAllocate;
        updateResourceStatus(availableResource);
        
        // Update request
        request.allocated += canAllocate;
        request.pending -= canAllocate;
        
        if (request.pending === 0) {
            request.status = 'allocated';
            request.followUpContact = '';
        } else {
            request.status = 'partial';
            request.followUpContact = availableResource.contact;
        }
    }
}

function updateResourceStatus(resource) {
    if (resource.available === 0) {
        resource.status = 'Deployed';
    } else if (resource.available < resource.total) {
        resource.status = 'Partial';
    } else {
        resource.status = 'Available';
    }
}

// Admin Functions
function allocateFromTable(requestId) {
    allocateResource(requestId);
}

function allocateFromMap(requestId) {
    allocateResource(requestId);
}

function allocateResource(requestId) {
    const request = activeRequests.find(req => req.id === requestId);
    if (!request || request.pending === 0) {
        showFlashMessage('No pending allocation needed for this request', 'info');
        return;
    }
    
    processResourceAllocation(request);
    
    updateDashboardStats();
    loadRequestsTable();
    loadResourcesTable();
    updateMapMarkers();
    
    showFlashMessage(
        `✅ Resource allocation updated for ${requestId}. ${request.pending > 0 ? `${request.pending} units still pending` : 'Request fully satisfied!'}`,
        request.pending > 0 ? 'warning' : 'success'
    );
}

function markFollowupComplete(requestId) {
    const request = activeRequests.find(req => req.id === requestId);
    if (request) {
        request.followUpContact = '';
        loadRequestsTable();
        showFlashMessage(`📞 Follow-up marked complete for ${requestId}`, 'success');
    }
}

function showRequestDetails(requestId) {
    const request = activeRequests.find(req => req.id === requestId);
    if (!request) return;
    
    const details = `
🚨 EMERGENCY REQUEST DETAILS

Request ID: ${request.id}
Resource Type: ${request.type}
Location: ${request.location}
Coordinates: ${request.coordinates.join(', ')}

📊 PRIORITY ANALYSIS
Severity Level: ${request.severity}/5
Individuals Affected: ${request.individualsAffected}
Calculated Priority: ${request.priority.toFixed(2)} (${getPriorityLevel(request.priority).toUpperCase()})

📦 ALLOCATION STATUS
Total Requested: ${request.quantity}
Currently Allocated: ${request.allocated}
Still Pending: ${request.pending}
Status: ${request.status.toUpperCase()}
${request.followUpContact ? `Follow-up Contact: ${request.followUpContact}` : ''}

⏰ TIMELINE
Submitted: ${new Date(request.timestamp).toLocaleString()}
    `;
    
    alert(details);
}

function quickAllocate(resourceId) {
    if (currentUserRole !== 'admin') return;
    
    const resource = resources.find(res => res.id === resourceId);
    if (!resource || resource.available === 0) {
        showFlashMessage('No resources available for allocation', 'warning');
        return;
    }
    
    // Find highest priority pending request of this type
    const pendingRequests = activeRequests.filter(req => req.type === resource.type && req.pending > 0)
                                         .sort((a, b) => b.priority - a.priority);
    
    if (pendingRequests.length === 0) {
        showFlashMessage(`No pending ${resource.type} requests found`, 'info');
        return;
    }
    
    const request = pendingRequests[0];
    processResourceAllocation(request);
    
    updateDashboardStats();
    loadRequestsTable();
    loadResourcesTable();
    updateMapMarkers();
    
    showFlashMessage(`⚡ Quick allocation: ${resource.type} → ${request.id} (${request.location})`, 'success');
}

// Resource Management
function showAddResourceModal() {
    if (currentUserRole !== 'admin') {
        showFlashMessage('❌ Administrator access required', 'error');
        return;
    }
    document.getElementById('addResourceModal').classList.remove('hidden');
}

function closeAddResourceModal() {
    document.getElementById('addResourceModal').classList.add('hidden');
    document.getElementById('addResourceForm').reset();
}

function handleAddResource(event) {
    event.preventDefault();
    
    if (currentUserRole !== 'admin') {
        showFlashMessage('❌ Administrator access required', 'error');
        return;
    }
    
    const type = document.getElementById('newResourceType').value;
    const total = parseInt(document.getElementById('newResourceTotal').value);
    const available = parseInt(document.getElementById('newResourceAvailable').value);
    const location = document.getElementById('newResourceLocation').value;
    const contact = document.getElementById('newResourceContact').value;
    
    if (available > total) {
        showFlashMessage('❌ Available quantity cannot exceed total quantity', 'error');
        return;
    }
    
    const newResourceId = `RES${String(resources.length + 1).padStart(3, '0')}`;
    
    // Random coordinates near base
    const coordinates = [
        BASE_LOCATION.coordinates[0] + (Math.random() - 0.5) * 0.01,
        BASE_LOCATION.coordinates[1] + (Math.random() - 0.5) * 0.01
    ];
    
    const newResource = {
        id: newResourceId,
        type: type,
        total: total,
        available: available,
        location: location,
        coordinates: coordinates,
        contact: contact,
        status: available === total ? 'Available' : (available === 0 ? 'Deployed' : 'Partial')
    };
    
    resources.push(newResource);
    
    closeAddResourceModal();
    
    updateDashboardStats();
    loadResourcesTable();
    updateMapMarkers();
    
    showFlashMessage(`✅ New resource ${newResourceId} (${type}) added to inventory!`, 'success');
}

function editResource(resourceId) {
    if (currentUserRole !== 'admin') {
        showFlashMessage('❌ Administrator access required', 'error');
        return;
    }
    
    const resource = resources.find(res => res.id === resourceId);
    if (!resource) return;
    
    const newQuantity = prompt(`Edit available quantity for ${resource.type} at ${resource.location}:`, resource.available);
    if (newQuantity !== null && !isNaN(newQuantity)) {
        const quantity = parseInt(newQuantity);
        if (quantity >= 0 && quantity <= resource.total) {
            resource.available = quantity;
            updateResourceStatus(resource);
            
            updateDashboardStats();
            loadResourcesTable();
            updateMapMarkers();
            
            showFlashMessage(`📝 Updated ${resource.type} availability to ${quantity}`, 'success');
        } else {
            showFlashMessage('❌ Invalid quantity (must be 0 to ' + resource.total + ')', 'error');
        }
    }
}

function adjustInventory(resourceId) {
    if (currentUserRole !== 'admin') {
        showFlashMessage('❌ Administrator access required', 'error');
        return;
    }
    
    const resource = resources.find(res => res.id === resourceId);
    if (!resource) return;
    
    const adjustment = prompt(`Adjust inventory for ${resource.type}\n\nCurrent Total: ${resource.total}\nCurrent Available: ${resource.available}\n\nEnter adjustment amount (+ to add, - to remove):`, '0');
    
    if (adjustment !== null && !isNaN(adjustment)) {
        const change = parseInt(adjustment);
        const newTotal = resource.total + change;
        const newAvailable = resource.available + change;
        
        if (newTotal >= 0 && newAvailable >= 0 && newAvailable <= newTotal) {
            resource.total = newTotal;
            resource.available = newAvailable;
            updateResourceStatus(resource);
            
            updateDashboardStats();
            loadResourcesTable();
            updateMapMarkers();
            
            showFlashMessage(`📊 Inventory adjusted: ${resource.type} ${change >= 0 ? '+' + change : change} units`, 'success');
        } else {
            showFlashMessage('❌ Invalid adjustment - check values', 'error');
        }
    }
}

// Enhanced Utility Functions
function showFlashMessage(message, type = 'info', duration = 6000) {
    const flashDiv = document.createElement('div');
    flashDiv.className = `flash-message ${type}`;
    flashDiv.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <i class="fas fa-${getFlashIcon(type)}" style="margin-top: 2px; font-size: 16px;"></i>
            <div style="flex: 1; font-size: 15px; line-height: 1.4;">${message}</div>
        </div>
    `;
    
    document.getElementById('flashMessages').appendChild(flashDiv);
    
    // Auto remove
    setTimeout(() => {
        if (flashDiv.parentNode) {
            flashDiv.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (flashDiv.parentNode) {
                    flashDiv.parentNode.removeChild(flashDiv);
                }
            }, 300);
        }
    }, duration);
    
    // Click to close
    flashDiv.addEventListener('click', () => {
        if (flashDiv.parentNode) {
            flashDiv.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (flashDiv.parentNode) {
                    flashDiv.parentNode.removeChild(flashDiv);
                }
            }, 300);
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

// Global function exports for HTML onclick handlers
window.toggleMobileMenu = toggleMobileMenu;
window.showAdminLogin = showAdminLogin;
window.closeAdminLogin = closeAdminLogin;
window.handleAdminLogin = handleAdminLogin;
window.switchToUserMode = switchToUserMode;
window.toggleMapLayer = toggleMapLayer;
window.optimizeAllRoutes = optimizeAllRoutes;
window.showOnRoadRoute = showOnRoadRoute;
window.clearRoute = clearRoute;
window.showRouteInfoModal = showRouteInfoModal;
window.closeRouteInfoModal = closeRouteInfoModal;
window.handleQuickRequest = handleQuickRequest;
window.showAdvancedRequestModal = showAdvancedRequestModal;
window.closeAdvancedRequestModal = closeAdvancedRequestModal;
window.handleAdvancedRequest = handleAdvancedRequest;
window.showAddResourceModal = showAddResourceModal;
window.closeAddResourceModal = closeAddResourceModal;
window.handleAddResource = handleAddResource;
window.allocateFromTable = allocateFromTable;
window.allocateFromMap = allocateFromMap;
window.markFollowupComplete = markFollowupComplete;
window.showRequestDetails = showRequestDetails;
window.quickAllocate = quickAllocate;
window.editResource = editResource;
window.adjustInventory = adjustInventory;