// Sample request data (in a real app, this would come from a backend)
const requests = {
    new: [
        {
            id: 1234,
            item: "Wireless Headphones",
            pickup: "Model Town Market",
            delivery: "NIT Jalandhar Hostel",
            budget: 2500,
            time: "Today, Before 8 PM",
            description: "Looking for wireless headphones with noise cancellation"
        }
    ],
    pending: [
        {
            id: 1235,
            item: "Smart Watch",
            pickup: "City Centre Mall",
            delivery: "NIT Jalandhar Campus",
            budget: 15000,
            status: "Picked up, On the way",
            eta: "30 minutes"
        }
    ],
    accepted: [
        {
            id: 1236,
            item: "Laptop Backpack",
            pickup: "Lajpat Nagar Market",
            delivery: "NIT Jalandhar Boys Hostel",
            budget: 2000,
            status: "Ready for Pickup",
            time: "Tomorrow, Before 6 PM"
        }
    ],
    completed: [
        {
            id: 1237,
            item: "Wireless Mouse",
            pickup: "Model Town Market",
            delivery: "NIT Jalandhar Girls Hostel",
            budget: 1500,
            completionDate: "Today, 3:45 PM",
            rating: "⭐⭐⭐⭐⭐"
        }
    ]
};

// Function to accept a delivery request
function acceptRequest(requestId) {
    const request = requests.new.find(r => r.id === requestId);
    if (request) {
        showNotification('Delivery request accepted! You can now proceed with pickup.', 'success');
        // Move request from new to accepted
        requests.accepted.push(request);
        requests.new = requests.new.filter(r => r.id !== requestId);
        updateRequestDisplay();
    }
}

// Function to deny a delivery request
function denyRequest(requestId) {
    const request = requests.new.find(r => r.id === requestId);
    if (request) {
        showNotification('Delivery request declined', 'error');
        // Remove request from new
        requests.new = requests.new.filter(r => r.id !== requestId);
        updateRequestDisplay();
    }
}

// Function to update delivery status
function updateStatus(requestId) {
    // In a real app, this would open a modal with status options
    const statusOptions = [
        "Picked up",
        "On the way",
        "Near delivery location",
        "Delivered"
    ];
    showNotification('Status updated successfully!', 'success');
}

// Function to complete a delivery
function completeRequest(requestId) {
    const request = requests.accepted.find(r => r.id === requestId);
    if (request) {
        showNotification('Delivery marked as completed! Thank you for your service.', 'success');
        // Move request from accepted to completed
        requests.completed.push(request);
        requests.accepted = requests.accepted.filter(r => r.id !== requestId);
        updateRequestDisplay();
    }
}

// Function to review a completed delivery
function reviewRequest(requestId) {
    // In a real app, this would show delivery details and rating
    showNotification('Delivery details loaded', 'success');
}

// Function to show notifications
function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    icon.innerHTML = type === 'success' ? '✓' : '✕';
    
    const text = document.createElement('span');
    text.className = 'notification-text';
    text.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(text);
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Function to update the request display
function updateRequestDisplay(data = requests) {
    const sections = ['new', 'pending', 'accepted', 'completed'];
    
    sections.forEach(section => {
        const container = document.querySelector(`#${section} .requests-grid`);
        if (container) {
            container.innerHTML = data[section].map(request => `
                <div class="request-card">
                    <div class="request-header">
                        <h3>Request #${request.id}</h3>
                        <span class="status ${section}">${section.charAt(0).toUpperCase() + section.slice(1)}</span>
                    </div>
                    <div class="request-details">
                        <p><strong>Item:</strong> ${request.item}</p>
                        <p><strong>Pickup:</strong> ${request.pickup}</p>
                        <p><strong>Delivery:</strong> ${request.delivery}</p>
                        <p><strong>Budget:</strong> ₹${request.budget}</p>
                        ${request.status ? `<p><strong>Status:</strong> ${request.status}</p>` : ''}
                        ${request.eta ? `<p><strong>ETA:</strong> ${request.eta}</p>` : ''}
                        ${request.time ? `<p><strong>Time:</strong> ${request.time}</p>` : ''}
                        ${request.description ? `<p><strong>Description:</strong> ${request.description}</p>` : ''}
                    </div>
                    <div class="request-actions">
                        ${getActionButtons(request.id, section)}
                    </div>
                </div>
            `).join('');
        }
    });
}

// Helper function to get action buttons based on request status
function getActionButtons(requestId, section) {
    switch(section) {
        case 'new':
            return `
                <button class="accept-btn" onclick="acceptRequest(${requestId})">Accept Delivery</button>
                <button class="deny-btn" onclick="denyRequest(${requestId})">Decline</button>
            `;
        case 'pending':
            return `
                <button class="update-btn" onclick="showStatusModal(${requestId})">Update Status</button>
            `;
        case 'accepted':
            return `
                <button class="complete-btn" onclick="completeRequest(${requestId})">Mark as Delivered</button>
            `;
        case 'completed':
            return `
                <button class="review-btn" onclick="reviewRequest(${requestId})">View Details</button>
            `;
        default:
            return '';
    }
}

