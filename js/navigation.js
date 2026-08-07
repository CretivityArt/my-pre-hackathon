/* =====================================================================
   navigation.js
   =====================================================================
   Every function that moves the user between pages lives here.
   Keeping navigation separate from API calls and UI logic makes it easy
   to find and change how pages link to each other.
   ===================================================================== */

/**
 * Sends the user to the login page.
 */
function goToLogin() {
    window.location.href = "login.html";
}

/**
 * Sends the user to the welcome page (shown right after login).
 */
function goToWelcome() {
    window.location.href = "welcome.html";
}

/**
 * Sends the user to the main dashboard.
 */
function goToDashboard() {
    window.location.href = "dashboard.html";
}

/**
 * Logs the user out and returns them to the login page.
 * If you add real session handling later (tokens, cookies, etc.),
 * clear that session data here before redirecting.
 */
function logout() {
    // Placeholder for future session cleanup, e.g.:
    // localStorage.removeItem("authToken");
    goToLogin();
}

/**
 * Wires up every sidebar navigation item found on the current page.
 * Sidebar items use a "data-page" attribute to say where they should go.
 * Example: <li class="sidebar-nav-item" data-page="dashboard.html">
 */
function setupSidebarNavigation() {
    const navItems = document.querySelectorAll("[data-page]");

    navItems.forEach((item) => {
        item.addEventListener("click", () => {
            const targetPage = item.getAttribute("data-page");
            if (targetPage) {
                window.location.href = targetPage;
            }
        });
    });
}

/**
 * Wires up any element marked with data-action="logout"
 * (used by the "Log Out" sidebar item).
 */
function setupLogoutButtons() {
    const logoutButtons = document.querySelectorAll('[data-action="logout"]');
    logoutButtons.forEach((button) => {
        button.addEventListener("click", logout);
    });
}

// Run the shared setup automatically on every page that includes this file.
document.addEventListener("DOMContentLoaded", () => {
    setupSidebarNavigation();
    setupLogoutButtons();
});
