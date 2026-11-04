/* =========================================
   NAVIGATION DROPDOWN
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const dropdowns = document.querySelectorAll(".nav-dropdown");

    dropdowns.forEach(function (dropdown) {

        const toggle = dropdown.querySelector(".nav-dropdown-toggle");

        if (!toggle) return;

        toggle.addEventListener("click", function (event) {

            event.stopPropagation();

            const isOpen = dropdown.classList.contains("open");

            dropdowns.forEach(function (item) {

                item.classList.remove("open");

                const itemToggle = item.querySelector(
                    ".nav-dropdown-toggle"
                );

                if (itemToggle) {
                    itemToggle.setAttribute("aria-expanded", "false");
                }

            });

            if (!isOpen) {

                dropdown.classList.add("open");

                toggle.setAttribute("aria-expanded", "true");

            }

        });

    });


    /* CLOSE WHEN CLICKING OUTSIDE */

    document.addEventListener("click", function (event) {

        if (!event.target.closest(".nav-dropdown")) {

            dropdowns.forEach(function (dropdown) {

                dropdown.classList.remove("open");

                const toggle = dropdown.querySelector(
                    ".nav-dropdown-toggle"
                );

                if (toggle) {
                    toggle.setAttribute("aria-expanded", "false");
                }

            });

        }

    });


    /* CLOSE WITH ESCAPE */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            dropdowns.forEach(function (dropdown) {

                dropdown.classList.remove("open");

                const toggle = dropdown.querySelector(
                    ".nav-dropdown-toggle"
                );

                if (toggle) {
                    toggle.setAttribute("aria-expanded", "false");
                }

            });

        }

    });

});

document.addEventListener("DOMContentLoaded", () => {

    // MOBILE NAVIGATION

    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");

    if (menuToggle && navigation) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Toggle navigation"
            );
        });

        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navigation.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Toggle navigation");
            });
        });

        document.addEventListener("click", (event) => {
            if (
                !navigation.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                navigation.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Toggle navigation");
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                navigation.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

/*index.html*/
    /* =========================================
   QUICK REPAIR SEARCH — HOME PAGE
========================================= */

(() => {

    const homeSearchForm = document.getElementById("homeSearchForm");

    if (!homeSearchForm) return;

    const categoryRadios = document.querySelectorAll(
        'input[name="category"]'
    );

    const deviceSelect = document.getElementById("device");
    const locationSelect = document.getElementById("location");


    /* =========================================
       DEVICE OPTIONS
    ========================================= */

    const devices = {

        phone: [
            { value: "smartphone", label: "Mobile Phone" }
        ],

        laptop: [
            { value: "laptop", label: "Laptop" }
        ]

    };


    /* =========================================
       UPDATE DEVICE DROPDOWN
    ========================================= */

    function updateDevices(category) {

        deviceSelect.innerHTML = "";

        const defaultOption = document.createElement("option");

        defaultOption.value = "";
        defaultOption.textContent = "Choose device";

        deviceSelect.appendChild(defaultOption);

        if (!category || !devices[category]) {

            deviceSelect.disabled = true;
            defaultOption.textContent = "Choose category first";

            return;
        }

        deviceSelect.disabled = false;

        devices[category].forEach((device) => {

            const option = document.createElement("option");

            option.value = device.value;
            option.textContent = device.label;

            deviceSelect.appendChild(option);

        });

    }


    /* =========================================
       CATEGORY CHANGE
    ========================================= */

    categoryRadios.forEach((radio) => {

        radio.addEventListener("change", () => {

            updateDevices(radio.value);

        });

    });


    /* =========================================
       SUBMIT SEARCH
    ========================================= */

    homeSearchForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const selectedCategory = document.querySelector(
            'input[name="category"]:checked'
        );

        const category = selectedCategory
            ? selectedCategory.value
            : "";

        const device = deviceSelect.value;
        const location = locationSelect.value;

        if (!category || !device || !location) {

            homeSearchForm.reportValidity();
            return;

        }

        const params = new URLSearchParams({
            category: category,
            device: device,
            location: location
        });

        window.location.href =
            `repair-shops.html?${params.toString()}`;

    });

})();


    // REPAIR OR REPLACE CALCULATOR

    const calculatorForm = document.getElementById("calculatorForm");
    const calculatorResult = document.getElementById("calculatorResult");
    const savingAmount = document.getElementById("savingAmount");
    const savingMessage = document.getElementById("savingMessage");
    const repairCostInput = document.getElementById("repairCost");
    const replacementCostInput = document.getElementById("replacementCost");

    function formatMMK(amount) {
        return new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 0
        }).format(amount);
    }

    if (
        calculatorForm &&
        calculatorResult &&
        savingAmount &&
        savingMessage &&
        repairCostInput &&
        replacementCostInput
    ) {
        calculatorForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const repairCost = Number(repairCostInput.value);
            const replacementCost = Number(replacementCostInput.value);

            if (
                repairCostInput.value.trim() === "" ||
                replacementCostInput.value.trim() === "" ||
                !Number.isFinite(repairCost) ||
                !Number.isFinite(replacementCost) ||
                repairCost < 0 ||
                replacementCost < 0
            ) {
                calculatorForm.reportValidity();
                return;
            }

            const difference = replacementCost - repairCost;

            calculatorResult.hidden = false;

            if (difference > 0) {
                savingAmount.textContent = `MMK ${formatMMK(difference)}`;
                savingMessage.textContent =
                    "Repairing may cost less than replacing your device. Confirm the final repair price and any additional charges with the provider.";

                calculatorResult.style.borderLeftColor = "#16834A";
                savingAmount.style.color = "#16834A";

            } else if (difference < 0) {
                savingAmount.textContent =
                    `MMK ${formatMMK(Math.abs(difference))} more`;

                savingMessage.textContent =
                    "The estimated repair cost is higher than the replacement cost. Consider the device condition, repair quality, warranty and environmental impact before deciding.";

                calculatorResult.style.borderLeftColor = "#FF7000";
                savingAmount.style.color = "#A84900";

            } else {
                savingAmount.textContent = "MMK 0";

                savingMessage.textContent =
                    "The estimated repair and replacement costs are equal. Compare warranty, device condition and expected lifespan before making your decision.";

                calculatorResult.style.borderLeftColor = "#16834A";
                savingAmount.style.color = "#003D29";
            }
        });

        [repairCostInput, replacementCostInput].forEach((input) => {
            input.addEventListener("input", () => {
                calculatorResult.hidden = true;
            });
        });
    }

});
/* =========================================
   HEADER SEARCH — ALL WEBSITE PAGES
   re:power Website
========================================= */

(() => {

    "use strict";

    /* =====================================
       1. GET HTML ELEMENTS
    ===================================== */

    const toggle = document.getElementById("headerSearchToggle");
    const panel = document.getElementById("headerSearchPanel");
    const input = document.getElementById("headerSearchInput");
    const close = document.getElementById("headerSearchClose");
    const results = document.getElementById("headerSearchResults");

    if (!toggle || !panel || !input || !close || !results) {
        return;
    }


    /* =====================================
       2. ALL WEBSITE PAGES
    ===================================== */

    const pages = [

        {
            title: "Home",
            href: "index.html",
            icon: "fa-house",
            keywords: [
                "home",
                "homepage",
                "welcome",
                "re power",
                "electronics",
                "repair",
                "reuse",
                "sustainability",
                "calculator",
                "cost calculator"
            ]
        },

        {
            title: "Find a Repair Shop",
            href: "repair-shops.html",
            icon: "fa-screwdriver-wrench",
            keywords: [
                "repair shop",
                "repair centre",
                "phone repair",
                "mobile repair",
                "laptop repair",
                "computer repair",
                "technician",
                "repair service",
                "shop location",
                "nearby repair",
                "repair cost",
                "find technician"
            ]
        },

        {
            title: "Collection & Delivery",
            href: "collection-delivery.html",
            icon: "fa-truck",
            keywords: [
                "collection",
                "delivery",
                "pickup",
                "pick up",
                "drop off",
                "device collection",
                "device delivery",
                "schedule collection",
                "booking",
                "transport",
                "collect device"
            ]
        },

        {
            title: "Weather & Device Care",
            href: "weather-device-care.html",
            icon: "fa-cloud-sun",
            keywords: [
                "weather",
                "device care",
                "phone care",
                "laptop care",
                "rain",
                "humidity",
                "heat",
                "temperature",
                "device maintenance",
                "maintenance guide",
                "repair tips",
                "protection",
                "cleaning",
                "device safety"
            ]
        },

        {
            title: "Business Partnerships",
            href: "partnerships.html",
            icon: "fa-handshake",
            keywords: [
                "partnership",
                "business",
                "sponsor",
                "sponsorship",
                "corporate",
                "organisation",
                "company",
                "collaboration",
                "business enquiry",
                "partner with us",
                "support business",
                "campaign"
            ]
        },

        {
            title: "Community & Donations",
            href: "community.html",
            icon: "fa-people-group",
            keywords: [
                "community",
                "donation",
                "donate",
                "volunteer",
                "volunteering",
                "community ideas",
                "volunteer board",
                "electronic donation",
                "old devices",
                "recycling",
                "reuse",
                "environment",
                "get involved"
            ]
        },

        {
            title: "About & Trust",
            href: "about.html",
            icon: "fa-circle-info",
            keywords: [
                "about",
                "about us",
                "our story",
                "mission",
                "vision",
                "trust",
                "privacy",
                "privacy policy",
                "terms",
                "terms and conditions",
                "information",
                "who we are"
            ]
        },

        {
            title: "Contact & Support",
            href: "contact.html",
            icon: "fa-headset",
            keywords: [
                "contact",
                "support",
                "help",
                "customer service",
                "get support",
                "contact us",
                "faq",
                "faqs",
                "frequently asked questions",
                "enquiry",
                "message",
                "email",
                "phone number"
            ]
        },

        {
            title: "Intro",
            href: "intro.html",
            icon: "fa-solid fa-circle-info",
            keywords: [
                "start",
                "intro",
                "annimation",
                "restart",
                "rerun"
            ]
        }

    ];


    /* =====================================
       3. NORMALISE SEARCH TEXT
    ===================================== */

    function normaliseText(value) {

        return value
            .toLowerCase()
            .trim()
            .replace(/[&]/g, "and")
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ");

    }


    /* =====================================
       4. SEARCH PAGE INFORMATION
    ===================================== */

    function showSuggestions(query = "") {

        results.innerHTML = "";

        const searchTerm = normaliseText(query);

        let matches = [];

        if (!searchTerm) {

            matches = pages.slice(0, 5);

        } else {

            matches = pages
                .map(page => {

                    const title = normaliseText(page.title);

                    const keywords = page.keywords.map(
                        keyword => normaliseText(keyword)
                    );

                    let score = 0;

                    if (title === searchTerm) {
                        score += 100;
                    }

                    if (title.startsWith(searchTerm)) {
                        score += 50;
                    }

                    if (title.includes(searchTerm)) {
                        score += 30;
                    }

                    keywords.forEach(keyword => {

                        if (keyword === searchTerm) {
                            score += 40;
                        } else if (keyword.startsWith(searchTerm)) {
                            score += 20;
                        } else if (keyword.includes(searchTerm)) {
                            score += 10;
                        } else if (
                            searchTerm.split(" ").some(word =>
                                keyword.includes(word)
                            )
                        ) {
                            score += 5;
                        }

                    });

                    return {
                        ...page,
                        score
                    };

                })
                .filter(page => page.score > 0)
                .sort((a, b) => b.score - a.score);

        }


        /* NO RESULTS */

        if (matches.length === 0) {

            results.innerHTML = `
                <div class="header-search-empty">
                    <i class="fas fa-search" aria-hidden="true"></i>
                    <p>No matching pages found.</p>
                    <span>Try searching for repair, donation, delivery or support.</span>
                </div>
            `;

            return;

        }


        /* DISPLAY MATCHING PAGES */

        matches.slice(0, 7).forEach(page => {

            const link = document.createElement("a");

            link.className = "header-search-result";

            link.href = page.href;

            link.innerHTML = `
                <i class="fas ${page.icon}" aria-hidden="true"></i>

                <span></span>

                <i class="fas fa-arrow-right" aria-hidden="true"></i>
            `;

            link.querySelector("span").textContent = page.title;

            results.appendChild(link);

        });

    }


    /* =====================================
       5. OPEN SEARCH
    ===================================== */

    function openSearch() {

        panel.classList.add("active");

        toggle.setAttribute("aria-expanded", "true");

        showSuggestions(input.value);

        input.focus();

    }


    /* =====================================
       6. CLOSE SEARCH
    ===================================== */

    function closeSearch() {

        panel.classList.remove("active");

        toggle.setAttribute("aria-expanded", "false");

        input.value = "";

        showSuggestions();

    }


    /* =====================================
       7. SEARCH BUTTON
    ===================================== */

    toggle.addEventListener("click", () => {

        if (panel.classList.contains("active")) {

            closeSearch();

        } else {

            openSearch();

        }

    });


    /* =====================================
       8. CLOSE BUTTON
    ===================================== */

    close.addEventListener("click", closeSearch);


    /* =====================================
       9. LIVE SEARCH
    ===================================== */

    input.addEventListener("input", () => {

        showSuggestions(input.value);

    });


    /* =====================================
       10. KEYBOARD CONTROLS
    ===================================== */

    input.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            const firstResult = results.querySelector(
                ".header-search-result"
            );

            if (firstResult) {

                window.location.href = firstResult.href;

            }

        }

        if (event.key === "Escape") {

            closeSearch();

        }

    });


    /* =====================================
       11. CLOSE WHEN CLICKING OUTSIDE
    ===================================== */

    document.addEventListener("click", event => {

        if (!event.target.closest(".header-search-wrapper")) {

            closeSearch();

        }

    });


    /* =====================================
       12. INITIAL SUGGESTIONS
    ===================================== */

    showSuggestions();

})();

