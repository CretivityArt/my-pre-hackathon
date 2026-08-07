/* =====================================================================
   api.js
   =====================================================================
   ALL communication with the Python/Flask backend happens through the
   functions in this file. If you need to change the backend address,
   or add a new endpoint, this is the ONLY file you should need to edit.

   HOW TO CONNECT YOUR REAL FLASK BACKEND:
   1. Change API_BASE_URL below to your Flask server's address.
   2. Set USE_MOCK_DATA to false.
   3. Make sure your Flask routes match the endpoint paths used below
      (for example "/login", "/dashboard-data").
   ===================================================================== */

// ---------------------------------------------------------------------
// CONFIGURATION — change these two lines to connect your real backend
// ---------------------------------------------------------------------
const API_BASE_URL = "http://127.0.0.1:50";

// When true, every function below returns fake/mock data instead of
// calling the backend. This lets the frontend work before Flask exists.
const USE_MOCK_DATA = false;


// ---------------------------------------------------------------------
// GENERIC REQUEST HELPERS
// Every other API function in this file is built on top of these two.
// ---------------------------------------------------------------------

/**
 * Sends a POST request with a JSON body to the backend.
 * @param {string} endpoint - e.g. "/login"
 * @param {object} data - the data to send
 * @returns {Promise<object>} the parsed JSON response
 */
async function postData(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error (POST ${endpoint}):`, error);
        // Return a consistent error shape so calling code can check `success`
        return { success: false, message: "Could not reach the server. Please try again." };
    }
}

/**
 * Sends a GET request to the backend.
 * @param {string} endpoint - e.g. "/dashboard-data"
 * @returns {Promise<object>} the parsed JSON response
 */
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error (GET ${endpoint}):`, error);
        return { success: false, message: "Could not reach the server. Please try again." };
    }
}


// ---------------------------------------------------------------------
// MOCK DATA
// Used only when USE_MOCK_DATA is true. Clearly separated so it is easy
// to delete once your Flask backend is ready.
// ---------------------------------------------------------------------
const MOCK_LOGIN_RESPONSE = {
    success: true,
    message: "Login successful (mock data).",
    user: {
        name: "Olivia Wilson",
        memberLevel: "Silver Member"
    }
};
 const MOCK_DASHBOARD_DATA = {
    success: true,
    user: {
        name: "Olivia Wilson",
        memberLevel: "Silver Member",
        avatarUrl: "assets/images/avatar.png"
    },
    balance: {
        amount: "5.2564,50",
        cardNumberMasked: "123-456-7890",
        expiry: "April 2028"
    },
    card: {
        holderName: "Olivia Wilson",
        cardNumberMasked: "123-456-7890",
        status: "Activated",
        tier: "Borcelle Silver Card",
        isPriorityCustomer: true
    },
    transactions: [
        { purpose: "Fauget Cafe", subtext: "Coffee Shop", date: "Today", time: "2m ago", amount: "$500", method: "QR Code", status: "Done" },
        { purpose: "Claudia Store", subtext: "Accessories", date: "Today", time: "5m ago", amount: "$1.000", method: "Transfer", status: "Done" },
        { purpose: "Chidi Barber", subtext: "Barber Shop", date: "Today", time: "1h ago", amount: "$500", method: "QR Code", status: "Done" },
        { purpose: "Cahaya Dewi", subtext: "Bank Account", date: "Today", time: "2h ago", amount: "$1.000", method: "Transfer", status: "Pending" },
        { purpose: "Yael Amari", subtext: "Bank Account", date: "Yesterday", time: "09:00 AM", amount: "$500", method: "Transfer", status: "Done" },
        { purpose: "Larana, Inc.", subtext: "Hotel", date: "Yesterday", time: "08:00 AM", amount: "$1.000", method: "QR Code", status: "Done" }
    ]
};


//const response=await fetch('http://127.0.0.1:50/api/dashboard/${username}')
//const MOCK_DASHBOARD_DATA=await response.json();

// ---------------------------------------------------------------------
// LOGIN ENDPOINTS
// ---------------------------------------------------------------------

/**
 * Sends the user's credentials to the backend to log in.
 * The backend (Flask) is responsible for checking the password —
 * this frontend never verifies passwords itself.
 */
async function loginUser(username, password) {

    const data = {
    username: username,
    password: password
};

/*** 
    fetch("http://127.0.0.1:50/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
});
**/
    if (USE_MOCK_DATA) {
        // Simulate a short network delay so the UI feels realistic
        await mockDelay();
        return MOCK_LOGIN_RESPONSE;
    }
    localStorage.setItem("username", username);
    return await postData("/login", {
        username: username,
        password: password
    });
    
    //window.location.href = "dashboard.html";
    //getDashboardData(username)
}


// ---------------------------------------------------------------------
// DASHBOARD ENDPOINTS
// ---------------------------------------------------------------------

/**
 * Fetches all data needed to fill in the dashboard page:
 * user info, balance, card info, and recent transactions.
 */
async function getDashboardData() {
    const username = localStorage.getItem("username");
    //localStorage.setItem("username", username);
    //username="Angshu"
    if (USE_MOCK_DATA) {
        await mockDelay();
        return MOCK_DASHBOARD_DATA;
    }

    return await fetchData(`/api/dashboard/${username}`);
}


// ---------------------------------------------------------------------
// SMALL HELPER — simulates network latency for mock mode only
// ---------------------------------------------------------------------
function mockDelay(ms = 400) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
