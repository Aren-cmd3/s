document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("DceEzWwmYn-Yp0ADD"); // Your EmailJS Public Key
});

function sendResetLink() {
    const email = document.getElementById("forgot-email").value;
    const confirmationMessage = document.getElementById("confirmation-message");

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    localStorage.setItem("reset_otp", otp); // Store OTP for verification
    localStorage.setItem("reset_email", email);

    sendMail(email, otp);
}

function sendMail(email, otp) {
    const templateParams = {
        user_email: email, // Ensure this matches EmailJS template
        otp_code: otp
    };

    emailjs.send("service_nkthqzu", "template_ekbw1t2", templateParams)
        .then(function (response) {
            console.log("✅ Email Sent Successfully:", response);
            document.getElementById("confirmation-message").innerText = "✅ OTP sent successfully! Check your email.";
            document.getElementById("confirmation-message").style.color = "green";

            document.getElementById("otp-section").style.display = "block"; // Show OTP input
        })
        .catch(function (error) {
            console.error("❌ EmailJS Error:", error);
            document.getElementById("confirmation-message").innerText = "❌ Error sending OTP. Try again later.";
            document.getElementById("confirmation-message").style.color = "red";
        });
}

function verifyOTP() {
    const enteredOTP = document.getElementById("otp-input").value;
    const storedOTP = localStorage.getItem("reset_otp");

    if (enteredOTP === storedOTP) {
        document.getElementById("confirmation-message").innerText = "✅ OTP Verified! Enter a new password.";
        document.getElementById("confirmation-message").style.color = "green";
        document.getElementById("otp-section").style.display = "none"; // Hide OTP section
        document.getElementById("password-section").style.display = "block"; // Show password reset section
    } else {
        document.getElementById("confirmation-message").innerText = "❌ Invalid OTP. Try again.";
        document.getElementById("confirmation-message").style.color = "red";
    }
}

function resetPassword() {
    const newPassword = document.getElementById("new-password").value;

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPassword)) {
        document.getElementById("confirmation-message").innerText = "❌ Password must be at least 8 characters and contain letters & numbers.";
        document.getElementById("confirmation-message").style.color = "red";
        return;
    }

    document.getElementById("confirmation-message").innerText = "✅ Password reset successfully! You can now log in.";
    document.getElementById("confirmation-message").style.color = "green";

    // Clear stored OTP & email after reset
    localStorage.removeItem("reset_otp");
    localStorage.removeItem("reset_email");

    setTimeout(() => {
        window.location.href = "index3.html"; // Redirect to login page
    }, 3000); // Redirect after 3 seconds
}