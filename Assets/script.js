// Sticky Navigation Menu JS Code
let nav = document.querySelector("nav");
let val;

// Side NavIgation Menu JS Code
let body = document.querySelector("body");
let navBar = document.querySelector(".navbar");
let menuBtn = document.querySelector(".menu-btn");
let cancelBtn = document.querySelector(".cancel-btn");
menuBtn.onclick = function() {
    navBar.classList.add("active");
    menuBtn.style.opacity = "0";
    menuBtn.style.pointerEvents = "none";
    body.style.overflow = "hidden";
}
cancelBtn.onclick = function() {
    navBar.classList.remove("active");
    menuBtn.style.opacity = "1";
    menuBtn.style.pointerEvents = "auto";
    body.style.overflow = "auto";
}

// Side Navigation Bar Close While We Click On Navigation Links
let navLinks = document.querySelectorAll(".menu li a");
for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function() {
        navBar.classList.remove("active");
        menuBtn.style.opacity = "1";
        menuBtn.style.pointerEvents = "auto";
    });
}

function getPageUrl() {
    return window.location.href;
}

// Set the value of the input field with the page URL
document.getElementById('pageUrlInput').value = getPageUrl();

function resetMessageBoxColor() {
    var messageBox = document.getElementById("message");
    messageBox.style.backgroundColor = "beige";
    messageBox.style.color = "green";
}

document.getElementById("form").addEventListener("submit", function(e) {
    e.preventDefault();
    resetMessageBoxColor();
    var messageBox = document.getElementById("message");
    messageBox.textContent = "Submitting..";
    messageBox.style.display = "block";
    document.getElementById("submit-button").disabled = true;

    var currentDate = new Date();
    var day = String(currentDate.getDate()).padStart(2, "0");
    var month = String(currentDate.getMonth() + 1).padStart(2, "0");
    var year = currentDate.getFullYear();
    var hours = String(currentDate.getHours()).padStart(2, "0");
    var minutes = String(currentDate.getMinutes()).padStart(2, "0");
    var seconds = String(currentDate.getSeconds()).padStart(2, "0");

    // 12-hour format conversion
    var hours12 = hours % 12 || 12; // Converts to 12-hour format
    var period = currentDate.getHours() >= 12 ? "PM" : "AM";

    // Retrieve the time zone
    var region = Intl.DateTimeFormat().resolvedOptions().timeZone;

    var timestamp = `${day}/${month}/${year} ${hours}:${minutes}:${seconds} or ${hours12}:${minutes}:${seconds} ${period} ${region}`;

    document.querySelector('input[name="Timestamp"]').value = timestamp;
    document.querySelector('input[name="PageUrl"]').value = getPageUrl();

    var formData = new FormData(this);

    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
    }).then(function(response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to submit the form.");
        }
    }).then(function(data) {
        messageBox.textContent = "Message Submitted Successfully!";
        messageBox.style.backgroundColor = "green";
        messageBox.style.color = "beige";
        document.getElementById("submit-button").disabled = false;
        document.getElementById("form").reset();

        setTimeout(function() {
            messageBox.textContent = "";
            messageBox.style.display = "none";
        }, 2000);
    }).catch(function(error) {
        console.error(error);
        messageBox.textContent = "An error occurred while submitting the form.";
    });
});
