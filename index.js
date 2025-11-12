function openPopup(popupId) {
    // Close all popups first
    closeAllPopups();
    
    const popup = document.getElementById(popupId);
    const blurOverlay = document.getElementById('blur-overlay');
    
    if (popup && blurOverlay) {
        popup.style.cssText = 'display: block !important; position: fixed !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; background: white !important; padding: 30px !important; border-radius: 15px !important; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important; z-index: 1000 !important; max-width: 500px !important; width: 90% !important; max-height: 80vh !important; overflow-y: auto !important; visibility: visible !important; opacity: 1 !important;';
        blurOverlay.style.display = 'block';
        blurOverlay.style.zIndex = '999';
        if (popupId === 'popup_donate') {
            document.getElementById("donationForm").style.display = "block";
        }
    }
}

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    const blurOverlay = document.getElementById('blur-overlay');
    
    if (popup && blurOverlay) {
        popup.style.display = 'none';
        blurOverlay.style.display = 'none';
        if (popupId === 'popup_donate') {
            document.getElementById("qrSection").style.display = "none";
        }
    }
}

function closeAllPopups() {
    const popups = document.querySelectorAll('.popup');
    const blurOverlay = document.getElementById('blur-overlay');
    
    popups.forEach(popup => {
        popup.style.display = 'none';
    });
    
    if (blurOverlay) {
        blurOverlay.style.display = 'none';
    }
    
    document.getElementById("qrSection").style.display = "none";
}



document.getElementById("donationForm").addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
    event.preventDefault();

    const donorName = document.getElementById("donorName").value.trim();
    const donorEmail = document.getElementById("donorEmail").value.trim();
    const donorMobile = document.getElementById("donorMobile").value.trim();

    if (!validateDonationForm(donorName, donorEmail, donorMobile)) {
        return;
    }

    storeDataInGoogleSheets(donorName, donorEmail, donorMobile);
}

function validateDonationForm(name, email, mobile) {
    if (!name || !email || !mobile) {
        alert("Please fill in all fields before proceeding.");
        return false;
    }

    if (name.length < 2) {
        alert("Name must be at least 2 characters long.");
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
        alert("Please enter a valid mobile number.");
        return false;
    }

    return true;
}


function storeDataInGoogleSheets(name, email, mobile) {
    const scriptURL = "https://script.google.com/macros/s/AKfycbzQ1tNA59sm15P6bjjN6d5xhVsZeUsWuN46hOyym4pBLARzYlWKp2W5ML76DTyZmX5e8g/exec";

    fetch(scriptURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile }),
        mode: "no-cors"  // <--- This avoids CORS errors but you won't get a response
    })
        .then(() => {
            alert("Donation details submitted successfully!");
            document.getElementById("donationForm").style.display = "none";
            showQRCode();
            resetForm();
        })
        .catch(error => console.error("Error:", error));

}



function showQRCode() {
    const qrSection = document.getElementById("qrSection");
    if (qrSection.style.display === "block") return;

    qrSection.style.display = "block";
    let timeLeft = 300;
    const countdownElement = document.getElementById("countdown");

    if (!countdownElement) {
        console.error("Countdown element not found!");
        return;
    }

    const timer = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        countdownElement.innerHTML = `QR Code will expire in ${minutes}m ${seconds}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            qrSection.style.display = "none";
        }
        timeLeft--;
    }, 1000);
}



function resetForm() {
    setTimeout(() => {
        document.getElementById("donationForm").reset();
    }, 3000);
}

function showPaymentSuccess() {
    closePopup('popup_donate');
    document.getElementById('success-message').textContent = 'Your payment has been successfully completed! We will respond to you soon.';
    openPopup('popup_success');
}

function showPaymentFailure() {
    closePopup('popup_donate');
    document.getElementById('failure-message').textContent = 'If your payment failed or you clicked wrongly, please contact our team for assistance.';
    openPopup('popup_failure');
}

function showVolunteerSuccess() {
    closePopup('popup_volunteer');
    document.getElementById('success-message').textContent = 'You have sent your volunteer request successfully! Our team will reach out to you soon.';
    openPopup('popup_success');
}




// volunteer form
// Handle volunteer form submission
document.querySelector(".volunteer-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("volunteer-name").value.trim();
    const email = document.getElementById("volunteer-email").value.trim();
    const phone = document.getElementById("volunteer-phone").value.trim();

    if (!validateVolunteerForm(name, email, phone)) {
        return;
    }

    storeVolunteerData(name, email, phone);
});

function validateVolunteerForm(name, email, phone) {
    if (!name || !email || !phone) {
        alert("Please fill in all fields before submitting.");
        return false;
    }

    if (name.length < 2) {
        alert("Name must be at least 2 characters long.");
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
        alert("Please enter a valid phone number.");
        return false;
    }

    return true;
}

function storeVolunteerData(name, email, phone) {
    const scriptURL = "https://script.google.com/macros/s/AKfycbzKE0Z_-AV_jsNhEGHo_6AGTDwWCeYNfVer4FRhX--DTnaOzB6aRnBYtQwhGZBJWh88/exec";

    fetch(scriptURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile: phone }),
        mode: "no-cors"
    })
        .then(() => {
            showVolunteerSuccess();
            resetVolunteerForm();
        })
        .catch(() => { alert("Volunteer details not submitted"); error => console.error("Error:", error) });
}

function resetVolunteerForm() {
    setTimeout(() => {
        document.querySelector(".volunteer-form").reset();
    }, 3000);
}