// Status update modal functionality
function showStatusModal(requestId) {
    const modal = document.createElement('div');
    modal.className = 'status-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Update Delivery Status</h3>
            <div class="status-options">
                <button onclick="updateDeliveryStatus(${requestId}, 'picked_up')">Picked Up</button>
                <button onclick="updateDeliveryStatus(${requestId}, 'on_way')">On the Way</button>
                <button onclick="updateDeliveryStatus(${requestId}, 'near_delivery')">Near Delivery Location</button>
                <button onclick="updateDeliveryStatus(${requestId}, 'delivered')">Delivered</button>
            </div>
            <button class="close-modal" onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Enhanced status update function
function updateDeliveryStatus(requestId, status) {
    const request = requests.pending.find(r => r.id === requestId);
    if (request) {
        const statusMap = {
            'picked_up': 'Picked up',
            'on_way': 'On the way',
            'near_delivery': 'Near delivery location',
            'delivered': 'Delivered'
        };
        
        request.status = statusMap[status];
        if (status === 'delivered') {
            completeRequest(requestId);
        }
        
        showNotification(`Status updated to: ${statusMap[status]}`, 'success');
        document.querySelector('.status-modal').remove();
        updateRequestDisplay();
    }
}

// Search functionality
function searchRequests(query) {
    const searchResults = {
        new: requests.new.filter(r => 
            r.item.toLowerCase().includes(query.toLowerCase()) ||
            r.pickup.toLowerCase().includes(query.toLowerCase()) ||
            r.delivery.toLowerCase().includes(query.toLowerCase())
        ),
        pending: requests.pending.filter(r => 
            r.item.toLowerCase().includes(query.toLowerCase()) ||
            r.pickup.toLowerCase().includes(query.toLowerCase()) ||
            r.delivery.toLowerCase().includes(query.toLowerCase())
        ),
        accepted: requests.accepted.filter(r => 
            r.item.toLowerCase().includes(query.toLowerCase()) ||
            r.pickup.toLowerCase().includes(query.toLowerCase()) ||
            r.delivery.toLowerCase().includes(query.toLowerCase())
        ),
        completed: requests.completed.filter(r => 
            r.item.toLowerCase().includes(query.toLowerCase()) ||
            r.pickup.toLowerCase().includes(query.toLowerCase()) ||
            r.delivery.toLowerCase().includes(query.toLowerCase())
        )
    };
    
    updateRequestDisplay(searchResults);
}

// Document Management
let currentDocumentType = null;
let signaturePad;
let stream = null;

// Initialize document management
function initDocumentManagement() {
    // Initialize signature pad
    const canvas = document.getElementById('signatureCanvas');
    signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)'
    });

    // Initialize camera
    initCamera();

    // Add event listeners
    document.getElementById('uploadDoc').addEventListener('click', () => {
        document.getElementById('uploadModal').style.display = 'flex';
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('uploadModal').style.display = 'none';
    });

    document.getElementById('dropZone').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', handleFileSelect);

    document.getElementById('dropZone').addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('dropZone').classList.add('dragover');
    });

    document.getElementById('dropZone').addEventListener('dragleave', () => {
        document.getElementById('dropZone').classList.remove('dragover');
    });

    document.getElementById('dropZone').addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('dropZone').classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    document.getElementById('capturePhoto').addEventListener('click', capturePhoto);
    document.getElementById('retakePhoto').addEventListener('click', retakePhoto);
    document.getElementById('clearSignature').addEventListener('click', clearSignature);
    document.getElementById('saveSignature').addEventListener('click', saveSignature);
}

// Initialize camera
async function initCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('camera');
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing camera:', err);
        showNotification('Error accessing camera. Please check permissions.', 'error');
    }
}

// Handle file selection
function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

// Handle files
function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/') || file.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('uploadPreview');
                if (file.type.startsWith('image/')) {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                } else {
                    preview.innerHTML = `<div class="pdf-preview">PDF Document</div>`;
                }
                document.getElementById('confirmUpload').style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            showNotification('Unsupported file type. Please upload JPG, PNG, or PDF.', 'error');
        }
    }
}

// Upload document
function uploadDocument(type) {
    currentDocumentType = type;
    document.getElementById('uploadModal').style.display = 'flex';
}

// Capture photo
function capturePhoto() {
    const video = document.getElementById('camera');
    const canvas = document.getElementById('photoCanvas');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    video.style.display = 'none';
    canvas.style.display = 'block';
    document.getElementById('capturePhoto').style.display = 'none';
    document.getElementById('retakePhoto').style.display = 'block';
}

// Retake photo
function retakePhoto() {
    const video = document.getElementById('camera');
    const canvas = document.getElementById('photoCanvas');

    video.style.display = 'block';
    canvas.style.display = 'none';
    document.getElementById('capturePhoto').style.display = 'block';
    document.getElementById('retakePhoto').style.display = 'none';
}

// Clear signature
function clearSignature() {
    signaturePad.clear();
}

// Save signature
function saveSignature() {
    if (signaturePad.isEmpty()) {
        showNotification('Please provide a signature', 'error');
        return;
    }

    const signatureData = signaturePad.toDataURL();
    // Here you would typically send the signature data to your server
    showNotification('Signature saved successfully', 'success');
}

