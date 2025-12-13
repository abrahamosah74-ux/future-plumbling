// Admin Products Management

let allProducts = [];

document.addEventListener('DOMContentLoaded', function() {
  loadProducts();
  setupProductFormHandlers();
});

async function loadProducts() {
  const tbody = document.getElementById('products-table-body');
  if (!tbody) return;
  
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    allProducts = await res.json();
    
    tbody.innerHTML = allProducts.map(product => `
      <tr data-product-id="${product.id}">
        <td>
          <img id="product-img-${product.id}" src="${product.image || 'https://via.placeholder.com/50'}" 
               alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
        </td>
        <td>${escapeHtml(product.name)}</td>
        <td>${escapeHtml(product.category)}</td>
        <td>₵${product.price?.toFixed(2) || '0.00'}</td>
        <td>${product.stock || 0}</td>
        <td><span class="status ${product.stock > 0 ? 'status-completed' : 'status-pending'}">
          ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></td>
        <td class="actions" style="text-align: center; gap: 8px;">
          <button class="btn-action upload-img-btn" data-product-id="${product.id}" 
                  style="cursor: pointer; background: none; border: none; color: #0078d7; font-size: 16px; padding: 5px;"
                  title="Upload Image"><i class="fas fa-cloud-upload-alt"></i></button>
          <button class="btn-action edit-product-btn" data-product-id="${product.id}" 
                  style="cursor: pointer; background: none; border: none; color: #0078d7; font-size: 16px; padding: 5px;"
                  title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn-action delete-product" data-product-id="${product.id}" 
                  style="cursor: pointer; background: none; border: none; color: #dc3545; font-size: 16px; padding: 5px;"
                  title="Delete"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
    
    setupProductUploadListeners();
    setupEditButtonListeners();
    setupDeleteButtonListeners();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: #666;">Failed to load products.</td></tr>`;
    console.error('Error loading products:', err);
  }
}

function setupProductUploadListeners() {
  const uploadBtns = document.querySelectorAll('.upload-img-btn');
  uploadBtns.forEach(btn => {
    btn.removeEventListener('click', handleUploadClick);
    btn.addEventListener('click', handleUploadClick);
  });
}

function handleUploadClick(e) {
  const productId = e.currentTarget.getAttribute('data-product-id');
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (evt) => {
    const file = evt.target.files[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showNotification('File size must be less than 5MB', 'error');
      return;
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        showNotification(errorData.message || 'Upload failed with status ' + res.status, 'error');
        console.error('Upload error response:', errorData);
        return;
      }
      
      const data = await res.json();
      
      if (data.success) {
        // Update the image in the table
        const imgEl = document.getElementById(`product-img-${productId}`);
        if (imgEl) {
          imgEl.src = data.imageUrl + '?t=' + Date.now(); // Add timestamp to force refresh
        }
        showNotification(`Image uploaded successfully!`, 'success');
      } else {
        showNotification(data.message || 'Failed to upload image', 'error');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      showNotification('Network error: ' + err.message, 'error');
    }
  };
  input.click();
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${type === 'success' ? '#34a853' : '#dc3545'};
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 2000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function setupProductFormHandlers() {
  // This function sets up the product form modal from admin.js
  // Here we'll add handlers for edit button clicks
}

function setupEditButtonListeners() {
  const editBtns = document.querySelectorAll('.edit-product-btn');
  editBtns.forEach(btn => {
    btn.removeEventListener('click', handleEditProduct);
    btn.addEventListener('click', handleEditProduct);
  });
}

function setupDeleteButtonListeners() {
  const deleteBtns = document.querySelectorAll('.delete-product');
  deleteBtns.forEach(btn => {
    btn.removeEventListener('click', handleDeleteProduct);
    btn.addEventListener('click', handleDeleteProduct);
  });
}

async function handleDeleteProduct(e) {
  e.preventDefault();
  const productId = parseInt(e.currentTarget.getAttribute('data-product-id'));
  const product = allProducts.find(p => p.id === productId);
  
  if (!product) {
    showNotification('Product not found', 'error');
    return;
  }
  
  // Confirm deletion
  if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
    return;
  }
  
  try {
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'DELETE'
    });
    
    if (res.ok) {
      showNotification('Product deleted successfully!', 'success');
      loadProducts();
    } else {
      const data = await res.json();
      showNotification(data.message || 'Failed to delete product', 'error');
    }
  } catch (err) {
    console.error('Error deleting product:', err);
    showNotification('Error deleting product: ' + err.message, 'error');
  }
}

async function handleEditProduct(e) {
  const productId = parseInt(e.currentTarget.getAttribute('data-product-id'));
  const product = allProducts.find(p => p.id === productId);
  
  if (!product) {
    showNotification('Product not found', 'error');
    return;
  }
  
  // Fill the form with product data
  document.getElementById('product-name').value = product.name || '';
  document.getElementById('product-category').value = product.category || '';
  document.getElementById('product-description').value = product.description || '';
  document.getElementById('product-price').value = product.price || '';
  document.getElementById('product-stock').value = product.stock || '';
  document.getElementById('product-image').value = product.image || '';
  document.getElementById('product-featured').checked = product.featured || false;
  document.getElementById('product-active').checked = product.active !== false;
  
  // Update modal title
  document.getElementById('product-modal-title').textContent = `Edit Product: ${product.name}`;
  
  // Store the product ID for update
  const productForm = document.getElementById('product-form');
  productForm.dataset.editingProductId = productId;
  
  // Show modal
  const productModal = document.getElementById('product-modal');
  productModal.style.display = 'flex';
}
