// Backend Server for Future Plumbing Company
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve admin static assets (CSS / JS for admin)
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Serve frontend static assets
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Load data from JSON files
let services = [];
let products = [];

async function loadData() {
  try {
    const servicesData = await fs.readFile(path.join(__dirname, 'data', 'services.json'), 'utf-8');
    const productsData = await fs.readFile(path.join(__dirname, 'data', 'products.json'), 'utf-8');

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

// Admin routes
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'admin.html'));
});

// Admin API - Get all orders (mock data)
app.get('/api/admin/orders', (req, res) => {
  // In production, this would come from a database
  const orders = [
    { id: 1001, customer: "Kwame Mensah", product: "Modern Chrome Faucet", amount: 450.00, status: "completed", date: "2023-10-15" },
    { id: 1002, customer: "Ama Boateng", product: "Rain Shower Set", amount: 650.00, status: "pending", date: "2023-10-16" },
    { id: 1003, customer: "Yaw Asante", product: "Automatic Water Pump", amount: 850.00, status: "processing", date: "2023-10-17" },
    { id: 1004, customer: "Esi Adjei", product: "PVC Plumbing Pipes", amount: 240.00, status: "completed", date: "2023-10-18" },
    { id: 1005, customer: "Kofi Owusu", product: "Water Tank + Installation", amount: 1500.00, status: "pending", date: "2023-10-19" }
  ];
  
  res.json(orders);
});

// Admin API - Update product (mock)
app.put('/api/admin/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;
  
  // Find product index
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex !== -1) {
    // Update product
    products[productIndex] = { ...products[productIndex], ...updates };
    
    // In production, save to database
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