// DOM Elements
const requestsList = document.getElementById('requestsList');
const activeDeliveriesList = document.getElementById('activeDeliveriesList');
const completedDeliveriesList = document.getElementById('completedDeliveriesList');
const documentPanel = document.getElementById('docVerificationPanel');
const routeModal = document.getElementById('routeModal');

// Side Panel Controls
document.querySelector('#uploadDocBtn').addEventListener('click', () => {
    documentPanel.classList.add('active');
});

// Close panels when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.side-panel') && !e.target.closest('.action-card')) {
        documentPanel.classList.remove('active');
    }
});

// Close panel buttons
document.querySelectorAll('.close-panel').forEach(btn => {
    btn.addEventListener('click', () => {
        documentPanel.classList.remove('active');
    });
});

// Route Modal Controls
function openRouteModal() {
    routeModal.style.display = 'flex';
    optimizeRoute();
}

function closeRouteModal() {
    routeModal.style.display = 'none';
    resetRouteModal();
}

// Close modal when clicking the close button
document.getElementById('closeRouteModal').addEventListener('click', closeRouteModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === routeModal) {
        closeRouteModal();
    }
});

// Document Upload Handling
let currentFile = null;

// Function to handle document upload
function uploadDocument(type) {
    currentDocumentType = type;
    
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,.pdf';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // Add event listener for file selection
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleDocumentFile(file);
        }
        // Remove the input element after use
        document.body.removeChild(fileInput);
    });
    
    // Trigger file selection dialog
    fileInput.click();
}

// Function to handle the selected document file
function handleDocumentFile(file) {
    currentFile = file;
    
    // Check file type
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const preview = document.getElementById('uploadPreview');
            
            // Clear previous preview
            preview.innerHTML = '';
            
            // Create preview based on file type
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Document Preview';
                img.style.maxWidth = '100%';
                img.style.maxHeight = '300px';
                img.style.borderRadius = '8px';
                preview.appendChild(img);
            } else {
                // For PDF files
                const pdfContainer = document.createElement('div');
                pdfContainer.className = 'pdf-preview';
                pdfContainer.innerHTML = `
                    <i class="fas fa-file-pdf" style="font-size: 48px; color: #e74c3c;"></i>
                    <p>${file.name}</p>
                `;
                preview.appendChild(pdfContainer);
            }
            
            // Show confirm button
            const confirmBtn = document.getElementById('confirmUpload');
            confirmBtn.style.display = 'block';
            
            // Add event listener for confirm button
            confirmBtn.onclick = () => confirmDocumentUpload();
        };
        
        reader.readAsDataURL(file);
    } else {
        showNotification('Unsupported file type. Please upload JPG, PNG, or PDF.', 'error');
    }
}

// Function to confirm document upload
function confirmDocumentUpload() {
    if (!currentFile || !currentDocumentType) {
        showNotification('No document selected', 'error');
        return;
    }
    
    // In a real application, you would upload the file to a server here
    // For this demo, we'll simulate a successful upload
    
    // Update document status
    const documentItem = document.querySelector(`.document-item button[onclick="uploadDocument('${currentDocumentType}')"]`).closest('.document-item');
    const statusSpan = documentItem.querySelector('.document-status');
    
    // Change status to pending verification
    statusSpan.className = 'document-status status-pending';
    statusSpan.textContent = 'Pending Verification';
    
    // Update button text
    const button = documentItem.querySelector('button');
    button.innerHTML = '<i class="fas fa-sync-alt"></i> Update';
    
    // Show success notification
    showNotification('Document uploaded successfully! Pending verification.', 'success');
    
    // Reset preview
    document.getElementById('uploadPreview').innerHTML = '';
    document.getElementById('confirmUpload').style.display = 'none';
    
    // Reset current file and type
    currentFile = null;
    currentDocumentType = null;
}

// Route Optimization Variables
let map;
let routePolyline;
let pickupMarkers = [];
let deliveryMarkers = [];
let currentMarker;
let currentRoute = [];
let isRouteActive = false;
let routeOptions = {
    avoidTraffic: true,
    preferHighways: true,
    optimizeTime: true,
    groupByArea: true,
    balanceLoad: true
};

// Map Initialization and Controls
let trafficLayer = null;
let satelliteLayer = null;
let isSatelliteView = false;

