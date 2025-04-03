document.addEventListener("DOMContentLoaded", function () {
    function login() {
        let email = document.getElementById("login-email").value.trim();
        let password = document.getElementById("login-password").value.trim();
        let errorMessage = document.getElementById("error-message");

        let users = JSON.parse(localStorage.getItem("users")) || [];

        let user = users.find(user => user.email === email && user.password === password);

        if (user) {
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            alert("Login successful!");
            window.location.href = "index.html"; // Redirect to homepage
        } else {
            errorMessage.textContent = "Invalid email or password!";
        }
    }

    window.login = login;
});
