const API = "https://fx-academy-backend.onrender.com";

const token = localStorage.getItem("token");

// Auto protect admin pages
if (!token && !location.href.includes("admin-login")) {
    window.location.href = "./admin-login.html";
}

// Notification system (shared everywhere)
function notify(message) {
    const div = document.createElement("div");

    div.innerText = message;
    div.style.position = "fixed";
    div.style.top = "20px";
    div.style.right = "20px";
    div.style.background = "#13294b";
    div.style.color = "white";
    div.style.padding = "12px 18px";
    div.style.borderRadius = "6px";
    div.style.zIndex = "99999";
    div.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
    div.style.fontSize = "14px";

    document.body.appendChild(div);

    setTimeout(() => div.remove(), 3000);
}
function showLiveNotification(data) {
    const box = document.createElement("div");

    box.style.position = "fixed";
    box.style.top = "20px";
    box.style.right = "20px";
    box.style.background = "#13294b";
    box.style.color = "#fff";
    box.style.padding = "14px 18px";
    box.style.borderRadius = "8px";
    box.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
    box.style.zIndex = "99999";
    box.style.minWidth = "220px";
    box.style.fontSize = "14px";

    box.innerHTML = `
        <strong>${data.title}</strong><br>
        ${data.message}
    `;

    document.body.appendChild(box);

    setTimeout(() => {
        box.remove();
    }, 4000);
}