// Route Optimization Functions
function setupRouteModalListeners() {
    // Toggle map view
    document.getElementById('toggleMapView').addEventListener('click', () => {
        const mapContainer = document.querySelector('.map-container');
        mapContainer.classList.toggle('map-only');
        const routeInfo = document.querySelector('.route-info');
        routeInfo.classList.toggle('hidden');
    });

    // Toggle route info
    document.getElementById('toggleRouteInfo').addEventListener('click', () => {
        const routeInfo = document.querySelector('.route-info');
        routeInfo.classList.toggle('hidden');
    });

    // Route options
    const optionInputs = document.querySelectorAll('.option-label input');
    optionInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            routeOptions[e.target.id] = e.target.checked;
            if (currentRoute.length > 0) {
                optimizeRoute();
            }
        });
    });

    // Start route
    document.getElementById('startRoute').addEventListener('click', () => {
        if (currentRoute.length > 0) {
            isRouteActive = true;
            startRoute();
            closeRouteModal();
            showNotification('Route started! Follow the optimized path.', 'success');
        }
    });

    // Reoptimize route
    document.getElementById('reoptimizeRoute').addEventListener('click', () => {
        optimizeRoute();
    });

    // Save route
    document.getElementById('saveRoute').addEventListener('click', () => {
        if (currentRoute.length > 0) {
            saveRoute();
            showNotification('Route saved successfully!', 'success');
        } else {
            showNotification('No route to save', 'warning');
        }
    });

    // Sort deliveries
    document.getElementById('sortByDistance').addEventListener('click', () => {
        sortDeliveries('distance');
    });

    document.getElementById('sortByTime').addEventListener('click', () => {
        sortDeliveries('time');
    });
}

function resetRouteModal() {
    clearMap();
    currentRoute = [];
    isRouteActive = false;
    document.getElementById('startRoute').disabled = true;
    document.getElementById('deliveryList').innerHTML = '';
}

function optimizeRoute() {
    const activeDeliveries = getActiveDeliveries();
    if (activeDeliveries.length === 0) {
        showNotification('No active deliveries to optimize', 'warning');
        return;
    }

    // Show loading state
    const optimizeBtn = document.getElementById('optimizeRouteBtn');
    optimizeBtn.disabled = true;
    optimizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Optimizing...';

    // Clear previous route
    clearMap();
    initMap();

    // Simulate API call delay
    setTimeout(() => {
        try {
            // Display delivery points on map
            displayDeliveryPoints(activeDeliveries);
            
            // Calculate and display optimal route
            calculateOptimalRoute(activeDeliveries);
            
            // Update route statistics
            updateRouteStats(activeDeliveries);
            
            // Enable route controls
            enableRouteControls();
            
            showNotification('Route optimized successfully!', 'success');
        } catch (error) {
            console.error('Route optimization error:', error);
            showNotification('Error optimizing route. Please try again.', 'error');
        } finally {
            // Reset button state
            optimizeBtn.disabled = false;
            optimizeBtn.innerHTML = '<i class="fas fa-route"></i> Optimize Route';
        }
    }, 1500);
}

function initMap() {
    console.log('Initializing map...');
    
    // Clear existing map if it exists
    if (map) {
        map.remove();
        map = null;
    }
    
    // Get the map container
    const mapContainer = document.getElementById('deliveryMap');
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }
    
    // Initialize the map centered on Jalandhar
    map = L.map('deliveryMap', {
        center: [31.3260, 75.5762],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
    });
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add traffic layer if enabled
    if (routeOptions.avoidTraffic) {
        trafficLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            opacity: 0.5
        }).addTo(map);
    }
    
    // Add zoom control to the top right
    L.control.zoom({
        position: 'topright'
    }).addTo(map);
    
    // Add scale control
    L.control.scale({
        imperial: false,
        position: 'bottomright'
    }).addTo(map);
    
    // Add custom controls
    const customControls = L.control({position: 'bottomleft'});
    customControls.onAdd = function() {
        const div = L.DomUtil.create('div', 'custom-map-controls');
        div.innerHTML = `
            <button id="centerMap" class="map-control-btn" title="Center Map">
                <i class="fas fa-crosshairs"></i>
            </button>
            <button id="toggleTraffic" class="map-control-btn" title="Toggle Traffic">
                <i class="fas fa-traffic-light"></i>
            </button>
            <button id="toggleMarkers" class="map-control-btn" title="Toggle Markers">
                <i class="fas fa-map-marker-alt"></i>
            </button>
        `;
        return div;
    };
    customControls.addTo(map);
    
    // Add event listeners for custom controls
    document.getElementById('centerMap').addEventListener('click', () => {
        if (currentRoute.length > 0) {
            map.fitBounds(routePolyline.getBounds());
        } else {
            map.setView([31.3260, 75.5762], 13);
        }
    });
    
    document.getElementById('toggleTraffic').addEventListener('click', () => {
        routeOptions.avoidTraffic = !routeOptions.avoidTraffic;
        document.getElementById('avoidTraffic').checked = routeOptions.avoidTraffic;
        optimizeRoute();
    });
    
    document.getElementById('toggleMarkers').addEventListener('click', () => {
        const markersVisible = pickupMarkers[0] && pickupMarkers[0].getOpacity() === 1;
        const opacity = markersVisible ? 0 : 1;
        
        pickupMarkers.forEach(marker => marker.setOpacity(opacity));
        deliveryMarkers.forEach(marker => marker.setOpacity(opacity));
    });

    // Initialize map control buttons
    initMapControls();
    
    console.log('Map initialized successfully');
}

