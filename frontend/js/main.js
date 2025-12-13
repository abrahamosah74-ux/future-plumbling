// Main JavaScript for Future Plumbing Company Website

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
    
    // Search Functionality
    const searchBar = document.getElementById('search-bar');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
        
        if (searchBar) {
            searchBar.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }
    }
    
    function performSearch() {
        const searchTerm = searchBar.value.trim();
        if (searchTerm) {
            // In a real implementation, this would redirect to products page with search results
            window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
        } else {
            searchBar.focus();
        }
    }
    
    // Animate elements on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('visible');
            }
        });
    }
    
    // Initial check on load
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // In a real implementation, this would send data to a server
            // For now, just show a success message
            alert(`Thank you, ${name}! Your message has been sent. We will contact you at ${email} or ${phone} soon.`);
            contactForm.reset();
            
            // Here you would typically send the data to your backend
            // Example: sendContactForm({name, email, phone, message});
        });
    }
    
    // Add to Cart Functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-cart')) {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            // Animate button
            e.target.textContent = 'Added!';
            e.target.style.backgroundColor = '#34a853';
            
            setTimeout(() => {
                e.target.textContent = 'Add to Cart';
                e.target.style.backgroundColor = '';
            }, 1500);
            
            // In a real implementation, add to cart logic would go here
            console.log(`Added ${productName} (${productPrice}) to cart`);
            
            // You would typically update a cart counter or send to backend
        }
    });
    
    // Product Filtering (for products page)
    const filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            const filterValue = this.value;
            // In a real implementation, this would filter products
            console.log(`Filtering by: ${filterValue}`);
        });
    }
    
    // Initialize products from server (mock data for now)
    loadFeaturedProducts();
    loadServices();
    
    // WhatsApp button animation
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        // Add a pulsing animation every 5 seconds
        setInterval(() => {
            whatsappFloat.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                whatsappFloat.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        }, 5000);
    }
});

// Load featured products (mock data for demonstration)
function loadFeaturedProducts() {
    const productsGrid = document.getElementById('featured-products');
    
    if (!productsGrid) return;
    
    // Mock product data (in a real app, this would come from a server)
    const mockProducts = [
        { id: 1, name: "Modern Faucet", description: "High-quality chrome finish faucet for kitchen sinks", price: "₵ 450.00", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
        { id: 2, name: "PVC Pipes", description: "Durable PVC pipes for water supply systems", price: "₵ 120.00", image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
        { id: 3, name: "Water Pump", description: "Automatic water pump with pressure control", price: "₵ 850.00", image: "https://images.unsplash.com/photo-1592921870789-04563d55041c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
        { id: 4, name: "Shower Set", description: "Complete shower set with rain shower head", price: "₵ 650.00", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
    ];
    
    // Clear the placeholder
    productsGrid.innerHTML = '';
    
    // Add products to grid
    mockProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card animate-on-scroll';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price}</div>
                <button class="btn btn-cart">Add to Cart</button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Trigger animation after loading
    setTimeout(() => {
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        animateElements.forEach(el => {
            el.classList.add('visible');
        });
    }, 300);
}

// Load services (mock data for demonstration)
function loadServices() {
    // In a real implementation, this would fetch from the server
    console.log("Services loaded from server");
}