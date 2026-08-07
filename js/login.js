/* =====================================================================
   login.js
   =====================================================================
   Handles everything on login.html:
   - reading what the user typed
   - basic frontend validation (NOT real authentication)
   - calling the API function from api.js
   - showing success/error messages
   - navigating to the dashboard on success

   Real password checking always happens on the Flask backend, never here.
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", handleLoginSubmit);
    }
});

/**
 * Runs when the login form is submitted.
 */
async function handleLoginSubmit(event) {
    // Stop the browser from doing a full page reload on submit
    event.preventDefault();

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const submitButton = document.getElementById("loginSubmitBtn");

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // ---- Basic frontend validation ----
    // This only checks that fields are filled in. It does NOT check
    // whether the password is correct — that is the backend's job.
    if (!username || !password) {
        showFormMessage("Please enter both your username and password.", "error");
        return;
    }

    // Disable the button and show a loading state while we wait
    setButtonLoading(submitButton, true);
    hideFormMessage();

    try {
        const response = await loginUser(username, password);

        if (response.success) {
            showFormMessage("Login successful! Redirecting...", "success");
            // Give the user a moment to see the success message
            setTimeout(goToWelcome, 700);
        } else {
            showFormMessage(response.message || "Invalid username or password.", "error");
            setButtonLoading(submitButton, false);
        }
    } catch (error) {
        console.error("Unexpected login error:", error);
        showFormMessage("Something went wrong. Please try again.", "error");
        setButtonLoading(submitButton, false);
    }
}

/**
 * Shows a message above the login form (error or success).
 */
function showFormMessage(text, type) {
    const messageBox = document.getElementById("formMessage");
    if (!messageBox) return;

    messageBox.textContent = text;
    messageBox.className = `form-message show ${type}`;
}

/**
 * Hides the message box.
 */
function hideFormMessage() {
    const messageBox = document.getElementById("formMessage");
    if (!messageBox) return;

    messageBox.className = "form-message";
}

/**
 * Toggles a simple loading state on the submit button so users
 * get feedback while the request is in flight.
 */
function setButtonLoading(button, isLoading) {
    if (!button) return;

    button.disabled = isLoading;
    button.textContent = isLoading ? "Logging in..." : "Log In";
}
