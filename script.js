// Enhanced product data with more details
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 2499,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "High-quality wireless headphones with noise cancellation",
        rating: 4.5,
        reviews: 128,
        inStock: true,
        features: ["Noise Cancellation", "Bluetooth 5.0", "20hr Battery Life"],
        category: "Electronics"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 15999,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Fitness tracking smartwatch with heart rate monitoring",
        rating: 4.8,
        reviews: 256,
        inStock: true,
        features: ["Heart Rate Monitor", "GPS", "Water Resistant"],
        category: "Electronics"
    },
    {
        id: 3,
        name: "Laptop Backpack",
        price: 1999,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Water-resistant laptop backpack with multiple compartments",
        rating: 4.3,
        reviews: 89,
        inStock: true,
        features: ["Water Resistant", "Multiple Pockets", "Laptop Sleeve"],
        category: "Accessories"
    },
    {
        id: 4,
        name: "Wireless Mouse",
        price: 1499,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Ergonomic wireless mouse with precision tracking",
        rating: 4.6,
        reviews: 175,
        inStock: true,
        features: ["Ergonomic Design", "Precision Tracking", "Long Battery Life"],
        category: "Electronics"
    },
    {
        id: 5,
        name: "Portable Power Bank",
        price: 2999,
        image: "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "20000mAh power bank with fast charging support",
        rating: 4.7,
        reviews: 203,
        inStock: true,
        features: ["20000mAh", "Fast Charging", "Multiple Ports"],
        category: "Electronics"
    },
    {
        id: 6,
        name: "USB-C Hub",
        price: 3999,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Multi-port USB-C hub with HDMI and card reader",
        rating: 4.4,
        reviews: 112,
        inStock: true,
        features: ["HDMI Port", "Card Reader", "Multiple USB Ports"],
        category: "Electronics"
    }
];

// Enhanced cart functionality with local storage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Enhanced product filtering and sorting
let currentPage = 1;
const productsPerPage = 6;

function filterAndSortProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortProducts').value;
    
    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || product.category === category;
        return matchesSearch && matchesCategory;
    });
    
    // Sort products
    switch(sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
    }
    
    return filteredProducts;
}

function updatePagination(filteredProducts) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const pageNumbers = document.querySelector('.page-numbers');
    const prevButton = document.querySelector('.prev-page');
    const nextButton = document.querySelector('.next-page');
    
    pageNumbers.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page-number');
        if (i === currentPage) pageButton.classList.add('active');
        pageButton.addEventListener('click', () => {
            currentPage = i;
            loadProducts();
        });
        pageNumbers.appendChild(pageButton);
    }
    
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

// Enhanced product loading with pagination
function loadProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    const filteredProducts = filterAndSortProducts();
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    productsGrid.innerHTML = '';
    
    paginatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${!product.inStock ? '<div class="out-of-stock">Out of Stock</div>' : ''}
                <div class="quick-actions">
                    <button class="quick-view" onclick="showProductDetails(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="add-to-wishlist" onclick="toggleWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <div class="product-meta">
                    <div class="rating">
                        ${generateStars(product.rating)}
                        <span>(${product.reviews})</span>
                    </div>
                    <p class="price">₹${product.price.toLocaleString('en-IN')}</p>
                </div>
                <div class="product-features">
                    ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <button onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                    ${!product.inStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
    
    updatePagination(filteredProducts);
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    return starsHTML;
}

// Enhanced add to cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCount();
    saveCart();
    showNotification('Product added to cart!', 'success');
    animateCartButton();
}

// Save cart to local storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count with animation
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCount.classList.add('has-items');
    } else {
        cartCount.classList.remove('has-items');
    }
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = document.createElement('i');
    icon.className = getNotificationIcon(type);
    
    const text = document.createElement('span');
    text.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(text);
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Get appropriate icon for notification type
function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'fas fa-check-circle';
        case 'error':
            return 'fas fa-exclamation-circle';
        case 'warning':
            return 'fas fa-exclamation-triangle';
        default:
            return 'fas fa-info-circle';
    }
}

// Animate cart button
function animateCartButton() {
    const cartButton = document.querySelector('.cart-icon');
    if (!cartButton) return;
    
    cartButton.classList.add('animate');
    setTimeout(() => cartButton.classList.remove('animate'), 1000);
}

