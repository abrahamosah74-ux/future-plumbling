# Future Plumbling - Admin Dashboard to Frontend Integration Guide

## Overview

This document describes how the admin dashboard is connected to the website frontend, allowing real-time synchronization of product data across all pages.

---

## Architecture

### 1. Backend API Endpoints

The backend server (Express.js) provides the following endpoints:

#### Product Management Endpoints:

- **GET /api/products** - Retrieve all products with optional filtering
  - Query parameters:
    - `category`: Filter by category
    - `search`: Search by name, description, or category
    - `featured`: Filter for featured products only

- **GET /api/products/featured** - Retrieve only featured products

- **GET /api/products/:id** - Get a single product by ID

- **GET /api/categories** - Get all available product categories

#### Admin Endpoints:

- **POST /api/admin/products** - Create a new product
  - Body: `{ name, category, description, price, stock, image, featured, active }`

- **PUT /api/admin/products/:id** - Update an existing product
  - Body: Same as POST

- **DELETE /api/admin/products/:id** - Delete a product

- **POST /api/upload-image** - Upload product images
  - Form data: `image` (multipart file)
  - Returns: `{ success, message, imageUrl }`

---

## Frontend Integration

### 1. Homepage (index.html)

The homepage displays featured products in the "Our Featured Products" section.

**File**: `frontend/js/main.js`

**Key Function**: `loadFeaturedProducts()`
- Fetches featured products from `/api/products/featured`
- Dynamically renders product cards
- No auto-refresh (loads once on page load)

### 2. Products Page (products.html)

The dedicated products page displays all products with filtering and search capabilities.

**File**: `frontend/js/products.js`

**Key Features**:
- Fetches all products from `/api/products`
- **Auto-refreshes every 5 seconds** to stay in sync with admin changes
- Supports filtering by category
- Supports search by product name/description
- Shopping cart functionality
- Integration with WhatsApp checkout

**How it works**:
```javascript
// Fetch products from API
async function fetchProducts() {
    const response = await fetch('/api/products');
    allProductsData = await response.json();
    loadProducts(allProductsData);
}

// Initial load
fetchProducts();

// Refresh every 5 seconds
setInterval(fetchProducts, 5000);
```

---

## Admin Dashboard Integration

### 1. Admin Panel (backend/admin/admin.html)

The admin dashboard provides a complete product management interface.

**Files**:
- `backend/admin/admin.html` - HTML structure
- `backend/admin/admin.js` - Main dashboard logic
- `backend/admin/admin-products.js` - Product management logic

### 2. Product Management Features

#### Add New Product
1. Click "Add Product" button
2. Fill in product details:
   - Name (required)
   - Category (required)
   - Description
   - Price (required)
   - Stock quantity
   - Image URL
   - Featured checkbox
   - Active checkbox
3. Click "Save Product"
4. Product is added to database via **POST /api/admin/products**

#### Edit Product
1. Click the edit icon (pencil) next to a product
2. Modal opens with current product data
3. Modify any fields
4. Click "Save Product"
5. Product is updated via **PUT /api/admin/products/:id**

#### Delete Product
1. Click the delete icon (trash) next to a product
2. Confirm deletion in dialog
3. Product is deleted via **DELETE /api/admin/products/:id**

#### Upload Product Image
1. Click the upload icon (cloud) next to a product
2. Select an image file (max 5MB)
3. Image is uploaded to `/uploads` directory
4. Product image URL is updated

---

## Data Persistence

### JSON File Storage

Products are stored in `backend/data/products.json` and are loaded on server startup.

**Key Files**:
- `backend/data/products.json` - Product data storage
- `backend/server.js` - Server configuration and routes

### Auto-Save Functionality

When products are created, updated, or deleted through the admin panel:
1. Changes are updated in memory
2. `saveProducts()` function writes changes to `products.json`
3. Changes persist across server restarts

```javascript
function saveProducts() {
  fs.writeFileSync(
    path.join(__dirname, 'data', 'products.json'),
    JSON.stringify(products, null, 2)
  );
}
```

---

## Real-Time Synchronization

### How Changes Are Reflected

1. **Admin Dashboard** → Creates/Updates/Deletes product
2. **Backend API** → Saves to `products.json`
3. **Products Page** → Auto-refreshes every 5 seconds
4. **Homepage** → User navigates back to see updated featured products

### Frontend Auto-Refresh

The products page automatically fetches updated data every 5 seconds:

```javascript
// Refresh products every 5 seconds
setInterval(fetchProducts, 5000);
```

This ensures users always see the most current product information without manual page refresh.

---

## Image Management

### Uploading Product Images

Products can have images uploaded through the admin dashboard:

1. Click the upload icon next to a product
2. Select an image file (JPEG, PNG, GIF, WebP - max 5MB)
3. Image is uploaded to `backend/uploads/` directory
4. Image URL is stored in product record
5. Image displays immediately on homepage and products page

