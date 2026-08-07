/* =====================================================================
   dashboard.js
   =====================================================================
   Handles everything on dashboard.html:
   - loading data from the backend (or mock data) when the page opens
   - updating each section of the dashboard with that data

   Each "update" function below is responsible for ONE section of the
   page, so it's easy to find and change how a specific piece renders.
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
});

/**
 * Main entry point for the dashboard page.
 * Fetches the data, then hands it off to smaller update functions.
 */
async function loadDashboard() {
    const data = await getDashboardData();

    if (!data.success) {
        showDashboardError("Could not load your dashboard. Please refresh the page.");
        return;
    }

    updateUserInfo(data.user);
    updateStatistics(data.balance);
    updateCards(data.card);
    updateNotifications(data.transactions);
}

/**
 * Fills in the top bar with the logged-in user's name and avatar.
 */
function updateUserInfo(user) {
    if (!user) return;

    const welcomeNameEls = document.querySelectorAll(".js-user-first-name");
    const userNameEl = document.querySelector(".js-topbar-username");
    const userRoleEl = document.querySelector(".js-topbar-role");

    welcomeNameEls.forEach((el) => {
        el.textContent = user.name;
    });

    if (userNameEl) userNameEl.textContent = user.name;
    if (userRoleEl) userRoleEl.textContent = user.memberLevel;
}

/**
 * Fills in the "My Account & Balance" card.
 * (Named updateStatistics to match the project's function naming plan —
 * on this dashboard, the balance figures ARE the account statistics.)
 */
function updateStatistics(balance) {
    if (!balance) return;

    const amountEl = document.querySelector(".js-balance-amount");
    const cardNumberEl = document.querySelector(".js-balance-card-number");
    const expiryEl = document.querySelector(".js-balance-expiry");

    if (amountEl) {
        // Split "5.254,50" into a large main part and a smaller decimal part,
        // matching the two-size look of the Canva design.
        const [wholePart, decimalPart] = balance.amount.split(",");
        amountEl.innerHTML = `$ ${wholePart}<small>,${decimalPart}</small>`;
    }

    if (cardNumberEl) cardNumberEl.textContent = balance.cardNumberMasked;
    if (expiryEl) expiryEl.textContent = balance.expiry;
}

/**
 * Fills in the "Card Info" panel (the physical card preview).
 */
function updateCards(card) {
    if (!card) return;

    const holderNameEl = document.querySelector(".js-card-holder-name");
    const cardNumberEl = document.querySelector(".js-card-number");
    const statusEl = document.querySelector(".js-card-status");
    const tierEl = document.querySelector(".js-card-tier");

    if (holderNameEl) holderNameEl.textContent = card.holderName;
    if (cardNumberEl) cardNumberEl.textContent = card.cardNumberMasked;
    if (statusEl) statusEl.textContent = card.status;
    if (tierEl) tierEl.textContent = card.tier;
}

/**
 * Fills in the transactions table.
 * (Named updateNotifications to match the project's function naming plan —
 * this Canva design shows transaction activity instead of a separate
 * notifications list, so the transaction feed fills that role.)
 */
function updateNotifications(transactions) {
    const tableBody = document.querySelector(".js-transaction-table-body");
    if (!tableBody || !transactions) return;

    // Clear any existing placeholder rows
    tableBody.innerHTML = "";

    transactions.forEach((tx) => {
        const row = document.createElement("tr");

        const statusClass = tx.status.toLowerCase() === "done" ? "done" : "pending";
        const statusIcon = tx.status.toLowerCase() === "done" ? "&#10003;" : "&#8226;";

        row.innerHTML = `
            <td>
                <div class="tx-purpose">${tx.purpose}</div>
                <div class="tx-subtext">${tx.subtext}</div>
            </td>
            <td>
                <div>${tx.date}</div>
                <div class="tx-date-time">${tx.time}</div>
            </td>
            <td>
                <div class="tx-purpose">${tx.amount}</div>
                <div class="tx-subtext">${tx.method}</div>
            </td>
            <td>
                <span class="status-pill ${statusClass}">${statusIcon} ${tx.status}</span>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

/**
 * Shows a simple error message if the dashboard data fails to load.
 */
function showDashboardError(message) {
    const mainContent = document.querySelector(".main-content");
    if (!mainContent) return;

    const errorBox = document.createElement("div");
    errorBox.className = "form-message error show";
    errorBox.style.gridColumn = "1 / -1";
    errorBox.textContent = message;

    mainContent.prepend(errorBox);
}