/*repair-shop.html*/

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* =========================================
       1. PAGE INITIALISATION
    ========================================= */

    const page = document.querySelector(".shop-page");

    if (!page) return;


    /* =========================================
       2. ELEMENT REFERENCES
    ========================================= */

    const searchForm = document.getElementById("shopSearchForm");

    const locationSelect = document.getElementById("shopLocation");
    const deviceSelect = document.getElementById("shopDevice");
    const problemSelect = document.getElementById("shopProblem");
    const budgetInput = document.getElementById("shopBudget");

    const deliveryCheckbox = document.getElementById("shopDelivery");

    const sortSelect = document.getElementById("shopSort");

    const categoryButtons = page.querySelectorAll(
        ".shop-category-option"
    );

    const resultFilterButtons = page.querySelectorAll(
        ".shop-filter-button"
    );

    const resultsContainer = document.getElementById("shopResults");
    const resultsSummary = document.getElementById("shopResultsSummary");

    const emptyState = document.getElementById("shopEmptyState");

    const resetButton = document.getElementById("resetShopFilters");
    const emptyResetButton = document.getElementById("shopEmptyReset");

    const detailsSection = document.getElementById("shopDetails");
    const detailContent = document.getElementById("shopDetailContent");

    const mapElement = document.getElementById("shopMap");

    const locationButton = document.getElementById("shopUseMyLocation");
    const locationStatus = document.getElementById("shopLocationStatus");


    /* =========================================
       3. DEVICE CATALOGUE
    ========================================= */

    const deviceOptions = {

        household: [
            { value: "refrigerator", label: "Refrigerator" },
            { value: "washing-machine", label: "Washing Machine" },
            { value: "television", label: "Television" },
            { value: "microwave", label: "Microwave" },
            { value: "rice-cooker", label: "Rice Cooker" },
            { value: "air-conditioner", label: "Air Conditioner" },
            { value: "fan", label: "Electric Fan" }
        ],

        personal: [
            { value: "smartphone", label: "Smartphone" },
            { value: "laptop", label: "Laptop" },
            { value: "tablet", label: "Tablet" },
            { value: "desktop", label: "Desktop Computer" },
            { value: "monitor", label: "Monitor" },
            { value: "printer", label: "Printer" }
        ]

    };


    /* =========================================
       4. PROBLEM LABELS
    ========================================= */

    const problemLabels = {

        power: "Power or Charging",
        screen: "Screen or Display",
        water: "Water Damage",
        performance: "Performance or Software",
        mechanical: "Mechanical Fault",
        other: "Other / Not Sure"

    };


    /* =========================================
       5. SHOP DATABASE

       All shops are fictional sample listings.

       LOW BUDGET:
       0–50,000 MMK

       MEDIUM BUDGET:
       50,001–100,000 MMK

       HIGH BUDGET:
       100,001–1,000,000 MMK
    ========================================= */

    const shops = [

        /* LOW BUDGET — SHOP 1 */

        {
            id: 1,

            name: "Home Appliance Care",

            category: "household",

            township: "Tamwe",

            address: "Sample Road, Tamwe Township, Yangon",

            devices: [
                "rice-cooker",
                "fan",
                "microwave"
            ],

            problems: [
                "power",
                "mechanical",
                "other"
            ],

            priceMin: 0,
            priceMax: 50000,

            collection: true,
            delivery: false,

            rating: 4.5,

            description:
                "A sample household appliance repair service for everyday electrical and mechanical problems.",

            latitude: 16.8065,
            longitude: 96.1875
        },


        /* LOW BUDGET — SHOP 2 */

        {
            id: 2,

            name: "Smart Device Service",

            category: "personal",

            township: "Sanchaung",

            address: "Sample Street, Sanchaung Township, Yangon",

            devices: [
                "smartphone",
                "laptop",
                "tablet"
            ],

            problems: [
                "screen",
                "power",
                "performance",
                "water"
            ],

            priceMin: 0,
            priceMax: 50000,

            collection: false,
            delivery: true,

            rating: 4.6,

            description:
                "A sample personal technology repair service for smartphones, laptops and tablets.",

            latitude: 16.8050,
            longitude: 96.1330
        },


        /* MEDIUM BUDGET — SHOP 3 */

        {
            id: 3,

            name: "Home Electronics Workshop",

            category: "household",

            township: "Bahan",

            address: "Sample Avenue, Bahan Township, Yangon",

            devices: [
                "refrigerator",
                "washing-machine",
                "television"
            ],

            problems: [
                "power",
                "water",
                "mechanical",
                "other"
            ],

            priceMin: 50001,
            priceMax: 100000,

            collection: true,
            delivery: true,

            rating: 4.7,

            description:
                "A sample appliance repair service for larger household electronics and common appliance faults.",

            latitude: 16.8110,
            longitude: 96.1590
        },


        /* MEDIUM BUDGET — SHOP 4 */

        {
            id: 4,

            name: "Computer & Mobile Care",

            category: "personal",

            township: "Kamayut",

            address: "Sample Road, Kamayut Township, Yangon",

            devices: [
                "smartphone",
                "laptop",
                "desktop",
                "monitor"
            ],

            problems: [
                "power",
                "screen",
                "performance",
                "other"
            ],

            priceMin: 50001,
            priceMax: 100000,

            collection: true,
            delivery: false,

            rating: 4.8,

            description:
                "A sample computer and mobile repair service for hardware, display and software problems.",

            latitude: 16.8270,
            longitude: 96.1335
        },


        /* HIGH BUDGET — SHOP 5 */

        {
            id: 5,

            name: "Advanced Appliance Solutions",

            category: "household",

            township: "Bahan",

            address: "Sample Street, Bahan Township, Yangon",

            devices: [
                "refrigerator",
                "washing-machine",
                "air-conditioner"
            ],

            problems: [
                "power",
                "water",
                "mechanical",
                "other"
            ],

            priceMin: 100001,
            priceMax: 1000000,

            collection: true,
            delivery: true,

            rating: 4.9,

            description:
                "A sample service for more complex household appliance repairs and electrical faults.",

            latitude: 16.8190,
            longitude: 96.1660
        },


        /* HIGH BUDGET — SHOP 6 */

        {
            id: 6,

            name: "Advanced Technology Repair",

            category: "personal",

            township: "Tamwe",

            address: "Sample Avenue, Tamwe Township, Yangon",

            devices: [
                "smartphone",
                "laptop",
                "desktop",
                "monitor",
                "printer"
            ],

            problems: [
                "power",
                "screen",
                "performance",
                "mechanical",
                "other"
            ],

            priceMin: 100001,
            priceMax: 1000000,

            collection: true,
            delivery: true,

            rating: 4.9,

            description:
                "A sample technology repair service for more complex computer and personal device issues.",

            latitude: 16.8000,
            longitude: 96.1950
        }

    ];


    /* =========================================
       6. APPLICATION STATE
    ========================================= */

    let activeCategory = "";

    let activeResultFilter = "all";

    let filteredShops = [...shops];

    let shopMap = null;

    let shopMarkers = [];

    let userLocationMarker = null;

    let detailMap = null;


    /* =========================================
       7. HELPER FUNCTIONS
    ========================================= */

    function escapeHTML(value) {

        return String(value).replace(/[&<>"']/g, function (character) {

            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return entities[character];

        });

    }


    function getCategoryName(category) {

        return category === "household"
            ? "Household Electronics"
            : "Personal Technology";

    }


    function getDeviceName(deviceId) {

        const allDevices = [
            ...deviceOptions.household,
            ...deviceOptions.personal
        ];

        const device = allDevices.find(function (item) {

            return item.value === deviceId;

        });

        return device ? device.label : deviceId;

    }


    function getBudgetLabel(shop) {

        if (shop.priceMax <= 50000) {
            return "0–50,000 MMK";
        }

        if (shop.priceMax <= 100000) {
            return "50,001–100,000 MMK";
        }

        return "100,001–1,000,000 MMK";

    }


    /* =========================================
       8. CATEGORY SELECTION
    ========================================= */

    function updateCategoryButtons() {

        categoryButtons.forEach(function (button) {

            const isActive =
                button.dataset.category === activeCategory;

            button.classList.toggle("active", isActive);

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        });

    }


    /* =========================================
       9. DEVICE DROPDOWN
    ========================================= */

    function updateDeviceOptions() {

        if (!deviceSelect) return;


        if (!activeCategory) {

            deviceSelect.innerHTML = `
                <option value="">Choose a category first</option>
            `;

            deviceSelect.disabled = true;

            return;

        }


        const availableDevices = deviceOptions[activeCategory] || [];

        const previousValue = deviceSelect.value;


        deviceSelect.innerHTML = `

            <option value="">Any Device</option>

            ${availableDevices.map(function (device) {

                return `
                    <option value="${escapeHTML(device.value)}">
                        ${escapeHTML(device.label)}
                    </option>
                `;

            }).join("")}

        `;


        deviceSelect.disabled = false;


        const previousValueExists = availableDevices.some(function (device) {

            return device.value === previousValue;

        });


        deviceSelect.value = previousValueExists
            ? previousValue
            : "";

    }


    categoryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const selectedCategory = button.dataset.category;

            if (
                selectedCategory !== "household" &&
                selectedCategory !== "personal"
            ) {
                return;
            }


            activeCategory = selectedCategory;

            updateCategoryButtons();

            updateDeviceOptions();

            renderShops();

        });

    });


    /* =========================================
       10. RESULT FILTER BUTTONS

       All Shops
       Phone Repair
       Laptop Repair
    ========================================= */

    function updateResultFilterButtons() {

        resultFilterButtons.forEach(function (button) {

            const isActive =
                button.dataset.shopFilter === activeResultFilter;

            button.classList.toggle("active", isActive);

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        });

    }


    resultFilterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const selectedFilter = button.dataset.shopFilter;

            if (
                !["all", "phone", "laptop"].includes(selectedFilter)
            ) {
                return;
            }


            activeResultFilter = selectedFilter;

            updateResultFilterButtons();

            renderShops();

        });

    });


    /* =========================================
       11. SEARCH FILTERING
    ========================================= */

    function getFilteredShops() {

        const selectedLocation = locationSelect
            ? locationSelect.value
            : "";

        const selectedDevice = deviceSelect
            ? deviceSelect.value
            : "";

        const selectedProblem = problemSelect
            ? problemSelect.value
            : "";

        const selectedBudget = budgetInput
            ? budgetInput.value.trim()
            : "";

        const selectedDelivery = deliveryCheckbox
            ? deliveryCheckbox.checked
            : false;


        let budget = null;


        if (selectedBudget !== "") {

            budget = Number(selectedBudget);

            if (
                !Number.isFinite(budget) ||
                budget < 0 ||
                budget > 1000000
            ) {
                return [];
            }

        }


        return shops.filter(function (shop) {


            /* CATEGORY FILTER */

            if (
                activeCategory &&
                shop.category !== activeCategory
            ) {
                return false;
            }


            /* PHONE / LAPTOP FILTER */

            if (activeResultFilter === "phone") {

                if (!shop.devices.includes("smartphone")) {
                    return false;
                }

            }


            if (activeResultFilter === "laptop") {

                if (!shop.devices.includes("laptop")) {
                    return false;
                }

            }


            /* TOWNSHIP FILTER */

            if (
                selectedLocation &&
                shop.township !== selectedLocation
            ) {
                return false;
            }


            /* DEVICE FILTER */

            if (
                selectedDevice &&
                !shop.devices.includes(selectedDevice)
            ) {
                return false;
            }


            /* PROBLEM FILTER */

            if (
                selectedProblem &&
                !shop.problems.includes(selectedProblem)
            ) {
                return false;
            }


            /* BUDGET FILTER */

            if (budget !== null) {

                if (
                    budget < shop.priceMin ||
                    budget > shop.priceMax
                ) {
                    return false;
                }

            }


            /* COLLECTION / DELIVERY FILTER */

            if (
                selectedDelivery &&
                !shop.collection &&
                !shop.delivery
            ) {
                return false;
            }


            return true;

        });

    }


    /* =========================================
       12. SORTING
    ========================================= */

    function sortShops(shopList) {

        const sortValue = sortSelect
            ? sortSelect.value
            : "recommended";

        const sortedShops = [...shopList];


        if (sortValue === "cost") {

            sortedShops.sort(function (a, b) {

                return a.priceMin - b.priceMin;

            });

        } else if (sortValue === "cost-high") {

            sortedShops.sort(function (a, b) {

                return b.priceMax - a.priceMax;

            });

        } else {

            sortedShops.sort(function (a, b) {

                return b.rating - a.rating;

            });

        }


        return sortedShops;

    }


    /* =========================================
       13. RENDER SHOP CARDS
    ========================================= */

    function renderShopCards(shopList) {

        if (!resultsContainer) return;


        resultsContainer.innerHTML = shopList.map(function (shop) {

            const supportedDevices = shop.devices.map(function (device) {

                return getDeviceName(device);

            });


            const services = [];

            if (shop.collection) {
                services.push("Collection Available");
            }

            if (shop.delivery) {
                services.push("Delivery Available");
            }


            return `

                <article class="shop-result-card">

                    <div class="shop-card-top">

                        <span class="shop-category-tag">
                            ${escapeHTML(getCategoryName(shop.category))}
                        </span>

                        <span class="shop-rating">
                            ★ ${escapeHTML(shop.rating)}
                        </span>

                    </div>


                    <div class="shop-card-content">

                        <h3>
                            ${escapeHTML(shop.name)}
                        </h3>


                        <p class="shop-card-location">

                            <i class="fas fa-location-dot"></i>

                            ${escapeHTML(shop.township)}, Yangon

                        </p>


                        <p class="shop-card-description">
                            ${escapeHTML(shop.description)}
                        </p>


                        <div class="shop-card-devices">

                            <strong>Supported Devices</strong>

                            <p>
                                ${supportedDevices.map(escapeHTML).join(", ")}
                            </p>

                        </div>


                        <div class="shop-card-services">

                            ${services.map(function (service) {

                                return `
                                    <span>${escapeHTML(service)}</span>
                                `;

                            }).join("")}

                        </div>


                        <button
                            type="button"
                            class="shop-view-details"
                            data-shop-id="${shop.id}">

                            View Shop Details

                            <i class="fas fa-arrow-right"></i>

                        </button>

                    </div>

                </article>

            `;

        }).join("");

    }


    /* =========================================
       14. RENDER SEARCH RESULTS
    ========================================= */

    function renderShops() {

        filteredShops = getFilteredShops();

        filteredShops = sortShops(filteredShops);


        /* RESULTS SUMMARY */

        if (resultsSummary) {

            resultsSummary.textContent =
                filteredShops.length +
                (filteredShops.length === 1
                    ? " Shop Found"
                    : " Shops Found");

        }


        /* EMPTY STATE */

        if (filteredShops.length === 0) {

            if (resultsContainer) {
                resultsContainer.innerHTML = "";
            }

            if (emptyState) {
                emptyState.hidden = false;
            }

        } else {

            if (emptyState) {
                emptyState.hidden = true;
            }

            renderShopCards(filteredShops);

        }


        /* UPDATE MAP */

        updateMapMarkers();

    }


    /* =========================================
       15. CLOSE SHOP DETAILS
    ========================================= */

    function closeShopDetails() {

        if (detailsSection) {
            detailsSection.hidden = true;
        }

        if (detailContent) {
            detailContent.hidden = true;
        }

        if (detailMap) {

            detailMap.remove();

            detailMap = null;

        }

    }


    /* =========================================
       16. SHOP DETAILS
    ========================================= */

    /* =========================================
   16. SHOP DETAILS
========================================= */

