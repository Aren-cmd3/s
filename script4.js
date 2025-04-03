document.addEventListener("DOMContentLoaded", function () {
    // Add check all functionality
    const checkAllBox = document.getElementById('check-all');
    if (checkAllBox) {
        checkAllBox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.cart-item-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
                checkbox.closest('.cart-item').classList.toggle('unchecked', !this.checked);
            });
            updateTotal();
        });
    }

    // Update cart display
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    localStorage.setItem("cartCount", cartCount);
    const cartLink = document.getElementById('cart-link');
    cartLink.innerHTML = `CART <span class="cart-count">${cartCount}</span>`;

    // Update selected products in checkout form
    const selectedProducts = document.getElementById('selected-products');
    if (selectedProducts) {
        let total = 0;
        selectedProducts.innerHTML = '<h3>Selected Products:</h3>';

        cart.forEach((item, index) => {
            const productCheckbox = document.createElement('div');
            productCheckbox.className = 'product-checkbox';
            const itemPrice = parseFloat(item.price.replace('₱', ''));
            const itemTotal = itemPrice * item.quantity;

            productCheckbox.innerHTML = `
                <input type="checkbox" id="product-${index}" name="product[]" checked>
                <label for="product-${index}">
                    <span class="product-name">${item.name}</span>
                    <span class="product-details">₱${itemPrice.toFixed(2)} × ${item.quantity} = ₱${itemTotal.toFixed(2)}</span>
                </label>
            `;
            selectedProducts.appendChild(productCheckbox);

            const checkbox = productCheckbox.querySelector(`#product-${index}`);
            checkbox.addEventListener('change', function() {
                updateTotal();
                this.closest('.product-checkbox').classList.toggle('unchecked');
            });

            if(checkbox.checked) {
                total += itemTotal;
            }
        });

        // Add total display div if not exists
        let totalDisplay = document.getElementById('products-total');
        if (!totalDisplay) {
            totalDisplay = document.createElement('div');
            totalDisplay.id = 'products-total';
            totalDisplay.className = 'total-display';
            selectedProducts.appendChild(totalDisplay);
        }
        totalDisplay.textContent = `Total: ₱${total.toFixed(2)}`;
    }

    function updateTotal() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        let total = 0;
        const checkedProducts = document.querySelectorAll('.product-checkbox input:checked');

        checkedProducts.forEach(checkbox => {
            const productId = checkbox.id.split('-')[1];
            const item = cart[productId];
            const itemPrice = parseFloat(item.price.replace('₱', ''));
            total += itemPrice * item.quantity;
        });

        document.getElementById('subtotal-amount').textContent = `₱${total.toFixed(2)}`;
        document.getElementById('total-amount').textContent = `₱${total.toFixed(2)}`;
        document.getElementById('total-price').textContent = total.toFixed(2);
    }

    // Check if user is logged in
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    const dashboardLink = document.querySelector("#dashboard-link");
    const dashboardPic = document.getElementById("dashboard-pic");

    if (user) {
        let firstName = user.name.split(" ")[0];
        dashboardLink.textContent = `Hi, ${firstName}`;
        dashboardLink.href = "dashboard.html";

        if (user.profilePic) {
            dashboardPic.src = user.profilePic;
        }
    }

    // Display cart items and total here
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartContainer = document.getElementById('cart-items');
    let total = 0;

    cartItems.forEach(item => {
        total += parseFloat(item.price.replace('₱', '')) * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <input type="checkbox" class="cart-item-checkbox" checked>
            <a href="index2.html?id=${item.id}"> <img src="${item.img}" alt="${item.name}"> </a>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>Price: ${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
            </div>
        `;
        cartContainer.appendChild(itemElement);
    });

    document.getElementById('total').textContent = `₱${total.toFixed(2)}`;
});