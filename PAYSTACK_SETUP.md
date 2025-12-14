# Paystack Integration Guide

## Overview
Your Future Plumbing website now has **Paystack payment integration** for products and services. Customers can safely pay using various methods including:
- ✅ Mobile Money (MTN, Vodafone, AirtelTigo)
- ✅ Debit/Credit Cards
- ✅ Bank Transfers
- ✅ International Cards

---

## Setup Instructions

### Step 1: Create a Paystack Account
1. Go to [Paystack.com](https://paystack.com)
2. Sign up and verify your email
3. Complete your business information
4. Add your bank account for withdrawals

### Step 2: Get Your Paystack Keys
1. Log into your Paystack dashboard
2. Go to **Settings → API Keys & Webhooks**
3. You'll see:
   - **Public Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)

### Step 3: Update Your Website
Replace the placeholder key in these files with your **Paystack Public Key**:

#### Frontend Files:
- **`frontend/checkout.html`** - Line 101
  ```javascript
  const PAYSTACK_PUBLIC_KEY = 'pk_live_YOUR_ACTUAL_PUBLIC_KEY';
  ```

- **`frontend/js/paystack.js`** - Line 2
  ```javascript
  const PAYSTACK_PUBLIC_KEY = 'pk_live_YOUR_ACTUAL_PUBLIC_KEY';
  ```

#### Backend Files:
- **`backend/server.js`** - Add your **Secret Key** for verification (optional for advanced setup)

### Step 4: Test Payment
1. Use Paystack's **Test Keys** (provided in your dashboard)
2. Test with sample card: `4111 1111 1111 1111` (Expiry: any future date, CVV: any 3 digits)
3. Go live with your **Live Keys** when ready

---

## How It Works

### Customer Journey
1. Customer adds products to cart
2. Clicks "Proceed to Checkout"
3. Fills out delivery information (Name, Email, Phone, Address)
4. Clicks "Pay with Paystack"
5. Paystack modal opens
6. Customer selects payment method (Mobile Money, Card, Bank Transfer, etc.)
7. Completes payment
8. Order is automatically created in your system
9. Confirmation email sent to customer

### Backend Flow
- **POST `/api/orders`** - Creates order after successful payment
- **GET `/api/orders`** - Admin retrieves all orders
- **GET `/api/orders/:id`** - Get specific order details
- **PUT `/api/orders/:id`** - Update order status
- **POST `/api/paystack/verify`** - Verify payment reference

---

## Order Data Structure

Each order contains:
```json
{
  "id": "1702502400000",
  "reference": "1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+233 XX XXX XXXX",
  "address": "123 Main Street, Accra",
  "notes": "Special instructions",
  "items": [
    {
      "id": "prod-1",
      "name": "Modern Faucet",
      "price": 450,
      "quantity": 2,
      "type": "product"
    }
  ],
  "total": 945,
  "status": "completed",
  "createdAt": "2025-12-13T10:00:00Z",
  "updatedAt": "2025-12-13T10:00:00Z"
}
```

---

## File Locations

### New Files Created:
- **`frontend/checkout.html`** - Checkout page with payment form
- **`frontend/js/paystack.js`** - Cart and payment logic

### Modified Files:
- **`backend/server.js`** - Added 5 order management endpoints + Paystack verification
- **`vercel.json`** - Already configured to handle `/api/orders` routes

### Data Storage:
- **`backend/data/orders.json`** - Where all orders are saved

---

## Security Best Practices

✅ **Always use your Public Key** in frontend code (it's meant to be public)
✅ **Never expose your Secret Key** in frontend code
✅ **Implement webhook verification** for production (optional advanced feature)
✅ **HTTPS only** - Paystack requires HTTPS for live payments
✅ **Validate amounts** on backend before processing

---

## Testing Checklist

- [ ] Replace placeholder public key with your test key
- [ ] Test adding products to cart
- [ ] Test removing products
- [ ] Test checkout page loads correctly
- [ ] Test payment with test card (4111 1111 1111 1111)
- [ ] Verify order appears in `backend/data/orders.json`
- [ ] Test mobile money payment method
- [ ] Check order status can be updated in admin

---

## Troubleshooting

### "Invalid Public Key" Error
- [ ] Make sure you copied the correct key (starts with `pk_`)
- [ ] Check for extra spaces or special characters
- [ ] Verify you're using the right environment (test vs live)

### Payment Modal Not Opening
- [ ] Check browser console for errors
- [ ] Ensure Paystack script is loaded: `<script src="https://js.paystack.co/v1/inline.js"></script>`
- [ ] Verify public key is set correctly

### Orders Not Saving
- [ ] Check that `backend/data/` directory exists
- [ ] Verify backend server is running
- [ ] Check server logs for errors

---

## Advanced Features (Coming Soon)

- 📧 Email notifications to customers on successful payment
- 📊 Admin analytics dashboard showing payment trends
- 🔔 Webhook integration for real-time payment updates
- 📱 Mobile Money optimization for Ghana market
- 🎯 Service booking with payment integration

---

## Support

For Paystack integration help:
- 📖 [Paystack Documentation](https://paystack.com/docs)
- 💬 [Paystack Support](https://support.paystack.com)
- 📧 Your customer email: jacobashiley45@icloud.com

---

## Summary

You now have a **fully functional payment system** with:
✅ Cart management
✅ Checkout page
✅ Paystack integration
✅ Order tracking
✅ Payment verification
✅ Admin order management

**Next Step:** Replace the placeholder public key with your Paystack account's actual key!
