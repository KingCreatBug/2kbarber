document.addEventListener("DOMContentLoaded", function () {
    // Load header
    fetch("../../templates/header.html")
        .then((response) => response.text())
        .then((data) => {
            document.getElementById("header").innerHTML = data;
        })
        .catch((error) => console.error("Error loading header:", error));

    // Load footer
    fetch("../../templates/footer.html")
        .then((response) => response.text())
        .then((data) => {
            document.getElementById("footer").innerHTML = data;
        })
        .catch((error) => console.error("Error loading footer:", error));
});

// Shop
// Generic function to show or hide elements based on event type
function toggleVisibility(eventType, elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        if (eventType === "mouseenter") {
            element.style.opacity = "1";
            element.style.visibility = "visible";
        } else if (eventType === "mouseleave") {
            element.style.opacity = "0";
            element.style.visibility = "hidden";
        }
    }
}

// Event handler for mouse events
function handleMouseEvent(event, elementId) {
    toggleVisibility(event.type, elementId);
}

// Attach event listeners to buttons
document.querySelectorAll(".shop-container__btn").forEach((button) => {
    const elementId = button.getAttribute("data-target"); // Use data attribute to get corresponding element ID
    button.addEventListener("mouseenter", (event) =>
        handleMouseEvent(event, elementId)
    );
    button.addEventListener("mouseleave", (event) =>
        handleMouseEvent(event, elementId)
    );
});
