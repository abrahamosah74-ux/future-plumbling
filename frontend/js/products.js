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
            
            // Create order summary
            let orderSummary = `*Future Plumbing Order*\n\n`;
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                orderSummary += `• ${item.name} x${item.quantity}: ₵${itemTotal.toFixed(2)}\n`;
            });
            
            orderSummary += `\n*Total: ₵${total.toFixed(2)}*\n\n`;
            orderSummary += `Customer Name: [Please provide]\n`;
            orderSummary += `Delivery Address: [Please provide]\n`;
            orderSummary += `Phone Number: [Please provide]`;
            
            // Encode for WhatsApp
            const encodedMessage = encodeURIComponent(orderSummary);
            const whatsappUrl = `https://wa.me/233547085680?text=${encodedMessage}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
        });
    }
    
    // Show notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification animate__animated animate__fadeInUp';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
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
    
    // Product data (in a real app, this would come from the server)
    const productsData = [
        { id: 1, name: "Modern Faucet", description: "High-quality chrome finish faucet for kitchen sinks", price: 450.00, category: "Faucets", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", featured: true },
        { id: 2, name: "PVC Pipes", description: "Durable PVC pipes for water supply systems", price: 120.00, category: "Pipes", image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", featured: true },
        { id: 3, name: "Water Pump", description: "Automatic water pump with pressure control", price: 850.00, category: "Pumps", image: "https://images.unsplash.com/photo-1592921870789-04563d55041c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", featured: true },
        { id: 4, name: "Shower Set", description: "Complete shower set with rain shower head", price: 650.00, category: "Showers", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", featured: true },
        { id: 5, name: "Toilet Bowl", description: "Modern ceramic toilet bowl with efficient flush", price: 750.00, category: "Toilets", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
        { id: 6, name: "Water Tank", description: "1000L plastic water storage tank", price: 1200.00, category: "Tanks", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
        { id: 7, name: "Pipe Wrench", description: "Professional pipe wrench for plumbing work", price: 85.00, category: "Tools", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=1" },
        { id: 8, name: "Sink Basin", description: "Stainless steel kitchen sink basin", price: 550.00, category: "Sinks", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=2" },
        { id: 9, name: "Water Meter", description: "Digital water meter with accurate reading", price: 350.00, category: "Meters", image: "https://images.unsplash.com/photo-1592921870789-04563d55041c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=3" },
        { id: 10, name: "Pipe Fittings", description: "Assorted PVC pipe fittings and connectors", price: 45.00, category: "Fittings", image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=4" },
        { id: 11, name: "Water Heater", description: "Electric instant water heater 50L", price: 950.00, category: "Heaters", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=5" },
        { id: 12, name: "Drain Cleaner", description: "Chemical drain cleaner for clogged pipes", price: 65.00, category: "Chemicals", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=6" },
        { id: 13, name: "Pipe Cutter", description: "Professional pipe cutter for precise cuts", price: 120.00, category: "Tools", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=7" },
        { id: 14, name: "Bath Tub", description: "Modern acrylic bath tub with fittings", price: 1800.00, category: "Baths", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=8" },
        { id: 15, name: "Valve Set", description: "Complete valve set for plumbing systems", price: 280.00, category: "Valves", image: "https://images.unsplash.com/photo-1592921870789-04563d55041c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=9" }
    ];
    
    // Load products
    function loadProducts(products = productsData) {
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