function initMapControls() {
    // Zoom controls
    document.getElementById('zoomIn').addEventListener('click', () => {
        map.zoomIn();
    });
    
    document.getElementById('zoomOut').addEventListener('click', () => {
        map.zoomOut();
    });
    
    document.getElementById('resetMap').addEventListener('click', () => {
        if (currentRoute.length > 0) {
            map.fitBounds(routePolyline.getBounds());
        } else {
            map.setView([31.3260, 75.5762], 13);
        }
    });
    
    // Toggle traffic layer
    document.getElementById('toggleTrafficLayer').addEventListener('click', () => {
        const btn = document.getElementById('toggleTrafficLayer');
        if (trafficLayer) {
            if (map.hasLayer(trafficLayer)) {
                map.removeLayer(trafficLayer);
                btn.classList.remove('active');
            } else {
                map.addLayer(trafficLayer);
                btn.classList.add('active');
            }
        } else {
            trafficLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                opacity: 0.5
            }).addTo(map);
            btn.classList.add('active');
        }
    });
    
    // Toggle satellite view
    document.getElementById('toggleSatelliteView').addEventListener('click', () => {
        const btn = document.getElementById('toggleSatelliteView');
        isSatelliteView = !isSatelliteView;
        
        if (isSatelliteView) {
            // Remove standard layer
            map.removeLayer(map.getPane('tilePane')._layers[Object.keys(map.getPane('tilePane')._layers)[0]].layer);
            
            // Add satellite layer
            satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '© Esri'
            }).addTo(map);
            
            btn.classList.add('active');
        } else {
            // Remove satellite layer
            if (satelliteLayer) {
                map.removeLayer(satelliteLayer);
            }
            
            // Add standard layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            btn.classList.remove('active');
        }
    });
}

function clearMap() {
    if (map) {
        map.remove();
        map = null;
    }
    pickupMarkers = [];
    deliveryMarkers = [];
    if (routePolyline) {
        routePolyline.remove();
        routePolyline = null;
    }
}

function displayDeliveryPoints(deliveries) {
    deliveries.forEach((delivery, index) => {
        // Create pickup marker
        const pickupMarker = L.marker([delivery.pickup.lat, delivery.pickup.lng], {
            icon: L.divIcon({
                className: 'marker-pin pickup',
                html: `<div class="marker-content">P${index + 1}</div>`
            })
        }).addTo(map);

        // Add popup to pickup marker
        pickupMarker.bindPopup(`
            <div class="marker-popup">
                <h4>Pickup #${index + 1}</h4>
                <p><strong>Location:</strong> ${delivery.pickup.address}</p>
                <p><strong>Items:</strong> ${delivery.items}</p>
                <p><strong>Time:</strong> ${delivery.time}</p>
            </div>
        `);

        // Create delivery marker
        const deliveryMarker = L.marker([delivery.delivery.lat, delivery.delivery.lng], {
            icon: L.divIcon({
                className: 'marker-pin delivery',
                html: `<div class="marker-content">D${index + 1}</div>`
            })
        }).addTo(map);

        // Add popup to delivery marker
        deliveryMarker.bindPopup(`
            <div class="marker-popup">
                <h4>Delivery #${index + 1}</h4>
                <p><strong>Location:</strong> ${delivery.delivery.address}</p>
                <p><strong>Items:</strong> ${delivery.items}</p>
                <p><strong>Budget:</strong> ₹${delivery.budget}</p>
                <p><strong>Time:</strong> ${delivery.time}</p>
            </div>
        `);

        pickupMarkers.push(pickupMarker);
        deliveryMarkers.push(deliveryMarker);
    });

    // Fit map bounds to show all markers
    const group = L.featureGroup([...pickupMarkers, ...deliveryMarkers]);
    map.fitBounds(group.getBounds());
}

function calculateOptimalRoute(deliveries) {
    currentRoute = [];
    const unvisited = [...deliveries];
    let current = unvisited.shift();

    while (unvisited.length > 0) {
        const next = findNearestDelivery(current, unvisited);
        currentRoute.push(next);
        unvisited.splice(unvisited.indexOf(next), 1);
        current = next;
    }

    displayRoute(currentRoute);
    updateDeliveryList(currentRoute);
}

function findNearestDelivery(current, candidates) {
    let bestScore = Infinity;
    let bestDelivery = null;

    candidates.forEach(delivery => {
        const score = calculateDeliveryScore(current, delivery);
        if (score < bestScore) {
            bestScore = score;
            bestDelivery = delivery;
        }
    });

    return bestDelivery;
}

function calculateDeliveryScore(current, delivery) {
    let score = calculateDistance(
        current.delivery.lat,
        current.delivery.lng,
        delivery.pickup.lat,
        delivery.pickup.lng
    );

    // Apply traffic penalty if enabled
    if (routeOptions.avoidTraffic) {
        score += getTrafficPenalty(delivery.pickup.lat, delivery.pickup.lng);
    }

    // Apply highway preference if enabled
    if (routeOptions.preferHighways) {
        score = adjustForHighways(score, delivery);
    }

    // Apply time optimization if enabled
    if (routeOptions.optimizeTime) {
        score = adjustForTime(score, delivery);
    }

    // Apply area grouping if enabled
    if (routeOptions.groupByArea) {
        score = adjustForArea(score, delivery);
    }

    // Apply load balancing if enabled
    if (routeOptions.balanceLoad) {
        score = adjustForLoad(score, delivery);
    }

    return score;
}

