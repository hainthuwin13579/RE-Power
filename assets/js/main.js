

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
    // QUICK REPAIR SEARCH

    const categoryRadios = document.querySelectorAll(
        'input[name="category"]'
    );

    const deviceSelect = document.getElementById("device");
    const locationInput = document.getElementById("location");

    const devices = {
        household: [
            "Fan",
            "Refrigerator",
            "Washing Machine",
            "Television",
            "Microwave",
            "Rice Cooker",
            "Air Conditioner",
            "Other Household Appliance"
        ],

        personal: [
            "Mobile Phone",
            "Laptop",
            "Tablet",
            "Desktop Computer",
            "Computer Accessories",
            "Other Personal Device"
        ]
    };

    function updateDevices(category, selectedDevice = "") {
        if (!deviceSelect) return;

        deviceSelect.innerHTML = "";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = category
            ? "Choose device"
            : "Choose category first";

        deviceSelect.appendChild(defaultOption);

        if (!category || !devices[category]) {
            deviceSelect.disabled = true;
            return;
        }

        deviceSelect.disabled = false;

        devices[category].forEach((device) => {
            const option = document.createElement("option");

            option.value = device.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            option.textContent = device;

            if (option.value === selectedDevice) {
                option.selected = true;
            }

            deviceSelect.appendChild(option);
        });
    }

    function getSelectedCategory() {
        const selected = document.querySelector(
            'input[name="category"]:checked'
        );

        return selected ? selected.value : "";
    }

    if (categoryRadios.length && deviceSelect) {
        categoryRadios.forEach((radio) => {
            radio.addEventListener("change", () => {
                updateDevices(radio.value);
            });
        });

        const params = new URLSearchParams(window.location.search);

        const initialCategory = params.get("category");
        const initialDevice = params.get("device");
        const initialLocation = params.get("location");

        if (initialCategory && devices[initialCategory]) {
            const initialRadio = document.querySelector(
                `input[name="category"][value="${initialCategory}"]`
            );

            if (initialRadio) {
                initialRadio.checked = true;
                updateDevices(initialCategory, initialDevice || "");
            } else {
                updateDevices("");
            }
        } else {
            updateDevices("");
        }

        if (locationInput && initialLocation) {
            locationInput.value = initialLocation;
        }
    }

    const homeSearchForm = document.getElementById("homeSearchForm");

    if (homeSearchForm) {
        homeSearchForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const category = getSelectedCategory();
            const device = deviceSelect ? deviceSelect.value : "";
            const location = locationInput ? locationInput.value.trim() : "";

            if (!category || !device || !location) {
                homeSearchForm.reportValidity();
                return;
            }

            const params = new URLSearchParams({
                category,
                device,
                location
            });

            window.location.href =
                `repair-shops.html?${params.toString()}`;
        });
    }


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

