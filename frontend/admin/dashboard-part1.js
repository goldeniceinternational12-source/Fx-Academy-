// ==============================
// AUTH CHECK
// ==============================
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "./admin-login.html";
}

// ==============================
// GLOBAL STATE
// ==============================
// ==============================
// LOADING STATE (STEP 2)
// ==============================
function setLoading(state) {
    const ids = ["users", "requests", "pending", "completed"];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = state ? "..." : "0";
        }
    });
}
let dashboardData = null;

// ==============================
// NOTIFICATION SYSTEM
// ==============================
function notify(message, type = "success") {

    const toast = document.createElement("div");

    toast.textContent = message;

    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.padding = "14px 18px";
    toast.style.borderRadius = "10px";
    toast.style.color = "#fff";
    toast.style.zIndex = "9999";
    toast.style.fontSize = "14px";
    toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
    toast.style.transform = "translateX(120%)";
    toast.style.transition = "0.3s ease";

    if (type === "error") {
        toast.style.background = "#e74c3c";
    } else if (type === "warning") {
        toast.style.background = "#f39c12";
    } else {
        toast.style.background = "#13294b";
    }

    document.body.appendChild(toast);

    // animate in
    setTimeout(() => {
        toast.style.transform = "translateX(0)";
    }, 100);

    // remove
    setTimeout(() => {
        toast.style.transform = "translateX(120%)";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
// ==============================
// ANIMATE COUNTERS
// ==============================
function animateValue(id, start, end, duration = 800) {
    const el = document.getElementById(id);

    if (!el) return;

    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;

        const progress = Math.min((timestamp - startTime) / duration, 1);

        el.textContent = Math.floor(progress * (end - start) + start).toLocaleString();

        if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}
// ==============================
// LOAD DASHBOARD DATA
// ==============================
async function loadDashboard() {
    try {

        setLoading(true);

        const res = await fetch("https://fx-academy-backend-v2.onrender.com", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            notify(data.message || "Failed to load dashboard", "error");
            setLoading(false);
            return;
        }

        renderCharts(data);

        animateValue("users", 0, data.totalUsers);
        animateValue("requests", 0, data.totalRequests);
        animateValue("pending", 0, data.pendingRequests);
        animateValue("completed", 0, data.completedRequests);

        renderRecentRequests(data.recentRequests);

        setLoading(false);

        notify("Dashboard loaded");

    } catch (err) {
        console.error(err);
        notify("Server error", "error");
        setLoading(false);
    }
}
// ==============================
// RECENT REQUESTS TABLE
// ==============================
function renderRecentRequests(requests) {
    const tbody = document.getElementById("tbody");

    if (!tbody) return;

    if (!requests || requests.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;color:#888;padding:20px;">
                    No recent requests found
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = requests.map(r => `
        <tr>
            <td>${r.name}</td>
            <td>${r.email}</td>
            <td>${r.request}</td>
            <td><span class="status ${r.status}">${r.status}</span></td>
        </tr>
    `).join("");
}