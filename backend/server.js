// Backend Server for Future Plumbing Company
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup multer for file uploads
const uploadsDir = path.join(__dirname, 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${timestamp}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    // Allow only image files
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
// Serve admin static assets (CSS / JS for admin)
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Serve frontend static assets
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Load data from JSON files
let services = [];
let products = [];

async function loadData() {
  try {
    const servicesData = await fs.promises.readFile(path.join(__dirname, 'data', 'services.json'), 'utf-8');
    const productsData = await fs.promises.readFile(path.join(__dirname, 'data', 'products.json'), 'utf-8');

    services = JSON.parse(servicesData);
    products = JSON.parse(productsData);

    console.log('Data loaded successfully');
  } catch (error) {
    console.error('Error loading data:', error);
    // Load default data if files don't exist (use absolute path)
    try {
      services = require(path.join(__dirname, 'data', 'services.json'));
      products = require(path.join(__dirname, 'data', 'products.json'));
    } catch (e) {
      services = [];
      products = [];
    }
  }
}

// Initialize data
loadData();

// Admin Authentication Setup
const ADMIN_CREDENTIALS = {
  username: 'Adminoko1',
  password: 'future1'
};

// Simple token generation (in production, use JWT)
const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Store valid tokens
const validTokens = new Set();

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  
  if (!token || !validTokens.has(token)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  next();
};

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const token = generateToken();
    validTokens.add(token);
    
    res.json({
      success: true,
      message: 'Login successful',
      token
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  }
});

// Admin logout endpoint
app.post('/api/admin/logout', (req, res) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (token) {
    validTokens.delete(token);
  }
  
  res.json({ success: true, message: 'Logged out' });
});

// API Routes
// Get all services
app.get('/api/services', (req, res) => {
  res.json(services);
});

// Get service by ID
app.get('/api/services/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const service = services.find(s => s.id === id);
  
  if (service) {
    res.json(service);
  } else {
    res.status(404).json({ message: 'Service not found' });
  }
});

// Add new service
app.post('/api/services', (req, res) => {
  const { name, category, description, price, duration, image, active } = req.body;
  
  // Validation
  if (!name || !category || !description || price === undefined || !duration) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields' 
    });
  }
  
  // Create new service
  const newService = {
    id: services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1,
    name,
    category,
    description,
    price: parseFloat(price),
    duration: parseFloat(duration),
    image: image || '',
    active: active !== false,
    createdAt: new Date()
  };
  
  services.push(newService);
  
  // Save to JSON file
  fs.writeFileSync(
    path.join(__dirname, 'data', 'services.json'),
    JSON.stringify(services, null, 2)
  );
  
  res.json({ 
    success: true, 
    message: 'Service added successfully',
    service: newService 
  });
});

// Update service
app.put('/api/services/:id', (req, res) => {
  const serviceId = parseInt(req.params.id);
  const { name, category, description, price, duration, image, active } = req.body;
  
  // Validation
  if (!name || !category || !description || price === undefined || !duration) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields' 
    });
  }
  
  // Find and update service
  const serviceIndex = services.findIndex(s => s.id === serviceId);
  if (serviceIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Service not found' 
    });
  }
  
  services[serviceIndex] = {
    ...services[serviceIndex],
    name,
    category,
    description,
    price: parseFloat(price),
    duration: parseFloat(duration),
    image: image || services[serviceIndex].image,
    active: active !== false,
    updatedAt: new Date()
  };
  
  // Save to JSON file
  fs.writeFileSync(
    path.join(__dirname, 'data', 'services.json'),
    JSON.stringify(services, null, 2)
  );
  
  res.json({ 
    success: true, 
    message: 'Service updated successfully',
    service: services[serviceIndex]
  });
});

// Delete service
app.delete('/api/services/:id', (req, res) => {
  const serviceId = parseInt(req.params.id);
  
  // Find and remove service
  const serviceIndex = services.findIndex(s => s.id === serviceId);
  if (serviceIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Service not found' 
    });
  }
  
  const deletedService = services.splice(serviceIndex, 1);
  
  // Save to JSON file
  fs.writeFileSync(
    path.join(__dirname, 'data', 'services.json'),
    JSON.stringify(services, null, 2)
  );
  
  res.json({ 
    success: true, 
    message: 'Service deleted successfully',
    service: deletedService[0]
  });
});

