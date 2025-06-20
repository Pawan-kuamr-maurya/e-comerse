const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item', // Reference to Item model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      priceAtPurchase: {
        type: Number,
        required: true,
      },
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  shippingAddress: {
    name: String,
    addressLine1: String,
    city: String,
  state: String,
  postalCode: String,
  country: String,
    phone:String
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Wallet', 'Cash on Delivery'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending',  'Failed','Processing','Done'],
    default: 'Pending',
  },
  shippedDate: Date,
  deliveredDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);