function showShopDetails(shopId) {

    const shop = shops.find(function (item) {

        return item.id === Number(shopId);

    });


    if (!shop || !detailContent || !detailsSection) return;


    /* DEVICE INFORMATION */

    const deviceNames = shop.devices.map(function (device) {

        return getDeviceName(device);

    });


    /* PROBLEM INFORMATION */

    const problemNames = shop.problems.map(function (problem) {

        return problemLabels[problem] || problem;

    });


    /* CUSTOMER FEEDBACK */

    const feedbackList = shopFeedback[shop.id] || [];

    const averageFeedback = feedbackList.length > 0
        ? (
            feedbackList.reduce(function (total, feedback) {
                return total + feedback.rating;
            }, 0) / feedbackList.length
        ).toFixed(1)
        : "0.0";


    /* STAR GENERATOR */

    function generateStars(rating) {

        return Array.from({ length: 5 }, function (_, index) {

            return `
                <i class="fas fa-star ${index < rating ? "active" : "inactive"}"></i>
            `;

        }).join("");

    }


    /* GOOGLE MAPS DIRECTIONS */

    const directionsURL =
        `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`;


    /* DETAIL CONTENT */

    detailContent.innerHTML = `

        <div class="shop-detail-layout">


            <!-- LEFT COLUMN -->

            <div class="shop-detail-left">


                <!-- SHOP HEADER -->

                <div class="shop-detail-header">

                    <div class="shop-detail-image">

                        <img
                            src="assets/images/repair-shop.jpg"
                            alt="Illustrative repair shop">

                    </div>


                    <div class="shop-detail-basic">

                        <div class="shop-detail-name">

                            <h2>
                                ${escapeHTML(shop.name)}
                            </h2>

                            <span class="shop-partner-badge">

                                <i class="fas fa-circle-info"></i>

                                Sample Listing

                            </span>

                        </div>


                        <p class="shop-detail-location">

                            <i class="fas fa-location-dot"></i>

                            ${escapeHTML(shop.township)}, Yangon

                        </p>


                        <div class="shop-supported-devices">

                            <span>Supported Devices</span>

                            <div class="shop-device-tags">

                                ${deviceNames.map(function (device) {

                                    return `
                                        <span>
                                            ${escapeHTML(device)}
                                        </span>
                                    `;

                                }).join("")}

                            </div>

                        </div>

                    </div>

                </div>


                <!-- ABOUT SHOP -->

                <div class="shop-detail-about">

                    <h3>About This Shop</h3>

                    <p>
                        ${escapeHTML(shop.description)}
                    </p>

                    <p>
                        This is an illustrative sample listing for the
                        re:power repair shop finder demonstration.
                    </p>

                </div>


                <!-- SHOP MAP -->

                <div class="shop-detail-map-section">

                    <h3>

                        <i class="fas fa-map-marked-alt"></i>

                        Shop Location

                    </h3>

                    <div id="shopDetailMap"></div>

                </div>


                <!-- CUSTOMER FEEDBACK -->

                <section class="shop-feedback-section">

                    <div class="shop-feedback-heading">

                        <div>

                            <span class="shop-feedback-eyebrow">
                                CUSTOMER EXPERIENCES
                            </span>

                            <h3>Customer Feedback</h3>

                            <p>
                                Read sample feedback about this repair shop's
                                service experience.
                            </p>

                        </div>


                        <div class="shop-feedback-summary">

                            <strong>${averageFeedback}</strong>

                            <div class="shop-feedback-summary-stars">

                                ${generateStars(Number(averageFeedback))}

                            </div>

                            <span>
                                Sample average rating
                            </span>

                        </div>

                    </div>


                    <!-- FEEDBACK LIST -->

                    <div class="shop-feedback-list">

                        ${feedbackList.map(function (feedback) {

                            return `

                                <article class="shop-feedback-card">

                                    <div class="shop-feedback-card-top">

                                        <div class="shop-feedback-customer">

                                            <div class="shop-feedback-avatar">

                                                <i class="fas fa-user"></i>

                                            </div>

                                            <div>

                                                <strong>
                                                    ${escapeHTML(feedback.name)}
                                                </strong>

                                                <span>
                                                    ${escapeHTML(feedback.date)}
                                                </span>

                                            </div>

                                        </div>


                                        <div class="shop-feedback-stars">

                                            ${generateStars(feedback.rating)}

                                        </div>

                                    </div>


                                    <p class="shop-feedback-comment">

                                        ${escapeHTML(feedback.comment)}

                                    </p>

                                </article>

                            `;

                        }).join("")}

                    </div>


                    <p class="shop-feedback-notice">

                        <i class="fas fa-circle-info"></i>

                        These reviews are illustrative examples for the
                        website prototype, not verified customer testimonials.

                    </p>

                </section>


            </div>


            <!-- VERTICAL DIVIDER -->

            <div class="shop-detail-divider"></div>


            <!-- RIGHT COLUMN -->

            <div class="shop-detail-right">


                <!-- SUPPORTED PROBLEMS -->

                <div class="shop-info-group">

                    <h3>

                        <i class="fas fa-screwdriver-wrench"></i>

                        Supported Problems

                    </h3>

                    <ul>

                        ${problemNames.map(function (problem) {

                            return `
                                <li>${escapeHTML(problem)}</li>
                            `;

                        }).join("")}

                    </ul>

                </div>


                <!-- ADDRESS -->

                <div class="shop-info-group">

                    <h3>

                        <i class="fas fa-location-dot"></i>

                        Address

                    </h3>

                    <p>
                        ${escapeHTML(shop.address)}
                    </p>

                </div>


                <!-- COLLECTION AND DELIVERY -->

                <div class="shop-info-group">

                    <h3>

                        <i class="fas fa-hand-holding"></i>

                        Collection & Delivery

                    </h3>

                    <ul>

                        <li>
                            Collection:
                            ${shop.collection ? "Available" : "Not Available"}
                        </li>

                        <li>
                            Delivery:
                            ${shop.delivery ? "Available" : "Not Available"}
                        </li>

                    </ul>

                </div>


                <!-- SAMPLE RATING -->

                <div class="shop-info-group">

                    <h3>

                        <i class="fas fa-star"></i>

                        Sample Rating

                    </h3>

                    <p>
                        ★ ${escapeHTML(String(shop.rating))} / 5
                    </p>

                    <p>
                        Illustrative listing rating.
                    </p>

                </div>


                <!-- PRICE INFORMATION -->

                <div class="shop-info-group">

                    <h3>

                        <i class="fas fa-money-bill-wave"></i>

                        Price Information

                    </h3>

                    <p>
                        This shop belongs to the
                        ${escapeHTML(getBudgetLabel(shop))}
                        sample budget group.
                    </p>

                    <p>
                        The final repair cost depends on the device,
                        parts required and damage condition. Contact
                        a repair provider for an actual quotation.
                    </p>

                </div>


                <!-- PROTOTYPE NOTICE -->

                <div class="shop-last-checked">

                    <i class="fas fa-circle-info"></i>

                    Illustrative prototype information

                </div>


                <!-- DIRECTIONS BUTTON -->

                <a
                    href="${directionsURL}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="shop-primary-button">

                    <i class="fas fa-diamond-turn-right"></i>

                    Get Directions

                </a>


                <!-- CLOSE BUTTON -->

                <button
                    type="button"
                    class="shop-detail-close"
                    id="closeShopDetails">

                    Close Shop Details

                </button>


            </div>

        </div>

    `;


    /* IMAGE FALLBACK */

    const shopImage = detailContent.querySelector(
        ".shop-detail-image img"
    );

    if (shopImage) {

        shopImage.addEventListener("error", function () {

            this.style.display = "none";

        });

    }


    /* SHOW DETAIL CONTENT */

    detailContent.hidden = false;

    detailsSection.hidden = false;


    /* SCROLL TO DETAILS */

    detailsSection.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });


    /* INITIALISE DETAIL MAP */

    initialiseDetailMap(shop);

}/* =========================================
   SAMPLE CUSTOMER FEEDBACK
   4–6 REVIEWS FOR EACH SHOP
========================================= */