// Get all products
app.get('/api/products', (req, res) => {
  const { category, search, featured } = req.query;
  
  let filteredProducts = [...products];
  
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) || 
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
  }
  
  if (featured === 'true') {
    filteredProducts = filteredProducts.filter(p => p.featured);
  }
  
  res.json(filteredProducts);
});

// Get featured products
app.get('/api/products/featured', (req, res) => {
  const featured = products.filter(p => p.featured);
  res.json(featured);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Get product categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

// Submit contact form
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  
  // Save to a simple log file (in production, use a database)
  const contactData = {
    timestamp: new Date().toISOString(),
    name,
    email,
    phone,
    message
  };
  
  // Log the contact (in production, save to database)
  console.log('Contact form submission:', contactData);
  
  // Send WhatsApp notification (concept)
  const whatsappMessage = `New Contact Form Submission:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`;
  console.log('WhatsApp message would be:', whatsappMessage);
  
  res.json({ 
    success: true, 
    message: 'Thank you for your message. We will contact you soon.',
    whatsappLink: `https://wa.me/233547085680?text=${encodeURIComponent(whatsappMessage)}`
  });
});

// Home route - serve frontend index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Admin routes
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'admin.html'));
});

// Image upload endpoint
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    console.log('File uploaded:', req.file.filename);
    
    res.json({ 
      success: true, 
      message: 'Image uploaded successfully',
      imageUrl: `/uploads/${req.file.filename}`,
      filename: req.file.filename
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Error uploading file'
    });
  }
});

// Profile picture upload endpoint
app.post('/api/upload-profile', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    console.log('Profile picture uploaded:', req.file.filename);
    
    res.json({ 
      success: true, 
      message: 'Profile picture uploaded successfully',
      imageUrl: `/uploads/${req.file.filename}`,
      filename: req.file.filename
    });
  } catch (err) {
    console.error('Profile upload error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Error uploading profile picture'
    });
  }
});

// Store orders in memory (in production, use a database)
let ordersStore = [
  { id: 1001, customer: "Kwame Mensah", product: "Modern Chrome Faucet", amount: 450.00, status: "completed", date: "2023-10-15" },
  { id: 1002, customer: "Ama Boateng", product: "Rain Shower Set", amount: 650.00, status: "pending", date: "2023-10-16" },
  { id: 1003, customer: "Yaw Asante", product: "Automatic Water Pump", amount: 850.00, status: "processing", date: "2023-10-17" },
  { id: 1004, customer: "Esi Adjei", product: "PVC Plumbing Pipes", amount: 240.00, status: "completed", date: "2023-10-18" },
  { id: 1005, customer: "Kofi Owusu", product: "Water Tank + Installation", amount: 1500.00, status: "pending", date: "2023-10-19" }
];

// Admin API - Get all orders
app.get('/api/admin/orders', (req, res) => {
  res.json(ordersStore);
});

