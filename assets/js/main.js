

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
