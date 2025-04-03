
document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Add click handler for place order button
    document.querySelector('.place-order-btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        const subtotal = document.getElementById('subtotal').textContent;
        const total = document.getElementById('total').textContent;
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        
        let receiptContent = `
            ===== Class Craft Receipt =====\n
            Order Details:\n`;
            
        cart.forEach(item => {
            const itemTotal = parseFloat(item.price.replace('₱', '')) * item.quantity;
            receiptContent += `
            ${item.name}
            Quantity: ${item.quantity}
            Price: ${item.price}
            Item Total: ₱${itemTotal.toFixed(2)}\n`;
        });
        
        receiptContent += `
            ========================
            Subtotal: ${subtotal}
            Total: ${total}
            Payment Method: ${paymentMethod}
            ========================
            Thank you for shopping at Class Craft!`;
            
        alert(receiptContent);
        
        // Save purchase history and calculate reward points
        const purchaseTotal = parseFloat(total.replace('₱', ''));
        const rewardPoints = purchaseTotal * 0.001; // 0.1% reward points

        const purchase = {
            items: cart,
            total: purchaseTotal,
            date: new Date().toISOString(),
            rewardPoints: rewardPoints
        };

        // Update user's total reward points
        let user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (user) {
            user.rewardPoints = (user.rewardPoints || 0) + rewardPoints;
            localStorage.setItem('loggedInUser', JSON.stringify(user));
        }
        
        let purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
        purchaseHistory.push(purchase);
        localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
        
        // Clear cart and redirect
        localStorage.removeItem('cart');
        window.location.href = 'index2.html';
    });
    if (cart.length === 0) {
        const productPreview = document.querySelector('.product-preview');
        productPreview.innerHTML = `
            <div class="empty-cart">
                <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty Cart" style="width: 150px; opacity: 0.5;">
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything to your cart yet</p>
                <a href="index2.html" class="shop-now-btn">Shop Now</a>
            </div>
        `;
        document.querySelector('.order-total').style.display = 'none';
        return;
    }

    // Update product preview with cart items
    const productPreview = document.querySelector('.product-preview');
    let subtotal = 0;

    cart.forEach(item => {
        const itemPrice = parseFloat(item.price.replace('₱', ''));
        const itemTotal = itemPrice * item.quantity;
        subtotal += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'product-details';
        itemElement.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="item-info">
                <h3>${item.name}</h3>
                <p class="product-price">₱${itemPrice.toFixed(2)}</p>
                <p class="quantity">Quantity: ${item.quantity}</p>
                <p class="item-total">Item Total: ₱${itemTotal.toFixed(2)}</p>
            </div>
        `;
        productPreview.appendChild(itemElement);
    });

    // Update subtotal and total display
    document.getElementById('subtotal').textContent = `₱${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `₱${subtotal.toFixed(2)}`;

    // Initialize quantity controls
    const quantity = document.getElementById('quantity');
    const decrease = document.getElementById('decrease');
    const increase = document.getElementById('increase');

    function updateTotals() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let subtotal = 0;
        
        cart.forEach(item => {
            const price = parseFloat(item.price.replace('₱', ''));
            subtotal += price * item.quantity;
        });

        const shipping = 0; // Free shipping
        const total = subtotal + shipping;

        document.getElementById('subtotal').textContent = `₱${subtotal.toFixed(2)}`;
        document.getElementById('total').textContent = `₱${total.toFixed(2)}`;
    }

    decrease.addEventListener('click', () => {
        if (quantity.value > 1) {
            quantity.value = parseInt(quantity.value) - 1;
            updateTotals();
        }
    });

    increase.addEventListener('click', () => {
        quantity.value = parseInt(quantity.value) + 1;
        updateTotals();
    });

    quantity.addEventListener('change', updateTotals);

    // Handle form submission
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        const purchase = {
            image: buyNowItem.img,
            name: buyNowItem.name,
            price: buyNowItem.price,
            quantity: quantity.value,
            timestamp: new Date().toISOString()
        };

        // Store purchase in localStorage
        let recentPurchases = JSON.parse(localStorage.getItem('recentPurchases') || '[]');
        recentPurchases.unshift(purchase);
        recentPurchases = recentPurchases.slice(0, 5); // Keep only 5 most recent purchases
        localStorage.setItem('recentPurchases', JSON.stringify(recentPurchases));
    });

    // Initial total calculation
    updateTotals();

    // Form submission handling
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        
        const orderDetails = {
            name,
            email,
            address,
            phone,
            payment: paymentMethod,
            product: {
                name: buyNowItem.name,
                price: buyNowItem.price,
                quantity: quantity.value,
                subtotal: document.getElementById('subtotal').textContent,
                total: document.getElementById('total').textContent
            }
        };

        // Send email receipt
        emailjs.send("service_2cfjz33", "template_b581ojd", {
            user_email: email,
            user_name: name,
            order_details: `
                <div style="padding: 10px 0;">
                    <strong>Product:</strong> ${buyNowItem.name}<br>
                    <strong>Quantity:</strong> ${quantity.value}<br>
                    <strong>Price:</strong> ${buyNowItem.price}<br>
                    <strong>Subtotal:</strong> ${document.getElementById('subtotal').textContent}<br>
                    <strong>Shipping:</strong> FREE<br>
                    <strong>Total:</strong> ${document.getElementById('total').textContent}<br>
                    <strong>Shipping Address:</strong> ${address}<br>
                    <strong>Payment Method:</strong> ${paymentMethod}
                </div>
            `
        })
        .then(function(response) {
            alert('Order placed successfully! Check your email for the receipt.');
            localStorage.removeItem('buyNowItem');
            window.location.href = 'index2.html';
        })
        .catch(function(error) {
            alert('Error sending receipt. Your order is still processed.');
            localStorage.removeItem('buyNowItem');
            window.location.href = 'index2.html';
        });
    });

    // Floating label animation
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
});
