// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation between admin sections
    const navLinks = document.querySelectorAll('.admin-nav-link');
    const contentSections = document.querySelectorAll('.admin-content');
    const pageTitle = document.getElementById('admin-page-title');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target page
            const targetPage = this.getAttribute('data-page');
            
            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            contentSections.forEach(section => section.classList.remove('active'));
            document.getElementById(`${targetPage}-content`).classList.add('active');
            
            // Update page title
            pageTitle.textContent = this.textContent.replace(/[0-9]/g, '').trim();
        });
    });
    
    // Modal functionality
    const productModal = document.getElementById('product-modal');
    const addProductBtn = document.getElementById('add-product');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const productForm = document.getElementById('product-form');
    
    // Open product modal
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            productModal.style.display = 'flex';
            document.getElementById('product-modal-title').textContent = 'Add New Product';
            productForm.reset();
        });
    }
    
    // Close modal
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            productModal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === productModal) {
            productModal.style.display = 'none';
        }
    });
    
    // Product form submission
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const productData = {
                name: document.getElementById('product-name').value,
                category: document.getElementById('product-category').value,
                description: document.getElementById('product-description').value,
                price: parseFloat(document.getElementById('product-price').value),
                stock: parseInt(document.getElementById('product-stock').value),
                image: document.getElementById('product-image').value,
                featured: document.getElementById('product-featured').checked,
                active: document.getElementById('product-active').checked,
                id: Date.now() // Generate unique ID
            };
            
            // In a real application, this would send data to the server
            console.log('Product data:', productData);
            
            // Show success message
            showNotification('Product saved successfully!', 'success');
            
            // Close modal
            productModal.style.display = 'none';
            
            // Add product to table
            addProductToTable(productData);
        });
    }
    
    // Add product to table function
    function addProductToTable(product) {
        const tbody = document.getElementById('products-table-body');
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="table-image">
                    <img src="${product.image || 'https://via.placeholder.com/50'}" alt="${product.name}" width="50" height="50">
                </div>
            </td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₵ ${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td><span class="status ${product.active ? 'status-completed' : 'status-pending'}">${product.active ? 'Active' : 'Inactive'}</span></td>
            <td>
                <button class="btn-action edit-product" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                <button class="btn-action delete-product" data-id="${product.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tbody.appendChild(row);
        
        // Add event listeners to new buttons
        row.querySelector('.edit-product').addEventListener('click', function() {
            editProduct(product);
        });
        
        row.querySelector('.delete-product').addEventListener('click', function() {
            deleteProduct(product.id, row);
        });
    }
    
    // Edit product function
    function editProduct(product) {
        document.getElementById('product-modal-title').textContent = 'Edit Product';
        
        // Fill form with product data
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-image').value = product.image;
        document.getElementById('product-featured').checked = product.featured;
        document.getElementById('product-active').checked = product.active;
        
        // Show modal
        productModal.style.display = 'flex';
        
        // Update form submission to handle edit
        const submitHandler = function(e) {
            e.preventDefault();
            
            // Update product data
            product.name = document.getElementById('product-name').value;
            product.category = document.getElementById('product-category').value;
            product.description = document.getElementById('product-description').value;
            product.price = parseFloat(document.getElementById('product-price').value);
            product.stock = parseInt(document.getElementById('product-stock').value);
            product.image = document.getElementById('product-image').value;
            product.featured = document.getElementById('product-featured').checked;
            product.active = document.getElementById('product-active').checked;
            
            showNotification('Product updated successfully!', 'success');
            productModal.style.display = 'none';
            
            // Remove this event listener
            productForm.removeEventListener('submit', submitHandler);
            
            // Reload products table
            loadProductsTable();
        };
        
        productForm.addEventListener('submit', submitHandler);
    }
    
    // Delete product function
    function deleteProduct(productId, row) {
        if (confirm('Are you sure you want to delete this product?')) {
            // In a real application, this would send delete request to server
            row.remove();
            showNotification('Product deleted successfully!', 'success');
        }
    }
    
    // Load products table
    function loadProductsTable() {
        const tbody = document.getElementById('products-table-body');
        
        // Sample product data
        const products = [
            { id: 1, name: "Modern Faucet", category: "Faucets", price: 450.00, stock: 25, image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80", active: true, featured: true },
            { id: 2, name: "PVC Pipes", category: "Pipes", price: 120.00, stock: 150, image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80", active: true, featured: true },
            { id: 3, name: "Water Pump", category: "Pumps", price: 850.00, stock: 12, image: "https://images.unsplash.com/photo-1592921870789-04563d55041c?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80", active: true, featured: true },
            { id: 4, name: "Shower Set", category: "Showers", price: 650.00, stock: 18, image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80", active: true, featured: true },
            { id: 5, name: "Toilet Bowl", category: "Toilets", price: 750.00, stock: 8, image: "https://via.placeholder.com/50", active: true, featured: false },
            { id: 6, name: "Water Tank", category: "Tanks", price: 1200.00, stock: 5, image: "https://via.placeholder.com/50", active: true, featured: false },
            { id: 7, name: "Pipe Wrench", category: "Tools", price: 85.00, stock: 45, image: "https://via.placeholder.com/50", active: true, featured: false },
            { id: 8, name: "Sink Basin", category: "Sinks", price: 550.00, stock: 15, image: "https://via.placeholder.com/50", active: true, featured: false },
            { id: 9, name: "Water Meter", category: "Meters", price: 350.00, stock: 22, image: "https://via.placeholder.com/50", active: true, featured: false },
            { id: 10, name: "Pipe Fittings", category: "Fittings", price: 45.00, stock: 200, image: "https://via.placeholder.com/50", active: true, featured: false }
        ];
        
        tbody.innerHTML = '';
        
        products.forEach(product => {
            addProductToTable(product);
        });
    }
    
    // Load orders table
    function loadOrdersTable() {
        const tbody = document.getElementById('orders-table-body');
        
        // Sample order data
        const orders = [
            { id: "FP-0012", customer: "Kwame Mensah", products: "Modern Faucet, PVC Pipes", date: "2023-10-15", amount: 1250.00, status: "pending" },
            { id: "FP-0011", customer: "Ama Serwaa", products: "Water Pump", date: "2023-10-14", amount: 850.00, status: "completed" },
            { id: "FP-0010", customer: "Kojo Ansah", products: "Water Tank, Pipe Fittings", date: "2023-10-13", amount: 2150.00, status: "pending" },
            { id: "FP-0009", customer: "Esi Asante", products: "Shower Set", date: "2023-10-12", amount: 450.00, status: "completed" },
            { id: "FP-0008", customer: "Yaw Boateng", products: "Toilet Bowl, Sink Basin", date: "2023-10-11", amount: 1300.00, status: "completed" },
            { id: "FP-0007", customer: "Akosua Bonsu", products: "Pipe Wrench, Pipe Cutter", date: "2023-10-10", amount: 205.00, status: "cancelled" }
        ];
        
        tbody.innerHTML = '';
        
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="order-checkbox"></td>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.products}</td>
                <td>${order.date}</td>
                <td>₵ ${order.amount.toFixed(2)}</td>
                <td><span class="status status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                <td>
                    <button class="btn-action view-order" data-id="${order.id}"><i class="fas fa-eye"></i></button>
                    <button class="btn-action edit-order" data-id="${order.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-action delete-order" data-id="${order.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Order filtering
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                const rows = tbody.querySelectorAll('tr');
                
                rows.forEach(row => {
                    const status = row.querySelector('.status').textContent.toLowerCase();
                    
                    if (filter === 'all' || status === filter) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        });
        
        // Select all orders checkbox
        const selectAll = document.getElementById('select-all-orders');
        if (selectAll) {
            selectAll.addEventListener('change', function() {
                const checkboxes = tbody.querySelectorAll('.order-checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
            });
        }
    }
    
    // Load customers table
    function loadCustomersTable() {
        const tbody = document.getElementById('customers-table-body');
        
        // Sample customer data
        const customers = [
            { id: "C-001", name: "Kwame Mensah", email: "kwame@example.com", phone: "0541234567", orders: 3, total: 3250.00, lastOrder: "2023-10-15" },
            { id: "C-002", name: "Ama Serwaa", email: "ama@example.com", phone: "0209876543", orders: 2, total: 1300.00, lastOrder: "2023-10-14" },
            { id: "C-003", name: "Kojo Ansah", email: "kojo@example.com", phone: "0551122334", orders: 1, total: 2150.00, lastOrder: "2023-10-13" },
            { id: "C-004", name: "Esi Asante", email: "esi@example.com", phone: "0245566778", orders: 4, total: 2800.00, lastOrder: "2023-10-12" },
            { id: "C-005", name: "Yaw Boateng", email: "yaw@example.com", phone: "0599988776", orders: 2, total: 2600.00, lastOrder: "2023-10-11" }
        ];
        
        tbody.innerHTML = '';
        
        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.orders}</td>
                <td>₵ ${customer.total.toFixed(2)}</td>
                <td>${customer.lastOrder}</td>
                <td>
                    <button class="btn-action view-customer"><i class="fas fa-eye"></i></button>
                    <button class="btn-action edit-customer"><i class="fas fa-edit"></i></button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    // Load messages
    function loadMessages() {
        const messagesList = document.getElementById('messages-list');
        
        // Sample messages data
        const messages = [
            { id: 1, sender: "John Doe", subject: "Inquiry about plumbing services", preview: "Hello, I would like to inquire about your plumbing services for my new house...", time: "2 hours ago", read: false },
            { id: 2, sender: "Sarah Smith", subject: "Product availability", preview: "I'm interested in the Modern Faucet. Is it available for immediate delivery?", time: "1 day ago", read: true },
            { id: 3, sender: "Michael Johnson", subject: "Emergency plumbing needed", preview: "We have a major pipe leak in our kitchen. Can you send someone ASAP?", time: "2 days ago", read: false },
            { id: 4, sender: "Emma Wilson", subject: "Service appointment", preview: "I would like to schedule a routine plumbing maintenance for next week.", time: "3 days ago", read: true },
            { id: 5, sender: "David Brown", subject: "Water heater installation", preview: "Looking for a quote for water heater installation in a 4-bedroom house.", time: "5 days ago", read: true }
        ];
        
        messagesList.innerHTML = '';
        
        messages.forEach(message => {
            const messageItem = document.createElement('div');
            messageItem.className = `message-item ${message.read ? '' : 'unread'}`;
            messageItem.innerHTML = `
                <div class="message-sender">${message.sender}</div>
                <div class="message-subject">${message.subject}</div>
                <div class="message-preview">${message.preview}</div>
                <div class="message-time">${message.time}</div>
            `;
            
            messageItem.addEventListener('click', function() {
                document.querySelectorAll('.message-item').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
                
                // Show message content
                document.getElementById('message-subject').textContent = message.subject;
                document.getElementById('message-body').innerHTML = `
                    <div class="message-details">
                        <p><strong>From:</strong> ${message.sender}</p>
                        <p><strong>Time:</strong> ${message.time}</p>
                        <hr>
                        <p>${message.preview} This is a more detailed version of the message. In a real application, this would show the full message content.</p>
                        <p>Customer might provide additional details about their plumbing issue or product inquiry here.</p>
                    </div>
                `;
                document.getElementById('message-reply').style.display = 'block';
            });
            
            messagesList.appendChild(messageItem);
        });
    }
    
    // Settings tabs
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsContents = document.querySelectorAll('.settings-tab-content');
    
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            settingsTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            settingsContents.forEach(c => c.classList.remove('active'));
            document.getElementById(`${tabId}-settings`).classList.add('active');
        });
    });
    
    // Settings form submissions
    const settingsForms = document.querySelectorAll('.settings-tab-content form');
    
    settingsForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Settings saved successfully!', 'success');
        });
    });
    
    // Show notification function
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Add styles for notification
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 15px 25px;
                    border-radius: var(--border-radius);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 1000;
                    animation: slideIn 0.3s ease;
                }
                
                .notification-success {
                    border-left: 4px solid var(--secondary-color);
                }
                
                .notification i {
                    color: var(--secondary-color);
                    font-size: 1.2rem;
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Initialize data loading
    loadProductsTable();
    loadOrdersTable();
    loadCustomersTable();
    loadMessages();
    
    // Update badge counts
    function updateBadgeCounts() {
        // In a real application, these would come from the server
        document.getElementById('pending-orders').textContent = '5';
        document.getElementById('new-messages').textContent = '3';
    }
    
    updateBadgeCounts();
    
    // Add order button
    const addOrderBtn = document.getElementById('add-order');
    if (addOrderBtn) {
        addOrderBtn.addEventListener('click', function() {
            alert('Add order functionality would open a form to create a new order.');
        });
    }
    
    // Add service button
    const addServiceBtn = document.getElementById('add-service');
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', function() {
            alert('Add service functionality would open a form to create a new service.');
        });
    }
    
    // Search functionality for each section
    const searchInputs = ['search-orders', 'search-products', 'search-customers'];
    
    searchInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        const button = document.getElementById(`${inputId}-btn`);
        
        if (input && button) {
            button.addEventListener('click', function() {
                performSearch(inputId);
            });
            
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch(inputId);
                }
            });
        }
    });
    
    function performSearch(inputId) {
        const input = document.getElementById(inputId);
        const searchTerm = input.value.trim().toLowerCase();
        
        // In a real application, this would filter the table data
        console.log(`Searching ${inputId.replace('search-', '')} for:`, searchTerm);
        showNotification(`Searching for "${searchTerm}"`, 'success');
    }
});