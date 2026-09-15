const router = require('express').Router();
const { Log } = require('../models/Models');
const verify = require('../middleware/auth');

// Get all purchases for user
router.get('/', verify, async (req, res) => {
  try {
    const purchases = await Log.find({ userId: req.user.id, type: 'purchase' }).sort({ createdAt: -1 });
    res.json(purchases);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get purchase by ID
router.get('/:id', verify, async (req, res) => {
  try {
    const purchase = await Log.findOne({ _id: req.params.id, userId: req.user.id, type: 'purchase' });
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    res.json(purchase);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Add new purchase
router.post('/', verify, async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'name and price are required' });
    }

    const newPurchase = new Log({
      userId: req.user.id,
      type: 'purchase',
      itemType: name,
      cost: parseFloat(price),
      quantity: 1,
      totalCost: parseFloat(price),
      createdAt: new Date()
    });

    await newPurchase.save();
    res.status(201).json(newPurchase);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update purchase
router.put('/:id', verify, async (req, res) => {
  try {
    const { itemType, cost, quantity, totalCost } = req.body;

    const updateData = {};
    if (itemType) updateData.itemType = itemType;
    if (cost !== undefined) updateData.cost = parseFloat(cost);
    if (quantity !== undefined) updateData.quantity = parseInt(quantity);
    if (totalCost !== undefined) updateData.totalCost = parseFloat(totalCost);

    const purchase = await Log.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id, type: 'purchase' },
      updateData,
      { returnDocument: 'after' }
    );

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    res.json(purchase);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete purchase
router.delete('/:id', verify, async (req, res) => {
  try {
    // First find the purchase to verify ownership
    const purchase = await Log.findById(req.params.id);
    
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    if (purchase.userId.toString() !== req.user.id || purchase.type !== 'purchase') {
      return res.status(403).json({ error: 'Not authorized to delete this purchase' });
    }

    await Log.findByIdAndDelete(req.params.id);
    res.json({ message: 'Purchase deleted successfully', deletedId: req.params.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
