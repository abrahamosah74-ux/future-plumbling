// Products Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
    
    // Cart functionality
    const cartToggle = document.getElementById('cart-toggle');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const clearCartBtn = document.getElementById('clear-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Initialize cart from localStorage or empty array
    let cart = JSON.parse(localStorage.getItem('futurePlumbingCart')) || [];
    
    // Toggle cart sidebar
    if (cartToggle) {
        cartToggle.addEventListener('click', toggleCart);
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', toggleCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', toggleCart);
    }
    
    function toggleCart() {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        updateCartDisplay();
    }
    
    // Update cart count
    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }
    
    // Update cart display
    function updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        const cartTotalPrice = document.getElementById('cart-total-price');
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            if (cartTotalPrice) cartTotalPrice.textContent = '₵ 0.00';
            return;
        }
        
        let itemsHTML = '';
        let totalPrice = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            itemsHTML += `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">₵ ${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        cartItems.innerHTML = itemsHTML;
        if (cartTotalPrice) cartTotalPrice.textContent = `₵ ${totalPrice.toFixed(2)}`;
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                updateQuantity(index, -1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                updateQuantity(index, 1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeFromCart(index);
            });
        });
    }
    
    // Add to cart function
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        localStorage.setItem('futurePlumbingCart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
        
        // Show success message
        showNotification(`${product.name} added to cart!`);
    }
    
    // Update quantity function
    function updateQuantity(index, change) {
        if (cart[index]) {
            cart[index].quantity += change;
            
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            
            localStorage.setItem('futurePlumbingCart', JSON.stringify(cart));
            updateCartCount();
            updateCartDisplay();
        }
    }
    
    // Remove from cart function
    function removeFromCart(index) {
        if (cart[index]) {
            cart.splice(index, 1);
            localStorage.setItem('futurePlumbingCart', JSON.stringify(cart));
            updateCartCount();
            updateCartDisplay();
        }
    }
    
    // Clear cart function
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (cart.length > 0 && confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                localStorage.removeItem('futurePlumbingCart');
                updateCartCount();
                updateCartDisplay();
                showNotification('Cart cleared successfully');
            }
        });
    }
    
    // Checkout function
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty. Add some products first.');
                return;
            }
            
            // Show payment method modal
            showPaymentModal();
        });
    }
    
    // Payment Modal Functions
    const paymentModal = document.getElementById('payment-modal');
    const closePaymentBtn = document.getElementById('close-payment-modal');
    const cancelPaymentBtn = document.getElementById('cancel-payment');
    const confirmPaymentBtn = document.getElementById('confirm-payment');
    
    function showPaymentModal() {
        if (paymentModal) {
            paymentModal.classList.add('active');
        }
    }
    
    function closePaymentModal() {
        if (paymentModal) {
            paymentModal.classList.remove('active');
        }
    }
    
    if (closePaymentBtn) {
        closePaymentBtn.addEventListener('click', closePaymentModal);
    }
    
    if (cancelPaymentBtn) {
        cancelPaymentBtn.addEventListener('click', closePaymentModal);
    }
    
    if (paymentModal) {
        paymentModal.addEventListener('click', function(e) {
            if (e.target === paymentModal) {
                closePaymentModal();
            }
        });
    }
    
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', function() {
            const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
            
            if (!selectedMethod) {
                alert('Please select a payment method');
                return;
            }
            
            const paymentMethod = selectedMethod.value;
            processCheckout(paymentMethod);
            closePaymentModal();
        });
    }
    
    function processCheckout(paymentMethod) {
        // Create order summary for WhatsApp
        let orderSummary = `*Future Plumbing Order*\n\n`;
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            orderSummary += `• ${item.name} x${item.quantity}: ₵${itemTotal.toFixed(2)}\n`;
        });
        
        orderSummary += `\n*Total: ₵${total.toFixed(2)}*\n\n`;
        
        if (paymentMethod === 'mobile-money') {
            orderSummary += `*Payment Method: Mobile Money*\n`;
            orderSummary += `Payment Options:\n`;
            orderSummary += `• MTN Mobile Money\n`;
            orderSummary += `• Vodafone Cash\n`;
            orderSummary += `• AirtelTigo Money\n\n`;
        } else {
            orderSummary += `*Payment Method: WhatsApp*\n\n`;
        }
        
        orderSummary += `Please provide:\n`;
        orderSummary += `• Your Full Name\n`;
        orderSummary += `• Delivery Address\n`;
        orderSummary += `• Phone Number`;
        
        // Encode for WhatsApp
        const encodedMessage = encodeURIComponent(orderSummary);
        const whatsappUrl = `https://wa.me/233547085680?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
    }
    
    // Show notification function
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification animate__animated animate__fadeInUp ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('animate__fadeOutDown');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
    
    // Search functionality
    const searchBar = document.getElementById('search-bar-products');
    const searchBtn = document.getElementById('search-btn-products');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        
        if (searchBar) {
            searchBar.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
            
            // Check URL for search parameter
            const urlParams = new URLSearchParams(window.location.search);
            const searchParam = urlParams.get('search');
            if (searchParam) {
                searchBar.value = searchParam;
                performSearch();
            }
        }
    }
    
    function performSearch() {
        const searchTerm = searchBar.value.trim();
        if (searchTerm) {
            filterProducts();
            // Update URL without reloading
            const url = new URL(window.location);
            url.searchParams.set('search', searchTerm);
            window.history.pushState({}, '', url);
        } else {
            filterProducts();
            // Remove search parameter from URL
            const url = new URL(window.location);
            url.searchParams.delete('search');
            window.history.pushState({}, '', url);
        }
    }
    
    // Filter and sort functionality
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
        
        // Check URL for category parameter
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam) {
            categoryFilter.value = categoryParam;
        }
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
    
    // Store for all products fetched from API
    let allProductsData = [];
    
    // Load products from API
    async function fetchProducts() {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            allProductsData = await response.json();
            loadProducts(allProductsData);
        } catch (error) {
            console.error('Error fetching products:', error);
            // Fallback to empty array if API fails
            allProductsData = [];
            loadProducts([]);
        }
    }
    
    // Initial load
    fetchProducts();
    
    // Load products
    function loadProducts(products = allProductsData) {
        const productsContainer = document.getElementById('products-container');
        const loadingIndicator = document.getElementById('loading-indicator');
        const noProductsMessage = document.getElementById('no-products');
        const productCount = document.getElementById('product-count');
        
        // Show loading
        if (loadingIndicator) loadingIndicator.style.display = 'flex';
        if (productsContainer) productsContainer.innerHTML = '';
        
        // Simulate loading delay
        setTimeout(() => {
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            
            if (products.length === 0) {
                if (noProductsMessage) noProductsMessage.style.display = 'block';
                if (productCount) productCount.textContent = '0';
                return;
            }
            
            if (noProductsMessage) noProductsMessage.style.display = 'none';
            if (productCount) productCount.textContent = products.length;
            
            products.forEach((product, index) => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card animate-on-scroll';
                productCard.style.animationDelay = `${index * 0.1}s`;
                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'">
                        ${product.featured ? '<span class="product-badge">Featured</span>' : ''}
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-category">${product.category}</div>
                        <div class="product-price">₵ ${product.price.toFixed(2)}</div>
                        <button class="btn btn-cart add-to-cart" data-product='${JSON.stringify(product)}'>Add to Cart</button>
                    </div>
                `;
                
                if (productsContainer) {
                    productsContainer.appendChild(productCard);
                }
            });
            
            // Add event listeners to "Add to Cart" buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const product = JSON.parse(this.getAttribute('data-product'));
                    addToCart(product);
                });
            });
            
            // Trigger animation
            setTimeout(() => {
                const animateElements = document.querySelectorAll('.animate-on-scroll');
                animateElements.forEach(el => {
                    el.classList.add('visible');
                });
            }, 300);
        }, 800);
    }
    
    // Filter products function
    function filterProducts() {
        const searchTerm = searchBar ? searchBar.value.trim().toLowerCase() : '';
        const category = categoryFilter ? categoryFilter.value : 'all';
        const sortBy = sortFilter ? sortFilter.value : 'default';
        
        let filteredProducts = [...productsData];
        
        // Filter by search term
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }
        
        // Filter by category
        if (category !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.category === category
            );
        }
        
        // Sort products
        if (sortBy === 'price-low') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'name') {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        loadProducts(filteredProducts);
    }
    
    // Initialize products
    loadProducts();
    updateCartCount();
    
    // Add CSS for cart and notifications
    const additionalStyles = `
        /* Cart Sidebar Styles */
        .cart-sidebar {
            position: fixed;
            top: 0;
            right: -400px;
            width: 350px;
            height: 100vh;
            background: white;
            box-shadow: -5px 0 15px rgba(0,0,0,0.1);
            z-index: 1001;
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
        }
        
        .cart-sidebar.active {
            right: 0;
        }
        
        .cart-header {
            padding: 20px;
            border-bottom: 1px solid var(--light-gray);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .cart-header h3 {
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .close-cart {
            background: none;
            border: none;
            font-size: 1.8rem;
            cursor: pointer;
            color: var(--gray-color);
        }
        
        .cart-items {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }
        
        .empty-cart {
            text-align: center;
            padding: 40px 20px;
            color: var(--gray-color);
        }
        
        .empty-cart i {
            font-size: 3rem;
            margin-bottom: 15px;
            opacity: 0.5;
        }
        
        .cart-item {
            display: flex;
            gap: 15px;
            padding: 15px 0;
            border-bottom: 1px solid var(--light-gray);
        }
        
        .cart-item-image {
            width: 60px;
            height: 60px;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .cart-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .cart-item-details {
            flex: 1;
        }
        
        .cart-item-details h4 {
            margin: 0 0 5px 0;
            font-size: 0.95rem;
        }
        
        .cart-item-price {
            color: var(--primary-color);
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .cart-item-quantity {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .quantity-btn {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            border: 1px solid var(--light-gray);
            background: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .remove-item {
            background: none;
            border: none;
            color: #dc3545;
            cursor: pointer;
            font-size: 1rem;
        }
        
        .cart-summary {
            padding: 20px;
            border-top: 1px solid var(--light-gray);
        }
        
        .cart-total {
            display: flex;
            justify-content: space-between;
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 20px;
        }
        
        .cart-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            display: none;
        }
        
        .cart-overlay.active {
            display: block;
        }
        
        /* Notification Styles */
        .notification {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--secondary-color);
            color: white;
            padding: 15px 25px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 1002;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        /* Loading Indicator */
        .loading-indicator {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
            color: var(--gray-color);
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--light-gray);
            border-top-color: var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        /* No Products Message */
        .no-products-message {
            text-align: center;
            padding: 60px 20px;
            color: var(--gray-color);
        }
        
        .no-products-message i {
            font-size: 3rem;
            margin-bottom: 15px;
            opacity: 0.5;
        }
        
        /* Product Badge */
        .product-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--accent-color);
            color: var(--dark-color);
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        /* Product Category */
        .product-category {
            color: var(--gray-color);
            font-size: 0.9rem;
            margin-bottom: 10px;
        }
        
        /* Call to Action Section */
        .cta-section {
            background: linear-gradient(135deg, var(--primary-color) 0%, #0d62d9 100%);
            color: white;
            padding: 80px 0;
            text-align: center;
        }
        
        .cta-content h2 {
            color: white;
            margin-bottom: 15px;
        }
        
        .cta-content p {
            color: rgba(255,255,255,0.9);
            max-width: 600px;
            margin: 0 auto 30px;
        }
        
        /* Products Header */
        .products-header {
            background: linear-gradient(135deg, var(--primary-color) 0%, #0d62d9 100%);
            color: white;
            padding: 80px 0;
            text-align: center;
        }
        
        .products-filter-section {
            background: #f8f9fa;
            padding: 20px 0;
        }
        
        .products-filter {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: white;
            padding: 20px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
        }
    `;
    
    // Add styles to document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
});