document.getElementById("signup-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let firstName = document.getElementById("firstName").value.trim();
    let middleName = document.getElementById("middleName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let name = `${firstName} ${middleName} ${lastName}`;
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let birthMonth = document.getElementById("birthMonth").value;
    let birthDay = document.getElementById("birthDay").value;
    let birthYear = document.getElementById("birthYear").value;
    let birthday = `${birthMonth}/${birthDay}/${birthYear}`;

    // Add validation for all fields
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.value.trim() === '') {
            input.classList.add('invalid');
            input.classList.remove('valid');
        } else {
            input.classList.add('valid');
            input.classList.remove('invalid');
        }
    });

    // Check if any field is invalid
    if (document.querySelectorAll('.invalid').length > 0) {
        alert("Please fill in all fields correctly.");
        return;
    }

    if (name === "" || email === "" || password === "") {
        alert("Please fill in all fields.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    if (users.some(user => user.email === email)) {
        alert("Email already registered! Please log in.");
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully!");
    window.location.href = "index3.html"; // Redirect to login page
});
