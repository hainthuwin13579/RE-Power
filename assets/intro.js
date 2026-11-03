/* re:power Intro Page */

document.addEventListener("DOMContentLoaded", function () {

    const HOME_PAGE = "index.html";
    const intro = document.getElementById("intro");

    const key = "repowerIntroPlayed";

    // If intro element doesn't exist, do nothing
    if (!intro) return;

    // Check whether intro has already played
    if (localStorage.getItem(key) === "true") {

        window.location.replace(HOME_PAGE);
        return;

    }

    // Start intro timer
    setTimeout(function () {

        // Fade out intro
        intro.classList.add("leaving");

        // Save that intro has played
        localStorage.setItem(key, "true");

        // Redirect to homepage after fade-out
        setTimeout(function () {

            window.location.replace(HOME_PAGE);

        }, 850);

    }, 7000);

});