// Enhanced smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// Enhanced user type selection
function selectUserType(type) {
    const cards = document.querySelectorAll('.user-type-card');
    cards.forEach(card => card.classList.remove('selected'));
    
    const selectedCard = document.querySelector(`.user-type-card[onclick*="${type}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        showNotification(`Selected: ${type.charAt(0).toUpperCase() + type.slice(1)}`, 'success');
        
        setTimeout(() => {
            if (type === 'accepter') {
                window.location.href = 'accepter.html';
            } else if (type === 'requester') {
                window.location.href = 'requester.html';
            }
        }, 1000);
    }
}

// Enhanced dark mode toggle
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const icon = darkModeToggle?.querySelector('i');

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    if (icon) {
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    localStorage.setItem('darkMode', isDarkMode);
    showNotification(`Dark mode ${isDarkMode ? 'enabled' : 'disabled'}`, 'info');
}

// Initialize dark mode from localStorage
const savedDarkMode = localStorage.getItem('darkMode') === 'true';
if (savedDarkMode) {
    document.body.classList.add('dark-mode');
    if (icon) {
        icon.className = 'fas fa-sun';
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Add scroll reveal animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(element => revealObserver.observe(element));
    
    // Add loading state to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('loading')) return;
            
            this.classList.add('loading');
            const originalText = this.textContent;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            setTimeout(() => {
                this.classList.remove('loading');
                this.textContent = originalText;
            }, 2000);
        });
    });
    
    // Add event listeners for filtering and sorting
    document.getElementById('productSearch').addEventListener('input', () => {
        currentPage = 1;
        loadProducts();
    });
    
    document.getElementById('categoryFilter').addEventListener('change', () => {
        currentPage = 1;
        loadProducts();
    });
    
    document.getElementById('sortProducts').addEventListener('change', () => {
        currentPage = 1;
        loadProducts();
    });
    
    // Pagination buttons
    document.querySelector('.prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadProducts();
        }
    });
    
    document.querySelector('.next-page').addEventListener('click', () => {
        const filteredProducts = filterAndSortProducts();
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            loadProducts();
        }
    });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
    
    if (e.key === 'Tab') {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const modal = document.querySelector('.modal[style*="display: block"]');
        
        if (modal) {
            const focusableContent = modal.querySelectorAll(focusableElements);
            const firstFocusableElement = focusableContent[0];
            const lastFocusableElement = focusableContent[focusableContent.length - 1];
            
            if (e.shiftKey && document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }
});

// Add form validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            showNotification(`Please fill in ${input.name || 'this field'}`, 'error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Add password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[^a-zA-Z0-9]+/)) strength++;
    
    const strengthLevels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
    const colors = ['#ef4444', '#f59e0b', '#fbbf24', '#10b981', '#3b82f6'];
    
    strengthBar.style.width = `${(strength / 5) * 100}%`;
    strengthBar.style.backgroundColor = colors[strength - 1];
    strengthText.textContent = strengthLevels[strength - 1];
    strengthText.style.color = colors[strength - 1];
}

// Add chat functionality
function initializeChat() {
    const chatButton = document.getElementById('chatButton');
    const chatBox = document.getElementById('chatBox');
    const closeChat = document.getElementById('closeChat');
    const sendMessage = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    
    if (!chatButton || !chatBox || !closeChat || !sendMessage || !chatInput) return;
    
    chatButton.addEventListener('click', () => {
        chatBox.style.display = 'flex';
        chatInput.focus();
    });
    
    closeChat.addEventListener('click', () => {
        chatBox.style.display = 'none';
    });
    
    sendMessage.addEventListener('click', () => {
        sendChatMessage();
    });
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatInput || !chatMessages) return;
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessageToChat('user', message);
    chatInput.value = '';
    
    // Simulate support response
    setTimeout(() => {
        addMessageToChat('support', 'Thank you for your message. Our support team will get back to you shortly.');
    }, 1000);
}

function addMessageToChat(type, text) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${type === 'user' ? 'user' : 'headset'}"></i>
        </div>
        <div class="message-content">
            <div class="message-name">${type === 'user' ? 'You' : 'ShopPool Support'}</div>
            <div class="message-text">${text}</div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Product details modal
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="product-details">
                <div class="product-gallery">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h2>${product.name}</h2>
                    <div class="rating">
                        ${generateStars(product.rating)}
                        <span>${product.reviews} reviews</span>
                    </div>
                    <p class="price">₹${product.price.toLocaleString('en-IN')}</p>
                    <p class="description">${product.description}</p>
                    <div class="features">
                        <h3>Features</h3>
                        <ul>
                            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="actions">
                        <button onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                            ${!product.inStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
                            <i class="fas fa-heart"></i> Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
}

// Wishlist functionality
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index === -1) {
        wishlist.push(productId);
        showNotification('Added to wishlist!', 'success');
    } else {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist', 'info');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}

function updateWishlistUI() {
    document.querySelectorAll('.add-to-wishlist, .wishlist-btn').forEach(button => {
        const productId = parseInt(button.getAttribute('onclick').match(/\d+/)[0]);
        const icon = button.querySelector('i');
        if (wishlist.includes(productId)) {
            icon.classList.add('active');
        } else {
            icon.classList.remove('active');
        }
    });
}

// Initialize event listeners for filtering and sorting
document.addEventListener('DOMContentLoaded', () => {
    // ... existing initialization code ...
    
    // Initialize wishlist UI
    updateWishlistUI();
});

// Payment System Variables
let currentStep = 1;
const totalSteps = 3;
let selectedPaymentMethod = '';

// Payment System Functions
function initializePaymentSystem() {
    // Add event listeners for payment modal
    document.getElementById('closePaymentModal').addEventListener('click', closePaymentModal);
    document.getElementById('proceedToPayment').addEventListener('click', proceedToPayment);
    document.getElementById('proceedToConfirmation').addEventListener('click', proceedToConfirmation);
    document.getElementById('continueShopping').addEventListener('click', closePaymentModal);

    // Add event listeners for payment methods
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', handlePaymentMethodChange);
    });
}

function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'block';
    currentStep = 1;
    updateCheckoutSteps();
    updateCartSummary();
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'none';
    currentStep = 1;
    updateCheckoutSteps();
}

function updateCheckoutSteps() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index + 1 < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });

    // Show/hide appropriate content
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.style.display = 'none';
    });
    document.getElementById(`step${currentStep}`).style.display = 'block';
}

function updateCartSummary() {
    const cartItems = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');

    // Clear existing items
    cartItems.innerHTML = '';

    // Add cart items
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const shipping = subtotal > 0 ? 5.99 : 0;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    // Update total elements
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = `$${shipping.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

function proceedToPayment() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    currentStep = 2;
    updateCheckoutSteps();
}

function handlePaymentMethodChange(event) {
    selectedPaymentMethod = event.target.value;
    const paymentDetails = document.querySelectorAll('.payment-details');
    paymentDetails.forEach(detail => {
        detail.style.display = 'none';
    });
    document.getElementById(`${selectedPaymentMethod}Details`).style.display = 'block';
}

function proceedToConfirmation() {
    if (!selectedPaymentMethod) {
        showNotification('Please select a payment method', 'error');
        return;
    }

    // Validate payment details based on selected method
    if (selectedPaymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('cardName').value;

        if (!cardNumber || !expiryDate || !cvv || !cardName) {
            showNotification('Please fill in all card details', 'error');
            return;
        }
    } else if (selectedPaymentMethod === 'upi') {
        const upiId = document.getElementById('upiId').value;
        if (!upiId) {
            showNotification('Please enter your UPI ID', 'error');
            return;
        }
    } else if (selectedPaymentMethod === 'netbanking') {
        const selectedBank = document.querySelector('input[name="bank"]:checked');
        if (!selectedBank) {
            showNotification('Please select a bank', 'error');
            return;
        }
    }

    // Generate random order ID
    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    document.getElementById('orderId').textContent = orderId;
    document.getElementById('orderAmount').textContent = document.getElementById('total').textContent;

    currentStep = 3;
    updateCheckoutSteps();
}

// Initialize payment system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializePaymentSystem();
}); 