function calculateDistance(lat1, lng1, lat2, lng2) {
    // Haversine formula for calculating distance between two points
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(degrees) {
    return degrees * (Math.PI/180);
}

function getTrafficPenalty(lat, lng) {
    // Simulate traffic data (in a real app, this would come from a traffic API)
    const hour = new Date().getHours();
    const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18);
    return isRushHour ? 2 : 0;
}

function adjustForHighways(score, delivery) {
    // Simulate highway proximity (in a real app, this would use actual highway data)
    const hasHighway = Math.random() > 0.5;
    return hasHighway ? score * 0.8 : score;
}

function adjustForTime(score, delivery) {
    // Consider delivery time windows
    const now = new Date();
    const deliveryTime = new Date(delivery.time);
    const timeDiff = Math.abs(deliveryTime - now) / (1000 * 60 * 60); // hours
    return score * (1 + timeDiff * 0.1);
}

function adjustForArea(score, delivery) {
    // Consider area grouping
    const currentArea = getAreaCode(delivery.pickup.lat, delivery.pickup.lng);
    const isSameArea = currentArea === getAreaCode(delivery.delivery.lat, delivery.delivery.lng);
    return isSameArea ? score * 0.9 : score;
}

function adjustForLoad(score, delivery) {
    // Consider load balancing
    const currentLoad = getCurrentLoad();
    const maxLoad = 100;
    return score * (1 + (currentLoad / maxLoad));
}

function getAreaCode(lat, lng) {
    // Simulate area codes (in a real app, this would use actual area data)
    return Math.floor(lat * 100) + Math.floor(lng * 100);
}

function getCurrentLoad() {
    // Simulate current load (in a real app, this would track actual deliveries)
    return Math.random() * 100;
}

