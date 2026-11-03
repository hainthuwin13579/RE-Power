

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
