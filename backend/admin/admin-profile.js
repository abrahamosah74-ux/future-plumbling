// Admin Profile Management

document.addEventListener('DOMContentLoaded', function() {
  setupProfileUpload();
});

function setupProfileUpload() {
  const userAvatar = document.querySelector('.user-avatar');
  if (!userAvatar) return;
  
  // Add click handler
  userAvatar.style.cursor = 'pointer';
  userAvatar.addEventListener('click', handleProfileUploadClick);
  
  // Add hover effect
  userAvatar.style.transition = 'all 0.3s ease';
  userAvatar.addEventListener('mouseenter', function() {
    this.style.opacity = '0.7';
    this.style.transform = 'scale(1.05)';
  });
  userAvatar.addEventListener('mouseleave', function() {
    this.style.opacity = '1';
    this.style.transform = 'scale(1)';
  });
}

function handleProfileUploadClick(e) {
  e.preventDefault();
  
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (evt) => {
    const file = evt.target.files[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showAdminNotification('File size must be less than 5MB', 'error');
      return;
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch('/api/upload-profile', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Update the avatar with the new image
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar) {
          // Create img element or update existing
          let imgEl = userAvatar.querySelector('img');
          if (!imgEl) {
            imgEl = document.createElement('img');
            imgEl.style.cssText = `
              width: 40px;
              height: 40px;
              border-radius: 50%;
              object-fit: cover;
            `;
            // Remove the icon
            const icon = userAvatar.querySelector('i');
            if (icon) icon.remove();
            userAvatar.appendChild(imgEl);
          }
          imgEl.src = data.imageUrl + '?t=' + Date.now();
          imgEl.alt = 'Admin Profile';
        }
        showAdminNotification('Profile picture updated successfully!', 'success');
      } else {
        console.error('Upload response error:', data);
        showAdminNotification(data.message || 'Failed to upload profile picture', 'error');
      }
    } catch (err) {
      console.error('Error uploading profile:', err);
      showAdminNotification('Network error: ' + err.message, 'error');
    }
  };
  input.click();
}

function showAdminNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${type === 'success' ? '#34a853' : type === 'error' ? '#dc3545' : '#0078d7'};
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
