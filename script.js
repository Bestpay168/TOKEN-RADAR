/* =========================================================
TOKEN RADAR AI
script.js
Frontend Scanner + Scoring Engine + Watchlist + Modal
========================================================= */

"use strict";

/* =========================================================
CONFIG
========================================================= */

const CONFIG = {
appName: "TOKEN RADAR AI",

```
storage: {
    watchlist: "token_radar_watchlist",
    alerts: "token_radar_alerts",
    settings: "token_radar_settings"
},

api: {
    // Nanti bisa diarahkan ke Supabase Edge Function
    endpoint: "",
    enabled: false
},

scan: {
    interval: 5 * 60 * 1000,
    minScore: 55
},

prediction: {
    shortTermDays: 7,
    mediumTermDays: 30
}
```

};

/* =========================================================
DEMO DATA
========================================================= */

const DEMO_TOKENS = [
{
id: "ondo",
symbol: "ONDO",
name: "Ondo Finance",
logo: "https://assets.coingecko.com/coins/images/26580/small/ondo.png",
price: 0.82,
change24h: 3.42,
marketCap: 2650000000,
volume24h: 185000000,

```
    structure: 82,
    volume: 79,
    oi: 71,
    funding: 68,
    cvd: 76,
    whale: 88,
    netflow: 81,
    fundamentals: 84,
    catalyst: 78,
    unlockRisk: 35,

    signal: "ACCUMULATION",
    risk: "MEDIUM"
},

{
    id: "aave",
    symbol: "AAVE",
    name: "Aave",
    logo: "https://assets.coingecko.com/coins/images/12645/small/AAVE.png",
    price: 291.40,
    change24h: 4.86,
    marketCap: 4380000000,
    volume24h: 412000000,

    structure: 86,
    volume: 84,
    oi: 78,
    funding: 72,
    cvd: 81,
    whale: 82,
    netflow: 75,
    fundamentals: 94,
    catalyst: 81,
    unlockRisk: 12,

    signal: "BREAKOUT WATCH",
    risk: "LOW"
},

{
    id: "uni",
    symbol: "UNI",
    name: "Uniswap",
    logo: "https://assets.coingecko.com/coins/images/12504/small/uni.jpg",
    price: 7.17,
    change24h: 14.52,
    marketCap: 4300000000,
    volume24h: 890000000,

    structure: 94,
    volume: 96,
    oi: 86,
    funding: 79,
    cvd: 91,
    whale: 84,
    netflow: 76,
    fundamentals: 92,
    catalyst: 96,
    unlockRisk: 18,

    signal: "BREAKOUT",
    risk: "MEDIUM"
},

{
    id: "orca",
    symbol: "ORCA",
    name: "Orca",
    logo: "https://assets.coingecko.com/coins/images/17547/small/Orca_Logo.png",
    price: 3.12,
    change24h: -1.30,
    marketCap: 165000000,
    volume24h: 22000000,

    structure: 74,
    volume: 69,
    oi: 61,
    funding: 63,
    cvd: 73,
    whale: 91,
    netflow: 88,
    fundamentals: 79,
    catalyst: 67,
    unlockRisk: 20,

    signal: "ACCUMULATION",
    risk: "HIGH"
},

{
    id: "link",
    symbol: "LINK",
    name: "Chainlink",
    logo: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
    price: 24.15,
    change24h: 2.91,
    marketCap: 15400000000,
    volume24h: 610000000,

    structure: 85,
    volume: 82,
    oi: 75,
    funding: 70,
    cvd: 79,
    whale: 95,
    netflow: 87,
    fundamentals: 91,
    catalyst: 86,
    unlockRisk: 24,

    signal: "ACCUMULATION",
    risk: "MEDIUM"
},

{
    id: "ena",
    symbol: "ENA",
    name: "Ethena",
    logo: "https://assets.coingecko.com/coins/images/36530/small/ENA.png",
    price: 0.71,
    change24h: 5.21,
    marketCap: 2200000000,
    volume24h: 310000000,

    structure: 81,
    volume: 85,
    oi: 82,
    funding: 76,
    cvd: 80,
    whale: 88,
    netflow: 72,
    fundamentals: 83,
    catalyst: 91,
    unlockRisk: 49,

    signal: "BREAKOUT WATCH",
    risk: "HIGH"
},

{
    id: "morpho",
    symbol: "MORPHO",
    name: "Morpho",
    logo: "https://assets.coingecko.com/coins/images/29844/small/morpho.png",
    price: 4.92,
    change24h: 6.18,
    marketCap: 910000000,
    volume24h: 87000000,

    structure: 84,
    volume: 78,
    oi: 72,
    funding: 69,
    cvd: 81,
    whale: 94,
    netflow: 85,
    fundamentals: 88,
    catalyst: 80,
    unlockRisk: 22,

    signal: "ACCUMULATION",
    risk: "MEDIUM"
},

{
    id: "sui",
    symbol: "SUI",
    name: "Sui",
    logo: "https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg",
    price: 0.795,
    change24h: -0.97,
    marketCap: 2950000000,
    volume24h: 410000000,

    structure: 63,
    volume: 72,
    oi: 70,
    funding: 61,
    cvd: 65,
    whale: 74,
    netflow: 68,
    fundamentals: 86,
    catalyst: 88,
    unlockRisk: 42,

    signal: "WATCH",
    risk: "HIGH"
},

{
    id: "fet",
    symbol: "FET",
    name: "Artificial Superintelligence Alliance",
    logo: "https://assets.coingecko.com/coins/images/5681/small/Fetch.jpg",
    price: 1.28,
    change24h: 3.77,
    marketCap: 3300000000,
    volume24h: 240000000,

    structure: 77,
    volume: 75,
    oi: 73,
    funding: 67,
    cvd: 78,
    whale: 80,
    netflow: 74,
    fundamentals: 82,
    catalyst: 89,
    unlockRisk: 19,

    signal: "WATCH",
    risk: "MEDIUM"
},

{
    id: "aave2",
    symbol: "LDO",
    name: "Lido DAO",
    logo: "https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png",
    price: 1.42,
    change24h: 2.43,
    marketCap: 1260000000,
    volume24h: 93000000,

    structure: 75,
    volume: 71,
    oi: 66,
    funding: 65,
    cvd: 74,
    whale: 89,
    netflow: 82,
    fundamentals: 85,
    catalyst: 76,
    unlockRisk: 16,

    signal: "ACCUMULATION",
    risk: "MEDIUM"
}
```

];

/* =========================================================
STATE
========================================================= */

const state = {
tokens: [],
filteredTokens: [],
selectedToken: null,
watchlist: [],
alerts: [],
lastScan: null,
chart: null
};

/* =========================================================
DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

```
init();
```

});

/* =========================================================
INITIALIZATION
========================================================= */

async function init() {

```
loadStorage();

setupNavigation();
setupFilters();
setupButtons();
setupChartControls();

hideLoader();

await loadMarketData();

renderAll();

startAutoScan();
```

}

/* =========================================================
LOADER
========================================================= */

function hideLoader() {

```
const loader = document.querySelector(".page-loader");

if (!loader) return;

setTimeout(() => {

    loader.classList.add("hidden");

    setTimeout(() => {
        loader.remove();
    }, 600);

}, 700);
```

}

/* =========================================================
LOAD MARKET DATA
========================================================= */

async function loadMarketData() {

```
showScannerLoading();

try {

    if (CONFIG.api.enabled && CONFIG.api.endpoint) {

        const response = await fetch(CONFIG.api.endpoint);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        state.tokens = normalizeTokens(data);

    } else {

        // DEMO MODE
        await delay(500);

        state.tokens = DEMO_TOKENS.map(token => ({
            ...token,
            score: calculateScore(token)
        }));

    }

} catch (error) {

    console.error("Market data error:", error);

    state.tokens = DEMO_TOKENS.map(token => ({
        ...token,
        score: calculateScore(token)
    }));

}

state.lastScan = new Date();
```

}

/* =========================================================
NORMALIZE API DATA
========================================================= */

function normalizeTokens(data) {

```
const list = Array.isArray(data)
    ? data
    : data.tokens || data.data || [];

return list.map(token => {

    const normalized = {
        ...token,

        id: token.id || token.symbol?.toLowerCase(),

        symbol: token.symbol || "N/A",

        name: token.name || token.symbol || "Unknown",

        price: Number(token.price || 0),

        change24h: Number(
            token.change24h ??
            token.price_change_percentage_24h ??
            0
        ),

        marketCap: Number(
            token.marketCap ??
            token.market_cap ??
            0
        ),

        volume24h: Number(
            token.volume24h ??
            token.total_volume ??
            0
        )
    };

    normalized.score = calculateScore(normalized);

    return normalized;

});
```

}

/* =========================================================
SCORING ENGINE
========================================================= */

/*
SCORE MODEL

```
Price structure       15%
Volume / spot         15%
Open interest         10%
Funding               10%
CVD / order flow      10%
Whale accumulation    15%
Exchange netflow      10%
Fundamentals          10%
Catalyst               5%

Unlock risk is used as a penalty.

NOTE:
These weights are a starting model and should be
backtested before being treated as predictive.
```

*/

function calculateScore(token) {

```
const weights = {
    structure: 0.15,
    volume: 0.15,
    oi: 0.10,
    funding: 0.10,
    cvd: 0.10,
    whale: 0.15,
    netflow: 0.10,
    fundamentals: 0.10,
    catalyst: 0.05
};

let score = 0;

Object.keys(weights).forEach(key => {

    const value = clamp(
        Number(token[key] ?? 50),
        0,
        100
    );

    score += value * weights[key];

});

// Unlock penalty
const unlockRisk = clamp(
    Number(token.unlockRisk ?? 0),
    0,
    100
);

const unlockPenalty = unlockRisk * 0.12;

score -= unlockPenalty;

// Market change adjustment
const change = Number(token.change24h ?? 0);

if (change > 0 && change < 8) {
    score += 2;
}

// Extreme pump penalty
if (change > 20) {
    score -= 5;
}

return Math.round(
    clamp(score, 0, 100)
);
```

}

/* =========================================================
PREDICTION ENGINE
========================================================= */

function calculatePrediction(token) {

```
const score = token.score ?? calculateScore(token);

/*
   The app does NOT claim an exact future price.
   It generates scenario ranges based on score.

   These are model scenarios, NOT guarantees.
*/

let shortMin;
let shortMax;

let mediumMin;
let mediumMax;

if (score >= 85) {

    shortMin = 7;
    shortMax = 18;

    mediumMin = 15;
    mediumMax = 35;

} else if (score >= 75) {

    shortMin = 4;
    shortMax = 12;

    mediumMin = 10;
    mediumMax = 25;

} else if (score >= 65) {

    shortMin = 2;
    shortMax = 8;

    mediumMin = 5;
    mediumMax = 17;

} else if (score >= 55) {

    shortMin = -2;
    shortMax = 5;

    mediumMin = 0;
    mediumMax = 10;

} else {

    shortMin = -10;
    shortMax = 2;

    mediumMin = -15;
    mediumMax = 5;

}

const breakoutProbability = Math.round(
    clamp(
        35 + score * 0.62,
        20,
        94
    )
);

return {
    short: {
        min: shortMin,
        max: shortMax
    },

    medium: {
        min: mediumMin,
        max: mediumMax
    },

    probability: breakoutProbability
};
```

}

/* =========================================================
SIGNAL ENGINE
========================================================= */

function determineSignal(token) {

```
const score = token.score;

if (score >= 88) {
    return "BREAKOUT";
}

if (score >= 78) {
    return "BREAKOUT WATCH";
}

if (score >= 68) {
    return "ACCUMULATION";
}

if (score >= 55) {
    return "WATCH";
}

return "WEAK";
```

}

/* =========================================================
RISK ENGINE
========================================================= */

function determineRisk(token) {

```
const unlock = Number(token.unlockRisk ?? 0);
const change = Number(token.change24h ?? 0);
const score = Number(token.score ?? 0);

if (unlock >= 60 || change >= 20) {
    return "HIGH";
}

if (score >= 78 && unlock < 30) {
    return "LOW";
}

return "MEDIUM";
```

}

/* =========================================================
RENDER ALL
========================================================= */

function renderAll() {

```
state.tokens.forEach(token => {

    token.score = calculateScore(token);

    token.signal = determineSignal(token);

    token.risk = determineRisk(token);

});

state.filteredTokens = [...state.tokens];

renderMarketOverview();
renderScanner();
renderFeaturedToken();
renderWatchlist();
renderAlerts();
renderUnlocks();
```

}

/* =========================================================
MARKET OVERVIEW
========================================================= */

function renderMarketOverview() {

```
const total = state.tokens.length;

const bullish = state.tokens.filter(
    token => token.score >= 70
).length;

const breakout = state.tokens.filter(
    token => token.signal === "BREAKOUT"
).length;

const avgScore = total
    ? Math.round(
        state.tokens.reduce(
            (sum, token) => sum + token.score,
            0
        ) / total
    )
    : 0;

setText(
    "[data-stat='tokens']",
    total
);

setText(
    "[data-stat='bullish']",
    bullish
);

setText(
    "[data-stat='breakout']",
    breakout
);

setText(
    "[data-stat='score']",
    avgScore
);
```

}

/* =========================================================
FEATURED TOKEN
========================================================= */

function renderFeaturedToken() {

```
if (!state.tokens.length) return;

const token =
    state.tokens
        .slice()
        .sort((a, b) => b.score - a.score)[0];

state.selectedToken = token;

const prediction =
    calculatePrediction(token);

setText(
    "#featuredSymbol",
    token.symbol
);

setText(
    "#featuredName",
    token.name
);

setText(
    "#featuredPrice",
    formatPrice(token.price)
);

setText(
    "#featuredChange",
    formatPercent(token.change24h)
);

setText(
    "#featuredScore",
    token.score
);

setText(
    "#shortPrediction",
    `+${prediction.short.min}% → +${prediction.short.max}%`
);

setText(
    "#mediumPrediction",
    `+${prediction.medium.min}% → +${prediction.medium.max}%`
);

setText(
    "#breakoutProbability",
    `${prediction.probability}%`
);

const logo =
    document.querySelector("#featuredLogo");

if (logo && token.logo) {
    logo.src = token.logo;
    logo.alt = token.symbol;
}

updateScoreCircle(token.score);

renderSignalReasons(token);

updateWatchButton(token);
```

}

/* =========================================================
SCORE CIRCLE
========================================================= */

function updateScoreCircle(score) {

```
const circle =
    document.querySelector(".score-circle");

if (!circle) return;

circle.style.setProperty(
    "--score",
    score
);

const value =
    circle.querySelector(".score-value");

if (value) {
    value.textContent = score;
}
```

}

/* =========================================================
SIGNAL REASONS
========================================================= */

function renderSignalReasons(token) {

```
const container =
    document.querySelector(".signal-reasons");

if (!container) return;

const reasons = [];

if (token.structure >= 75) {
    reasons.push("Struktur harga membentuk higher-low.");
}

if (token.volume >= 75) {
    reasons.push("Volume spot menunjukkan peningkatan aktivitas.");
}

if (token.whale >= 80) {
    reasons.push("Aktivitas whale menunjukkan akumulasi.");
}

if (token.netflow >= 75) {
    reasons.push("Netflow mendukung tekanan jual yang lebih rendah.");
}

if (token.cvd >= 75) {
    reasons.push("Order flow/CVD menunjukkan tekanan beli.");
}

if (token.fundamentals >= 80) {
    reasons.push("Fundamental/protocol activity relatif kuat.");
}

if (token.unlockRisk >= 50) {
    reasons.push("⚠️ Risiko unlock cukup tinggi.");
}

container.innerHTML = reasons
    .slice(0, 5)
    .map(
        reason => `<div class="reason-item">✓ ${escapeHTML(reason)}</div>`
    )
    .join("");
```

}

/* =========================================================
SCANNER TABLE
========================================================= */

function renderScanner() {

```
const tbody =
    document.querySelector("#scannerBody");

if (!tbody) return;

if (!state.filteredTokens.length) {

    tbody.innerHTML = `
        <tr>
            <td colspan="8">
                <div class="empty-state">
                    Tidak ada token yang sesuai filter.
                </div>
            </td>
        </tr>
    `;

    return;
}

tbody.innerHTML =
    state.filteredTokens
        .sort((a, b) => b.score - a.score)
        .map(token => {

            const prediction =
                calculatePrediction(token);

            return `
                <tr data-token="${escapeHTML(token.id)}">

                    <td>
                        <div class="token-cell">

                            <img
                                class="token-logo"
                                src="${escapeHTML(token.logo || "")}"
                                alt="${escapeHTML(token.symbol)}"
                                onerror="this.style.display='none'"
                            >

                            <div>
                                <strong>
                                    ${escapeHTML(token.symbol)}
                                </strong>

                                <small>
                                    ${escapeHTML(token.name)}
                                </small>
                            </div>

                        </div>
                    </td>

                    <td>
                        ${formatPrice(token.price)}
                    </td>

                    <td class="${token.change24h >= 0 ? "positive" : "negative"}">
                        ${formatPercent(token.change24h)}
                    </td>

                    <td>
                        <span class="score-mini ${scoreClass(token.score)}">
                            ${token.score}
                        </span>
                    </td>

                    <td>
                        <span class="signal-badge ${badgeClass(token.signal)}">
                            ${escapeHTML(token.signal)}
                        </span>
                    </td>

                    <td>
                        <span class="risk-badge ${riskClass(token.risk)}">
                            ${escapeHTML(token.risk)}
                        </span>
                    </td>

                    <td>
                        ${prediction.probability}%
                    </td>

                    <td>
                        <button
                            class="table-action"
                            data-action="details"
                            data-id="${escapeHTML(token.id)}">
                            Detail
                        </button>
                    </td>

                </tr>
            `;

        })
        .join("");
```

}

/* =========================================================
FILTERS
========================================================= */

function setupFilters() {

```
const filters =
    document.querySelectorAll(
        ".scanner-filters select"
    );

filters.forEach(select => {

    select.addEventListener(
        "change",
        applyFilters
    );

});
```

}

/* =========================================================
APPLY FILTERS
========================================================= */

function applyFilters() {

```
const marketCap =
    document.querySelector("#marketCapFilter")?.value || "all";

const signal =
    document.querySelector("#signalFilter")?.value || "all";

const risk =
    document.querySelector("#riskFilter")?.value || "all";

const score =
    Number(
        document.querySelector("#scoreFilter")?.value || 0
    );

state.filteredTokens =
    state.tokens.filter(token => {

        let pass = true;

        if (marketCap !== "all") {

            const cap = token.marketCap;

            if (
                marketCap === "large" &&
                cap < 10_000_000_000
            ) {
                pass = false;
            }

            if (
                marketCap === "mid" &&
                (
                    cap < 1_000_000_000 ||
                    cap >= 10_000_000_000
                )
            ) {
                pass = false;
            }

            if (
                marketCap === "small" &&
                cap >= 1_000_000_000
            ) {
                pass = false;
            }

        }

        if (
            signal !== "all" &&
            token.signal !== signal
        ) {
            pass = false;
        }

        if (
            risk !== "all" &&
            token.risk !== risk
        ) {
            pass = false;
        }

        if (token.score < score) {
            pass = false;
        }

        return pass;

    });

renderScanner();
```

}

/* =========================================================
BUTTONS
========================================================= */

function setupButtons() {

```
document.addEventListener(
    "click",
    event => {

        const target =
            event.target.closest("[data-action]");

        if (!target) return;

        const action =
            target.dataset.action;

        const id =
            target.dataset.id;

        switch (action) {

            case "details":
                openTokenModal(id);
                break;

            case "watch":
                toggleWatchlist(id);
                break;

            case "scan":
                runScan();
                break;

            case "close-modal":
                closeModal();
                break;

            case "remove-watch":
                removeFromWatchlist(id);
                break;

        }

    }
);
```

}

/* =========================================================
NAVIGATION
========================================================= */

function setupNavigation() {

```
const menuToggle =
    document.querySelector(".menu-toggle");

const navbar =
    document.querySelector(".navbar");

const overlay =
    document.querySelector(".nav-overlay");

if (!menuToggle || !navbar) return;

menuToggle.addEventListener(
    "click",
    () => {

        navbar.classList.toggle("active");

        menuToggle.classList.toggle("active");

        if (overlay) {
            overlay.classList.toggle("active");
        }

    }
);

document
    .querySelectorAll(".nav-link")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navbar.classList.remove("active");

                menuToggle.classList.remove("active");

                overlay?.classList.remove("active");

            }
        );

    });

overlay?.addEventListener(
    "click",
    () => {

        navbar.classList.remove("active");

        menuToggle.classList.remove("active");

        overlay.classList.remove("active");

    }
);
```

}

/* =========================================================
WATCHLIST
========================================================= */

function loadStorage() {

```
try {

    state.watchlist =
        JSON.parse(
            localStorage.getItem(
                CONFIG.storage.watchlist
            )
        ) || [];

    state.alerts =
        JSON.parse(
            localStorage.getItem(
                CONFIG.storage.alerts
            )
        ) || [];

} catch (error) {

    state.watchlist = [];
    state.alerts = [];

}
```

}

function saveWatchlist() {

```
localStorage.setItem(
    CONFIG.storage.watchlist,
    JSON.stringify(state.watchlist)
);
```

}

function toggleWatchlist(id) {

```
const index =
    state.watchlist.indexOf(id);

if (index === -1) {

    state.watchlist.push(id);

} else {

    state.watchlist.splice(index, 1);

}

saveWatchlist();

updateWatchButton(
    state.tokens.find(
        token => token.id === id
    )
);

renderWatchlist();
```

}

function removeFromWatchlist(id) {

```
state.watchlist =
    state.watchlist.filter(
        item => item !== id
    );

saveWatchlist();

renderWatchlist();
```

}

function updateWatchButton(token) {

```
if (!token) return;

const button =
    document.querySelector(
        "[data-action='watch']"
    );

if (!button) return;

const active =
    state.watchlist.includes(token.id);

button.textContent =
    active
        ? "★ Dalam Watchlist"
        : "☆ Tambah Watchlist";

button.dataset.id = token.id;
```

}

/* =========================================================
WATCHLIST RENDER
========================================================= */

function renderWatchlist() {

```
const container =
    document.querySelector(".watchlist-grid");

if (!container) return;

const tokens =
    state.tokens.filter(
        token =>
            state.watchlist.includes(token.id)
    );

if (!tokens.length) {

    container.innerHTML = `
        <div class="empty-state">
            <strong>Watchlist masih kosong</strong>
            <p>
                Tambahkan token yang ingin dipantau.
            </p>
        </div>
    `;

    return;

}

container.innerHTML =
    tokens.map(token => {

        return `
            <article class="watchlist-card">

                <div class="watchlist-card-header">

                    <div class="token-cell">

                        <img
                            class="token-logo"
                            src="${escapeHTML(token.logo || "")}"
                            alt="${escapeHTML(token.symbol)}"
                        >

                        <div>
                            <strong>
                                ${escapeHTML(token.symbol)}
                            </strong>

                            <small>
                                ${escapeHTML(token.name)}
                            </small>
                        </div>

                    </div>

                    <button
                        class="watchlist-remove"
                        data-action="remove-watch"
                        data-id="${escapeHTML(token.id)}">
                        ×
                    </button>

                </div>

                <div class="watch-price">
                    ${formatPrice(token.price)}
                </div>

                <div class="watch-score">
                    Score ${token.score}/100
                </div>

            </article>
        `;

    }).join("");
```

}

/* =========================================================
ALERTS
========================================================= */

function renderAlerts() {

```
const container =
    document.querySelector(".alerts-list");

if (!container) return;

const alerts = [];

state.tokens.forEach(token => {

    if (token.score >= 85) {

        alerts.push({
            type: "warning",
            title: `${token.symbol} mendekati breakout`,
            text: `Radar score ${token.score}/100 dengan probabilitas breakout tinggi.`,
            time: "Sekarang"
        });

    }

    if (token.unlockRisk >= 50) {

        alerts.push({
            type: "danger",
            title: `${token.symbol} memiliki unlock risk`,
            text: "Potensi tekanan jual perlu diperhatikan.",
            time: "Sekarang"
        });

    }

});

if (!alerts.length) {

    container.innerHTML = `
        <div class="empty-state">
            Tidak ada alert penting.
        </div>
    `;

    return;
}

container.innerHTML =
    alerts
        .slice(0, 8)
        .map(alert => {

            return `
                <article class="alert-card ${alert.type}">

                    <div class="alert-header">
                        <strong>
                            ${escapeHTML(alert.title)}
                        </strong>

                        <span class="alert-time">
                            ${escapeHTML(alert.time)}
                        </span>
                    </div>

                    <p>
                        ${escapeHTML(alert.text)}
                    </p>

                </article>
            `;

        })
        .join("");
```

}

/* =========================================================
UNLOCKS
========================================================= */

function renderUnlocks() {

```
const container =
    document.querySelector(".unlock-grid");

if (!container) return;

const tokens =
    state.tokens
        .slice()
        .sort(
            (a, b) =>
                (b.unlockRisk || 0) -
                (a.unlockRisk || 0)
        )
        .slice(0, 6);

container.innerHTML =
    tokens.map(token => {

        const risk =
            token.unlockRisk || 0;

        return `
            <article class="unlock-card ${risk >= 50 ? "high" : ""}">

                <div class="unlock-header">

                    <strong>
                        ${escapeHTML(token.symbol)}
                    </strong>

                    <span class="unlock-date">
                        Risk ${risk}%
                    </span>

                </div>

                <div class="unlock-data">

                    <span>
                        Unlock Risk
                    </span>

                    <strong>
                        ${risk}%
                    </strong>

                </div>

            </article>
        `;

    }).join("");
```

}

/* =========================================================
MODAL
========================================================= */

function openTokenModal(id) {

```
const token =
    state.tokens.find(
        item => item.id === id
    );

if (!token) return;

state.selectedToken = token;

const modal =
    document.querySelector(".modal");

if (!modal) return;

const prediction =
    calculatePrediction(token);

setText(
    "#modalSymbol",
    token.symbol
);

setText(
    "#modalName",
    token.name
);

setText(
    "#modalScore",
    token.score
);

setText(
    "#modalProbability",
    `${prediction.probability}%`
);

setText(
    "#modalShortPrediction",
    `+${prediction.short.min}% → +${prediction.short.max}%`
);

setText(
    "#modalMediumPrediction",
    `+${prediction.medium.min}% → +${prediction.medium.max}%`
);

renderIndicators(token);

modal.classList.add("active");

document.body.classList.add("modal-open");

createChart(token);
```

}

function closeModal() {

```
const modal =
    document.querySelector(".modal");

if (!modal) return;

modal.classList.remove("active");

document.body.classList.remove("modal-open");
```

}

/* =========================================================
INDICATORS
========================================================= */

function renderIndicators(token) {

```
const container =
    document.querySelector(".indicator-grid");

if (!container) return;

const indicators = [
    ["Price Structure", token.structure],
    ["Spot Volume", token.volume],
    ["Open Interest", token.oi],
    ["Funding", token.funding],
    ["CVD", token.cvd],
    ["Whale", token.whale],
    ["Netflow", token.netflow],
    ["Fundamental", token.fundamentals]
];

container.innerHTML =
    indicators.map(
        ([name, value]) => {

            return `
                <div class="indicator">

                    <span>
                        ${escapeHTML(name)}
                    </span>

                    <strong>
                        ${value}/100
                    </strong>

                    <div class="indicator-bar">
                        <span
                            style="width:${value}%">
                        </span>
                    </div>

                </div>
            `;

        }
    ).join("");
```

}

/* =========================================================
CHART
========================================================= */

function setupChartControls() {

```
const buttons =
    document.querySelectorAll(
        "[data-chart-period]"
    );

buttons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            buttons.forEach(
                item =>
                    item.classList.remove("active")
            );

            button.classList.add("active");

            if (state.selectedToken) {
                createChart(
                    state.selectedToken,
                    button.dataset.chartPeriod
                );
            }

        }
    );

});
```

}

function createChart(token, period = "7D") {

```
const canvas =
    document.querySelector("#tokenChart");

if (!canvas) return;

if (
    typeof Chart === "undefined"
) {

    renderChartFallback(canvas);

    return;

}

if (state.chart) {
    state.chart.destroy();
}

const points =
    generateChartData(
        token,
        period
    );

state.chart =
    new Chart(canvas, {

        type: "line",

        data: {

            labels: points.labels,

            datasets: [
                {
                    label: token.symbol,

                    data: points.values,

                    tension: 0.35,

                    fill: true,

                    pointRadius: 0
                }
            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {

                x: {
                    display: false
                },

                y: {
                    grid: {
                        display: false
                    }
                }

            }

        }

    });
```

}

function generateChartData(token, period) {

```
let count = 30;

if (period === "24H") {
    count = 24;
}

if (period === "7D") {
    count = 30;
}

if (period === "30D") {
    count = 45;
}

const labels = [];
const values = [];

let price =
    Number(token.price || 1);

for (let i = 0; i < count; i++) {

    const volatility =
        (
            Math.random() -
            0.48
        ) * 0.035;

    price *= 1 + volatility;

    labels.push(i + 1);

    values.push(
        Number(price.toFixed(6))
    );

}

return {
    labels,
    values
};
```

}

function renderChartFallback(canvas) {

```
const parent =
    canvas.parentElement;

if (!parent) return;

parent.innerHTML = `
    <div class="empty-state">
        Chart.js belum dimuat.
    </div>
`;
```

}

/* =========================================================
RUN SCAN
========================================================= */

async function runScan() {

```
const button =
    document.querySelector(
        "[data-action='scan']"
    );

if (button) {

    button.disabled = true;

    button.textContent =
        "Scanning...";

}

showScannerLoading();

await loadMarketData();

renderAll();

if (button) {

    button.disabled = false;

    button.textContent =
        "Scan Market";

}
```

}

/* =========================================================
AUTO SCAN
========================================================= */

function startAutoScan() {

```
setInterval(
    () => {

        runSilentScan();

    },
    CONFIG.scan.interval
);
```

}

async function runSilentScan() {

```
try {

    await loadMarketData();

    renderAll();

} catch (error) {

    console.error(
        "Auto scan error:",
        error
    );

}
```

}

/* =========================================================
SCANNER LOADING
========================================================= */

function showScannerLoading() {

```
const tbody =
    document.querySelector("#scannerBody");

if (!tbody) return;

tbody.innerHTML = `
    <tr>
        <td colspan="8">

            <div class="table-loader">

                <span></span>
                <span></span>
                <span></span>

                <p>
                    Menganalisis market...
                </p>

            </div>

        </td>
    </tr>
`;
```

}

/* =========================================================
UTILITIES
========================================================= */

function delay(ms) {

```
return new Promise(
    resolve =>
        setTimeout(resolve, ms)
);
```

}

function clamp(value, min, max) {

```
return Math.min(
    Math.max(value, min),
    max
);
```

}

function setText(selector, value) {

```
const element =
    document.querySelector(selector);

if (element) {
    element.textContent = value;
}
```

}

function formatPrice(value) {


const number =
    Number(value || 0);

if (number >= 1000) {

    return "$" +
        number.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}

if (number >= 1) {

    return "$" +
        number.toFixed(2);

}

if (number >= 0.01) {

    return "$" +
        number.toFixed(4);

}

return "$" +
    number.toFixed(8);


}

function formatPercent(value) {


const number =
    Number(value || 0);

return (
    number >= 0
        ? "+"
        : ""
) +
    number.toFixed(2) +
    "%";


}

function scoreClass(score) {


if (score >= 85) return "excellent";

if (score >= 75) return "good";

if (score >= 60) return "medium";

return "low";


}

function badgeClass(signal) {


return signal
    .toLowerCase()
    .replace(/\s+/g, "-");


}

function riskClass(risk) {


return risk.toLowerCase();


}

function escapeHTML(value) {


return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");


}

/* =========================================================
KEYBOARD
========================================================= */

document.addEventListener(
"keydown",
event => {


    if (event.key === "Escape") {
        closeModal();
    }

}


);

/* =========================================================
MODAL BACKDROP
========================================================= */

document.addEventListener(
"click",
event => {


    const modal =
        document.querySelector(".modal");

    if (
        modal &&
        event.target === modal
    ) {
        closeModal();
    }

}


);

/* =========================================================
GLOBAL API
========================================================= */

window.TokenRadar = {


getTokens() {
    return state.tokens;
},

getToken(id) {
    return state.tokens.find(
        token => token.id === id
    );
},

calculateScore,

calculatePrediction,

runScan,

addToWatchlist(id) {

    if (
        !state.watchlist.includes(id)
    ) {

        state.watchlist.push(id);

        saveWatchlist();

        renderWatchlist();

    }

}


};
