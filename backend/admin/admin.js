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
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('active');
                const form = modal.querySelector('form');
                if (form) {
                    form.reset();
                    delete form.dataset.editingProductId;
                    delete form.dataset.editingServiceId;
                }
                const modalTitle = modal.querySelector('.modal-header h3');
                if (modalTitle) {
                    if (modalTitle.id === 'product-modal-title') {
                        modalTitle.textContent = 'Add New Product';
                    } else if (modalTitle.id === 'service-modal-title') {
                        modalTitle.textContent = 'Add New Service';
                    }
                }
            }
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        // Only close if clicking directly on the modal backdrop, not inside modal-content
        if (e.target === productModal) {
            productModal.style.display = 'none';
            productModal.classList.remove('active');
            productForm.reset();
            delete productForm.dataset.editingProductId;
            document.getElementById('product-modal-title').textContent = 'Add New Product';
        }
        if (e.target === serviceModal) {
            serviceModal.style.display = 'none';
            serviceModal.classList.remove('active');
            serviceForm.reset();
            delete serviceForm.dataset.editingServiceId;
            document.getElementById('service-modal-title').textContent = 'Add New Service';
        }
    }, false);
    
    // Product form submission
    if (productForm) {
        productForm.addEventListener('submit', async function(e) {
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
                active: document.getElementById('product-active').checked
            };
            
            // Validate required fields
            if (!productData.name || !productData.category || !productData.price) {
              showNotification('Please fill in all required fields', 'error');
              return;
            }
            
            // Check if we're editing or adding
            const editingProductId = productForm.dataset.editingProductId;
            
            try {
              if (editingProductId) {
                // Update existing product
                const res = await fetch(`/api/admin/products/${editingProductId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(productData)
                });
                
                if (res.ok) {
                  showNotification('Product updated successfully!', 'success');
                  productModal.style.display = 'none';
                  productForm.reset();
                  delete productForm.dataset.editingProductId;
                  if (window.loadProducts) {
                    window.loadProducts();
                  }
                } else {
                  const errorData = await res.json();
                  showNotification(errorData.message || 'Failed to update product', 'error');
                }
              } else {
                // Add new product
                const res = await fetch('/api/admin/products', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(productData)
                });
                
                if (res.ok) {
                  const result = await res.json();
                  showNotification('Product created successfully!', 'success');
                  productModal.style.display = 'none';
                  productForm.reset();
                  if (window.loadProducts) {
                    window.loadProducts();
                  }
                } else {
                  const errorData = await res.json();
                  showNotification(errorData.message || 'Failed to create product', 'error');
                }
              }
            } catch (err) {
              console.error('Error:', err);
              showNotification('Error: ' + err.message, 'error');
            }
        });
    }
    
    // Make loadProducts available globally for admin-products.js to call after updates
    window.loadProducts = function() {
        // This function is defined in admin-products.js
        // No need to do anything here - admin-products.js handles its own loading
    };

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
    
    // Service Management
    const serviceModal = document.getElementById('service-modal');
    const addServiceBtn = document.getElementById('add-service');
    const serviceForm = document.getElementById('service-form');
    
    // Load and display services
    function loadServices() {
        fetch('/api/services')
            .then(res => res.json())
            .then(services => {
                const grid = document.querySelector('.services-grid-admin');
                if (!grid) return;
                
                grid.innerHTML = '';
                
                if (!services || services.length === 0) {
                    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No services yet. Create your first service!</p>';
                    return;
                }
                
                services.forEach(service => {
                    const card = document.createElement('div');
                    card.className = 'service-card';
                    card.innerHTML = `
                        <div style="position: relative;">
                            ${service.image ? `<img src="${service.image}" alt="${service.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">` : `<div style="width: 100%; height: 200px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-tools" style="font-size: 48px; color: #ccc;"></i></div>`}
                            <span style="position: absolute; top: 10px; right: 10px; background: ${service.active ? '#4CAF50' : '#999'}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${service.active ? 'Active' : 'Inactive'}</span>
                        </div>
                        <div style="padding: 15px;">
                            <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px; font-weight: 600;">${service.name}</h3>
                            <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;"><i class="fas fa-tag"></i> ${service.category}</p>
                            <p style="margin: 0 0 10px 0; color: #999; font-size: 13px;">${service.description.substring(0, 60)}${service.description.length > 60 ? '...' : ''}</p>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
                                <div>
                                    <span style="font-size: 18px; font-weight: 700; color: #667eea;">₵${service.price}</span>
                                    <span style="color: #999; font-size: 12px; margin-left: 5px;"> / ${service.duration}h</span>
                                </div>
                                <div style="display: flex; gap: 5px;">
                                    <button class="btn-action edit-service" data-id="${service.id}" title="Edit"><i class="fas fa-edit"></i></button>
                                    <button class="btn-action delete-service" data-id="${service.id}" title="Delete"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    `;
                    grid.appendChild(card);
                });
                
                // Add event listeners to edit and delete buttons
                document.querySelectorAll('.edit-service').forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        const id = this.getAttribute('data-id');
                        editService(id);
                    });
                });
                
                document.querySelectorAll('.delete-service').forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        const id = this.getAttribute('data-id');
                        if (confirm('Are you sure you want to delete this service?')) {
                            deleteService(id);
                        }
                    });
                });
            })
            .catch(err => console.error('Error loading services:', err));
    }
    
    // Open service modal
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            serviceModal.classList.add('active');
            serviceModal.style.display = 'flex';
            document.getElementById('service-modal-title').textContent = 'Add New Service';
            serviceForm.reset();
            delete serviceForm.dataset.editingServiceId;
            const submitBtn = serviceForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.textContent = 'Save Service';
        });
    }
    
    // Service form submission
    if (serviceForm) {
        serviceForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const serviceData = {
                name: document.getElementById('service-name').value,
                category: document.getElementById('service-category').value,
                description: document.getElementById('service-description').value,
                price: parseFloat(document.getElementById('service-price').value),
                duration: parseFloat(document.getElementById('service-duration').value),
                image: document.getElementById('service-image').value,
                active: document.getElementById('service-active').checked
            };
            
            // Check if we're editing or creating
            const isEditing = serviceForm.dataset.editingServiceId;
            const serviceId = isEditing ? serviceForm.dataset.editingServiceId : null;
            const url = isEditing ? `/api/services/${serviceId}` : '/api/services';
            const method = isEditing ? 'PUT' : 'POST';
            
            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(serviceData)
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    showNotification(isEditing ? 'Service updated successfully!' : 'Service added successfully!', 'success');
                    serviceModal.style.display = 'none';
                    serviceForm.reset();
                    delete serviceForm.dataset.editingServiceId;
                    document.getElementById('service-modal-title').textContent = 'Add New Service';
                    serviceForm.querySelector('button[type="submit"]').textContent = 'Save Service';
                    loadServices();
                } else {
                    showNotification('Error: ' + (result.message || 'Unknown error'), 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error saving service', 'error');
            }
        });
        
        // Image preview for service image
        const serviceImageUpload = document.getElementById('service-image-upload');
        if (serviceImageUpload) {
            serviceImageUpload.addEventListener('change', async function() {
                const file = this.files[0];
                if (file) {
                    const formData = new FormData();
                    formData.append('image', file);
                    
                    try {
                        const response = await fetch('/api/upload-image', {
                            method: 'POST',
                            body: formData
                        });
                        const data = await response.json();
                        if (data.success) {
                            document.getElementById('service-image').value = data.imageUrl;
                            showNotification('Image uploaded successfully', 'success');
                        } else {
                            showNotification('Failed to upload image', 'error');
                        }
                    } catch (error) {
                        console.error('Error uploading image:', error);
                        showNotification('Error uploading image', 'error');
                    }
                }
            });
        }
    }
    
    function editService(id) {
        console.log('Edit service called with ID:', id);
        // Fetch the service data
        fetch(`/api/services/${id}`)
            .then(res => {
                console.log('Service response status:', res.status);
                return res.json();
            })
            .then(service => {
                console.log('Service data received:', service);
                if (!service || !service.name) {
                    showNotification('Service not found', 'error');
                    return;
                }
                
                // Populate the form with service data
                document.getElementById('service-name').value = service.name;
                document.getElementById('service-category').value = service.category;
                document.getElementById('service-description').value = service.description;
                document.getElementById('service-price').value = service.price;
                document.getElementById('service-duration').value = service.duration;
                document.getElementById('service-image').value = service.image || '';
                document.getElementById('service-active').checked = service.active !== false;
                
                console.log('Form populated. serviceModal:', serviceModal);
                
                // Update modal title and button
                document.getElementById('service-modal-title').textContent = 'Edit Service';
                const submitBtn = serviceForm.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Update Service';
                
                // Store the service ID for update
                serviceForm.dataset.editingServiceId = id;
                
                // Show modal using class and inline style
                console.log('Before showing modal - display:', serviceModal.style.display);
                serviceModal.classList.add('active');
                serviceModal.style.display = 'flex';
                console.log('After showing modal - display:', serviceModal.style.display);
                console.log('Modal visible:', window.getComputedStyle(serviceModal).display);
            })
            .catch(err => {
                console.error('Error loading service:', err);
                showNotification('Error loading service', 'error');
            });
    }
    
    function deleteService(id) {
        // Send delete request to server
        fetch(`/api/services/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    showNotification('Service deleted successfully!', 'success');
                    loadServices();
                } else {
                    showNotification('Error deleting service: ' + (result.message || 'Unknown error'), 'error');
                }
            })
            .catch(err => {
                console.error('Error:', err);
                showNotification('Error deleting service', 'error');
            });
    }
    
    // Initial load
    loadServices();
    
    // Load messages
    function loadMessages() {
        const messagesList = document.getElementById('messages-list');
        
        // Fetch chat sessions from API
        fetch('/api/admin/chat-sessions')
            .then(res => res.json())
            .then(sessions => {
                messagesList.innerHTML = '';
                
                if (sessions.length === 0) {
                    messagesList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;"><i class="fas fa-comments"></i><p>No active chats yet</p><p style="font-size: 12px;">Customers will appear here when they use "Chat with Agent"</p></div>';
                    return;
                }
                
                // Add header
                const header = document.createElement('div');
                header.style.cssText = 'padding: 12px 20px; background: #f0f0f0; border-bottom: 2px solid #ddd; font-weight: 600; font-size: 12px; color: #666; text-transform: uppercase;';
                header.innerHTML = '<i class="fas fa-globe"></i> Website Chat Sessions';
                messagesList.appendChild(header);
                
                sessions.forEach(session => {
                    const messageItem = document.createElement('div');
                    messageItem.className = 'message-item';
                    messageItem.setAttribute('data-session-id', session.sessionId);
                    const lastTime = session.timestamp ? new Date(session.timestamp).toLocaleString() : 'Just now';
                    
                    messageItem.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <div class="message-sender" style="font-weight: 600;"><i class="fas fa-user-circle"></i> ${session.sessionId.replace('customer-', 'Customer ')}</div>
                            <span style="background: #4CAF50; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">Active</span>
                        </div>
                        <div class="message-subject" style="color: #4CAF50;"><i class="fas fa-comments"></i> ${session.messageCount} message${session.messageCount !== 1 ? 's' : ''}</div>
                        <div class="message-preview">${session.lastMessage.substring(0, 50)}${session.lastMessage.length > 50 ? '...' : ''}</div>
                        <div class="message-time" style="margin-top: 6px; font-size: 12px;"><i class="fas fa-clock"></i> ${lastTime}</div>
                    `;
                    
                    messageItem.addEventListener('click', function() {
                        // Mark as active
                        document.querySelectorAll('.message-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        this.classList.add('active');
                        
                        // Load chat session
                        loadChatSession(this.getAttribute('data-session-id'));
                    });
                    
                    messagesList.appendChild(messageItem);
                });
            })
            .catch(err => console.error('Error loading messages:', err));
    }
    
    // Load chat session
    function loadChatSession(sessionId) {
        fetch(`/api/messages/${sessionId}`)
            .then(res => res.json())
            .then(session => {
                const customerName = sessionId.replace('customer-', 'Customer ');
                document.getElementById('message-subject').innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div>
                            <div style="font-size: 16px; font-weight: 600;">💬 Website Chat - ${customerName}</div>
                            <div style="font-size: 12px; color: #999; margin-top: 4px;">From: Chat with Agent button</div>
                        </div>
                    </div>
                `;
                
                let chatHtml = '<div class="chat-conversation" style="display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto; padding: 15px; background: #f9f9f9; border-radius: 8px;">';
                
                if (!session.messages || session.messages.length === 0) {
                    chatHtml += '<p style="text-align: center; color: #999;">No messages yet</p>';
                } else {
                    session.messages.forEach(msg => {
                        const isAgent = msg.sender === 'agent';
                        const msgTime = new Date(msg.timestamp).toLocaleTimeString();
                        
                        if (isAgent) {
                            chatHtml += `
                                <div style="text-align: right;">
                                    <div style="display: inline-block; background-color: #667eea; color: white; padding: 10px 14px; border-radius: 12px; border-bottom-right-radius: 4px; max-width: 70%;">
                                        <p style="margin: 0; word-wrap: break-word;">${msg.message}</p>
                                        <small style="opacity: 0.8; font-size: 11px;">You • ${msgTime}</small>
                                    </div>
                                </div>
                            `;
                        } else {
                            chatHtml += `
                                <div style="text-align: left;">
                                    <div style="display: inline-block; background-color: #e0e0e0; color: #333; padding: 10px 14px; border-radius: 12px; border-bottom-left-radius: 4px; max-width: 70%;">
                                        <p style="margin: 0; word-wrap: break-word;">${msg.message}</p>
                                        <small style="opacity: 0.7; font-size: 11px;">${customerName} • ${msgTime}</small>
                                    </div>
                                </div>
                            `;
                        }
                    });
                }
                
                chatHtml += '</div>';
                document.getElementById('message-body').innerHTML = chatHtml;
                
                // Auto-scroll to bottom
                const chatDiv = document.querySelector('.chat-conversation');
                if (chatDiv) {
                    chatDiv.scrollTop = chatDiv.scrollHeight;
                }
                
                // Show reply form and setup handler
                document.getElementById('message-reply').style.display = 'block';
                
                const replyTextarea = document.querySelector('#message-reply textarea');
                const replyBtn = document.querySelector('#message-reply button');
                
                // Remove old event listener by cloning
                const newReplyBtn = replyBtn.cloneNode(true);
                replyBtn.parentNode.replaceChild(newReplyBtn, replyBtn);
                
                // Add new event listener
                document.querySelector('#message-reply button').addEventListener('click', function() {
                    const replyText = document.querySelector('#message-reply textarea').value.trim();
                    if (replyText) {
                        sendAdminReply(sessionId, replyText);
                    } else {
                        alert('Please type a message');
                    }
                });
            })
            .catch(err => console.error('Error loading chat session:', err));
    }
    
    // Send admin reply
    function sendAdminReply(sessionId, message) {
        console.log('Sending reply to session:', sessionId, 'Message:', message);
        
        fetch('/api/admin/send-reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, message })
        })
            .then(res => {
                console.log('Response status:', res.status);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('Response data:', data);
                if (data.success) {
                    document.querySelector('#message-reply textarea').value = '';
                    loadChatSession(sessionId);
                    alert('Reply sent to customer!');
                } else {
                    alert('Failed to send reply: ' + (data.message || 'Unknown error'));
                }
            })
            .catch(err => {
                console.error('Error sending reply:', err);
                alert('Error sending reply: ' + err.message);
            });
    }
    
    // Auto-refresh messages every 5 seconds
    setInterval(() => {
        const activeMessage = document.querySelector('.message-item.active');
        if (activeMessage) {
            const sessionId = activeMessage.getAttribute('data-session-id');
            loadChatSession(sessionId);
        } else {
            loadMessages();
        }
    }, 5000);
    
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

    // Image Upload Handler
    const productImageUpload = document.getElementById('product-image-upload');
    if (productImageUpload) {
        productImageUpload.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (!file) return;

            // Show preview
            const reader = new FileReader();
            reader.onload = function(event) {
                const previewContainer = document.getElementById('image-preview-container');
                const previewImg = document.getElementById('image-preview');
                previewImg.src = event.target.result;
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);

            // Upload file to server
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch('/api/upload-image', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (data.success) {
                    document.getElementById('product-image').value = data.imageUrl;
                    showNotification('Image uploaded successfully', 'success');
                } else {
                    showNotification('Failed to upload image', 'error');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                showNotification('Error uploading image', 'error');
            }
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
            const token = localStorage.getItem('adminToken');
            
            try {
                await fetch('/api/admin/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.error('Logout error:', error);
            }
            
            // Clear token and redirect
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login.html';
        });
    }
});