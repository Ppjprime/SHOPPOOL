// Sample data for active and past requests
const requests = {
    active: [
        {
            id: 1234,
            item: "Wireless Headphones",
            pickup: "Model Town Market",
            delivery: "NIT Jalandhar Boys Hostel",
            budget: 2500,
            status: "In Progress",
            eta: "Today, 7:30 PM"
        }
    ],
    pending: [], // Initialize empty pending array
    past: [
        {
            id: 1235,
            item: "Smart Watch",
            pickup: "City Centre Mall",
            delivery: "NIT Jalandhar Girls Hostel",
            budget: 15000,
            completionDate: "Yesterday, 4:30 PM",
            rating: "⭐⭐⭐⭐⭐"
        }
    ]
};

// Initialize map and tracking variables
let map;
let truckMarker;
let routeCoordinates = [];
let currentRouteIndex = 0;
let startTime;
let totalDistance = 0;
let currentSpeed = 0;
let estimatedTimeRemaining = 0;
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

// Custom truck icon
const truckIcon = L.divIcon({
    html: '🚚',
    className: 'truck-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

// Initialize map
function initMap() {
    map = L.map('map').setView([31.3260, 75.5762], 12); // Zoomed out a bit
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Form submission handler
document.getElementById('requestForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        id: Date.now(),
        item: document.getElementById('item').value,
        category: document.getElementById('category').value,
        pickup: document.getElementById('pickup').value,
        delivery: document.getElementById('delivery').value,
        deadline: document.getElementById('deadline').value,
        description: document.getElementById('description').value,
        status: 'pending',
        timestamp: new Date().toISOString()
    };

    // Add to pending requests
    requests.pending.push(formData);
    
    // Create and append new request card
    const requestCard = createRequestCard(formData);
    const mainContent = document.querySelector('.main-content');
    
    // Insert at the beginning of main content
    if (mainContent.firstChild) {
        mainContent.insertBefore(requestCard, mainContent.firstChild);
    } else {
        mainContent.appendChild(requestCard);
    }
    
    // Show success notification
    showNotification('Request published successfully!', 'success');
    
    // Reset form
    this.reset();
});

// Track delivery request
function trackRequest(requestId) {
    const modal = document.getElementById('mapModal');
    modal.style.display = 'block';
    
    // Initialize map immediately
    if (!map) {
        initMap();
    }
    
    // Reset tracking state
    currentRouteIndex = 0;
    routeCoordinates = [];
    startTime = Date.now();
    totalDistance = 0;
    currentSpeed = 0;
    estimatedTimeRemaining = 0;
    
    // Reset all status steps
    document.querySelectorAll('.status-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Clear existing markers and routes
    if (map) {
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker || layer instanceof L.Routing.Control) {
                map.removeLayer(layer);
            }
        });
    }
    
    // Simulate delivery route immediately
    simulateDeliveryRoute(requestId);
}

// Simulate delivery route
function simulateDeliveryRoute(requestId) {
    // Sample coordinates with greater distance
    const pickupCoords = [31.3256, 75.5792]; // Model Town Market
    const deliveryCoords = [31.3959, 75.5358]; // NIT Jalandhar Boys Hostel
    
    // Add markers immediately
    L.marker(pickupCoords).addTo(map).bindPopup('📍 Pickup Location');
    L.marker(deliveryCoords).addTo(map).bindPopup('🏁 Delivery Location');
    
    // Create routing control
    const routingControl = L.Routing.control({
        waypoints: [
            L.latLng(pickupCoords[0], pickupCoords[1]),
            L.latLng(deliveryCoords[0], deliveryCoords[1])
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: true,
        lineOptions: {
            styles: [{ color: '#ff0000', weight: 4, opacity: 0.8 }]
        }
    }).addTo(map);
    
    // Start truck movement when route is found
    routingControl.on('routesfound', function(e) {
        const route = e.routes[0];
        routeCoordinates = route.coordinates;
        totalDistance = route.summary.totalDistance / 1000;
        
        // Add a small delay before starting the animation
        setTimeout(() => {
            startTruckMovement();
            startDeliveryProgress();
        }, 1000); // 1 second delay before starting
    });
}

// Start delivery progress
function startDeliveryProgress() {
    const steps = document.querySelectorAll('.status-step');
    let currentStep = 0;
    
    // Show first step immediately
    steps[0].classList.add('active');
    
    // Calculate intervals based on route length
    const totalSteps = steps.length;
    const routeLength = routeCoordinates.length;
    
    // Update steps as truck moves with longer intervals
    const progressInterval = setInterval(() => {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            steps[currentStep].classList.add('active');
        } else {
            clearInterval(progressInterval);
        }
    }, 8000); // Increased to 8 seconds per step
}

