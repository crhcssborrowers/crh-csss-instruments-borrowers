// =======================
// ACCOUNTS
// =======================
const accounts = [
    { username: "CSS", password: "css@012", role: "admin" },
    { username: "CSS", password: "css@012", role: "viewer" }
];

// =======================
// BORROW DATA
// =======================
let borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];

// =======================
// INITIAL STOCK
// =======================
const initialStock = {
    "Alligator Forcep": 1,
    "Alus Forcep": 1,
    "Bobcock Forcep": 4,
    "Blade Holder": 2,
    "Bonecurette": 1,
    "Bone Ronguer": 1,
    "CTT Set": 5,
    "Cutdown": 3,
    "Cutting Needles": 3,
    "Enema Can": 6,
    "Hemostatic Curve": 1,
    "Hemostatic Straight": 2,
    "Minor Set": 6,
    "Kelly Straight": 4,
    "Mayo Scissors Soaked": 3,
    "Metz Scissors Soaked": 7,
    "Mosquito Curve": 2,
    "Needle Holder Gold": 1,
    "Needle Holder Small": 1,
    "Needle Holder Medium": 1,
    "Needle Holder Large": 1,
    "Ovum Forcep": 5,
    "Skin Retractor": 2,
    "Stainless Kidney Basin": 5,
    "Suture Remover Soaked": 4,
    "Vaginal Speculum Large": 1,
    "Vaginal Speculum Small": 2,
    "Suturing Set": 5,
    "Red Ribbon": 1,
    "Infectious Minor Set": 2,
    "Infectious CTT Set": 2,
    "Infectious Kidney Basin": 2,
    "Needle Holder Long/Straight": 1,
    "Needle Holder Long/Curve": 1,
    "Pean Straight": 1,
    "Pean Curve": 1,
    "Bayonet forcep Long": 2,
    "Bayonet forcep Small": 2,
    "Nasal Speculum": 2,
    "Tissue forcep w/ Teeth": 4,
    "Long Nose": 2
};

// =======================
// STOCK LOAD (SAFE MERGE)
// =======================
let instrumentStock =
    JSON.parse(localStorage.getItem("instrumentStock")) || {};

for (let key in initialStock) {
    if (instrumentStock[key] === undefined) {
        instrumentStock[key] = initialStock[key];
    }
}

// =======================
// EXPIRY DATA
// =======================
let expiryData =
    JSON.parse(localStorage.getItem("expiryData")) || {};

// =======================
// SAVE ALL
// =======================
function saveAll() {
    localStorage.setItem("borrowList", JSON.stringify(borrowList));
    localStorage.setItem("instrumentStock", JSON.stringify(instrumentStock));
    localStorage.setItem("expiryData", JSON.stringify(expiryData));
}

// =======================
// LOGIN
// =======================
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const user = accounts.find(a =>
        a.username === username && a.password === password
    );

    if (!user) {
        document.getElementById("error-msg").textContent = "Invalid login!";
        return;
    }

    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("dashboard-page").classList.remove("hidden");

    loadAll();
});

// =======================
// LOGOUT (FIXED)
// =======================
function logout() {
    document.getElementById("dashboard-page")?.classList.add("hidden");
    document.getElementById("login-page")?.classList.remove("hidden");

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("error-msg").textContent = "";

    loadAll();
}

// SAFE EVENT BINDING
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    }
});

// =======================
// BORROW
// =======================
document.getElementById("borrow-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const equipment = document.getElementById("equipment-select").value.trim();

    if (!instrumentStock.hasOwnProperty(equipment)) {
        alert("Instrument not registered!");
        return;
    }

    if (instrumentStock[equipment] <= 0) {
        alert("No stock available!");
        return;
    }

    instrumentStock[equipment]--;

    borrowList.push({
        id: Date.now(),
        name: document.getElementById("borrower-name").value,
        type: document.getElementById("type-select").value,
        equipment: equipment,
        area: document.getElementById("area-select").value,
        time: new Date().toLocaleString(),
        timestamp: Date.now(),
        returned: false
    });

    saveAll();
    loadAll();
    e.target.reset();
});

// =======================
// RETURN
// =======================
function returnItem(id) {
    const item = borrowList.find(i => i.id === id);
    if (!item || item.returned) return;

    item.returned = true;
    item.returnTime = new Date().toLocaleString();

    if (instrumentStock[item.equipment] !== undefined) {
        instrumentStock[item.equipment]++;
    }

    saveAll();
    loadAll();
}

// =======================
// LOAD FUNCTIONS
// =======================
function loadActive() {
    const tbody = document.querySelector("#borrow-table tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    borrowList.filter(i => !i.returned).forEach(item => {
        tbody.innerHTML += `
        <tr>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.equipment}</td>
            <td>${item.area}</td>
            <td>${item.time}</td>
            <td>Borrowed</td>
            <td><button onclick="returnItem(${item.id})">Return</button></td>
        </tr>`;
    });
}

function loadReturned() {
    const tbody = document.querySelector("#returned-table tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    borrowList.filter(i => i.returned).forEach(item => {
        tbody.innerHTML += `
        <tr>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.equipment}</td>
            <td>${item.area}</td>
            <td>${item.returnTime}</td>
        </tr>`;
    });
}

function loadTotal() {
    const tbody = document.querySelector("#total-table tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    borrowList.forEach(item => {
        tbody.innerHTML += `
        <tr>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.equipment}</td>
            <td>${item.area}</td>
            <td>${item.time}</td>
        </tr>`;
    });
}

// =======================
// AVAILABLE STOCK
// =======================
function loadAvailable() {
    const tbody = document.querySelector("#available-table tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    for (let key in initialStock) {
        const savedExpiry = expiryData[key] || "";

        tbody.innerHTML += `
        <tr>
            <td style="text-align:center;">${key}</td>
            <td style="text-align:center;">${initialStock[key]}</td>
            <td style="text-align:center;">${instrumentStock[key]}</td>
            <td style="text-align:center;">${savedExpiry || "-"}</td>
            <td style="text-align:center;">
                <div class="expiry-inline">
                    <input type="date" id="expiry-${key.replace(/\s/g,'-')}" value="${savedExpiry}">
                    <button onclick="saveExpiry('${key}')" class="enter-btn">Enter</button>
                </div>
            </td>
        </tr>`;
    }
}

// =======================
// SAVE EXPIRY
// =======================
function saveExpiry(key) {
    const input = document.getElementById("expiry-" + key.replace(/\s/g,'-'));
    if (!input) return;

    expiryData[key] = input.value;
    saveAll();
    loadAvailable();
}

// =======================
// LOAD ALL
// =======================
function loadAll() {
    loadActive();
    loadReturned();
    loadTotal();
    loadAvailable();
}

// =======================
// NAVIGATION
// =======================
function showView(view) {
    document.querySelectorAll(".main-content > div")
        .forEach(v => v.classList.add("hidden"));

    const target = document.getElementById("view-" + view);
    if (target) target.classList.remove("hidden");
}

document.getElementById("nav-dash").onclick = () => showView("dashboard");
document.getElementById("nav-total").onclick = () => showView("total");
document.getElementById("nav-returned").onclick = () => showView("returned");
document.getElementById("nav-available").onclick = () => showView("available");

// =======================
// INIT
// =======================
loadAll();