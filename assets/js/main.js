
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