function displayRoute(route) {
    if (routePolyline) {
        routePolyline.remove();
    }

    const routePoints = route.map(delivery => [
        [delivery.pickup.lat, delivery.pickup.lng],
        [delivery.delivery.lat, delivery.delivery.lng]
    ]).flat();

    routePolyline = L.polyline(routePoints, {
        color: '#2196F3',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(map);

    // Add route animation
    animateRoute(routePoints);

    map.fitBounds(routePolyline.getBounds());
}

function animateRoute(points) {
    if (points.length < 2) return;
    
    // Create a moving marker
    const movingMarker = L.marker(points[0], {
        icon: L.divIcon({
            className: 'moving-marker',
            html: '<div class="marker-content"><i class="fas fa-truck"></i></div>'
        })
    }).addTo(map);
    
    // Animate along the route
    let i = 0;
    const animate = () => {
        if (i < points.length - 1) {
            const start = points[i];
            const end = points[i + 1];
            const duration = 1000; // 1 second per segment
            const startTime = performance.now();
            
            const animateSegment = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const lat = start[0] + (end[0] - start[0]) * progress;
                const lng = start[1] + (end[1] - start[1]) * progress;
                
                movingMarker.setLatLng([lat, lng]);
                
                if (progress < 1) {
                    requestAnimationFrame(animateSegment);
                } else {
                    i++;
                    animate();
                }
            };
            
            requestAnimationFrame(animateSegment);
        } else {
            // Reset animation when complete
            setTimeout(() => {
                movingMarker.remove();
                animateRoute(points);
            }, 1000);
        }
    };
    
    animate();
}

function updateDeliveryList(route) {
    const deliveryList = document.getElementById('deliveryList');
    deliveryList.innerHTML = '';
    
    route.forEach((delivery, index) => {
        const deliveryItem = document.createElement('div');
        deliveryItem.className = 'delivery-item';
        deliveryItem.innerHTML = `
            <div class="stop-number">${index + 1}</div>
            <div class="delivery-info">
                <h4>${delivery.items}</h4>
                <p class="pickup"><i class="fas fa-map-marker-alt"></i> ${delivery.pickup.address}</p>
                <p class="delivery"><i class="fas fa-flag-checkered"></i> ${delivery.delivery.address}</p>
                <p class="distance"><i class="fas fa-road"></i> ${calculateDistance(
                    delivery.pickup.lat,
                    delivery.pickup.lng,
                    delivery.delivery.lat,
                    delivery.delivery.lng
                ).toFixed(1)} km</p>
                <p class="time"><i class="fas fa-clock"></i> ${delivery.time}</p>
            </div>
        `;
        deliveryList.appendChild(deliveryItem);
    });
}

function updateRouteStats(deliveries) {
    let totalDistance = 0;
    let totalTime = 0;
    let totalEarnings = 0;
    
    deliveries.forEach(delivery => {
        const distance = calculateDistance(
            delivery.pickup.lat,
            delivery.pickup.lng,
            delivery.delivery.lat,
            delivery.delivery.lng
        );
        totalDistance += distance;
        totalTime += distance * 2; // Assume 2 minutes per km
        totalEarnings += delivery.budget;
    });
    
    document.getElementById('totalDistance').textContent = `${totalDistance.toFixed(1)} km`;
    document.getElementById('estimatedTime').textContent = `${Math.round(totalTime)} min`;
    document.getElementById('totalStops').textContent = deliveries.length;
    document.getElementById('estimatedEarnings').textContent = `₹${totalEarnings}`;
}

function enableRouteControls() {
    document.getElementById('startRoute').disabled = false;
    document.getElementById('reoptimizeRoute').disabled = false;
    document.getElementById('saveRoute').disabled = false;
}

function sortDeliveries(criteria) {
    if (!currentRoute.length) return;
    
    if (criteria === 'distance') {
        currentRoute.sort((a, b) => {
            const distA = calculateDistance(
                a.pickup.lat,
                a.pickup.lng,
                a.delivery.lat,
                a.delivery.lng
            );
            const distB = calculateDistance(
                b.pickup.lat,
                b.pickup.lng,
                b.delivery.lat,
                b.delivery.lng
            );
            return distA - distB;
        });
    } else if (criteria === 'time') {
        currentRoute.sort((a, b) => {
            const timeA = new Date(a.time);
            const timeB = new Date(b.time);
            return timeA - timeB;
        });
    }
    
    displayRoute(currentRoute);
    updateDeliveryList(currentRoute);
    showNotification(`Deliveries sorted by ${criteria}`, 'success');
}

function startRoute() {
    // In a real app, this would start navigation
    showNotification('Navigation started! Follow the optimized route.', 'success');
}

function saveRoute() {
    // In a real app, this would save the route to a database
    localStorage.setItem('savedRoute', JSON.stringify(currentRoute));
}

function getActiveDeliveries() {
    // In a real app, this would fetch from an API
    return [
        {
            id: 1236,
            items: "Laptop Backpack",
            pickup: {
                lat: 31.3260,
                lng: 75.5762,
                address: "Lajpat Nagar Market"
            },
            delivery: {
                lat: 31.3360,
                lng: 75.5862,
                address: "NIT Jalandhar Boys Hostel"
            },
            budget: 2000,
            time: "Tomorrow, Before 6 PM"
        },
        {
            id: 1238,
            items: "Gaming Mouse",
            pickup: {
                lat: 31.3160,
                lng: 75.5662,
                address: "Electronics Hub"
            },
            delivery: {
                lat: 31.3460,
                lng: 75.5962,
                address: "NIT Jalandhar Campus"
            },
            budget: 3500,
            time: "Today, Before 9 PM"
        },
        {
            id: 1239,
            items: "Smart Watch",
            pickup: {
                lat: 31.3560,
                lng: 75.6062,
                address: "City Centre Mall"
            },
            delivery: {
                lat: 31.3660,
                lng: 75.6162,
                address: "NIT Jalandhar Campus"
            },
            budget: 15000,
            time: "Today, Before 8 PM"
        }
    ];
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Add search input to the dashboard
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="requestSearch" placeholder="Search requests..." onkeyup="searchRequests(this.value)">
    `;
    document.querySelector('.accepter-dashboard').insertBefore(searchContainer, document.querySelector('.dashboard-section'));
    
    // Initialize displays
    updateRequestDisplay();
    
    // Initialize document management
    initDocumentManagement();
    
    // Initialize route options
    if (typeof routeOptions !== 'undefined') {
        Object.keys(routeOptions).forEach(key => {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                checkbox.checked = routeOptions[key];
            }
        });
    }
    
    // Initialize route modal listeners
    setupRouteModalListeners();
    
    // Add event listener for close button
    const closeBtn = document.getElementById('closeRoutePanel');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeRoutePanel);
    }
});

// Update the event listener for the optimize route button
document.querySelector('#optimizeRouteBtn').addEventListener('click', openRouteOptimization);

// Function to open route optimization panel
function openRouteOptimization() {
    const panel = document.getElementById('routeOptimizationPanel');
    const overlay = document.getElementById('routeOverlay');
    
    if (panel && overlay) {
        panel.classList.add('active');
        overlay.classList.add('active');
        
        // Initialize map when panel is opened
        setTimeout(() => {
            initMap();
        }, 100);
    }
}

// Function to close route optimization panel
function closeRoutePanel() {
    const panel = document.getElementById('routeOptimizationPanel');
    const overlay = document.getElementById('routeOverlay');
    
    if (panel && overlay) {
        panel.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Document Verification Functions
function initDocumentVerification() {
    // Initialize tabs
    const tabs = document.querySelectorAll('.doc-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and content
            document.querySelectorAll('.doc-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.doc-tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Initialize preview controls
    const rotateBtn = document.getElementById('rotatePreview');
    const zoomInBtn = document.getElementById('zoomInPreview');
    const zoomOutBtn = document.getElementById('zoomOutPreview');
    const preview = document.getElementById('uploadPreview');
    let rotation = 0;
    let scale = 1;

    rotateBtn.addEventListener('click', () => {
        rotation = (rotation + 90) % 360;
        preview.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    });

    zoomInBtn.addEventListener('click', () => {
        scale = Math.min(scale + 0.25, 3);
        preview.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    });

    zoomOutBtn.addEventListener('click', () => {
        scale = Math.max(scale - 0.25, 0.5);
        preview.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    });

    // Initialize document view buttons
    const viewButtons = document.querySelectorAll('.btn-icon[title="View Document"]');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const documentItem = e.target.closest('.document-item');
            const documentName = documentItem.querySelector('.document-name').textContent;
            viewDocument(documentName);
        });
    });

    // Initialize cancel upload button
    const cancelBtn = document.getElementById('cancelUpload');
    cancelBtn.addEventListener('click', () => {
        resetPreview();
        hideUploadActions();
    });
}

function viewDocument(documentName) {
    // Simulate document viewing
    showNotification(`Viewing ${documentName}`, 'info');
    // In a real implementation, this would open a modal with the document
}

function resetPreview() {
    const preview = document.getElementById('uploadPreview');
    preview.innerHTML = `
        <div class="empty-preview">
            <i class="fas fa-file-upload"></i>
            <p>Select a document to preview</p>
        </div>
    `;
    preview.style.transform = 'rotate(0deg) scale(1)';
}

function hideUploadActions() {
    document.getElementById('confirmUpload').style.display = 'none';
    document.getElementById('cancelUpload').style.display = 'none';
}

function showUploadActions() {
    document.getElementById('confirmUpload').style.display = 'block';
    document.getElementById('cancelUpload').style.display = 'block';
}

function updateVerificationProgress() {
    const totalDocs = document.querySelectorAll('.document-item').length;
    const verifiedDocs = document.querySelectorAll('.status-verified').length;
    const progress = (verifiedDocs / totalDocs) * 100;
    
    const progressFill = document.querySelector('.progress-fill');
    const progressStats = document.querySelector('.progress-stats');
    
    progressFill.style.width = `${progress}%`;
    progressStats.innerHTML = `
        <span>${verifiedDocs} of ${totalDocs} documents verified</span>
        <span>${Math.round(progress)}% complete</span>
    `;
}

// Update the existing uploadDocument function
function uploadDocument(type) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,.pdf';
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file, type);
        }
    });
    
    fileInput.click();
}

function handleFile(file, type) {
    const reader = new FileReader();
    const preview = document.getElementById('uploadPreview');
    
    reader.onload = function(e) {
        if (file.type.startsWith('image/')) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Document Preview">`;
        } else if (file.type === 'application/pdf') {
            preview.innerHTML = `
                <div class="pdf-preview">
                    <i class="fas fa-file-pdf"></i>
                    <p>${file.name}</p>
                </div>
            `;
        }
        
        showUploadActions();
        showNotification('Document ready for upload', 'info');
    };
    
    reader.readAsDataURL(file);
}