const shopFeedback = {

    // SHOP 1 — HOME APPLIANCE CARE
    1: [
        {
            name: "Aung Kyaw Min",
            rating: 5,
            date: "20 October 2026",
            comment: "The staff were friendly and explained the appliance problem clearly. I appreciated their helpful service."
        },
        {
            name: "Thandar Hlaing",
            rating: 4,
            date: "23 October 2026",
            comment: "The technician checked the appliance carefully and provided useful repair advice."
        },
        {
            name: "Min Zaw Oo",
            rating: 5,
            date: "28 October 2026",
            comment: "Good communication and professional customer support. The overall experience was pleasant."
        },
        {
            name: "Su Myat Noe",
            rating: 4,
            date: "1 November 2026",
            comment: "The staff were polite and helped me understand the possible repair options."
        }
    ],


    // SHOP 2 — SMART DEVICE SERVICE
    2: [
        {
            name: "Ei Ei Phyo",
            rating: 4,
            date: "18 October 2026",
            comment: "The staff were helpful and provided useful information about my phone problem."
        },
        {
            name: "Kyaw Zin Htet",
            rating: 5,
            date: "24 October 2026",
            comment: "The service was organised and the repair options were explained clearly."
        },
        {
            name: "May Thiri Aung",
            rating: 4,
            date: "30 October 2026",
            comment: "A positive experience overall. I appreciated the friendly communication."
        },
        {
            name: "Htet Naing Lin",
            rating: 5,
            date: "2 November 2026",
            comment: "The technician was helpful and answered my questions about the device issue."
        },
        {
            name: "Nandar Win",
            rating: 4,
            date: "3 November 2026",
            comment: "Good customer support and clear explanations about the available services."
        }
    ],


    // SHOP 3 — HOME ELECTRONICS WORKSHOP
    3: [
        {
            name: "Aye Chan Mon",
            rating: 5,
            date: "16 October 2026",
            comment: "The technician provided a clear explanation of the appliance issue and possible solutions."
        },
        {
            name: "Thant Zin",
            rating: 4,
            date: "22 October 2026",
            comment: "Good customer service. The staff answered my questions and explained the available options."
        },
        {
            name: "Khin Wint Wah",
            rating: 5,
            date: "29 October 2026",
            comment: "The overall experience was convenient and the staff were welcoming."
        },
        {
            name: "Ye Yint Aung",
            rating: 4,
            date: "1 November 2026",
            comment: "The staff were helpful and provided practical advice about appliance maintenance."
        },
        {
            name: "Phyu Sin Htet",
            rating: 5,
            date: "3 November 2026",
            comment: "Friendly communication and useful information about the repair process."
        },
        {
            name: "Ko Ko Lwin",
            rating: 4,
            date: "4 November 2026",
            comment: "A helpful experience. The technician explained the appliance problem in simple terms."
        }
    ],


    // SHOP 4 — COMPUTER & MOBILE CARE
    4: [
        {
            name: "Nay Lin Tun",
            rating: 4,
            date: "19 October 2026",
            comment: "The shop provided useful advice and helped me understand what my laptop needed."
        },
        {
            name: "Moe Thuzar",
            rating: 5,
            date: "25 October 2026",
            comment: "Friendly staff and clear communication throughout the service."
        },
        {
            name: "Htet Htet Aung",
            rating: 4,
            date: "31 October 2026",
            comment: "A helpful experience. I received clear information before deciding on the repair."
        },
        {
            name: "Zaw Min Khant",
            rating: 5,
            date: "2 November 2026",
            comment: "The staff were professional and explained the computer repair options clearly."
        }
    ],


    // SHOP 5 — ADVANCED APPLIANCE SOLUTIONS
    5: [
        {
            name: "Chaw Su Mon",
            rating: 5,
            date: "17 October 2026",
            comment: "The staff were patient and explained the possible repair solutions in a simple way."
        },
        {
            name: "Aung Myo Thu",
            rating: 4,
            date: "26 October 2026",
            comment: "Good communication and helpful support. The service information was easy to understand."
        },
        {
            name: "Thet Thet Hnin",
            rating: 5,
            date: "1 November 2026",
            comment: "I appreciated the attention given to my appliance and the helpful customer support."
        },
        {
            name: "Pyae Phyo Aung",
            rating: 4,
            date: "2 November 2026",
            comment: "The technician provided useful information about the appliance and its possible repair needs."
        },
        {
            name: "Hnin Pwint",
            rating: 5,
            date: "4 November 2026",
            comment: "A pleasant experience with clear explanations and friendly communication."
        }
    ],


    // SHOP 6 — ADVANCED TECHNOLOGY REPAIR
    6: [
        {
            name: "Kaung Myat",
            rating: 4,
            date: "21 October 2026",
            comment: "The team were helpful and provided useful information about the computer repair process."
        },
        {
            name: "Yoon Waddy",
            rating: 5,
            date: "27 October 2026",
            comment: "Friendly customer support and clear explanations. Overall, a pleasant experience."
        },
        {
            name: "Thura Aung",
            rating: 4,
            date: "2 November 2026",
            comment: "The staff responded to my questions and helped me understand the device issue."
        },
        {
            name: "Su Hlaing",
            rating: 5,
            date: "3 November 2026",
            comment: "The service information was easy to understand and the staff were welcoming."
        },
        {
            name: "Min Thant Kyaw",
            rating: 4,
            date: "4 November 2026",
            comment: "A good sample service experience with helpful communication and repair advice."
        },
        {
            name: "Nwe Nwe Aye",
            rating: 5,
            date: "4 November 2026",
            comment: "The team provided clear information and made the repair process easy to understand."
        }
    ]

};

    /* =========================================
       17. VIEW DETAILS BUTTON
    ========================================= */

    if (resultsContainer) {

    resultsContainer.addEventListener("click", function (event) {

        const button = event.target.closest(".shop-view-details");

        if (!button) return;

        showShopDetails(button.dataset.shopId);

        });

    }


    /* =========================================
       18. CLOSE DETAILS BUTTON
    ========================================= */

    if (detailContent) {

        detailContent.addEventListener("click", function (event) {

            const closeButton = event.target.closest(
                "#closeShopDetails"
            );

            if (!closeButton) return;

            closeShopDetails();

        });

    }


    /* =========================================
       19. SEARCH FORM SUBMISSION
    ========================================= */

    if (searchForm) {

        searchForm.addEventListener("submit", function (event) {

            event.preventDefault();

            closeShopDetails();

            renderShops();


            document.querySelector(".shop-results-section")
                ?.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

        });

    }


    /* =========================================
       20. SORTING
    ========================================= */

    if (sortSelect) {

        sortSelect.addEventListener("change", function () {

            renderShops();

        });

    }


    /* =========================================
       21. RESET FILTERS
    ========================================= */

    function resetFilters() {

        if (searchForm) {
            searchForm.reset();
        }


        activeCategory = "";

        activeResultFilter = "all";


        updateCategoryButtons();

        updateResultFilterButtons();

        updateDeviceOptions();

        closeShopDetails();


        if (locationStatus) {

            locationStatus.textContent =
                "Allow location access to find repair shops near you.";

        }


        renderShops();

    }


    if (resetButton) {

        resetButton.addEventListener("click", resetFilters);

    }


    if (emptyResetButton) {

        emptyResetButton.addEventListener("click", resetFilters);

    }


    /* =========================================
       22. INITIALISE MAIN LEAFLET MAP
    ========================================= */

    function initialiseMap() {

        if (!mapElement) return;


        if (typeof L === "undefined") {

            mapElement.innerHTML = `

                <p class="shop-map-error">

                    Map is currently unavailable.
                    Please check your Leaflet library connection.

                </p>

            `;

            return;

        }


        shopMap = L.map(mapElement).setView(

            [16.8100, 96.1550],

            12

        );


        L.tileLayer(

            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

            {
                attribution: "&copy; OpenStreetMap contributors"
            }

        ).addTo(shopMap);


        updateMapMarkers();

    }


    /* =========================================
       23. UPDATE MAIN MAP MARKERS
    ========================================= */

    function updateMapMarkers() {

        if (!shopMap || typeof L === "undefined") return;


        /* REMOVE OLD SHOP MARKERS */

        shopMarkers.forEach(function (marker) {

            shopMap.removeLayer(marker);

        });

        shopMarkers = [];


        /* ADD FILTERED SHOP MARKERS */

        filteredShops.forEach(function (shop) {

            const marker = L.marker([

                shop.latitude,

                shop.longitude

            ]).addTo(shopMap);


            marker.bindPopup(`

                <div class="shop-map-popup">

                    <strong>
                        ${escapeHTML(shop.name)}
                    </strong>

                    <p>
                        ${escapeHTML(shop.township)}, Yangon
                    </p>

                    <small>
                        Sample repair shop
                    </small>

                </div>

            `);


            shopMarkers.push(marker);

        });


        /* FIT MAP TO MARKERS */

        if (shopMarkers.length > 0) {

            const markerGroup = L.featureGroup(shopMarkers);

            shopMap.fitBounds(

                markerGroup.getBounds(),

                {

                    padding: [30, 30],

                    maxZoom: 14

                }

            );

        } else {

            shopMap.setView(

                [16.8100, 96.1550],

                12

            );

        }

    }


    /* =========================================
       24. INITIALISE DETAIL MAP
    ========================================= */

    function initialiseDetailMap(shop) {

        const detailMapElement =
            document.getElementById("shopDetailMap");


        if (!detailMapElement || typeof L === "undefined") return;


        /* REMOVE PREVIOUS DETAIL MAP */

        if (detailMap) {

            detailMap.remove();

            detailMap = null;

        }


        /* CREATE NEW DETAIL MAP */

        detailMap = L.map(detailMapElement).setView(

            [shop.latitude, shop.longitude],

            15

        );


        L.tileLayer(

            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

            {

                attribution: "&copy; OpenStreetMap contributors"

            }

        ).addTo(detailMap);


        /* SHOP MARKER */

        L.marker([

            shop.latitude,

            shop.longitude

        ])

            .addTo(detailMap)

            .bindPopup(escapeHTML(shop.name))

            .openPopup();


        /* FIX MAP DISPLAY SIZE */

        setTimeout(function () {

            if (detailMap) {

                detailMap.invalidateSize();

            }

        }, 200);

    }


    /* =========================================
       25. USER CURRENT LOCATION
    ========================================= */

    if (locationButton) {

        locationButton.addEventListener("click", function () {


            if (!navigator.geolocation) {

                if (locationStatus) {

                    locationStatus.textContent =
                        "Your browser does not support location services.";

                }

                return;

            }


            if (locationStatus) {

                locationStatus.textContent =
                    "Getting your current location...";

            }


            navigator.geolocation.getCurrentPosition(

                function (position) {

                    const latitude = position.coords.latitude;

                    const longitude = position.coords.longitude;


                    if (!shopMap || typeof L === "undefined") {

                        if (locationStatus) {

                            locationStatus.textContent =
                                "Your location was found, but the map is unavailable.";

                        }

                        return;

                    }


                    /* CENTRE MAP */

                    shopMap.setView(

                        [latitude, longitude],

                        14

                    );


                    /* REMOVE PREVIOUS USER MARKER */

                    if (userLocationMarker) {

                        shopMap.removeLayer(userLocationMarker);

                    }


                    /* ADD USER MARKER */

                    userLocationMarker = L.marker([

                        latitude,

                        longitude

                    ]).addTo(shopMap);


                    userLocationMarker

                        .bindPopup("Your Current Location")

                        .openPopup();


                    if (locationStatus) {

                        locationStatus.textContent =
                            "Map centred on your current location.";

                    }

                },


                function () {

                    if (locationStatus) {

                        locationStatus.textContent =
                            "Unable to access your location. Please check your browser permissions.";

                    }

                },


                {

                    enableHighAccuracy: true,

                    timeout: 10000

                }

            );

        });

    }


    /* =========================================
       26. INITIAL PAGE SETUP
    ========================================= */

    activeCategory = "";

    activeResultFilter = "all";


    updateCategoryButtons();

    updateResultFilterButtons();

    updateDeviceOptions();


    /* BUDGET INPUT SETTINGS */

    if (budgetInput) {

        budgetInput.min = "0";

        budgetInput.max = "1000000";

        budgetInput.step = "1000";

        budgetInput.placeholder =
            "Enter budget (0–1,000,000 MMK)";

    }


    /* HIDE DETAILS INITIALLY */

    if (detailsSection) {
        detailsSection.hidden = true;
    }

    if (detailContent) {
        detailContent.hidden = true;
    }


    /* INITIALISE MAP */

    initialiseMap();


    /* DISPLAY INITIAL RESULTS */

    renderShops();


});



/* weather-device-care.html */
/* =========================================
   PAGE 4 — WEATHER & DEVICE CARE
========================================= */

