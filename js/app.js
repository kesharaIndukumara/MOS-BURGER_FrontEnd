console.log("Hello, welcome to Delicious Bites POS System!");

// Enhanced login system with multiple users and session management
const validUsers = [
  { username: "admin", password: "admin123", role: "Administrator" },
  { username: "manager", password: "manager456", role: "Manager" },
  { username: "cashier", password: "cash789", role: "Cashier" }
];

let loginAttempts = 0;
const maxAttempts = 3;

function signinbutton() {
  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value;
  const loginBtn = document.getElementById("loginBtn");
  const btnText = loginBtn.querySelector(".btn-text");
  const btnIcon = loginBtn.querySelector(".btn-icon");
  const btnLoader = loginBtn.querySelector(".btn-loader");

  // Input validation
  if (!username || !password) {
    showNotification("Please enter both username and password!", "error");
    return;
  }

  // Check if account is locked
  if (loginAttempts >= maxAttempts) {
    showNotification("Account locked due to too many failed attempts. Please refresh the page to try again.", "error");
    return;
  }

  // Show loading state
  loginBtn.disabled = true;
  btnText.style.display = "none";
  btnIcon.style.display = "none";
  btnLoader.style.display = "block";

  // Simulate API call delay
  setTimeout(() => {
    // Find user in valid users array
    const user = validUsers.find(u => u.username === username && u.password === password);

    if (user) {
      // Store user session data
      sessionStorage.setItem('currentUser', JSON.stringify({
        username: user.username,
        role: user.role,
        loginTime: new Date().toISOString()
      }));
      
      console.log(`Redirecting to interface.html... Welcome ${user.role}: ${user.username}`);
      
      // Success notification
      showNotification(`Login successful! Welcome ${user.role}: ${user.username}`, "success");
      
      // Reset login attempts on successful login
      loginAttempts = 0;
      
      // Redirect after short delay
      setTimeout(() => {
        window.location.href = "interface.html";
      }, 1500);
      
    } else {
      loginAttempts++;
      const remainingAttempts = maxAttempts - loginAttempts;
      
      if (remainingAttempts > 0) {
        showNotification(`Invalid username or password! ${remainingAttempts} attempts remaining.`, "error");
      } else {
        showNotification("Account locked due to too many failed attempts!", "error");
      }
      
      // Clear password field and add shake animation
      document.getElementById("password").value = "";
      document.querySelector(".form-container").classList.add("shake");
      setTimeout(() => {
        document.querySelector(".form-container").classList.remove("shake");
      }, 500);
    }

    // Reset button state
    loginBtn.disabled = false;
    btnText.style.display = "inline";
    btnIcon.style.display = "inline";
    btnLoader.style.display = "none";
    
  }, 1500); // Simulate network delay
}

// Enhanced notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => {
    notification.remove();
  });

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  let icon = 'fas fa-info-circle';
  if (type === 'success') icon = 'fas fa-check-circle';
  if (type === 'error') icon = 'fas fa-exclamation-triangle';
  if (type === 'warning') icon = 'fas fa-exclamation-circle';
  
  notification.innerHTML = `
    <i class="${icon}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Function to check user session on page load
function checkUserSession() {
  const currentUser = sessionStorage.getItem('currentUser');
  if (currentUser) {
    const userData = JSON.parse(currentUser);
    console.log(`Session found for ${userData.role}: ${userData.username}`);
    
    // Show welcome back message
    showNotification(`Welcome back, ${userData.username}!`, "success");
    
    // Auto-redirect if still valid (optional)
    // window.location.href = "interface.html";
  }
}

// Auto-check session when page loads
document.addEventListener('DOMContentLoaded', function() {
  checkUserSession();
  
  // Add shake animation CSS if not exists
  if (!document.querySelector('#shake-style')) {
    const style = document.createElement('style');
    style.id = 'shake-style';
    style.textContent = `
      .shake {
        animation: shake 0.5s ease-in-out;
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(style);
  }
});

// Enter key support for login
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    signinbutton();
  }
});

// Auto-focus username field
window.addEventListener('load', function() {
  document.getElementById('username').focus();
});