// Initialize document verification when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initDocumentVerification();
    updateVerificationProgress();
});

// Live Location Tracking
let locationMarker = null;
let locationPath = null;
let locationHistory = [];
let isTracking = false;
let watchId = null;

function initLiveLocation() {
    const startBtn = document.getElementById('startTracking');
    const stopBtn = document.getElementById('stopTracking');
    const centerBtn = document.getElementById('centerOnMe');
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    const latSpan = document.querySelector('.lat');
    const lngSpan = document.querySelector('.lng');
    const accuracySpan = document.querySelector('.accuracy-value');

    startBtn.addEventListener('click', () => {
        if (!isTracking) {
            startLocationTracking();
            startBtn.style.display = 'none';
            stopBtn.style.display = 'block';
            statusIndicator.classList.add('active');
            statusText.textContent = 'Location tracking active';
        }
    });

    stopBtn.addEventListener('click', () => {
        if (isTracking) {
            stopLocationTracking();
            startBtn.style.display = 'block';
            stopBtn.style.display = 'none';
            statusIndicator.classList.remove('active');
            statusText.textContent = 'Location tracking inactive';
        }
    });

    centerBtn.addEventListener('click', () => {
        if (locationMarker) {
            map.setView(locationMarker.getLatLng(), 16);
        }
    });
}

function startLocationTracking() {
    if (!navigator.geolocation) {
        showNotification('Geolocation is not supported by your browser', 'error');
        return;
    }

    isTracking = true;
    locationHistory = [];

    watchId = navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            
            // Update location info
            document.querySelector('.lat').textContent = `Lat: ${latitude.toFixed(6)}`;
            document.querySelector('.lng').textContent = `Lng: ${longitude.toFixed(6)}`;
            document.querySelector('.accuracy-value').textContent = `Accuracy: ${Math.round(accuracy)}m`;

            // Update or create location marker
            const latLng = L.latLng(latitude, longitude);
            if (!locationMarker) {
                locationMarker = L.marker(latLng, {
                    icon: L.divIcon({
                        className: 'location-marker',
                        iconSize: [24, 24]
                    })
                }).addTo(map);
            } else {
                locationMarker.setLatLng(latLng);
            }

            // Update location history and path
            locationHistory.push(latLng);
            updateLocationPath();
        },
        (error) => {
            console.error('Error getting location:', error);
            showNotification('Error getting location: ' + error.message, 'error');
            stopLocationTracking();
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

function stopLocationTracking() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    isTracking = false;
}

function updateLocationPath() {
    if (locationHistory.length < 2) return;

    if (locationPath) {
        locationPath.remove();
    }

    locationPath = L.polyline(locationHistory, {
        className: 'location-path'
    }).addTo(map);
} 