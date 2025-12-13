// Admin Dashboard - Recent Orders

document.addEventListener('DOMContentLoaded', function() {
  loadRecentOrders();
});

async function loadRecentOrders() {
  const tbody = document.getElementById('recent-orders-body');
  if (!tbody) return;
  
  try {
    const res = await fetch('/api/admin/orders');
    if (!res.ok) throw new Error('Failed to fetch orders');
    const orders = await res.json();
    
    // Get only the last 4 orders (most recent)
    const recentOrders = orders.slice(0, 4);
    
    if (recentOrders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #666;">No orders yet.</td></tr>`;
      return;
    }
    
    tbody.innerHTML = recentOrders.map(order => `
      <tr>
        <td><strong>#${order.id}</strong></td>
        <td>${escapeHtml(order.customer)}</td>
        <td>${formatDate(order.date)}</td>
        <td>₵${order.amount.toFixed(2)}</td>
        <td><span class="status status-${getStatusClass(order.status)}">${capitalizeFirst(order.status)}</span></td>
        <td>
          <button class="btn-action view-order" data-order-id="${order.id}" 
                  style="cursor: pointer; background: none; border: none; color: #0078d7; font-size: 14px; padding: 5px;"
                  title="View"><i class="fas fa-eye"></i></button>
          <button class="btn-action delete-recent-order" data-order-id="${order.id}" 
                  style="cursor: pointer; background: none; border: none; color: #dc3545; font-size: 14px; padding: 5px;"
                  title="Delete"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
    
    setupRecentOrderListeners();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #666;">Failed to load orders.</td></tr>`;
    console.error('Error loading recent orders:', err);
  }
}

function setupRecentOrderListeners() {
  const deleteButtons = document.querySelectorAll('.delete-recent-order');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', handleDeleteRecentOrder);
  });
}

async function handleDeleteRecentOrder(e) {
  const orderId = parseInt(e.currentTarget.getAttribute('data-order-id'));
  
  if (!confirm(`Delete order #${orderId}?`)) {
    return;
  }
  
  try {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'DELETE'
    });
    
    if (res.ok) {
      // Reload recent orders
      loadRecentOrders();
      showNotification(`Order #${orderId} deleted`, 'success');
    } else {
      showNotification('Failed to delete order', 'error');
    }
  } catch (err) {
    console.error('Error deleting order:', err);
    showNotification('Error deleting order', 'error');
  }
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
    z-index: 3000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
