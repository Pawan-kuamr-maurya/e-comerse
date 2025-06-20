  const mongoose = require('mongoose');

  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'seller', 'admin'],
      default: 'user',
    },
    // Additional optional fields
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
      age: {
      type: Number,
      required: true
    },
    gender:{
      type:String,
      enum:["male","female"]
    }
    ,
    profileImage: {
      type:String,
    
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    wallet:{
  type:Number,
  default:5000
    },
  cartitems:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    }],
    orders:[{
type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    }]
  });

  // Middleware to update 'updatedAt' on save
  userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

  // Note: Password hashing should be handled in pre-save hooks or separately in your auth logic

  module.exports = mongoose.model('User', userSchema);