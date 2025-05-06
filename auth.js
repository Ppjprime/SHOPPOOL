// DOM Elements
const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeButtons = document.querySelectorAll('.close-modal');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const notification = document.getElementById('notification');

// User data storage
const users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Event Listeners
loginBtn.addEventListener('click', () => showModal(loginModal));
signupBtn.addEventListener('click', () => showModal(signupModal));
closeButtons.forEach(btn => btn.addEventListener('click', closeModals));
switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    switchModals(loginModal, signupModal);
});
switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    switchModals(signupModal, loginModal);
});

// Form submissions
loginForm.addEventListener('submit', handleLogin);
signupForm.addEventListener('submit', handleSignup);

// Password visibility toggles
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', togglePasswordVisibility);
});

// Password strength checker
const signupPassword = document.getElementById('signupPassword');
signupPassword.addEventListener('input', checkPasswordStrength);

// Functions
function showModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModals() {
    loginModal.style.display = 'none';
    signupModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchModals(from, to) {
    from.style.display = 'none';
    to.style.display = 'block';
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        showNotification('Login successful!', 'success');
        closeModals();
        updateUIForLoggedInUser(user);
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (users.some(u => u.email === email)) {
        showNotification('Email already registered', 'error');
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        createdAt: new Date()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    showNotification('Account created successfully!', 'success');
    closeModals();
    loginModal.style.display = 'block';
}

function checkPasswordStrength(e) {
    const password = e.target.value;
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    const isLongEnough = password.length >= 8;

    let strength = 0;
    if (hasLower) strength++;
    if (hasUpper) strength++;
    if (hasNumber) strength++;
    if (hasSpecial) strength++;
    if (isLongEnough) strength++;

    const percentage = (strength / 5) * 100;
    strengthBar.style.width = `${percentage}%`;
    strengthBar.style.background = getStrengthColor(strength);

    strengthText.textContent = getStrengthText(strength);
}

function getStrengthColor(strength) {
    if (strength <= 2) return '#ff4444';
    if (strength <= 3) return '#ffa700';
    if (strength <= 4) return '#00c851';
    return '#007E33';
}

function getStrengthText(strength) {
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Moderate';
    if (strength <= 4) return 'Strong';
    return 'Very Strong';
}

function togglePasswordVisibility(e) {
    const passwordInput = e.target.previousElementSibling;
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    e.target.classList.toggle('fa-eye');
    e.target.classList.toggle('fa-eye-slash');
}

function showNotification(message, type) {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function updateUIForLoggedInUser(user) {
    // Update the auth buttons
    const authButtons = document.querySelector('.auth-buttons');
    authButtons.innerHTML = `
        <div class="user-menu">
            <span>Welcome, ${user.name}</span>
            <button class="auth-btn logout-btn" onclick="handleLogout()">
                <i class="fas fa-sign-out-alt"></i>
                Logout
            </button>
        </div>
    `;
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    location.reload();
}

// Check if user is already logged in
if (currentUser) {
    updateUIForLoggedInUser(currentUser);
}

// Close modals when clicking outside
window.onclick = function(e) {
    if (e.target === loginModal || e.target === signupModal) {
        closeModals();
    }
} 