# Quick Start Guide - Testing the Admin-to-Frontend Integration

This guide walks you through testing the integration between the admin dashboard and the frontend website.

## Prerequisites
- Backend server running on `http://localhost:3000`
- Node.js with Express and required packages installed
- Modern web browser (Chrome, Firefox, Safari, Edge)

---

## Testing Workflow

### Step 1: Open the Website
1. Go to `http://localhost:3000` in your browser
2. See the homepage with featured products
3. Click on "Products" in the navigation to see all products page

### Step 2: Open Admin Dashboard
1. In a new tab, go to `http://localhost:3000/admin`
2. You should see the admin dashboard with a "Products" section
3. Current products are listed in a table

### Step 3: Test Adding a Product
1. In the Admin dashboard, click **"Add Product"** button
2. Fill in the form:
   ```
   Name: Test Premium Faucet
   Category: Faucets
   Description: A test product for integration
   Price: 899.00
   Stock: 10
   Image URL: https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80
   Featured: ✓ (checked)
   Active: ✓ (checked)
   ```
3. Click **"Save Product"**
4. You should see a success message

### Step 4: Verify Product Appears on Products Page
1. Go to the **Products Page** tab (or open new tab: `http://localhost:3000/products.html`)
2. **Wait up to 5 seconds** - the page auto-refreshes every 5 seconds
3. The new "Test Premium Faucet" should appear in the products grid
4. Confirm the price is 899.00

### Step 5: Verify Product Appears on Homepage (Featured)
1. Since we checked "Featured" when creating the product, it should appear as featured
2. Go to the **Homepage** tab
3. Refresh the page (F5)
4. Scroll down to "Our Featured Products" section
5. You should see "Test Premium Faucet" there

### Step 6: Test Editing a Product
1. In the **Admin Dashboard** Products section
2. Click the **edit icon** (pencil) next to "Test Premium Faucet"
3. Change the price to **999.00** and stock to **5**
4. Click **"Save Product"**
5. Success message appears

### Step 7: Verify Edit on Products Page
1. Go to **Products Page** tab
2. The page should auto-update within 5 seconds
3. "Test Premium Faucet" now shows price **999.00**
4. Verify the change without manual refresh

### Step 8: Test Image Upload (Optional)
1. In Admin Dashboard, click the **upload icon** (cloud) next to any product
2. Select an image file from your computer (max 5MB)
3. Image uploads and displays in the table
4. The new image URL is saved to that product

### Step 9: Test Deleting a Product
1. In Admin Dashboard, click the **delete icon** (trash) next to "Test Premium Faucet"
2. Confirm the deletion in the dialog
3. Success message appears

### Step 10: Verify Deletion on Products Page
1. Go to **Products Page** tab
2. Page auto-updates within 5 seconds
3. "Test Premium Faucet" is no longer in the list
4. Confirm deletion without manual refresh

---

## Test Cases Summary

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 1 | Add new product | Product appears in admin table | ✓ |
| 2 | Add featured product | Product appears on homepage | ✓ |
| 3 | Edit product price | Products page updates in 5 sec | ✓ |
| 4 | Edit product stock | Products page updates in 5 sec | ✓ |
| 5 | Delete product | Product removed from products page | ✓ |
| 6 | Upload image | Image displays in table | ✓ |
| 7 | Search on products page | Products filter correctly | ✓ |
| 8 | Filter by category | Category filter works | ✓ |
| 9 | Add to cart | Product can be added to cart | ✓ |
| 10 | Checkout | WhatsApp order integration works | ✓ |

---

## Real-Time Sync Test

### How to Verify Real-Time Synchronization:

1. **Open Two Browser Windows Side-by-Side**:
   - Left window: Admin Dashboard at `http://localhost:3000/admin`
   - Right window: Products Page at `http://localhost:3000/products.html`

2. **Add a Product in Admin**:
   - Click "Add Product"
   - Enter details for a test product
   - Click "Save Product"
   - Success message appears

3. **Watch Products Page Update**:
   - The right window will auto-refresh within 5 seconds
   - New product automatically appears without any manual action
   - This proves real-time synchronization is working

4. **Edit a Product in Admin**:
   - Click edit on any product
   - Change the price
   - Save changes
   - Products page updates automatically

---

## API Testing (Using Browser Console)

You can test API endpoints directly from browser console:

### Test Get All Products
```javascript
fetch('/api/products')
  .then(r => r.json())
  .then(data => console.log(data))
```

### Test Get Featured Products
```javascript
fetch('/api/products/featured')
  .then(r => r.json())
  .then(data => console.log(data))
```

### Test Create Product
```javascript
fetch('/api/admin/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test Product',
    category: 'Faucets',
    description: 'Test',
    price: 100,
    stock: 5,
    featured: false,
    active: true
  })
})
.then(r => r.json())
.then(data => console.log(data))
```

### Test Update Product
```javascript
fetch('/api/admin/products/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ price: 150 })
})
.then(r => r.json())
.then(data => console.log(data))
```

### Test Delete Product
```javascript
fetch('/api/admin/products/1', { method: 'DELETE' })
  .then(r => r.json())
  .then(data => console.log(data))
```

---

## Troubleshooting Test Failures

### Products not appearing on products page after add
- ✓ Wait 5 seconds for auto-refresh
- ✓ Check browser console (F12) for errors
- ✓ Verify backend server is running
- ✓ Try manual refresh (F5) on products page

### Changes not persisting after refresh
- ✓ Check if `backend/data/products.json` is being updated
- ✓ Verify backend has write permissions to `backend/data/` directory
- ✓ Check server logs for any errors

### Images not uploading
- ✓ Ensure image is less than 5MB
- ✓ Only JPEG, PNG, GIF, WebP formats supported
- ✓ Check `backend/uploads/` directory exists and is writable

### Admin dashboard not loading
- ✓ Verify backend server is running: `npm start` in `backend/`
- ✓ Try clearing browser cache
- ✓ Check if port 3000 is being used by another process

---

## Performance Notes

- **Auto-refresh interval**: 5 seconds on products page
- **Image upload limit**: 5MB per file
- **API response time**: Should be < 100ms for local server
- **Product JSON file size**: ~50KB for 20+ products

---

## Next Steps After Testing

If all tests pass:
1. Review the `INTEGRATION_GUIDE.md` for complete documentation
2. Customize product categories as needed
3. Set up automatic backups of `products.json`
4. Consider adding authentication to admin dashboard
5. Plan migration to database (MongoDB, PostgreSQL) for scalability

For issues or questions, refer to the troubleshooting section in the main documentation.