(() => {

    "use strict";


    /* =========================================
       PAGE INITIALISATION
    ========================================= */

    const page = document.querySelector(".weather-care-page");

    if (!page) return;


    /* =========================================
       ELEMENT REFERENCES
    ========================================= */

    const filterButtons = page.querySelectorAll(
        ".weather-filter-btn"
    );

    const guideCards = page.querySelectorAll(
        ".weather-guide-card"
    );

    const guideDetails = page.querySelectorAll(
        ".weather-guide-detail"
    );

    const readButtons = page.querySelectorAll(
        "[data-open-guide]"
    );

    const closeButtons = page.querySelectorAll(
        "[data-close-guide]"
    );

    const emptyMessage = page.querySelector(
        "#weatherFilterEmpty"
    );


    /* =========================================
       STATE
    ========================================= */

    let activeGuide = null;


    /* =========================================
       GET GUIDE DETAIL
    ========================================= */

    function getGuideDetail(guideName) {

        return Array.from(guideDetails).find(detail => {

            return detail.dataset.detail === guideName;

        });

    }


    /* =========================================
       GET GUIDE BUTTON
    ========================================= */

    function getGuideButton(guideName) {

        return Array.from(readButtons).find(button => {

            return button.dataset.openGuide === guideName;

        });

    }


    /* =========================================
       GET GUIDE CARD
    ========================================= */

    function getGuideCard(guideName) {

        const button = getGuideButton(guideName);

        return button
            ? button.closest(".weather-guide-card")
            : null;

    }


    /* =========================================
       UPDATE BUTTON APPEARANCE
    ========================================= */

    function updateGuideButton(button, isOpen) {

        if (!button) return;

        button.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        const icon = button.querySelector("i");

        if (icon) {

            icon.classList.remove(
                "fa-arrow-right",
                "fa-arrow-down"
            );

            icon.classList.add(
                isOpen ? "fa-arrow-down" : "fa-arrow-right"
            );

        }

        const label = button.querySelector(
            ".weather-button-text"
        );

        if (label) {

            label.textContent = isOpen
                ? "Close Guide"
                : "Read Guide";

        } else {

            button.childNodes.forEach(node => {

                if (node.nodeType === Node.TEXT_NODE) {

                    node.textContent = isOpen
                        ? "Close Guide "
                        : "Read Guide ";

                }

            });

        }

    }


    /* =========================================
       CLOSE ALL GUIDES
    ========================================= */

    function closeAllGuides() {

        guideDetails.forEach(detail => {

            detail.hidden = true;

        });

        readButtons.forEach(button => {

            updateGuideButton(button, false);

        });

        activeGuide = null;

    }


    /* =========================================
       OPEN SELECTED GUIDE
    ========================================= */

    function openGuide(guideName) {

        const selectedDetail = getGuideDetail(guideName);

        const selectedButton = getGuideButton(guideName);

        const selectedCard = getGuideCard(guideName);


        // Check that the selected guide exists.

        if (
            !selectedDetail ||
            !selectedButton ||
            !selectedCard ||
            selectedCard.hidden
        ) {

            return;

        }


        // Clicking the currently open guide closes it.

        if (activeGuide === guideName) {

            closeAllGuides();

            return;

        }


        // Close previously opened guides.

        closeAllGuides();


        // Open the selected guide.

        selectedDetail.hidden = false;

        updateGuideButton(selectedButton, true);

        activeGuide = guideName;


        // Scroll to the selected guide.

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        window.requestAnimationFrame(() => {

            selectedDetail.scrollIntoView({

                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth",

                block: "start"

            });

        });

    }


    /* =========================================
       READ GUIDE BUTTON EVENTS
    ========================================= */

    readButtons.forEach(button => {

        button.addEventListener("click", () => {

            const guideName = button.dataset.openGuide;

            if (!guideName) return;

            openGuide(guideName);

        });

    });


    /* =========================================
       CLOSE GUIDE BUTTON EVENTS
    ========================================= */

    closeButtons.forEach(button => {

        button.addEventListener("click", () => {

            closeAllGuides();

        });

    });


    /* =========================================
       DEVICE FILTERING
    ========================================= */

    function filterGuides(device) {

        let visibleCount = 0;


        // Update active filter button.

        filterButtons.forEach(button => {

            const isActive = button.dataset.device === device;

            button.classList.toggle("active", isActive);

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        });


        // Filter guide cards.

        guideCards.forEach(card => {

            const supportedDevices = (
                card.dataset.devices || ""
            )
                .trim()
                .split(/\s+/)
                .filter(Boolean);

            const matches =
                device === "all" ||
                supportedDevices.includes(device);

            card.hidden = !matches;

            if (matches) {

                visibleCount++;

            }

        });


        // Show or hide empty message.

        if (emptyMessage) {

            emptyMessage.hidden = visibleCount > 0;

        }


        // Close the guide if its card is filtered out.

        if (activeGuide) {

            const activeCard = getGuideCard(activeGuide);

            if (!activeCard || activeCard.hidden) {

                closeAllGuides();

            }

        }

    }


    /* =========================================
       FILTER BUTTON EVENTS
    ========================================= */

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedDevice = button.dataset.device;

            if (!selectedDevice) return;

            filterGuides(selectedDevice);

        });

    });


    /* =========================================
       ESCAPE KEY
    ========================================= */

    page.addEventListener("keydown", event => {

        if (event.key === "Escape" && activeGuide) {

            // Save the button before closing the guide.

            const previousButton = getGuideButton(activeGuide);

            closeAllGuides();

            if (previousButton) {

                previousButton.focus();

            }

        }

    });


    /* =========================================
       PDF DOWNLOAD LINKS
    ========================================= */

    const downloadLinks = page.querySelectorAll(
        ".weather-download-btn, .weather-detail-download-btn"
    );

    downloadLinks.forEach(link => {

        const destination = link.getAttribute("href");

        if (
            !destination ||
            destination.trim() === "" ||
            destination === "#"
        ) {

            link.setAttribute("aria-disabled", "true");

            link.addEventListener("click", event => {

                event.preventDefault();

            });

        }

    });


    /* =========================================
       REPAIR SUPPORT LINKS
    ========================================= */

    const repairLinks = page.querySelectorAll(
        'a[href="repair-shops.html"]'
    );

    repairLinks.forEach(link => {

        if (!link.hasAttribute("aria-label")) {

            link.setAttribute(
                "aria-label",
                "Find a repair shop on re:power"
            );

        }

    });


    /* =========================================
       INITIALISE GUIDE BUTTONS
    ========================================= */

    readButtons.forEach(button => {

        button.setAttribute(
            "aria-expanded",
            "false"
        );

        const label = button.querySelector(
            ".weather-button-text"
        );

        if (label && !label.textContent.trim()) {

            label.textContent = "Read Guide";

        }

    });


    /* =========================================
       INITIAL PAGE STATE
    ========================================= */

    closeAllGuides();

    filterGuides("all");


})();

/* partnerships.html */

document.addEventListener("DOMContentLoaded", function () {

/* GET FORM ELEMENTS */

    const partnershipForm = document.getElementById("partnershipEnquiryForm");

    // Stop if this is not the Business Partnerships page.
    if (!partnershipForm) return;

    const partnerType = document.getElementById("partnerType");
    const servicesGroup = document.getElementById("partnerServicesGroup");
    const servicesInput = document.getElementById("partnerServices");
    const consentCheckbox = document.getElementById("partnerConsent");
    const consentError = document.getElementById("partnerConsentError");
    const successMessage = document.getElementById("partnershipFormSuccess");

    const enquiryButtons = document.querySelectorAll("[data-enquiry-type]");


/* CHECK REQUIRED ELEMENTS */

    if (
        !partnerType ||
        !servicesGroup ||
        !servicesInput ||
        !consentCheckbox ||
        !consentError ||
        !successMessage
    ) {
        console.error("Partnership form elements are missing.");
        return;
    }


/* UPDATE PARTNERSHIP FORM */

    function updatePartnershipForm() {

        const selectedType = partnerType.value;
        const servicesLabel = servicesGroup.querySelector("label");

        const partnershipOptions = {

            repair: {
                placeholder:
                    "e.g. Mobile phones, laptops, screen replacement, diagnostics",

                label:
                    "Supported Devices / Repair Services *"
            },

            delivery: {
                placeholder:
                    "e.g. Device collection, return delivery, service areas",

                label:
                    "Delivery Services / Coverage *"
            },

            sponsor: {
                placeholder:
                    "e.g. Repair awareness, educational campaigns, reuse initiatives",

                label:
                    "Campaign / Sponsorship Interests *"
            }

        };

        const selectedOption = partnershipOptions[selectedType] || {
            placeholder:
                "e.g. Mobile phones, laptops, screen replacement",

            label:
                "Supported Devices / Services *"
        };

        servicesInput.placeholder = selectedOption.placeholder;

        if (servicesLabel) {
            servicesLabel.textContent = selectedOption.label;
        }

        clearFieldError(partnerType);
    }


    partnerType.addEventListener("change", updatePartnershipForm);


/* PARTNERSHIP TYPE BUTTONS */

    enquiryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const selectedType = button.dataset.enquiryType;

            if (!["repair", "delivery", "sponsor"].includes(selectedType)) {
                return;
            }

            partnerType.value = selectedType;

            updatePartnershipForm();

        });

    });


/* SHOW FIELD ERROR */

    function showFieldError(field, message) {

        const formGroup = field.closest(".partnership-form-group");

        if (!formGroup) return;

        formGroup.classList.add("is-invalid");

        const errorElement = formGroup.querySelector(
            ".partnership-field-error"
        );

        if (errorElement) {
            errorElement.textContent = message;
        }

        field.setAttribute("aria-invalid", "true");

    }


/* CLEAR FIELD ERROR */

    function clearFieldError(field) {

        const formGroup = field.closest(".partnership-form-group");

        if (!formGroup) return;

        formGroup.classList.remove("is-invalid");

        const errorElement = formGroup.querySelector(
            ".partnership-field-error"
        );

        if (errorElement) {
            errorElement.textContent = "";
        }

        field.removeAttribute("aria-invalid");

    }


/* VALIDATE EMAIL ADDRESS */

    function isValidEmail(email) {

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailPattern.test(email);

    }


/* VALIDATE PARTNERSHIP FORM */

    function validatePartnershipForm() {

        let isValid = true;

        const requiredFields = partnershipForm.querySelectorAll(
            "input[required], select[required], textarea[required]"
        );


        requiredFields.forEach(function (field) {

            // Clear previous validation messages.
            clearFieldError(field);

            // Consent is checked separately.
            if (field.type === "checkbox") {
                return;
            }

            const fieldValue = field.value.trim();


            // Check empty required fields.
            if (!fieldValue) {

                showFieldError(
                    field,
                    "This field is required."
                );

                isValid = false;

                return;
            }


            // Check email format.
            if (field.type === "email" && !isValidEmail(fieldValue)) {

                showFieldError(
                    field,
                    "Please enter a valid email address."
                );

                isValid = false;

            }

        });


        // Validate consent checkbox.
        if (!consentCheckbox.checked) {

            consentError.textContent =
                "Please confirm that the information provided is accurate.";

            consentCheckbox.setAttribute("aria-invalid", "true");

            isValid = false;

        } else {

            consentError.textContent = "";

            consentCheckbox.removeAttribute("aria-invalid");

        }


        return isValid;

    }


/* CLEAR ERRORS WHEN USERS EDIT FIELDS */

    const formFields = partnershipForm.querySelectorAll(
        "input, select, textarea"
    );


    formFields.forEach(function (field) {

        field.addEventListener("input", function () {

            if (field.type !== "checkbox") {
                clearFieldError(field);
            }

            successMessage.hidden = true;

        });


        field.addEventListener("change", function () {

            if (field.type !== "checkbox") {
                clearFieldError(field);
            }

            successMessage.hidden = true;

        });

    });


    // Clear consent error when checkbox is selected.
    consentCheckbox.addEventListener("change", function () {

        consentError.textContent = "";

        consentCheckbox.removeAttribute("aria-invalid");

        successMessage.hidden = true;

    });


/* FORM SUBMISSION */

    partnershipForm.addEventListener("submit", function (event) {

        event.preventDefault();

        // Hide previous success message.
        successMessage.hidden = true;


        // Stop submission if validation fails.
        if (!validatePartnershipForm()) {

            const firstInvalidField = partnershipForm.querySelector(
                '[aria-invalid="true"]'
            );

            if (firstInvalidField) {

                firstInvalidField.focus();

            }

            return;

        }


/* SHOW SUCCESS MESSAGE */

        successMessage.hidden = false;

        successMessage.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });


/* RESET FORM */

        partnershipForm.reset();

        updatePartnershipForm();

    });


/* READ URL PARAMETERS */

    const pageParams = new URLSearchParams(window.location.search);

    const requestedType = pageParams.get("type");

    const validPartnershipTypes = [
        "repair",
        "delivery",
        "sponsor"
    ];


    if (validPartnershipTypes.includes(requestedType)) {

        partnerType.value = requestedType;

    }


/* INITIALISE FORM */

    updatePartnershipForm();

});

/* community.html */
/* =========================================
   PAGE 6: COMMUNITY & DONATIONS
   ========================================= */

/*
 * Prototype event data.
 *
 * Replace the sample information and registration URLs with
 * details confirmed by the event organiser.
 *
 * status values:
 * "upcoming" = registration or attendance is currently available
 * "completed" = the event has finished
 * "closed" = registration is closed
 */

const communityEvents = [
    {
        id: "event-001",
        title: "Community Device-Care Workshop",
        organiser: "Sample Community Organiser",
        date: "2026-12-12",
        location: "Yangon, Myanmar",
        description:
            "A proposed awareness session covering everyday device care, " +
            "battery safety, responsible use and when to seek professional repair.",
        activity:
            "Attend an awareness session and help participants learn " +
            "basic, safe device-care practices.",
        eligibility:
            "Open to interested community members. Confirm age requirements " +
            "and accessibility arrangements with the organiser.",
        status: "upcoming",
        image: "assets/images/community-workshop.webp",
        imageAlt: "Placeholder image for a community device-care workshop",

        /*
         * Replace with the actual organiser-managed Google Form URL.
         * Keep the empty value until a real registration form is available.
         */
        registrationURL: ""
    },

    {
        id: "event-002",
        title: "Responsible Electronics Reuse Campaign",
        organiser: "Sample Reuse Initiative",
        date: "2026-10-10",
        location: "Yangon, Myanmar",
        description:
            "A sample completed activity entry. Replace this description " +
            "with an accurate summary of a real campaign and its outcomes.",
        activity:
            "Share information about responsible device reuse and " +
            "appropriate electronic-waste handling.",
        eligibility: "Sample completed event record.",
        status: "completed",
        image: "assets/images/community-reuse.webp",
        imageAlt: "Placeholder image for an electronics reuse campaign",
        registrationURL: ""
    },

    {
        id: "event-003",
        title: "Repair Awareness Volunteer Session",
        organiser: "Sample Volunteer Group",
        date: "2026-11-15",
        location: "Yangon, Myanmar",
        description:
            "A prototype event with closed registration. Replace the details " +
            "with verified information supplied by the organiser.",
        activity:
            "Support event preparation and share information about " +
            "repair options and responsible device use.",
        eligibility:
            "Contact the organiser to confirm requirements for future sessions.",
        status: "closed",
        image: "assets/images/community-volunteers.webp",
        imageAlt: "Placeholder image for a volunteer activity",
        registrationURL: ""
    }
];


