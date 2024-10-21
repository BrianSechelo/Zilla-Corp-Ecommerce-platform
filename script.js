// Add to Cart function in sproduct.html
function addToCart() {
    const selectedSize = document.getElementById('sizeSelect').value;
    if (!selectedSize) {
        alert('Please select a size before adding the product to the cart.');
        return;
    }

    const productName = document.querySelector('.single-pro-details h4').innerText;
    const productPrice = parseFloat(document.querySelector('.single-pro-details h2').innerText.replace('$', ''));
    const productQuantity = parseInt(document.getElementById('quantity').value);
    const productImage = document.querySelector('.single-pro-image img').src;

    const product = {
        name: productName,
        price: productPrice,
        quantity: productQuantity,
        size: selectedSize,
        image: productImage
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product already exists in the cart (same product name and size)
    const existingProductIndex = cart.findIndex(p => p.name === productName && p.size === selectedSize);
    if (existingProductIndex !== -1) {
        // Update quantity if product exists
        cart[existingProductIndex].quantity += productQuantity;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
}

// Load Cart Items to Cart.html
function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTable = document.getElementById('cartItems');
    let subtotal = 0;
    let total = 0; // Initialize total
    cartTable.innerHTML = '';  // Clear the cart table before loading

    cartItems.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        const row = `
            <tr>
                <td><a href="#" onclick="removeFromCart(${index})"><i class="far fa-times-circle"></i></a></td>
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td>${item.name} (${item.size})</td>
                <td>Kshs. ${item.price.toFixed(2)}</td>
                <td><input type="number" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)"></td>
                <td>Kshs. ${itemSubtotal.toFixed(2)}</td>
            </tr>
        `;

        cartTable.innerHTML += row;
    });

    document.getElementById('cartSubtotal').innerText = `Kshs. ${subtotal.toFixed(2)}`;
    total = subtotal;
    document.getElementById('cartTotal').innerText = `Kshs. ${total.toFixed(2)}`;
}

function updateQuantity(index, newQuantity) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems[index].quantity = parseInt(newQuantity);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    loadCart();
}

function removeFromCart(index) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    loadCart();
}

// Clear the cart on logout
function logout() {
    localStorage.removeItem('cart');
    window.location.href = "landingpage.html";  // Assuming you have a logout page
}

// Call loadCart when the page loads
window.onload = loadCart;
document.getElementById('checkoutButton').addEventListener('click', function() {
    // Assuming cart data is stored in localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItems.length === 0) {
        alert('Your cart is empty. Please add items before proceeding to checkout.');
        return;
    }

    // You can send the cart details to your server here if needed
    // e.g., make an AJAX request to the server to save the cart

    // Redirect to checkout page
    window.location.href = '/checkout.html';
});

