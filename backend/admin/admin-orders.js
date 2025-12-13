// Admin Orders Management

document.addEventListener('DOMContentLoaded', function() {
  loadOrders();
  setupFilterButtons();
});

let allOrders = [];

async function loadOrders() {
  const tbody = document.getElementById('orders-table-body');
  if (!tbody) return;
  
  try {
    const res = await fetch('/api/admin/orders');
    if (!res.ok) throw new Error('Failed to fetch orders');
    allOrders = await res.json();
    
    renderOrders(allOrders);
    attachDeleteListeners();
    attachViewListeners();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px; color: #666;">Failed to load orders.</td></tr>`;
    console.error('Error loading orders:', err);
  }
}

function renderOrders(orders) {
  const tbody = document.getElementById('orders-table-body');
  if (!tbody) return;
  
  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px; color: #666;">No orders found.</td></tr>`;
    return;
  }
  
  tbody.innerHTML = orders.map(order => `
    <tr data-order-id="${order.id}">
      <td><input type="checkbox" class="order-checkbox"></td>
      <td><strong>#${order.id}</strong></td>
      <td>${escapeHtml(order.customer)}</td>
      <td>${escapeHtml(order.product)}</td>
      <td>${formatDate(order.date)}</td>
      <td>₵${order.amount.toFixed(2)}</td>
      <td><span class="status status-${getStatusClass(order.status)}">${capitalizeFirst(order.status)}</span></td>
      <td class="actions" style="text-align: center; gap: 8px;">
        <button class="btn-action view-order" data-order-id="${order.id}" 
                style="cursor: pointer; background: none; border: none; color: #0078d7; font-size: 16px; padding: 5px;"
                title="View"><i class="fas fa-eye"></i></button>
        <button class="btn-action delete-order" data-order-id="${order.id}" 
                style="cursor: pointer; background: none; border: none; color: #dc3545; font-size: 16px; padding: 5px;"
                title="Delete"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

function attachDeleteListeners() {
  const deleteButtons = document.querySelectorAll('.delete-order');
  deleteButtons.forEach(btn => {
    btn.removeEventListener('click', handleDeleteOrder);
    btn.addEventListener('click', handleDeleteOrder);
  });
}

function attachViewListeners() {
  const viewButtons = document.querySelectorAll('.view-order');
  viewButtons.forEach(btn => {
    btn.removeEventListener('click', handleViewOrder);
    btn.addEventListener('click', handleViewOrder);
  });
}

async function handleDeleteOrder(e) {
  const orderId = parseInt(e.currentTarget.getAttribute('data-order-id'));
  
  // Confirm deletion
  if (!confirm(`Are you sure you want to delete order #${orderId}?`)) {
    return;
  }
  
  try {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'DELETE'
    });
    
    if (res.ok) {
      // Remove order from local array
      allOrders = allOrders.filter(order => order.id !== orderId);
      
      // Remove row from table
      const row = document.querySelector(`tr[data-order-id="${orderId}"]`);
      if (row) {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        row.style.transition = 'all 0.3s ease';
        setTimeout(() => row.remove(), 300);
      }
      
      showNotification(`Order #${orderId} deleted successfully`, 'success');
    } else {
      showNotification('Failed to delete order', 'error');
    }
  } catch (err) {
    console.error('Error deleting order:', err);
    showNotification('Error deleting order', 'error');
  }
}

function handleViewOrder(e) {
  const orderId = parseInt(e.currentTarget.getAttribute('data-order-id'));
  const order = allOrders.find(o => o.id === orderId);
  
  if (!order) {
    showNotification('Order not found', 'error');
    return;
  }
  
  // Create and show modal with order details
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
  `;
  
  modal.innerHTML = `
    <div style="background: white; border-radius: 8px; padding: 30px; max-width: 500px; width: 90%; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #333;">Order #${order.id}</h2>
        <button onclick="this.closest('div').parentElement.parentElement.remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
      </div>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 15px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase; font-weight: bold;">Customer</p>
            <p style="margin: 0; color: #333; font-size: 16px;">${escapeHtml(order.customer)}</p>
          </div>
          <div>
            <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase; font-weight: bold;">Order Date</p>
            <p style="margin: 0; color: #333; font-size: 16px;">${formatDate(order.date)}</p>
          </div>
          <div>
            <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase; font-weight: bold;">Product</p>
            <p style="margin: 0; color: #333; font-size: 16px;">${escapeHtml(order.product)}</p>
          </div>
          <div>
            <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase; font-weight: bold;">Amount</p>
            <p style="margin: 0; color: #333; font-size: 16px; font-weight: bold;">₵${order.amount.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p style="margin: 0 0 8px 0; color: #666; font-size: 12px; text-transform: uppercase; font-weight: bold;">Status</p>
        <span class="status status-${getStatusClass(order.status)}" style="display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">
          ${capitalizeFirst(order.status)}
        </span>
      </div>
      
      <div style="display: flex; gap: 10px;">
        <button onclick="this.closest('div').parentElement.parentElement.remove()" style="flex: 1; padding: 10px; border: 1px solid #ddd; background: white; color: #666; border-radius: 4px; cursor: pointer; font-weight: 500;">Close</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close on background click
  modal.addEventListener('click', function(e) {
    if (e.target === this) {
      this.remove();
    }
  });
}

function setupFilterButtons() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      if (filter === 'all') {
        renderOrders(allOrders);
      } else {
        const filtered = allOrders.filter(order => order.status === filter);
        renderOrders(filtered);
      }
      attachDeleteListeners();
      attachViewListeners();
    });
  });
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getStatusClass(status) {
  const map = {
    'pending': 'pending',
    'processing': 'processing',
    'completed': 'completed',
    'cancelled': 'cancelled'
  };
  return map[status] || 'pending';
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
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