document.addEventListener("DOMContentLoaded", function () {

    const eventGrid = document.getElementById("community-event-grid");
    const emptyState = document.getElementById("community-empty-state");
    const filterButtons = document.querySelectorAll("[data-event-filter]");

    const eventDetailsSection = document.getElementById("event-details");
    const eventDetailsContent = document.getElementById("event-details-content");


    /* ---------- HELPERS ---------- */

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return entities[character];
        });
    }


    function formatEventDate(dateString) {
        if (!dateString) {
            return "Date to be confirmed";
        }

        const date = new Date(dateString + "T12:00:00");

        if (Number.isNaN(date.getTime())) {
            return "Date to be confirmed";
        }

        return new Intl.DateTimeFormat("en", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(date);
    }


    function getStatusLabel(status) {
        const labels = {
            upcoming: "Upcoming",
            completed: "Completed",
            closed: "Registration Closed"
        };

        return labels[status] || "Status to be confirmed";
    }


    function getEventImage(event) {
        /*
         * Use a local compressed image when available.
         * The fallback prevents broken image icons if a placeholder
         * file has not yet been added to the project.
         */
        const imagePath = event.image
            ? escapeHTML(event.image)
            : "";

        if (!imagePath) {
            return `
                <div class="event-image-placeholder" aria-hidden="true">
                    <i class="fa-solid fa-people-group"></i>
                </div>
            `;
        }

        return `
            <img
                class="community-event-image"
                src="${imagePath}"
                alt="${escapeHTML(event.imageAlt || event.title)}"
                loading="lazy"
                onerror="
                    this.style.display='none';
                    this.nextElementSibling.hidden=false;
                "
            >
            <div class="event-image-placeholder" aria-hidden="true" hidden>
                <i class="fa-solid fa-people-group"></i>
            </div>
        `;
    }


    function getRegistrationButton(event) {
        if (event.status === "completed") {
            return `
                <button class="btn btn-outline" type="button" disabled>
                    Event Completed
                </button>
            `;
        }

        if (event.status === "closed") {
            return `
                <button class="btn btn-outline" type="button" disabled>
                    Registration Closed
                </button>
            `;
        }

        /*
         * Only allow HTTPS Google Forms URLs.
         * Do not send users to a made-up or unverified registration form.
         */
        let validFormURL = "";

        try {
            const parsedURL = new URL(event.registrationURL);

            if (
                parsedURL.protocol === "https:" &&
                (
                    parsedURL.hostname === "forms.gle" ||
                    parsedURL.hostname === "docs.google.com"
                )
            ) {
                validFormURL = parsedURL.href;
            }
        } catch (error) {
            // No valid organiser-managed form has been supplied.
        }

        if (validFormURL) {
            return `
                <a
                    class="btn btn-primary"
                    href="${escapeHTML(validFormURL)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Register for ${escapeHTML(event.title)}"
                >
                    Register <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
            `;
        }

        return `
            <button
                class="btn btn-primary"
                type="button"
                data-registration-unavailable="${escapeHTML(event.id)}"
            >
                Registration Details
            </button>
        `;
    }


    /* ---------- EVENT CARDS ---------- */

    function renderEvents(filter = "upcoming") {
        if (!eventGrid) {
            return;
        }

        const filteredEvents = communityEvents.filter(function (event) {
            return event.status === filter;
        });

        eventGrid.innerHTML = filteredEvents.map(function (event) {
            return `
                <article class="community-event-card">

                    <div class="community-event-image-wrap">
                        ${getEventImage(event)}

                        <span class="event-status-badge status-${escapeHTML(event.status)}">
                            ${escapeHTML(getStatusLabel(event.status))}
                        </span>
                    </div>

                    <div class="community-event-card-content">

                        <div class="event-meta">
                            <span>
                                <i class="fa-regular fa-calendar"></i>
                                ${escapeHTML(formatEventDate(event.date))}
                            </span>

                            <span>
                                <i class="fa-solid fa-location-dot"></i>
                                ${escapeHTML(event.location)}
                            </span>
                        </div>

                        <h3>${escapeHTML(event.title)}</h3>

                        <p>${escapeHTML(event.description)}</p>

                        <div class="event-organiser">
                            <i class="fa-solid fa-user-group"></i>
                            <span>
                                Organised by:
                                ${escapeHTML(event.organiser)}
                            </span>
                        </div>

                        <div class="event-card-actions">
                            <button
                                class="btn btn-outline"
                                type="button"
                                data-view-event="${escapeHTML(event.id)}"
                            >
                                View Event
                            </button>

                            ${getRegistrationButton(event)}
                        </div>

                    </div>
                </article>
            `;
        }).join("");

        if (emptyState) {
            emptyState.hidden = filteredEvents.length > 0;
        }
    }


    /* ---------- EVENT FILTERS ---------- */

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const filter = button.dataset.eventFilter;

            filterButtons.forEach(function (otherButton) {
                const isActive = otherButton === button;

                otherButton.classList.toggle("active", isActive);
                otherButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            renderEvents(filter);

            if (eventDetailsSection) {
                eventDetailsSection.hidden = true;
            }
        });
    });


    /* ---------- EVENT DETAILS ---------- */

    function showEventDetails(eventId) {
        const event = communityEvents.find(function (item) {
            return item.id === eventId;
        });

        if (!event || !eventDetailsSection || !eventDetailsContent) {
            return;
        }

        const registrationButton = getRegistrationButton(event);

        eventDetailsContent.innerHTML = `
            <div class="event-detail-header">
                <div>
                    <span class="section-eyebrow">COMMUNITY EVENT</span>
                    <h2>${escapeHTML(event.title)}</h2>
                    <span class="event-status-badge status-${escapeHTML(event.status)}">
                        ${escapeHTML(getStatusLabel(event.status))}
                    </span>
                </div>

                <button
                    type="button"
                    class="event-detail-close"
                    data-close-event
                    aria-label="Close event details"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="event-detail-information">
                <p>
                    <i class="fa-regular fa-calendar"></i>
                    <strong>Date:</strong>
                    ${escapeHTML(formatEventDate(event.date))}
                </p>

                <p>
                    <i class="fa-solid fa-location-dot"></i>
                    <strong>Location:</strong>
                    ${escapeHTML(event.location)}
                </p>

                <p>
                    <i class="fa-solid fa-user-group"></i>
                    <strong>Organiser:</strong>
                    ${escapeHTML(event.organiser)}
                </p>
            </div>

            <div class="event-detail-body">
                <h3>About this activity</h3>
                <p>${escapeHTML(event.description)}</p>

                <h3>What you will do</h3>
                <p>${escapeHTML(event.activity)}</p>

                <h3>Eligibility and requirements</h3>
                <p>${escapeHTML(event.eligibility)}</p>

                <p class="prototype-note">
                    Confirm the event date, venue, requirements and any
                    costs directly with the organiser before attending.
                </p>
            </div>

            <div class="event-detail-actions">
                ${registrationButton}
                <a href="contact.html" class="btn btn-outline">
                    Contact Community Support
                </a>
            </div>
        `;

        eventDetailsSection.hidden = false;

        eventDetailsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    if (eventGrid) {
        eventGrid.addEventListener("click", function (event) {
            const viewButton = event.target.closest("[data-view-event]");
            const unavailableButton = event.target.closest(
                "[data-registration-unavailable]"
            );

            if (viewButton) {
                showEventDetails(viewButton.dataset.viewEvent);
                return;
            }

            if (unavailableButton) {
                const selectedEvent = communityEvents.find(function (item) {
                    return item.id ===
                        unavailableButton.dataset.registrationUnavailable;
                });

                if (selectedEvent) {
                    showEventDetails(selectedEvent.id);
                }
            }
        });
    }


    if (eventDetailsContent) {
        eventDetailsContent.addEventListener("click", function (event) {
            if (event.target.closest("[data-close-event]")) {
                eventDetailsSection.hidden = true;
            }
        });
    }


    /* ---------- COMMUNITY IDEA FORM ---------- */

    const ideaForm = document.getElementById("community-idea-form");
    const ideaFeedback = document.getElementById(
        "community-idea-feedback"
    );

    if (ideaForm && ideaFeedback) {
        ideaForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!ideaForm.checkValidity()) {
                ideaForm.reportValidity();
                return;
            }

            const title = document.getElementById("idea-title").value.trim();
            const category = document.getElementById("idea-category").value;
            const description = document.getElementById(
                "idea-description"
            ).value.trim();

            if (!title || !category || !description) {
                ideaFeedback.className = "form-feedback error";
                ideaFeedback.textContent =
                    "Please complete all required fields.";
                ideaFeedback.hidden = false;
                return;
            }

            /*
             * Demonstration only:
             * this code does not transmit or persist any submitted data.
             */
            ideaFeedback.className = "form-feedback success";
            ideaFeedback.innerHTML = `
                <strong><i class="fa-solid fa-circle-check"></i>
                Demo submission successful!</strong>
                <p>
                    Your idea has passed the form validation demonstration.
                    It has not been sent or saved. A backend or external form
                    service is required for real submissions.
                </p>
            `;

            ideaFeedback.hidden = false;
            ideaFeedback.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

            ideaForm.reset();
        });
    }


    /* ---------- DONATION LINKS ---------- */

    document.querySelectorAll(".donation-contact-link").forEach(
        function (link) {
            link.addEventListener("click", function (event) {
                const donationContact = document.getElementById(
                    "donation-contact"
                );

                if (donationContact) {
                    event.preventDefault();

                    donationContact.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            });
        }
    );


    /* ---------- INITIAL RENDER ---------- */

    renderEvents("upcoming");

});

