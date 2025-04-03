document.addEventListener("DOMContentLoaded", function() {
    const cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
    const cartLink = document.getElementById('cart-link');
    if (cartCount > 0) {
        cartLink.innerHTML = `CART <span class="cart-count">${cartCount}</span>`;
    }
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    let addressList = JSON.parse(localStorage.getItem("addresses")) || [];

    if (!user) {
        window.location.href = "index3.html"; 
        return;
    }

    // Calculate order statistics
    const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    const totalOrders = purchaseHistory.length;
    const totalSpent = purchaseHistory.reduce((sum, purchase) => sum + purchase.total, 0);

    // Update stats display
    document.querySelector('.stat-number').textContent = totalOrders;
    document.querySelectorAll('.stat-number')[1].textContent = `₱${totalSpent.toFixed(2)}`;
    document.querySelectorAll('.stat-number')[2].textContent = `${(user.rewardPoints || 0).toFixed(2)}`;

    let firstName = user.name.split(" ")[0];
    let fullName = user.name;
    let email = user.email;
    
    // Update user information display
    document.getElementById("user-name").textContent = `Hi, ${firstName}`;
    
    // Add user details section
    const userInfoSection = document.createElement('div');
    userInfoSection.className = 'user-info';
    userInfoSection.innerHTML = `
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Birthday:</strong> ${user.birthday || 'Not provided'}</p>
        <p><strong>Account Status:</strong> Active</p>
        <p><strong>Member Since:</strong> ${new Date().toLocaleDateString()}</p>
    `;
    
    document.querySelector('.profile-section').insertBefore(
        userInfoSection, 
        document.querySelector('.logout-btn')
    );

    const profilePic = document.getElementById("profile-pic");
    if (user.profilePic) {
        profilePic.src = user.profilePic;
    }

    document.getElementById("profile-pic-upload").addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePic.src = e.target.result;
                user.profilePic = e.target.result;
                localStorage.setItem("loggedInUser", JSON.stringify(user));
            };
            reader.readAsDataURL(file);
        }
    });

    function renderAddresses() {
        let addressContainer = document.getElementById("address-list");
        addressContainer.innerHTML = "";
        addressList.forEach((address, index) => {
            let addressHTML = `
                <div class="address-item">
                    <div>
                        <strong>${address.name}</strong> | ${address.phone} <br>
                        ${address.details}
                        ${address.default ? "<span class='default-tag'>DEFAULT</span>" : ""}
                    </div>
                    <div class="address-actions">
                        <button onclick="setDefaultAddress(${index})">Set as Default</button>
                        <button onclick="editAddress(${index})">Edit</button>
                        <button onclick="deleteAddress(${index})">Delete</button>
                    </div>
                </div>
            `;
            addressContainer.innerHTML += addressHTML;
        });
    }

    window.openAddressModal = function () {
        document.getElementById("address-modal").style.display = "block";
    };

    window.closeAddressModal = function () {
        document.getElementById("address-modal").style.display = "none";
    };

    window.saveAddress = function () {
        let firstName = document.getElementById("address-firstname").value;
        let middleName = document.getElementById("address-middlename").value;
        let lastName = document.getElementById("address-lastname").value;
        let fullName = `${firstName} ${middleName} ${lastName}`.trim();
        let phone = document.getElementById("address-phone").value;
        let details = document.getElementById("address-details").value;

        if (firstName && lastName && phone && details) {
            addressList.push({ name: fullName, phone, details, default: false });
            localStorage.setItem("addresses", JSON.stringify(addressList));
            renderAddresses();
            closeAddressModal();
        } else {
            alert("Please fill out all fields.");
        }
    };

    window.setDefaultAddress = function (index) {
        addressList.forEach((addr, i) => addr.default = i === index);
        localStorage.setItem("addresses", JSON.stringify(addressList));
        renderAddresses();
    };

    window.editAddress = function (index) {
        let address = addressList[index];
        const names = address.name.split(' ');
        document.getElementById("address-firstname").value = names[0] || '';
        document.getElementById("address-middlename").value = names[1] || '';
        document.getElementById("address-lastname").value = names[2] || '';
        document.getElementById("address-phone").value = address.phone;
        document.getElementById("address-details").value = address.details;
        document.getElementById("modal-title").textContent = "Edit Address";
        document.getElementById("address-modal").style.display = "block";
        
        // Override save function temporarily for editing
        window.saveAddress = function() {
            let firstName = document.getElementById("address-firstname").value;
            let middleName = document.getElementById("address-middlename").value;
            let lastName = document.getElementById("address-lastname").value;
            let fullName = `${firstName} ${middleName} ${lastName}`.trim();
            let phone = document.getElementById("address-phone").value;
            let details = document.getElementById("address-details").value;

            if (firstName && lastName && phone && details) {
                addressList[index] = { 
                    name: fullName, 
                    phone, 
                    details, 
                    default: address.default 
                };
                localStorage.setItem("addresses", JSON.stringify(addressList));
                renderAddresses();
                closeAddressModal();
            } else {
                alert("Please fill out all fields.");
            }
        };
    };

    window.deleteAddress = function (index) {
        addressList.splice(index, 1);
        localStorage.setItem("addresses", JSON.stringify(addressList));
        renderAddresses();
    };

    renderAddresses();

    window.logout = function() {
        localStorage.removeItem("loggedInUser");
        window.location.href = "index.html";
    };
});