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

  // Input validation
  if (!username || !password) {
    alert("Please enter both username and password!");
    return;
  }

  // Check if account is locked
  if (loginAttempts >= maxAttempts) {
    alert("Account locked due to too many failed attempts. Please refresh the page to try again.");
    return;
  }

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
    alert(`Login successful! Welcome ${user.role}: ${user.username}`);
    
    // Reset login attempts on successful login
    loginAttempts = 0;
    
    window.location.href = "interface.html";
  } else {
    loginAttempts++;
    const remainingAttempts = maxAttempts - loginAttempts;
    
    if (remainingAttempts > 0) {
      alert(`Invalid username or password! ${remainingAttempts} attempts remaining.`);
    } else {
      alert("Account locked due to too many failed attempts!");
    }
    
    // Clear password field
    document.getElementById("password").value = "";
  }
}

// Function to check user session on page load
function checkUserSession() {
  const currentUser = sessionStorage.getItem('currentUser');
  if (currentUser) {
    const userData = JSON.parse(currentUser);
    console.log(`Session found for ${userData.role}: ${userData.username}`);
  }
}

// Auto-check session when page loads
document.addEventListener('DOMContentLoaded', checkUserSession);