/* contact.html */ 
/* =========================================
   PAGE 8: CONTACT & SUPPORT
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("repower-contact-form");

    // This script only runs on the Contact & Support page.
    if (!contactForm) {
        return;
    }

    const categorySelect = document.getElementById("support-category");
    const contactMethodSelect = document.getElementById("support-contact-method");

    const emailGroup = document.getElementById("support-email-group");
    const phoneGroup = document.getElementById("support-phone-group");

    const emailInput = document.getElementById("support-email");
    const phoneInput = document.getElementById("support-phone");

    const guidanceTitle = document.getElementById("support-guidance-title");
    const guidanceText = document.getElementById("support-guidance-text");

    const messageInput = document.getElementById("support-message");
    const characterCount = document.getElementById("support-character-count");

    const successPanel = document.getElementById("support-form-success");
    const successMessage = document.getElementById("support-success-message");
    const newEnquiryButton = document.getElementById("support-new-enquiry");

    const categoryCards = document.querySelectorAll(
        ".support-category-card[data-enquiry-category]"
    );

    const categoryGuidance = {
        "General": {
            title: "General enquiry",
            message:
                "Ask about re:power, website features or how the repair " +
                "referral process works. Avoid including sensitive personal information."
        },

        "Repair Listing": {
            title: "Repair listing support",
            message:
                "Include the shop name and the page or listing involved. " +
                "Describe the incorrect detail without sharing private " +
                "customer or payment information."
        },

        "Collection & Delivery": {
            title: "Collection and delivery",
            message:
                "Describe the service area or arrangement you are asking " +
                "about. Availability, timing and fees must be confirmed " +
                "with the relevant provider."
        },

        "Business/Sponsor": {
            title: "Business or sponsorship enquiry",
            message:
                "Tell us whether you represent a repair shop, delivery " +
                "provider or sponsor. You can also use the dedicated " +
                "partnership page for more information."
        },

        "Community/Event": {
            title: "Community or event enquiry",
            message:
                "Include the event or donation opportunity you are asking " +
                "about. For registrations, check the event organiser's " +
                "official registration instructions."
        },

        "Report a Problem": {
            title: "Report a problem",
            message:
                "Explain what happened and identify the relevant page or " +
                "listing. Do not include passwords, card details or " +
                "unnecessary personal information."
        }
    };


    /* -----------------------------------------
       CATEGORY-SPECIFIC GUIDANCE
       ----------------------------------------- */

    function updateCategoryGuidance(category) {
        const guidance = categoryGuidance[category];

        if (!guidance) {
            guidanceTitle.textContent = "Before you start";
            guidanceText.textContent =
                "Select a category to see guidance relevant to your enquiry.";
            return;
        }

        guidanceTitle.textContent = guidance.title;
        guidanceText.textContent = guidance.message;
    }


    function selectCategory(category) {
        if (!categoryGuidance[category]) {
            return;
        }

        categorySelect.value = category;
        updateCategoryGuidance(category);

        categoryCards.forEach(function (card) {
            const isSelected =
                card.dataset.enquiryCategory === category;

            card.classList.toggle("is-selected", isSelected);
            card.setAttribute("aria-pressed", String(isSelected));
        });
    }


    categoryCards.forEach(function (card) {
        card.addEventListener("click", function () {
            selectCategory(card.dataset.enquiryCategory);

            document.getElementById("contact-form-section")
                .scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        });
    });


    categorySelect.addEventListener("change", function () {
        selectCategory(categorySelect.value);
    });


    /* -----------------------------------------
       PREFERRED CONTACT METHOD
       ----------------------------------------- */

    function updateContactMethod() {
        const method = contactMethodSelect.value;

        const emailIsRequired = method === "Email";
        const phoneIsRequired = method === "Phone";

        emailGroup.hidden = !emailIsRequired;
        phoneGroup.hidden = !phoneIsRequired;

        emailInput.required = emailIsRequired;
        phoneInput.required = phoneIsRequired;

        // Clear irrelevant fields when the contact method changes.
        if (!emailIsRequired) {
            emailInput.value = "";
            clearFieldError(emailInput);
        }

        if (!phoneIsRequired) {
            phoneInput.value = "";
            clearFieldError(phoneInput);
        }
    }


    contactMethodSelect.addEventListener("change", updateContactMethod);


    /* -----------------------------------------
       MESSAGE CHARACTER COUNT
       ----------------------------------------- */

    function updateCharacterCount() {
        characterCount.textContent =
            messageInput.value.length + " / 3000";
    }


    messageInput.addEventListener("input", updateCharacterCount);


    /* -----------------------------------------
       VALIDATION HELPERS
       ----------------------------------------- */

    function setFieldError(field, message) {
        const errorElement = document.getElementById(
            field.id + "-error"
        );

        field.classList.add("support-input-invalid");
        field.setAttribute("aria-invalid", "true");

        if (errorElement) {
            errorElement.textContent = message;
        }
    }


    function clearFieldError(field) {
        const errorElement = document.getElementById(
            field.id + "-error"
        );

        field.classList.remove("support-input-invalid");
        field.removeAttribute("aria-invalid");

        if (errorElement) {
            errorElement.textContent = "";
        }
    }


    function clearAllErrors() {
        contactForm.querySelectorAll(
            "input, select, textarea"
        ).forEach(function (field) {
            clearFieldError(field);
        });

        document.getElementById("support-consent-error").textContent = "";
    }


    function validateRequiredText(field, label, minimumLength) {
        const value = field.value.trim();

        if (!value) {
            setFieldError(field, label + " is required.");
            return false;
        }

        if (minimumLength && value.length < minimumLength) {
            setFieldError(
                field,
                label + " must contain at least " +
                minimumLength + " characters."
            );
            return false;
        }

        clearFieldError(field);
        return true;
    }


    function validateEmail() {
        if (contactMethodSelect.value !== "Email") {
            clearFieldError(emailInput);
            return true;
        }

        const email = emailInput.value.trim();

        // Practical format check for front-end validation.
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            setFieldError(emailInput, "Email address is required.");
            return false;
        }

        if (!emailPattern.test(email)) {
            setFieldError(
                emailInput,
                "Enter a valid email address."
            );
            return false;
        }

        clearFieldError(emailInput);
        return true;
    }


    function validatePhone() {
        if (contactMethodSelect.value !== "Phone") {
            clearFieldError(phoneInput);
            return true;
        }

        const phone = phoneInput.value.trim();

        // Allow digits, spaces, +, brackets, hyphens and periods.
        const phonePattern = /^\+?[0-9().\s-]{7,24}$/;

        if (!phone) {
            setFieldError(phoneInput, "Phone number is required.");
            return false;
        }

        if (!phonePattern.test(phone)) {
            setFieldError(
                phoneInput,
                "Enter a valid phone number using at least 7 digits."
            );
            return false;
        }

        const digitCount = phone.replace(/\D/g, "").length;

        if (digitCount < 7) {
            setFieldError(
                phoneInput,
                "Phone number must contain at least 7 digits."
            );
            return false;
        }

        clearFieldError(phoneInput);
        return true;
    }


    function validateSelect(field, label) {
        if (!field.value) {
            setFieldError(field, "Please select " + label + ".");
            return false;
        }

        clearFieldError(field);
        return true;
    }


    function validatePrivacyAcknowledgement() {
        const checkbox = document.getElementById(
            "support-privacy-acknowledgement"
        );

        const errorElement = document.getElementById(
            "support-consent-error"
        );

        if (!checkbox.checked) {
            errorElement.textContent =
                "Please acknowledge the prototype privacy information.";
            return false;
        }

        errorElement.textContent = "";
        return true;
    }


    /* -----------------------------------------
       FORM SUBMISSION
       ----------------------------------------- */

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        clearAllErrors();

        const checks = [
            validateRequiredText(
                document.getElementById("support-name"),
                "Your name",
                2
            ),

            validateSelect(
                contactMethodSelect,
                "a preferred contact method"
            ),

            validateEmail(),
            validatePhone(),

            validateSelect(
                categorySelect,
                "an enquiry category"
            ),

            validateRequiredText(
                document.getElementById("support-subject"),
                "Subject",
                3
            ),

            validateRequiredText(
                messageInput,
                "Message",
                10
            ),

            validatePrivacyAcknowledgement()
        ];

        const isValid = checks.every(Boolean);

        if (!isValid) {
            const firstInvalidField = contactForm.querySelector(
                ".support-input-invalid"
            );

            if (firstInvalidField) {
                firstInvalidField.focus();

                firstInvalidField.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            } else {
                const consentError = document.getElementById(
                    "support-consent-error"
                );

                if (consentError.textContent) {
                    document.getElementById(
                        "support-privacy-acknowledgement"
                    ).focus();
                }
            }

            return;
        }

        const selectedCategory = categorySelect.value;

        /*
         * DEMO ONLY:
         * No network request is made.
         * Do not display a real message-sent confirmation.
         * A production form needs a secure backend or connected form service.
         */

        successMessage.textContent =
            "Your " + selectedCategory.toLowerCase() +
            " enquiry passed the local demonstration checks. " +
            "No message was sent or stored.";

        contactForm.hidden = true;
        successPanel.hidden = false;

        successPanel.focus();

        successPanel.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });


    /* -----------------------------------------
       START ANOTHER ENQUIRY
       ----------------------------------------- */

    newEnquiryButton.addEventListener("click", function () {
        contactForm.reset();

        clearAllErrors();

        contactForm.hidden = false;
        successPanel.hidden = true;

        updateContactMethod();
        updateCharacterCount();
        updateCategoryGuidance("");

        categoryCards.forEach(function (card) {
            card.classList.remove("is-selected");
            card.setAttribute("aria-pressed", "false");
        });

        contactForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        document.getElementById("support-name").focus();
    });


    /* -----------------------------------------
       CLEAR ERRORS WHILE EDITING
       ----------------------------------------- */

    contactForm.querySelectorAll(
        "input, select, textarea"
    ).forEach(function (field) {
        field.addEventListener("input", function () {
            clearFieldError(field);
        });

        field.addEventListener("change", function () {
            clearFieldError(field);
        });
    });


    /* -----------------------------------------
       INITIAL STATE
       ----------------------------------------- */

    updateContactMethod();
    updateCharacterCount();
    updateCategoryGuidance("");

});
/* collection-delivery.html */
/* =========================================
   RE:POWER COLLECTION & DELIVERY
   JavaScript Functionality
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("collectionForm");

    const message = document.getElementById("formMessage");

    const preferenceError =
        document.getElementById("preferenceError");

    const dateInput = document.getElementById("date");


    // SET MINIMUM COLLECTION DATE TO TODAY

    const today = new Date();

    const localDate = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    dateInput.min = localDate;


    // COLLECTION PREFERENCE SELECTION

    const preferenceCards =
        document.querySelectorAll(".preference-card");

    const preferenceInputs =
        document.querySelectorAll('input[name="preference"]');


    preferenceInputs.forEach(function (radio) {

        radio.addEventListener("change", function () {

            preferenceCards.forEach(function (card) {
                card.classList.remove("selected");
            });

            radio.closest(".preference-card")
                .classList.add("selected");

            preferenceError.style.display = "none";

        });

    });


    // FORM SUBMISSION

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        let isValid = true;


        // CHECK REQUIRED INPUTS

        const requiredFields =
            form.querySelectorAll("[required]");


        requiredFields.forEach(function (field) {

            const group = field.closest(".form-group");

            if (!field.value.trim()) {

                isValid = false;

                if (group) {
                    group.classList.add("invalid");
                }

            } else {

                if (group) {
                    group.classList.remove("invalid");
                }

            }

        });


        // CHECK COLLECTION PREFERENCE

        const selectedPreference =
            form.querySelector(
                'input[name="preference"]:checked'
            );

        if (!selectedPreference) {

            isValid = false;

            preferenceError.style.display = "block";

        }


        // CHECK FORM VALIDATION

        if (!isValid) {

            showMessage(
                "Please complete all required fields before submitting.",
                "warning"
            );

            const firstInvalid =
                form.querySelector(
                    ".form-group.invalid input, " +
                    ".form-group.invalid select, " +
                    ".form-group.invalid textarea"
                );

            if (firstInvalid) {
                firstInvalid.focus();
            }

            return;

        }


        // COLLECT FORM DATA

        const enquiry = {

            customerName:
                document.getElementById("customerName").value,

            phone:
                document.getElementById("phone").value,

            township:
                document.getElementById("township").value,

            category:
                document.getElementById("category").value,

            device:
                document.getElementById("device").value,

            repairShop:
                document.getElementById("repairShop").value,

            preference:
                selectedPreference.value,

            date:
                document.getElementById("date").value,

            time:
                document.getElementById("time").value,

            address:
                document.getElementById("address").value,

            submittedAt:
                new Date().toISOString()

        };


        // SAVE DEMO ENQUIRY IN LOCAL STORAGE

        try {

            let enquiries = JSON.parse(
                localStorage.getItem("repowerEnquiries") || "[]"
            );

            enquiries.push(enquiry);
        localStorage.setItem(
                "repowerEnquiries",
                JSON.stringify(enquiries)
            );


            showMessage(
                "Your enquiry has been saved successfully on this device. " +
                "This is a demonstration submission; RE:Power has not " +
                "received it yet.",
                "success"
            );

        }

        catch (error) {

            showMessage(
                "Unable to save the enquiry. Please try again.",
                "error"
            );

        }

    });


    // RESET FORM

    form.addEventListener("reset", function () {

        setTimeout(function () {

            const groups =
                form.querySelectorAll(".form-group");

            groups.forEach(function (group) {
                group.classList.remove("invalid");
            });

            preferenceCards.forEach(function (card) {
                card.classList.remove("selected");
            });

            preferenceError.style.display = "none";

            message.className = "form-message";
            message.textContent = "";

        }, 0);

    });


    // DISPLAY FORM MESSAGES

    function showMessage(text, type) {

        message.textContent = text;

        message.className = "form-message " + type;

    }

});

/* 
   RE:POWER WEATHER CARE and SMART ASSISTANT
   Weather: Open-Meteo API // and Assistant JavaScript prototype only
*/

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. WEATHER ELEMENTS
    // =====================================

    const weatherLocation = document.getElementById("weather-location");
    const weatherTemperature = document.getElementById("weather-temperature");
    const weatherDescription = document.getElementById("weather-description");
    const weatherFeelsLike = document.getElementById("weather-feels-like");
    const weatherIcon = document.getElementById("weather-icon");
    const weatherHumidity = document.getElementById("weather-humidity");
    const weatherRainfall = document.getElementById("weather-rainfall");
    const weatherWind = document.getElementById("weather-wind");
    const weatherRainChance = document.getElementById("weather-rain-chance");
    const weatherAlert = document.getElementById("weather-alert");
    const weatherUpdated = document.getElementById("weather-updated");
    const refreshButton = document.getElementById("refresh-weather");

    const ecoReminderList = document.getElementById("eco-reminder-list");
    const assistantWeatherContext = document.getElementById(
        "assistant-weather-context"
    );

    let currentWeather = null;


    // =====================================
    // 2. WEATHER CODE DESCRIPTIONS
    // =====================================

    function getWeatherInfo(code) {

        const weatherTypes = {
            0:  { description: "Clear sky", icon: "☀️" },
            1:  { description: "Mainly clear", icon: "🌤️" },
            2:  { description: "Partly cloudy", icon: "⛅" },
            3:  { description: "Overcast", icon: "☁️" },
            45: { description: "Foggy", icon: "🌫️" },
            48: { description: "Depositing rime fog", icon: "🌫️" },
            51: { description: "Light drizzle", icon: "🌦️" },
            53: { description: "Moderate drizzle", icon: "🌦️" },
            55: { description: "Heavy drizzle", icon: "🌧️" },
            61: { description: "Slight rain", icon: "🌧️" },
            63: { description: "Moderate rain", icon: "🌧️" },
            65: { description: "Heavy rain", icon: "🌧️" },
            71: { description: "Slight snowfall", icon: "🌨️" },
            73: { description: "Moderate snowfall", icon: "🌨️" },
            75: { description: "Heavy snowfall", icon: "❄️" },
            80: { description: "Rain showers", icon: "🌦️" },
            81: { description: "Moderate rain showers", icon: "🌧️" },
            82: { description: "Heavy rain showers", icon: "⛈️" },
            95: { description: "Thunderstorm", icon: "⛈️" },
            96: { description: "Thunderstorm with hail", icon: "⛈️" },
            99: { description: "Severe thunderstorm with hail", icon: "⛈️" }
        };

        return weatherTypes[code] || {
            description: "Weather information unavailable",
            icon: "🌤️"
        };
    }


    // =====================================
    // 3. GET USER LOCATION
    // =====================================

    function getWeatherLocation() {

        if (!navigator.geolocation) {
            loadWeather(16.8409, 96.1735, "Yangon (fallback)");
            return;
        }

        weatherLocation.textContent = "Detecting your location...";

        navigator.geolocation.getCurrentPosition(

            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                loadWeather(latitude, longitude, "Your current area");
            },

            () => {
                weatherLocation.textContent =
                    "Location unavailable · Showing Yangon weather";

                loadWeather(16.8409, 96.1735, "Yangon (fallback)");
            },

            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    }


    // =====================================
    // 4. FETCH WEATHER FROM OPEN-METEO
    // =====================================

    async function loadWeather(latitude, longitude, locationName) {

        weatherLocation.textContent = "Updating weather...";

        const apiURL =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m` +
            `&daily=precipitation_probability_max` +
            `&forecast_days=1` +
            `&timezone=auto`;

        try {

            const response = await fetch(apiURL);

            if (!response.ok) {
                throw new Error("Weather API request failed.");
            }

            const data = await response.json();

            const current = data.current;
            const daily = data.daily;

            const weatherInfo = getWeatherInfo(current.weather_code);

            const rainChance =
                daily.precipitation_probability_max?.[0] ?? 0;

            currentWeather = {
                temperature: current.temperature_2m,
                feelsLike: current.apparent_temperature,
                humidity: current.relative_humidity_2m,
                rainfall: current.precipitation,
                wind: current.wind_speed_10m,
                rainChance: rainChance,
                condition: weatherInfo.description,
                location: locationName
            };

            // Display live weather
            weatherLocation.textContent = `📍 ${locationName}`;

            weatherTemperature.textContent =
                `${Math.round(current.temperature_2m)}°C`;

            weatherDescription.textContent =
                weatherInfo.description;

            weatherFeelsLike.textContent =
                `Feels like ${Math.round(current.apparent_temperature)}°C`;

            weatherIcon.innerHTML =
                `<span>${weatherInfo.icon}</span>`;

            weatherHumidity.textContent =
                `${current.relative_humidity_2m}%`;

            weatherRainfall.textContent =
                `${current.precipitation} mm`;

            weatherWind.textContent =
                `${current.wind_speed_10m} km/h`;

            weatherRainChance.textContent =
                `${rainChance}%`;

            weatherUpdated.textContent =
                `Updated at ${new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })}`;

            // Generate recommendations
            updateEcoReminders(currentWeather);
            updateWeatherAlert(currentWeather);
            updateWellbeing(currentWeather);

            // Share weather context with the assistant
            assistantWeatherContext.textContent =
                `${weatherInfo.description}, ${Math.round(current.temperature_2m)}°C. ` +
                `Humidity: ${current.relative_humidity_2m}%.`;

            window.repowerWeatherContext = currentWeather;

        } catch (error) {

            console.error("Weather error:", error);

            weatherLocation.textContent = "Weather unavailable";
            weatherDescription.textContent =
                "Unable to retrieve live weather data.";

            weatherAlert.innerHTML = `
                <span>⚠️</span>
                <p>Please check your internet connection and try refreshing.</p>
            `;

            weatherUpdated.textContent = "Unable to update weather.";
        }
    }


    // =====================================
    // 5. DYNAMIC WEATHER ALERTS
    // =====================================

    function updateWeatherAlert(weather) {

        let message = "🌱 Enjoy your day and remember to care for your devices!";

        if (weather.temperature >= 35) {

            message =
                "☀️ High temperature detected. Keep devices away from direct sunlight and hot surfaces.";

        } else if (weather.rainfall >= 5 || weather.rainChance >= 70) {

            message =
                "🌧️ Rain is likely. Protect electronic devices from water and avoid charging them in wet areas.";

        } else if ([95, 96, 99].includes(getCurrentWeatherCode())) {

            message =
                "⛈️ Thunderstorm conditions detected. Follow local safety guidance and consider unplugging sensitive electronics when safe to do so.";

        } else if (weather.humidity >= 80) {

            message =
                "💧 High humidity detected. Keep electronic devices in a dry, ventilated place.";

        }

        weatherAlert.innerHTML = `
            <span>🌿</span>
            <p>${message}</p>
        `;
    }


    function getCurrentWeatherCode() {
        // The condition text is used here because the weather object
        // stores the readable condition rather than the numeric code.
        const condition = currentWeather?.condition?.toLowerCase() || "";

        if (condition.includes("thunderstorm")) return 95;

        return 0;
    }


    // =====================================
    // 6. DYNAMIC ECO REMINDERS
    // =====================================

    function updateEcoReminders(weather) {

        const reminders = [];

        if (weather.temperature >= 35) {

            reminders.push({
                icon: "☀️",
                text: "Avoid leaving phones, laptops and batteries inside hot vehicles or under direct sunlight."
            });

            reminders.push({
                icon: "🔋",
                text: "Allow electronic devices to cool naturally before charging if they become unusually hot."
            });

        } else if (weather.temperature <= 20) {

            reminders.push({
                icon: "🌡️",
                text: "Keep sensitive electronics away from extreme temperature changes."
            });
        }

        if (weather.rainChance >= 60 || weather.rainfall >= 2) {

            reminders.push({
                icon: "🌧️",
                text: "Protect reusable electronics and repair tools from rain and moisture."
            });
        }

        if (weather.humidity >= 75) {

            reminders.push({
                icon: "💧",
                text: "Keep electronic devices in a dry, ventilated space to reduce moisture exposure."
            });
        }

        reminders.push({
            icon: "♻️",
            text: "Consider repairing a damaged device before replacing it to reduce electronic waste."
        });

        reminders.push({
            icon: "🔌",
            text: "Switch off and unplug unused devices when it is safe to do so."
        });

        ecoReminderList.innerHTML = reminders.slice(0, 4).map(item => `
            <div class="rp-reminder-item">
                <span>${item.icon}</span>
                <p>${item.text}</p>
            </div>
        `).join("");
    }


    // =====================================
    // 7. WELLBEING RECOMMENDATIONS
    // =====================================

    function updateWellbeing(weather) {

        const recommendations = [];

        if (weather.temperature >= 35) {

            recommendations.push({
                icon: "💧",
                title: "Stay hydrated",
                text: "Drink water regularly, especially in hot weather."
            });

            recommendations.push({
                icon: "🌤️",
                title: "Avoid excessive heat",
                text: "Take breaks in a cool, shaded environment."
            });

        } else if (weather.temperature <= 18) {

            recommendations.push({
                icon: "🧥",
                title: "Stay comfortable",
                text: "Dress appropriately for cooler weather."
            });
        }

        if (weather.rainChance >= 60 || weather.rainfall >= 2) {

            recommendations.push({
                icon: "☔",
                title: "Plan ahead",
                text: "Consider bringing an umbrella when going outside."
            });
        }

        recommendations.push({
            icon: "👀",
            title: "Rest your eyes",
            text: "Take regular breaks from screens and digital devices."
        });

        recommendations.push({
            icon: "🌿",
            title: "Take a little break",
            text: "Stretch, relax and give yourself time away from screens."
        });

        const container =
            document.getElementById("health-recommendations");

        container.innerHTML = recommendations.slice(0, 4).map(item => `
            <div class="rp-wellbeing-item">
                <span>${item.icon}</span>
                <div>
                    <strong>${item.title}</strong>
                    <p>${item.text}</p>
                </div>
            </div>
        `).join("");
    }


    // =====================================
    // 8. PROTOTYPE ASSISTANT
    // =====================================

    const chatForm = document.getElementById("ai-chat-form");
    const questionInput = document.getElementById("ai-question");
    const deviceSelect = document.getElementById("ai-device");
    const chatMessages = document.getElementById("ai-chat-messages");
    const sendButton = document.getElementById("ai-send-button");


    function addMessage(message, sender) {

        const messageElement = document.createElement("div");

        messageElement.className =
            sender === "user"
                ? "rp-message user-message"
                : "rp-message assistant-message";

        const avatar = document.createElement("div");
        avatar.className = "rp-message-avatar";
        avatar.textContent = sender === "user" ? "👤" : "🌱";

        const content = document.createElement("div");
        content.className = "rp-message-content";

        const paragraph = document.createElement("p");
        paragraph.textContent = message;

        const time = document.createElement("span");
        time.className = "rp-message-time";
        time.textContent = "Just now";

        content.appendChild(paragraph);
        content.appendChild(time);

        messageElement.appendChild(avatar);
        messageElement.appendChild(content);

        chatMessages.appendChild(messageElement);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }


    // Predefined prototype responses
    function getPrototypeAnswer(question, device) {

        const text = question.toLowerCase();

        const weather = currentWeather;

        // Weather questions
        if (
            text.includes("weather") ||
            text.includes("rain") ||
            text.includes("temperature") ||
            text.includes("hot") ||
            text.includes("humidity")
        ) {

            if (weather) {
                return `Your current weather is ${weather.condition} with a temperature of ${Math.round(weather.temperature)}°C and ${weather.humidity}% humidity. ${weather.temperature >= 35
                    ? "Keep your devices away from direct sunlight and stay hydrated."
                    : weather.rainChance >= 60
                        ? "Rain may occur, so protect your devices from moisture."
                        : "Remember to keep your devices clean and properly ventilated."
                }`;
            }

            return "I cannot access weather information right now. Please refresh the weather card and try again.";
        }


        // Device care
        if (
            text.includes("hot") ||
            text.includes("overheat") ||
            text.includes("heating")
        ) {

            return device === "General"
                ? "If an electronic device becomes unusually hot, stop using it and allow it to cool in a safe, ventilated place. Avoid covering its vents."
                : `For your ${device}, stop using it if it becomes unusually hot. Let it cool naturally in a ventilated area. If overheating continues, consider professional repair.`;
        }


        if (
            text.includes("battery") ||
            text.includes("charging") ||
            text.includes("charge")
        ) {

            return `For your ${device}, use a compatible charger and avoid charging it near water or excessive heat. If the battery is swollen, damaged or unusually hot, stop using the device and seek professional help.`;
        }


        if (
            text.includes("slow") ||
            text.includes("lag") ||
            text.includes("performance")
        ) {

            return `If your ${device} is running slowly, try closing unused applications, checking available storage and restarting it. If the problem continues, a repair technician can inspect it.`;
        }


        if (
            text.includes("repair") ||
            text.includes("broken") ||
            text.includes("damaged") ||
            text.includes("fix")
        ) {

            return `Before replacing your ${device}, consider getting a repair assessment. 
            A technician can identify the damaged component and help you compare repair costs with replacement costs.`;
        }


        // Sustainability
        if (
            text.includes("eco") ||
            text.includes("environment") ||
            text.includes("waste") ||
            text.includes("recycle")
        ) {

            return "You can reduce electronic waste by repairing devices, donating working electronics, reusing accessories and sending unusable electronics to an appropriate e-waste collection point.";
        }


        // Wellbeing
        if (
            text.includes("health") ||
            text.includes("tired") ||
            text.includes("eye") ||
            text.includes("stress") ||
            text.includes("wellbeing") ||
            text.includes("well-being")
        ) {

            return "Remember to take regular screen breaks, stretch your body and drink water throughout the day. If you have persistent or concerning symptoms, seek advice from a qualified healthcare professional.";
        }


        // Default response
        return `Thanks for your question! 🌿 I can demonstrate basic advice about ${device.toLowerCase()} care, battery maintenance, weather protection, repair options, sustainability and everyday wellbeing. Try asking me about one of those topics!`;
    }


    // =====================================
    // 9. SEND CHAT MESSAGE
    // =====================================

    chatForm.addEventListener("submit", event => {

        event.preventDefault();

        const question = questionInput.value.trim();
        const selectedDevice = deviceSelect.value;

        if (!question) return;

        // Display user message
        addMessage(question, "user");

        questionInput.value = "";
        sendButton.disabled = true;
        sendButton.textContent = "...";

        // Simulate assistant thinking
        setTimeout(() => {

            const answer = getPrototypeAnswer(
                question,
                selectedDevice
            );

            addMessage(answer, "assistant");

            sendButton.disabled = false;
            sendButton.textContent = "➤";

        }, 700);
    });


    // =====================================
    // 10. REFRESH WEATHER
    // =====================================

    refreshButton.addEventListener("click", () => {
        getWeatherLocation();
    });


    // =====================================
    // 11. START WEATHER
    // =====================================

    getWeatherLocation();

});
