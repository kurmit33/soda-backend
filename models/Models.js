const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['drink', 'purchase'], required: true },
  
  // Pola dla 'drink'
  drinkType: String,
  volume: Number,
  storeCost: Number,
  homeCost: Number,
  profit: Number,

  // Pola dla 'purchase'
  itemType: String,
  cost: Number,
  quantity: Number,
  totalCost: Number,

  createdAt: { type: Date, default: Date.now }
});

const settingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  waterStorePrice: { type: Number, default: 1.20 },
  deviceCost: { type: Number, default: 350 },
  co2Usage: { type: Number, default: 0 },
  drinks: [{
    id: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    storePrice: { type: Number, required: true }
  }]
});

module.exports = {
  Log: mongoose.model('Log', logSchema),
  Settings: mongoose.model('Settings', settingsSchema)
};