// Start truck movement
function startTruckMovement() {
    if (routeCoordinates.length === 0) return;
    
    // Create truck marker at start
    truckMarker = L.marker(routeCoordinates[0], { icon: truckIcon }).addTo(map);
    
    // Start movement
    moveTruck(0);
}

// Move truck along route
function moveTruck(index) {
    if (index >= routeCoordinates.length) {
        // Delivery completed
        showNotification('🎉 Delivery completed successfully!', 'success');
        return;
    }
    
    const currentPos = routeCoordinates[index];
    const nextPos = routeCoordinates[index + 1];
    
    if (nextPos) {
        // Calculate rotation angle
        const angle = Math.atan2(nextPos[1] - currentPos[1], nextPos[0] - currentPos[0]) * 180 / Math.PI;
        truckMarker.getElement().style.transform = `rotate(${angle}deg)`;
    }
    
    // Move truck
    truckMarker.setLatLng(currentPos);
    currentRouteIndex = index;
    
    // Update metrics
    updateDeliveryMetrics();
    
    // Continue movement with increased delay
    setTimeout(() => {
        moveTruck(index + 1);
    }, 100); // Increased to 100ms for slower movement
}

// Function to get coordinates for locations
function getLocationCoordinates(location) {
    // Sample coordinates for different locations
    const locations = {
        'Model Town Market': [31.3256, 75.5792],
        'City Centre Mall': [31.3267, 75.5789],
        'Lajpat Nagar Market': [31.3278, 75.5778],
        'Guru Nanak Market': [31.3289, 75.5767],
        'NIT Jalandhar Boys Hostel': [31.3959, 75.5358],
        'NIT Jalandhar Girls Hostel': [31.3960, 75.5359],
        'NIT Jalandhar Campus': [31.3961, 75.5360]
    };
    
    return locations[location] || [31.3959, 75.5358]; // Default to NIT coordinates
}

// Update delivery metrics
function updateDeliveryMetrics() {
    const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
    const progress = currentRouteIndex / routeCoordinates.length;
    
    // Calculate ETA only
    const remainingDistance = totalDistance * (1 - progress);
    const currentSpeed = (totalDistance / elapsedTime) * 3600; // km/h
    const estimatedTimeRemaining = remainingDistance / currentSpeed; // hours
    
    // Update the metrics display
    const metricsContainer = document.getElementById('deliveryMetrics');
    if (metricsContainer) {
        metricsContainer.innerHTML = `
            <div class="metric">
                <div class="metric-label">ETA</div>
                <div class="metric-value">${formatTime(estimatedTimeRemaining)}</div>
            </div>
        `;
    }
}

