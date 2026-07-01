// ==============================
// DATE TIME
// ==============================
function updateDateTime() {
    const now = new Date();

    const dateEl = document.getElementById("todayDate");
    const updateEl = document.getElementById("lastUpdated");

    if (dateEl) {
        dateEl.textContent = now.toDateString();
    }

    if (updateEl) {
        updateEl.textContent = "Last updated: " + now.toLocaleTimeString();
    }
}

setInterval(updateDateTime, 1000);
updateDateTime();


// ==============================
// LOGOUT
// ==============================
const logoutBtn = document.getElementById("logout");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "./admin-login.html";
    });
}


// ==============================
// SOCKET (OPTIMIZED)
// ==============================
const socket = io("https://fx-academy-backend.onrender.com");

let refreshCooldown = false;

socket.on("dashboard-update", (data) => {

    console.log("LIVE EVENT:", data);

    if (typeof notify === "function") {
        notify(data.message);
    }

    // prevent spam reload
    if (data.type === "payment") {

        if (refreshCooldown) return;

        refreshCooldown = true;

        if (typeof loadDashboard === "function") {
            loadDashboard();
        }

        setTimeout(() => {
            refreshCooldown = false;
        }, 2000);
    }
});


// ==============================
// CHARTS
// ==============================
function renderCharts(data) {

    // SAFETY CHECK
    if (!data) return;

    // =========================
    // USERS CHART
    // =========================
    const ctx1 = document.getElementById("usersChart");

    if (ctx1 && data.usersByMonth) {

        const labels = data.usersByMonth.map(d => `M${d._id}`);
        const values = data.usersByMonth.map(d => d.total);

        if (window.usersChart) window.usersChart.destroy();

        window.usersChart = new Chart(ctx1, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Users Growth",
                    data: values,
                    borderColor: "#13294b",
                    backgroundColor: "rgba(19,41,75,0.1)",
                    fill: true,
                    tension: 0.3
                }]
            }
        });
    }

    // =========================
    // PAYMENT CHART
    // =========================
    const ctx2 = document.getElementById("paymentsChart");

    if (ctx2 && data.paymentStatus) {

        if (window.paymentsChart) window.paymentsChart.destroy();

        window.paymentsChart = new Chart(ctx2, {
            type: "pie",
            data: {
                labels: ["Approved", "Pending", "Rejected"],
                datasets: [{
                    data: [
                        data.paymentStatus.approved || 0,
                        data.paymentStatus.pending || 0,
                        data.paymentStatus.rejected || 0
                    ],
                    backgroundColor: ["#27ae60", "#f39c12", "#e74c3c"]
                }]
            }
        });
    }
}


// ==============================
// READY
// ==============================
console.log("Dashboard Part 2 Loaded Successfully");