// Create order from website
app.post('/api/create-order', (req, res) => {
  try {
    const { customer, email, phone, product, amount, quantity = 1, status = 'pending' } = req.body;
    
    // Validate required fields
    if (!customer || !product || !amount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Generate unique order ID
    const orderId = 'FP-' + (Math.max(...ordersStore.map(o => parseInt(o.id.split('-')[1]) || 0), 999) + 1).toString().padStart(4, '0');
    const date = new Date().toISOString().split('T')[0];
    
    const newOrder = {
      id: orderId,
      customer,
      email,
      phone,
      product,
      amount: parseFloat(amount),
      quantity: parseInt(quantity),
      status,
      date
    };
    
    ordersStore.push(newOrder);
    res.json({ success: true, message: 'Order created successfully', orderId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin API - Delete order
app.delete('/api/admin/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  ordersStore = ordersStore.filter(order => order.id !== id);
  res.json({ success: true, message: 'Order deleted successfully' });
});

// Store chat messages (in production, use a database)
let messagesStore = {};

// Chat API - Send message
app.post('/api/send-message', (req, res) => {
  const { sessionId, message, sender, timestamp } = req.body;
  
  if (!sessionId || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  
  // Initialize session if doesn't exist
  if (!messagesStore[sessionId]) {
    messagesStore[sessionId] = {
      sessionId,
      customerName: 'Customer',
      messages: []
    };
  }
  
  // Add message
  messagesStore[sessionId].messages.push({
    message,
    sender,
    timestamp: new Date(timestamp),
    read: sender === 'agent'
  });
  
  res.json({ success: true, message: 'Message sent successfully' });
});

// Chat API - Get messages for a session
app.get('/api/messages/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = messagesStore[sessionId];
  
  if (!session) {
    return res.json({ messages: [] });
  }
  
  res.json(session);
});

// Admin API - Get all chat sessions
app.get('/api/admin/chat-sessions', (req, res) => {
  const sessions = Object.values(messagesStore).map(session => ({
    sessionId: session.sessionId,
    customerName: session.customerName,
    messageCount: session.messages.length,
    lastMessage: session.messages[session.messages.length - 1]?.message || 'No messages',
    timestamp: session.messages[session.messages.length - 1]?.timestamp
  }));
  res.json(sessions);
});

// Admin API - Reply to customer message
app.post('/api/admin/send-reply', (req, res) => {
  const { sessionId, message } = req.body;
  
  console.log('Send reply request - sessionId:', sessionId, 'message:', message);
  console.log('Available sessions:', Object.keys(messagesStore));
  
  if (!sessionId || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  
  if (!messagesStore[sessionId]) {
    console.log('Session not found:', sessionId);
    return res.status(404).json({ success: false, message: 'Session not found' });
  }
  
  messagesStore[sessionId].messages.push({
    message,
    sender: 'agent',
    timestamp: new Date(),
    read: false
  });
  
  console.log('Reply sent successfully for session:', sessionId);
  res.json({ success: true, message: 'Reply sent successfully' });
});

// Admin API - Add new product
app.post('/api/admin/products', (req, res) => {
  const { name, category, description, price, stock, image, featured, active } = req.body;
  
  // Validate required fields
  if (!name || !category || !price) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name, category, and price are required' 
    });
  }
  
  // Create new product with next ID
  const newId = Math.max(...products.map(p => p.id), 0) + 1;
  const newProduct = {
    id: newId,
    name,
    category,
    description: description || '',
    price: parseFloat(price),
    stock: parseInt(stock) || 0,
    image: image || '',
    featured: featured === true || featured === 'true',
    active: active !== false && active !== 'false'
  };
  
  products.push(newProduct);
  
  // Save products to file (optional - for persistence)
  saveProducts();
  
  console.log(`Product ${newId} created:`, newProduct);
  
  res.json({ 
    success: true, 
    message: 'Product created successfully',
    product: newProduct
  });
});

// Admin API - Delete product
app.delete('/api/admin/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex !== -1) {
    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);
    
    // Save products to file (optional - for persistence)
    saveProducts();
    
    console.log(`Product ${id} deleted:`, deletedProduct);
    
    res.json({ 
      success: true, 
      message: 'Product deleted successfully'
    });
  } else {
    res.status(404).json({ 
      success: false, 
      message: 'Product not found' 
    });
  }
});

// Helper function to save products to file
function saveProducts() {
  try {
    fs.writeFileSync(
      path.join(__dirname, 'data', 'products.json'),
      JSON.stringify(products, null, 2)
    );
  } catch (error) {
    console.error('Error saving products to file:', error);
  }
}

// Admin API - Update product (mock)
app.put('/api/admin/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;
  
  // Find product index
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex !== -1) {
    // Update product
    products[productIndex] = { ...products[productIndex], ...updates };
    
    // Save products to file for persistence
    saveProducts();
    
    console.log(`Product ${id} updated:`, updates);
    
    res.json({ 
      success: true, 
      message: 'Product updated successfully',
      product: products[productIndex]
    });
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
});

// Admin API - Get stats
app.get('/api/admin/stats', (req, res) => {
  // Calculate stats from products
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStock = products.filter(p => p.stock < 10).length;
  const categoriesCount = [...new Set(products.map(p => p.category))].length;
  
  res.json({
    totalProducts,
    totalValue: totalValue.toFixed(2),
    lowStock,
    categoriesCount,
    totalOrders: 125, // Mock data
    revenue: 45250.00 // Mock data
  });
});

// Error handling for multer (must come before catch-all route)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(413).json({ success: false, message: 'File is too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});

// Serve frontend
// Catch-all: serve frontend index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Future Plumbing server running on port ${PORT}`);
  console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
  console.log(`API endpoints: http://localhost:${PORT}/api/`);
});