/*repair-shop.html*/

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* 1. PAGE CHECK */

    const shopPage = document.querySelector(".shop-page");

    if (!shopPage) {
        return;
    }


    /* 2. DEVICE OPTIONS */

    const deviceOptions = {

        household: [
            "Refrigerator",
            "Washing Machine",
            "Television",
            "Air Conditioner",
            "Microwave",
            "Rice Cooker",
            "Electric Fan",
            "Water Pump"
        ],

        personal: [
            "Smartphone",
            "Laptop",
            "Desktop Computer",
            "Tablet",
            "Monitor",
            "Printer",
            "Power Bank",
            "Computer Accessories"
        ]

    };


    /* 3. SAMPLE REPAIR SHOP DATA */

    const repairShops = [

        {
            id: 1,
            name: "Green Tech Repair Centre",
            category: "personal",
            township: "Sanchaung",
            city: "Yangon",
            address: "Sanchaung Township, Yangon",
            latitude: 16.8053,
            longitude: 96.1320,

            description:
                "A sample repair listing offering general electronic device inspection and repair services.",

            devices: [
                "Smartphone",
                "Laptop",
                "Tablet",
                "Desktop Computer"
            ],

            problems: [
                "power",
                "screen",
                "performance"
            ],

            price: 25000,
            delivery: true,
            phone: "+95 9 123 456 701",

            icon: "fa-laptop",
            badge: "Personal Technology",

            services:
                "Screen inspection, charging diagnosis, software troubleshooting and general device servicing.",

            hours: "9:00 AM – 6:00 PM"
        },

        {
            id: 2,
            name: "Smart Home Appliance Service",
            category: "household",
            township: "Kamayut",
            city: "Yangon",
            address: "Kamayut Township, Yangon",
            latitude: 16.8250,
            longitude: 96.1350,

            description:
                "A sample household appliance repair listing for common home electronics.",

            devices: [
                "Refrigerator",
                "Washing Machine",
                "Television",
                "Microwave"
            ],

            problems: [
                "power",
                "mechanical",
                "performance"
            ],

            price: 35000,
            delivery: true,
            phone: "+95 9 123 456 702",

            icon: "fa-tv",
            badge: "Household Electronics",

            services:
                "Appliance inspection, electrical troubleshooting and general maintenance.",

            hours: "8:30 AM – 5:30 PM"
        },

        {
            id: 3,
            name: "Mobile Care Workshop",
            category: "personal",
            township: "Hlaing",
            city: "Yangon",
            address: "Hlaing Township, Yangon",
            latitude: 16.8500,
            longitude: 96.1300,

            description:
                "A sample mobile device repair listing for common smartphone problems.",

            devices: [
                "Smartphone",
                "Tablet"
            ],

            problems: [
                "screen",
                "power",
                "water"
            ],

            price: 18000,
            delivery: false,
            phone: "+95 9 123 456 703",

            icon: "fa-mobile-screen-button",
            badge: "Personal Technology",

            services:
                "Mobile device inspection, display diagnosis and charging problem assessment.",

            hours: "10:00 AM – 7:00 PM"
        },

        {
            id: 4,
            name: "Home Electronics Workshop",
            category: "household",
            township: "Bahan",
            city: "Yangon",
            address: "Bahan Township, Yangon",
            latitude: 16.8100,
            longitude: 96.1600,

            description:
                "A sample repair listing for household electrical and electronic equipment.",

            devices: [
                "Electric Fan",
                "Rice Cooker",
                "Water Pump",
                "Air Conditioner"
            ],

            problems: [
                "power",
                "mechanical",
                "performance"
            ],

            price: 30000,
            delivery: false,
            phone: "+95 9 123 456 704",

            icon: "fa-house",
            badge: "Household Electronics",

            services:
                "Electrical inspection, mechanical troubleshooting and maintenance.",

            hours: "9:00 AM – 5:00 PM"
        },

        {
            id: 5,
            name: "Digital Device Solutions",
            category: "personal",
            township: "Mayangone",
            city: "Yangon",
            address: "Mayangone Township, Yangon",
            latitude: 16.8650,
            longitude: 96.1550,

            description:
                "A sample technology repair listing for computers and related equipment.",

            devices: [
                "Laptop",
                "Desktop Computer",
                "Monitor",
                "Printer"
            ],

            problems: [
                "power",
                "performance",
                "other"
            ],

            price: 40000,
            delivery: true,
            phone: "+95 9 123 456 705",

            icon: "fa-computer",
            badge: "Personal Technology",

            services:
                "Computer diagnostics, software troubleshooting and hardware inspection.",

            hours: "9:30 AM – 6:00 PM"
        },

        {
            id: 6,
            name: "Appliance Care Service",
            category: "household",
            township: "Thingangyun",
            city: "Yangon",
            address: "Thingangyun Township, Yangon",
            latitude: 16.8300,
            longitude: 96.2000,

            description:
                "A sample home appliance service listing with general maintenance options.",

            devices: [
                "Refrigerator",
                "Washing Machine",
                "Air Conditioner",
                "Electric Fan"
            ],

            problems: [
                "power",
                "mechanical",
                "other"
            ],

            price: 45000,
            delivery: true,
            phone: "+95 9 123 456 706",

            icon: "fa-screwdriver-wrench",
            badge: "Household Electronics",

            services:
                "General appliance inspection, maintenance and fault diagnosis.",

            hours: "8:00 AM – 5:00 PM"
        }

    ];


    /* 4. HTML ELEMENTS */

    const categoryButtons = shopPage.querySelectorAll(
        ".shop-category-option"
    );

    const shopFilterButtons = shopPage.querySelectorAll(
        ".shop-filter-button"
    );

    const searchForm = shopPage.querySelector(
        "#shopSearchForm"
    );

    const locationInput = shopPage.querySelector(
        "#shopLocation"
    );

    const deviceSelect = shopPage.querySelector(
        "#shopDevice"
    );

    const problemSelect = shopPage.querySelector(
        "#shopProblem"
    );

    const budgetInput = shopPage.querySelector(
        "#shopBudget"
    );

    const deliveryCheckbox = shopPage.querySelector(
        "#shopDelivery"
    );

    const resultsContainer = shopPage.querySelector(
        "#shopResults"
    );

    const resultsSummary = shopPage.querySelector(
        "#shopResultsSummary"
    );

    const emptyState = shopPage.querySelector(
        "#shopEmptyState"
    );

    const resetButton = shopPage.querySelector(
        "#resetShopFilters"
    );

    const emptyResetButton = shopPage.querySelector(
        "#shopEmptyReset"
    );

    const sortSelect = shopPage.querySelector(
        "#shopSort"
    );

    const mapToggle = shopPage.querySelector(
        "#shopMapToggle"
    );

    const mapPanel = shopPage.querySelector(
        "#shopMapPanel"
    );

    const resultsLayout = shopPage.querySelector(
        ".shop-results-layout"
    );

    const detailContent = shopPage.querySelector(
        "#shopDetailContent"
    );

    const currentYear = document.getElementById(
        "currentYear"
    );


    /* 5. APPLICATION VARIABLES */

    let selectedCategory = "household";

    let activeShopFilter = "all";

    let filteredShops = [...repairShops];

    let shopMap = null;

    let detailMap = null;

    let mapMarkers = [];

    let detailMarker = null;

    const currencyFormatter = new Intl.NumberFormat("en-US");


    /* 6. HELPER FUNCTIONS */

    function formatPrice(price) {

        return "MMK " + currencyFormatter.format(price);

    }


    function getShopById(shopId) {

        return repairShops.find(function (shop) {

            return shop.id === Number(shopId);

        });

    }


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


    function closeDetailMap() {

        if (detailMap) {

            detailMap.remove();

            detailMap = null;

            detailMarker = null;

        }

    }


    function closeShopDetails() {

        if (detailContent) {

            detailContent.hidden = true;

            detailContent.innerHTML = "";

        }

        closeDetailMap();

    }


    /* 7. DEVICE DROPDOWN */

    function updateDeviceOptions() {

        if (!deviceSelect) {
            return;
        }

        const previousValue = deviceSelect.value;

        const devices = deviceOptions[selectedCategory];

        deviceSelect.innerHTML =
            '<option value="">All supported devices</option>';

        devices.forEach(function (device) {

            const option = document.createElement("option");

            option.value = device;

            option.textContent = device;

            deviceSelect.appendChild(option);

        });

        if (devices.includes(previousValue)) {

            deviceSelect.value = previousValue;

        }

    }


    /* 8. CATEGORY SELECTION */

    function updateCategoryButtons() {

        categoryButtons.forEach(function (button) {

            const isActive =
                button.dataset.category === selectedCategory;

            button.classList.toggle("active", isActive);

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        });

    }


    categoryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const category = button.dataset.category;

            if (!deviceOptions[category]) {
                return;
            }

            selectedCategory = category;

            updateCategoryButtons();

            updateDeviceOptions();

            applyFilters();

        });

    });


    /* 9. SHOP TYPE FILTER */

    function getVisibleShops() {

        if (activeShopFilter === "phone") {

            return filteredShops.filter(function (shop) {

                return shop.devices.includes("Smartphone");

            });

        }


        if (activeShopFilter === "laptop") {

            return filteredShops.filter(function (shop) {

                return shop.devices.includes("Laptop");

            });

        }


        return filteredShops;

    }


    shopFilterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const filter = button.dataset.shopFilter;

            if (!["all", "phone", "laptop"].includes(filter)) {
                return;
            }

            activeShopFilter = filter;


            shopFilterButtons.forEach(function (filterButton) {

                const isActive =
                    filterButton.dataset.shopFilter === activeShopFilter;

                filterButton.classList.toggle(
                    "active",
                    isActive
                );

                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );

            });


            renderShops();

        });

    });


    /* 10. FILTER REPAIR SHOPS */

    function applyFilters() {

        const location = locationInput
            ? locationInput.value.trim().toLowerCase()
            : "";

        const device = deviceSelect
            ? deviceSelect.value
            : "";

        const problem = problemSelect
            ? problemSelect.value
            : "";

        const budget = budgetInput
            ? budgetInput.value.trim()
            : "";

        const budgetNumber = Number(budget);

        const deliveryOnly = deliveryCheckbox
            ? deliveryCheckbox.checked
            : false;


        filteredShops = repairShops.filter(function (shop) {


            /* CATEGORY MATCH */

            const categoryMatch =
                activeShopFilter !== "all" ||
                shop.category === selectedCategory;


            /* LOCATION MATCH */

            const locationMatch =
                !location ||
                shop.township.toLowerCase().includes(location) ||
                shop.city.toLowerCase().includes(location) ||
                shop.address.toLowerCase().includes(location);


            /* DEVICE MATCH */

            const deviceMatch =
                !device ||
                shop.devices.includes(device);


            /* PROBLEM MATCH */

            const problemMatch =
                !problem ||
                shop.problems.includes(problem);


            /* BUDGET MATCH */

            const budgetMatch =
                budget === "" ||
                (
                    Number.isFinite(budgetNumber) &&
                    budgetNumber >= 0 &&
                    shop.price <= budgetNumber
                );


            /* DELIVERY MATCH */

            const deliveryMatch =
                !deliveryOnly ||
                shop.delivery;


            return (
                categoryMatch &&
                locationMatch &&
                deviceMatch &&
                problemMatch &&
                budgetMatch &&
                deliveryMatch
            );

        });


        sortShops();

    }


    /* 11. SORT REPAIR SHOPS */

    function sortShops() {

        const sortValue = sortSelect
            ? sortSelect.value
            : "recommended";


        if (sortValue === "cost") {

            filteredShops.sort(function (a, b) {

                return a.price - b.price;

            });

        } else if (sortValue === "cost-high") {

            filteredShops.sort(function (a, b) {

                return b.price - a.price;

            });

        } else {

            filteredShops.sort(function (a, b) {

                return a.id - b.id;

            });

        }


        renderShops();

    }


    /* 12. RENDER REPAIR SHOP CARDS */

    function renderShops() {

        if (!resultsContainer) {
            return;
        }


        resultsContainer.innerHTML = "";


        const visibleShops = getVisibleShops();


        /* UPDATE RESULTS COUNT */

        if (resultsSummary) {

            resultsSummary.textContent =
                visibleShops.length + " Shops Found";

        }


        /* EMPTY STATE */

        if (emptyState) {

            emptyState.hidden =
                visibleShops.length !== 0;

        }


        /* RENDER SHOP CARDS */

        visibleShops.forEach(function (shop) {

            const card = document.createElement("article");

            card.className = "shop-card";


            const deviceTags = shop.devices
                .slice(0, 3)
                .map(function (device) {

                    return `
                        <span class="shop-card-tag">
                            ${escapeHTML(device)}
                        </span>
                    `;

                })
                .join("");


            card.innerHTML = `

                <div class="shop-card-image">

                    <i
                        class="fas ${escapeHTML(shop.icon)}"
                        aria-hidden="true">
                    </i>

                    <span class="shop-card-badge">
                        ${escapeHTML(shop.badge)}
                    </span>

                </div>


                <div class="shop-card-content">

                    <h3>
                        ${escapeHTML(shop.name)}
                    </h3>


                    <div class="shop-card-location">

                        <i
                            class="fas fa-location-dot"
                            aria-hidden="true">
                        </i>

                        <span>
                            ${escapeHTML(shop.township)},
                            ${escapeHTML(shop.city)}
                        </span>

                    </div>


                    <p class="shop-card-description">
                        ${escapeHTML(shop.description)}
                    </p>


                    <div class="shop-card-tags">
                        ${deviceTags}
                    </div>


                    <div class="shop-card-price">

                        <span>
                            Estimated starting cost
                        </span>

                        <strong>
                            ${formatPrice(shop.price)}
                        </strong>

                    </div>


                    <div class="shop-card-actions">

                        <button
                            type="button"
                            class="shop-details-button"
                            data-shop-id="${shop.id}">

                            <i class="fas fa-circle-info"></i>

                            Details

                        </button>


                        <button
                            type="button"
                            class="shop-contact-button"
                            data-shop-id="${shop.id}">

                            <i class="fas fa-phone"></i>

                            Contact

                        </button>


                        <button
                            type="button"
                            class="shop-directions-button"
                            data-shop-id="${shop.id}">

                            <i class="fas fa-diamond-turn-right"></i>

                            Directions

                        </button>

                    </div>

                </div>

            `;


            resultsContainer.appendChild(card);

        });


        /* UPDATE MAP */

        updateMapMarkers(visibleShops);

    }


    /* 13. SHOP DETAILS */

    function showShopDetails(shopId) {

        const shop = getShopById(shopId);

        if (!shop || !detailContent) {
            return;
        }


        closeDetailMap();

        detailContent.hidden = false;


        const deviceTags = shop.devices
            .map(function (device) {

                return `
                    <span>
                        <i class="fas fa-check" aria-hidden="true"></i>
                        ${escapeHTML(device)}
                    </span>
                `;

            })
            .join("");


        detailContent.innerHTML = `

            <div class="shop-detail-layout">


                <div class="shop-detail-left">


                    <div class="shop-detail-header">


                        <div class="shop-detail-image">

                            <i
                                class="fas ${escapeHTML(shop.icon)}"
                                aria-hidden="true">
                            </i>

                        </div>


                        <div class="shop-detail-basic">


                            <div class="shop-detail-name">

                                <h2>
                                    ${escapeHTML(shop.name)}
                                </h2>


                                <span class="shop-partner-badge">

                                    <i class="fas fa-circle-check"></i>

                                    Sample Listing

                                </span>

                            </div>


                            <p class="shop-detail-location">

                                <i class="fas fa-location-dot"></i>

                                ${escapeHTML(shop.township)},
                                ${escapeHTML(shop.city)}

                            </p>


                            <div class="shop-supported-devices">

                                <span>Supported Devices</span>

                                <div class="shop-device-tags">
                                    ${deviceTags}
                                </div>

                            </div>


                        </div>

                    </div>


                    <div class="shop-detail-about">

                        <h3>About This Shop</h3>

                        <p>
                            ${escapeHTML(shop.description)}
                        </p>

                        <p>
                            ${escapeHTML(shop.services)}
                        </p>

                    </div>


                    <div class="shop-detail-map-section">

                        <h3>

                            <i class="fas fa-map-marked-alt"></i>

                            Shop Location

                        </h3>


                        <div
                            id="shopDetailMap"
                            aria-label="Map showing the sample repair shop location">
                        </div>

                    </div>


                </div>


                <div class="shop-detail-divider"></div>


                <div class="shop-detail-right">


                    <div class="shop-info-group">

                        <h3>

                            <i class="fas fa-screwdriver-wrench"></i>

                            Available Services

                        </h3>

                        <p>
                            ${escapeHTML(shop.services)}
                        </p>

                    </div>


                    <div class="shop-info-group">

                        <h3>

                            <i class="fas fa-location-dot"></i>

                            Address

                        </h3>

                        <p>
                            ${escapeHTML(shop.address)}
                        </p>

                    </div>


                    <div class="shop-info-group">

                        <h3>

                            <i class="fas fa-clock"></i>

                            Opening Hours

                        </h3>


                        <div class="shop-opening-hours">

                            <div>

                                <span>Opening time</span>

                                <strong>
                                    ${escapeHTML(shop.hours)}
                                </strong>

                            </div>

                        </div>

                    </div>


                    <div class="shop-info-group">

                        <h3>

                            <i class="fas fa-money-bill-wave"></i>

                            Price Notes

                        </h3>

                        <p>
                            Estimated starting cost:
                            <strong>${formatPrice(shop.price)}</strong>
                        </p>

                        <p>
                            Final prices may vary depending on the device model,
                            condition and required replacement parts.
                        </p>

                    </div>


                    <div class="shop-info-group">

                        <h3>

                            <i class="fas fa-address-book"></i>

                            Contact Details

                        </h3>

                        <p>

                            <i class="fas fa-phone"></i>

                            ${escapeHTML(shop.phone)}

                        </p>

                    </div>


                    <div class="shop-info-group">

                        <h3>

                            <i class="fas fa-truck"></i>

                            Collection and Delivery

                        </h3>

                        <p>
                            ${
                                shop.delivery
                                    ? "Collection and delivery are listed as available in this sample listing."
                                    : "Collection and delivery are not listed as available in this sample listing."
                            }
                        </p>

                    </div>


                    <div class="shop-last-checked">

                        <i class="fas fa-circle-info"></i>

                        Prototype sample information.
                        Shop details, contact numbers and prices
                        have not been independently verified.

                    </div>


                    <button
                        type="button"
                        class="shop-report-button"
                        id="closeShopDetails">

                        <i class="fas fa-times"></i>

                        Close Details

                    </button>


                </div>

            </div>

        `;


        initialiseDetailMap(shop);


        /* SCROLL TO DETAILS */

        const detailsSection = shopPage.querySelector(
            "#shopDetails"
        );

        if (detailsSection) {

            detailsSection.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }

    }


    /* 14. SHOP DETAIL MAP */

    function initialiseDetailMap(shop) {

        const detailMapElement = shopPage.querySelector(
            "#shopDetailMap"
        );

        if (!detailMapElement) {
            return;
        }


        if (typeof L === "undefined") {

            detailMapElement.innerHTML = `
                <p class="shop-map-error">
                    Map could not be loaded.
                    Please check your internet connection.
                </p>
            `;

            return;

        }


        detailMap = L.map(detailMapElement).setView(
            [shop.latitude, shop.longitude],
            15
        );


        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {

                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

                maxZoom: 19

            }
        ).addTo(detailMap);


        detailMarker = L.marker([

            shop.latitude,

            shop.longitude

        ]).addTo(detailMap);


        detailMarker.bindPopup(
            `<strong>${escapeHTML(shop.name)}</strong>`
        ).openPopup();


        setTimeout(function () {

            if (detailMap) {

                detailMap.invalidateSize();

            }

        }, 300);

    }


    /* 15. SHOP CARD BUTTON EVENTS */

    if (resultsContainer) {

        resultsContainer.addEventListener("click", function (event) {


            const detailsButton = event.target.closest(
                ".shop-details-button"
            );

            const contactButton = event.target.closest(
                ".shop-contact-button"
            );

            const directionsButton = event.target.closest(
                ".shop-directions-button"
            );


            /* VIEW DETAILS */

            if (detailsButton) {

                showShopDetails(
                    detailsButton.dataset.shopId
                );

                return;

            }


            /* CONTACT SHOP */

            if (contactButton) {

                const shop = getShopById(
                    contactButton.dataset.shopId
                );

                if (!shop) {
                    return;
                }

                window.location.href =
                    "tel:" + shop.phone.replace(/[^+\d]/g, "");

                return;

            }


            /* GET DIRECTIONS */

            if (directionsButton) {

                const shop = getShopById(
                    directionsButton.dataset.shopId
                );

                if (!shop) {
                    return;
                }

                const destination =
                    shop.latitude + "," + shop.longitude;

                window.open(

                    "https://www.google.com/maps/dir/?api=1&destination=" +
                    encodeURIComponent(destination),

                    "_blank",

                    "noopener,noreferrer"

                );

                return;

            }

        });

    }


    /* 16. CLOSE SHOP DETAILS */

    if (detailContent) {

        detailContent.addEventListener("click", function (event) {

            if (event.target.closest("#closeShopDetails")) {

                closeShopDetails();

            }

        });

    }


    /* 17. RESET FILTERS */

    function resetFilters() {


        /* RESET SHOP TYPE */

        activeShopFilter = "all";


        shopFilterButtons.forEach(function (button) {

            const isActive =
                button.dataset.shopFilter === "all";

            button.classList.toggle(
                "active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        });


        /* RESET CATEGORY */

        selectedCategory = "household";

        updateCategoryButtons();


        /* RESET INPUTS */

        if (locationInput) {
            locationInput.value = "";
        }

        if (problemSelect) {
            problemSelect.value = "";
        }

        if (budgetInput) {
            budgetInput.value = "";
        }

        if (deliveryCheckbox) {
            deliveryCheckbox.checked = false;
        }

        if (sortSelect) {
            sortSelect.value = "recommended";
        }


        /* RESET DEVICE DROPDOWN */

        updateDeviceOptions();


        /* CLOSE DETAILS */

        closeShopDetails();


        /* APPLY DEFAULT FILTERS */

        applyFilters();

    }


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetFilters
        );

    }


    if (emptyResetButton) {

        emptyResetButton.addEventListener(
            "click",
            resetFilters
        );

    }


    /* 18. SEARCH FORM */

    if (searchForm) {

        searchForm.addEventListener("submit", function (event) {

            event.preventDefault();

            applyFilters();


            const resultsSection = shopPage.querySelector(
                ".shop-results-section"
            );

            if (resultsSection) {

                resultsSection.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }

        });

    }


    /* 19. SORT CONTROL */

    if (sortSelect) {

        sortSelect.addEventListener("change", function () {

            sortShops();

        });

    }


    /* 20. MAIN MAP INITIALISATION */

    function initialiseMap() {

        const mapElement = shopPage.querySelector(
            "#shopMap"
        );

        if (!mapElement) {
            return;
        }


        if (typeof L === "undefined") {

            mapElement.innerHTML = `
                <p class="shop-map-error">
                    The map could not be loaded.
                    Please check your internet connection.
                </p>
            `;

            return;

        }


        shopMap = L.map(mapElement).setView(
            [16.8409, 96.1735],
            12
        );


        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {

                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

                maxZoom: 19

            }
        ).addTo(shopMap);


        updateMapMarkers();


        setTimeout(function () {

            if (shopMap) {

                shopMap.invalidateSize();

            }

        }, 300);

    }


    /* 21. UPDATE MAP MARKERS */

    function updateMapMarkers(
        shopsToShow = getVisibleShops()
    ) {

        if (!shopMap || typeof L === "undefined") {
            return;
        }


        /* REMOVE OLD MARKERS */

        mapMarkers.forEach(function (marker) {

            shopMap.removeLayer(marker);

        });

        mapMarkers = [];


        /* ADD NEW MARKERS */

        shopsToShow.forEach(function (shop) {

            const marker = L.marker([

                shop.latitude,

                shop.longitude

            ]).addTo(shopMap);


            marker.bindPopup(`

                <strong>
                    ${escapeHTML(shop.name)}
                </strong>

                <br>

                ${escapeHTML(shop.township)},
                ${escapeHTML(shop.city)}

                <br>

                <span>
                    ${formatPrice(shop.price)}
                </span>

                <br>

                <button
                    type="button"
                    class="shop-popup-details"
                    data-shop-id="${shop.id}">

                    View Details

                </button>

            `);


            marker.on("click", function () {

                showShopDetails(shop.id);

            });


            mapMarkers.push(marker);

        });


        /* ADJUST MAP VIEW */

        if (mapMarkers.length > 0) {

            const group = L.featureGroup(mapMarkers);

            shopMap.fitBounds(
                group.getBounds().pad(0.15)
            );

        } else {

            shopMap.setView(
                [16.8409, 96.1735],
                12
            );

        }

    }


    /* 22. MAP POPUP BUTTON */

    document.addEventListener("click", function (event) {

        const popupButton = event.target.closest(
            ".shop-popup-details"
        );

        if (!popupButton) {
            return;
        }

        showShopDetails(
            popupButton.dataset.shopId
        );

    });


    /* 23. MAP TOGGLE */

    if (mapToggle && resultsLayout) {

        mapToggle.addEventListener("click", function () {

            const isHidden =
                resultsLayout.classList.toggle("map-hidden");


            mapToggle.setAttribute(
                "aria-expanded",
                String(!isHidden)
            );


            mapToggle.innerHTML = isHidden

                ? '<i class="fas fa-map"></i> Show Map'

                : '<i class="fas fa-map"></i> Hide Map';


            if (!isHidden && shopMap) {

                setTimeout(function () {

                    shopMap.invalidateSize();


                    if (mapMarkers.length > 0) {

                        const group = L.featureGroup(mapMarkers);

                        shopMap.fitBounds(
                            group.getBounds().pad(0.15)
                        );

                    }

                }, 300);

            }

        });

    }


    /* 24. CURRENT YEAR */

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


    /*  INITIALISE APPLICATION */

    updateCategoryButtons();

    updateDeviceOptions();

    applyFilters();

    initialiseMap();


});
/* weather-device-care.html */
(() => {

    "use strict";

    /* PAGE INITIALISATION */

    const page = document.querySelector(".weather-care-page");

    if (!page) return;


    /* ELEMENT REFERENCES */

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


    /* STATE */

    let activeGuide = null;


    /* HELPER: GET GUIDE DETAIL */

    function getGuideDetail(guideName) {

        return Array.from(guideDetails).find(detail => {
            return detail.dataset.detail === guideName;
        });

    }


    /* HELPER: GET GUIDE BUTTON */

    function getGuideButton(guideName) {

        return Array.from(readButtons).find(button => {
            return button.dataset.openGuide === guideName;
        });

    }


    /* HELPER: GET GUIDE CARD */

    function getGuideCard(guideName) {

        const button = getGuideButton(guideName);

        return button
            ? button.closest(".weather-guide-card")
            : null;

    }


    /* UPDATE GUIDE BUTTON */

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

        }

    }


    /* CLOSE ALL GUIDE DETAILS */

    function closeAllGuides() {

        guideDetails.forEach(detail => {

            detail.hidden = true;

        });

        readButtons.forEach(button => {

            updateGuideButton(button, false);

        });

        activeGuide = null;

    }


    /* OPEN SELECTED GUIDE */

    function openGuide(guideName) {

        const selectedDetail = getGuideDetail(guideName);

        const selectedButton = getGuideButton(guideName);

        const selectedCard = getGuideCard(guideName);

        // Stop if the guide does not exist.

        if (
            !selectedDetail ||
            !selectedButton ||
            !selectedCard ||
            selectedCard.hidden
        ) {
            return;
        }

        // Close the current guide if it is already open.

        if (activeGuide === guideName) {

            closeAllGuides();

            return;

        }

        // Close any previously opened guide.

        closeAllGuides();

        // Display the selected guide.

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


    /* GUIDE BUTTON EVENTS */

    readButtons.forEach(button => {

        button.addEventListener("click", () => {

            const guideName = button.dataset.openGuide;

            if (!guideName) return;

            openGuide(guideName);

        });

    });


    /* OPTIONAL CLOSE BUTTON EVENTS */

    closeButtons.forEach(button => {

        button.addEventListener("click", () => {

            closeAllGuides();

        });

    });


    /* DEVICE FILTERING */

    function filterGuides(device) {

        let visibleCount = 0;


        // Update the active filter button.

        filterButtons.forEach(button => {

            const isActive = button.dataset.device === device;

            button.classList.toggle("active", isActive);

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        });


        // Show or hide matching guide cards.

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


        // Display the empty message when no guides match.

        if (emptyMessage) {

            emptyMessage.hidden = visibleCount !== 0;

        }


        // Close the guide if its card is no longer visible.

        if (activeGuide) {

            const activeCard = getGuideCard(activeGuide);

            if (!activeCard || activeCard.hidden) {

                closeAllGuides();

            }

        }

    }


    /* FILTER BUTTON EVENTS */

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedDevice = button.dataset.device;

            if (!selectedDevice) return;

            filterGuides(selectedDevice);

        });

    });


    /* KEYBOARD ACCESSIBILITY */

    page.addEventListener("keydown", event => {

        if (event.key === "Escape" && activeGuide) {

            closeAllGuides();

            const button = getGuideButton(activeGuide);

            if (button) {

                button.focus();

            }

        }

    });


    /* PDF DOWNLOAD LINKS */

    const downloadLinks = page.querySelectorAll(
        ".weather-download-btn, " +
        ".weather-detail-download-btn, " +
        ".weather-guide-actions .weather-download-btn"
    );

    downloadLinks.forEach(link => {

        const destination = link.getAttribute("href");

        // Prevent placeholder links from doing nothing.

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


    /* REPAIR SUPPORT LINKS */

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


    /* INITIALISE GUIDE BUTTONS */

    readButtons.forEach(button => {

        button.setAttribute(
            "aria-expanded",
            "false"
        );

        // Preserve the existing button icon and text.

        const label = button.querySelector(
            ".weather-button-text"
        );

        if (label && !label.textContent.trim()) {

            label.textContent = "Read Guide";

        }

    });


    /* INITIAL PAGE STATE */

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


/* RE:POWER COLLECTION & DELIVERY JavaScript Functionality */

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