// Format time
function formatTime(hours) {
    if (hours < 1) {
        const minutes = Math.round(hours * 60);
        return `${minutes} min`;
    }
    const wholeHours = Math.floor(hours);
    const remainingMinutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours} hr ${remainingMinutes} min`;
}

// Simulate delivery progress
function simulateDeliveryProgress() {
    const steps = document.querySelectorAll('.status-step');
    let currentStep = 0;
    
    // Add initial delay before starting
    setTimeout(() => {
        const interval = setInterval(() => {
            if (currentStep < steps.length - 1) {
                steps[currentStep].classList.add('active');
                const stepText = steps[currentStep].querySelector('.step-text').textContent;
                showNotification(`Delivery Status: ${stepText}`, 'success');
                currentStep++;
            } else {
                clearInterval(interval);
            }
        }, 5000);
    }, 1000);
}

// Close modal
document.querySelector('.close').addEventListener('click', function() {
    const modal = document.getElementById('mapModal');
    modal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('mapModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Make modal draggable
function makeDraggable() {
    const modalContent = document.querySelector('.modal-content');
    const modalHeader = document.querySelector('.modal-header');

    if (modalHeader) {
        modalHeader.addEventListener('mousedown', function(e) {
            if (e.target === modalHeader || e.target.parentNode === modalHeader) {
                isDragging = true;
                initialX = e.clientX - modalContent.offsetLeft;
                initialY = e.clientY - modalContent.offsetTop;
            }
        });
    }

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            e.preventDefault();
            const modalContent = document.querySelector('.modal-content');
            
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            // Keep the modal within the window bounds
            const rect = modalContent.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;
            
            currentX = Math.min(Math.max(currentX, 0), maxX);
            currentY = Math.min(Math.max(currentY, 0), maxY);

            modalContent.style.left = currentX + 'px';
            modalContent.style.top = currentY + 'px';
            modalContent.style.transform = 'none';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add emojis to request cards
    document.querySelectorAll('.request-title').forEach(title => {
        const emoji = getEmojiForRequest(title.textContent);
        title.innerHTML = `${emoji} ${title.textContent}`;
    });
    
    // Make modal draggable
    makeDraggable();
    
    // Initialize close button
    const closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.onclick = function() {
            const modal = document.getElementById('mapModal');
            if (modal) {
                modal.style.display = 'none';
                // Reset the map and tracking state
                if (map) {
                    map.eachLayer((layer) => {
                        if (layer instanceof L.Marker || layer instanceof L.Routing.Control) {
                            map.removeLayer(layer);
                        }
                    });
                }
                currentRouteIndex = 0;
                routeCoordinates = [];
            }
        };
    }
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('mapModal');
        if (event.target === modal) {
            modal.style.display = 'none';
            // Reset the map and tracking state
            if (map) {
                map.eachLayer((layer) => {
                    if (layer instanceof L.Marker || layer instanceof L.Routing.Control) {
                        map.removeLayer(layer);
                    }
                });
            }
            currentRouteIndex = 0;
            routeCoordinates = [];
        }
    };
});

// Get emoji for request type
function getEmojiForRequest(title) {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('grocery')) return '🛒';
    if (titleLower.includes('food')) return '🍽️';
    if (titleLower.includes('package')) return '📦';
    return '📝';
}

// Function to show notifications
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Create notification content
    const content = document.createElement('div');
    content.className = 'notification-content';
    
    // Add icon based on type
    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    icon.textContent = type === 'success' ? '✓' : '⚠';
    
    // Add message
    const messageSpan = document.createElement('span');
    messageSpan.className = 'notification-message';
    messageSpan.textContent = message;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => notification.remove();
    
    // Assemble notification
    content.appendChild(icon);
    content.appendChild(messageSpan);
    notification.appendChild(content);
    notification.appendChild(closeBtn);
    
    // Add to document
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    const timeout = setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);

    // Clear timeout if notification is manually closed
    closeBtn.onclick = () => {
        clearTimeout(timeout);
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    };
}

// Function to update the request display
function updateRequestDisplay() {
    // In a real app, this would update the UI with the latest data
    console.log('Updating request display...');
}

// Function to cancel a request
function cancelRequest(requestId) {
    if (confirm('Are you sure you want to cancel this request?')) {
        // Remove from requests array
        requests.pending = requests.pending.filter(r => r.id !== requestId);
        
        // Remove from DOM
        const card = document.querySelector(`.request-card[data-id="${requestId}"]`);
        if (card) {
            card.remove();
        }
        
        showNotification('Request cancelled successfully', 'success');
    }
}

// Function to review a completed delivery
function reviewDelivery(requestId) {
    const request = requests.past.find(r => r.id === requestId);
    if (request) {
        // In a real app, this would show a review modal
        showNotification('Review form loaded', 'success');
    }
}

// Add close button functionality
const closeBtn = document.querySelector('.close');
if (closeBtn) {
    closeBtn.onclick = function() {
        document.getElementById('mapModal').style.display = 'none';
    };
}

// Function to create a request card
function createRequestCard(request) {
    const card = document.createElement('div');
    card.className = 'request-card';
    card.setAttribute('data-id', request.id);
    
    const emoji = getEmojiForRequest(request.item);
    
    card.innerHTML = `
        <div class="request-header">
            <h3 class="request-title">${emoji} ${request.item}</h3>
            <span class="request-status pending">Pending</span>
        </div>
        <div class="request-details">
            <div class="detail-item">
                <i class="fas fa-tag"></i>
                <span>Category: ${request.category}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>📍 Pickup: ${request.pickup}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-flag-checkered"></i>
                <span>🏁 Delivery: ${request.delivery}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span>Deadline: ${formatDate(request.deadline)}</span>
            </div>
            ${request.description ? `
            <div class="detail-item">
                <i class="fas fa-info-circle"></i>
                <span>Description: ${request.description}</span>
            </div>
            ` : ''}
        </div>
        <div class="request-actions">
            <button class="btn btn-primary" onclick="showPaymentModal(${request.id})">
                <i class="fas fa-credit-card"></i> Pay Now
            </button>
            <button class="btn btn-secondary" onclick="editRequest(${request.id})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-secondary" onclick="cancelRequest(${request.id})">
                <i class="fas fa-trash"></i> Cancel
            </button>
        </div>
    `;
    return card;
}

// Function to format date
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to edit a request
function editRequest(requestId) {
    const request = requests.pending.find(r => r.id === requestId);
    if (request) {
        // Populate form with request data
        document.getElementById('item').value = request.item;
        document.getElementById('category').value = request.category;
        document.getElementById('pickup').value = request.pickup;
        document.getElementById('delivery').value = request.delivery;
        document.getElementById('deadline').value = request.deadline;
        document.getElementById('description').value = request.description;
        
        // Remove the old request
        cancelRequest(requestId);
        
        // Scroll to form
        document.querySelector('.sidebar').scrollIntoView({ behavior: 'smooth' });
    }
}

// Function to handle request acceptance
function acceptRequest(requestId) {
    const request = requests.pending.find(r => r.id === requestId);
    if (!request) return;

    // Update request status
    request.status = 'accepted';
    request.accepter = 'John Doe'; // In real app, this would be the actual accepter's name
    
    // Update the request card
    const requestCard = document.querySelector(`.request-card[data-id="${requestId}"]`);
    if (requestCard) {
        const statusSpan = requestCard.querySelector('.request-status');
        statusSpan.className = 'request-status active';
        statusSpan.textContent = 'Accepted';
        
        // Update actions
        const actionsDiv = requestCard.querySelector('.request-actions');
        actionsDiv.innerHTML = `
            <button class="btn btn-primary" onclick="showPaymentModal(${requestId})">
                <i class="fas fa-credit-card"></i> Pay Now
            </button>
            <button class="btn btn-secondary" onclick="trackRequest(${requestId})">
                <i class="fas fa-map-marked-alt"></i> Track
            </button>
        `;
    }

    showNotification('Request accepted! Please complete the payment.', 'success');
}

// Payment Modal Functions
function showPaymentModal(requestId) {
    const request = requests.pending.find(r => r.id === requestId);
    if (!request) return;

    // Update payment modal content
    document.getElementById('paymentItem').textContent = request.item;
    document.getElementById('paymentTotal').textContent = '₹50.00';
    
    // Show the modal
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'block';

    // Reset payment status
    const statusMessage = document.querySelector('.status-message');
    const processingAnimation = document.querySelector('.processing-animation');
    const payNowBtn = document.querySelector('.pay-now-btn');

    statusMessage.style.display = 'block';
    statusMessage.textContent = 'Scan QR code to pay';
    statusMessage.style.color = '';
    processingAnimation.style.display = 'none';
    payNowBtn.disabled = false;
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'none';
}

function copyUpiId() {
    const upiId = document.querySelector('.upi-id').textContent;
    navigator.clipboard.writeText(upiId).then(() => {
        showNotification('UPI ID copied to clipboard!', 'success');
    });
}

function processPayment() {
    const statusMessage = document.querySelector('.status-message');
    const processingAnimation = document.querySelector('.processing-animation');
    const payNowBtn = document.querySelector('.pay-now-btn');

    // Show processing state
    statusMessage.style.display = 'none';
    processingAnimation.style.display = 'flex';
    payNowBtn.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
        processingAnimation.style.display = 'none';
        statusMessage.textContent = 'Payment Successful!';
        statusMessage.style.display = 'block';
        statusMessage.style.color = '#4CAF50';

        // Update request status after successful payment
        const requestCard = document.querySelector('.request-card');
        if (requestCard) {
            const statusSpan = requestCard.querySelector('.request-status');
            statusSpan.className = 'request-status active';
            statusSpan.textContent = 'Payment Completed';
        }

        // Close modal after success
        setTimeout(() => {
            closePaymentModal();
            showNotification('Payment successful! Your request is now active.', 'success');
        }, 1500);
    }, 2000);
}

// Add event listeners for payment modal
document.addEventListener('DOMContentLoaded', function() {
    // Close modal when clicking the close button
    const closeBtn = document.querySelector('#paymentModal .close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePaymentModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('paymentModal');
        if (event.target === modal) {
            closePaymentModal();
        }
    });

    // Handle payment method selection
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Hide all payment details
            document.querySelectorAll('.payment-details').forEach(detail => {
                detail.style.display = 'none';
            });
            // Show selected payment details
            document.getElementById(this.value + 'Details').style.display = 'block';
        });
    });
}); 