### Image URL Format

Images are served at: `http://localhost:3000/uploads/{filename}`

Example: `http://localhost:3000/uploads/product-1234567890.jpg`

---

## Workflow: From Admin to Customer

### Scenario: Add a New Product

1. **Admin**:
   - Opens `/admin`
   - Clicks "Add Product"
   - Fills in details: Name="Premium Faucet", Price=550, Category="Faucets"
   - Clicks "Save Product"
   - Product is created with ID 11 (for example)

2. **Backend**:
   - POST request creates new product
   - Product saved to `products.json`
   - API responds with success message

3. **Frontend - Products Page**:
   - Auto-refresh triggers within 5 seconds
   - `fetchProducts()` retrieves all products including new one
   - New product appears in grid immediately

4. **Frontend - Homepage**:
   - Featured products still show old data
   - When user navigates back or refreshes, new featured products load
   - To see featured products immediately, admin can check the "Featured" checkbox

### Scenario: Edit Product Price

1. **Admin**:
   - Clicks edit icon on existing product
   - Changes price from 450 to 475
   - Clicks "Save Product"

2. **Backend**:
   - PUT request updates product in memory
   - Product saved to `products.json`

3. **Frontend - Products Page**:
   - Auto-refresh within 5 seconds shows new price
   - Products are re-rendered with updated information

4. **Customer Experience**:
   - Customer browsing products page sees price update automatically
   - If customer already added to cart, local cart price remains unchanged (based on when they added it)

---

## Features Summary

| Feature | Admin | Homepage | Products Page |
|---------|-------|----------|----------------|
| View Products | ✅ | ✅ (Featured) | ✅ (All) |
| Add Products | ✅ | - | - |
| Edit Products | ✅ | - | - |
| Delete Products | ✅ | - | - |
| Upload Images | ✅ | ✅ | ✅ |
| Search | - | - | ✅ |
| Filter by Category | - | - | ✅ |
| Auto-Refresh | ✅ (Manual) | ❌ | ✅ (Every 5 sec) |
| Add to Cart | - | ✅ | ✅ |
| Checkout | - | ✅ | ✅ |

---

## API Request Examples

### Create Product (cURL)
```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Faucet",
    "category": "Faucets",
    "description": "High-end faucet with modern design",
    "price": 550.00,
    "stock": 20,
    "image": "https://example.com/faucet.jpg",
    "featured": true,
    "active": true
  }'
```

### Update Product (cURL)
```bash
curl -X PUT http://localhost:3000/api/admin/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 475.00,
    "stock": 18
  }'
```

### Delete Product (cURL)
```bash
curl -X DELETE http://localhost:3000/api/admin/products/1
```

---

## Troubleshooting

### Products Not Updating on Frontend
- **Issue**: Homepage or products page not showing latest products
- **Solution**: 
  - Check if backend server is running
  - Products page auto-refreshes every 5 seconds
  - Manual refresh (F5) on homepage
  - Check browser console for API errors

### Image Upload Fails
- **Issue**: "File is too large" or upload fails
- **Solution**:
  - Ensure image is less than 5MB
  - Only JPEG, PNG, GIF, WebP formats supported
  - Check `backend/uploads/` directory has write permissions

### Admin Dashboard Won't Load
- **Issue**: /admin returns blank or error
- **Solution**:
  - Verify backend server is running on port 3000
  - Check `backend/admin/` files exist
  - Clear browser cache
  - Try incognito window

### Products.json Not Found
- **Issue**: Error loading products from file
- **Solution**:
  - Ensure `backend/data/products.json` exists
  - Check file permissions
  - Verify JSON syntax is valid
  - Server will create default empty products if file is missing

---

## Environment Setup

### Requirements
- Node.js v14+
- Express.js (npm package)
- CORS enabled (npm package)
- Multer for image uploads (npm package)

### Installation
```bash
cd backend
npm install
npm start
```

### Server runs on: `http://localhost:3000`
- Admin Dashboard: `http://localhost:3000/admin`
- Homepage: `http://localhost:3000/`
- Products Page: `http://localhost:3000/products.html`
- API Base: `http://localhost:3000/api/`

---

## Future Enhancements

Potential improvements for the integration:

1. **WebSocket Real-Time Updates** - Replace 5-second polling with live updates
2. **Database Integration** - Move from JSON to MongoDB/PostgreSQL
3. **Admin Authentication** - Add login system for admin dashboard
4. **Product Inventory Alerts** - Notify when stock is low
5. **Order Management** - Full order tracking system
6. **Analytics Dashboard** - Track product views and sales
7. **Image Optimization** - Automatic thumbnail generation
8. **Caching** - Reduce API calls with browser caching

---

## Support

For issues or questions, check:
- Browser console (F12) for error messages
- Server logs in terminal
- API endpoint responses using Postman or cURL
- File permissions on `backend/` directory

