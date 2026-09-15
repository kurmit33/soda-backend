const router = require('express').Router();
const { Settings } = require('../models/Models');
const verify = require('../middleware/auth');

router.get('/', verify, async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user.id });
    if (!settings) {
      settings = new Settings({ userId: req.user.id });
      await settings.save();
    }
    res.json(settings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update general settings
router.put('/', verify, async (req, res) => {
  try {
    const { waterStorePrice, deviceCost, co2Usage } = req.body;
    
    const updateData = {};
    if (waterStorePrice !== undefined) updateData.waterStorePrice = waterStorePrice;
    if (deviceCost !== undefined) updateData.deviceCost = deviceCost;
    if (co2Usage !== undefined) updateData.co2Usage = co2Usage;

    const updated = await Settings.findOneAndUpdate(
      { userId: req.user.id }, 
      updateData, 
      { returnDocument: 'after', upsert: true }
    );
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Add new drink
router.post('/drinks', verify, async (req, res) => {
  try {
    const { name, storePrice } = req.body;
    
    if (!name || !storePrice) {
      return res.status(400).json({ error: 'Name and storePrice are required' });
    }

    const drinkId = Date.now().toString();
    const newDrink = { id: drinkId, name, storePrice: parseFloat(storePrice) };

    const settings = await Settings.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { drinks: newDrink } },
      { returnDocument: 'after', upsert: true }
    );
    
    res.status(201).json({ drink: newDrink });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update drink price
router.put('/drinks/:drinkId', verify, async (req, res) => {
  try {
    const { drinkId } = req.params;
    const { storePrice } = req.body;

    if (storePrice === undefined) {
      return res.status(400).json({ error: 'storePrice is required' });
    }

    const settings = await Settings.findOneAndUpdate(
      { userId: req.user.id, 'drinks.id': drinkId },
      { $set: { 'drinks.$.storePrice': parseFloat(storePrice) } },
      { returnDocument: 'after' }
    );

    if (!settings) {
      return res.status(404).json({ error: 'Drink not found' });
    }

    res.json(settings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete drink
router.delete('/drinks/:drinkId', verify, async (req, res) => {
  try {
    const { drinkId } = req.params;

    const settings = await Settings.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { drinks: { id: drinkId } } },
      { returnDocument: 'after' }
    );

    if (!settings) {
      return res.status(404).json({ error: 'Drink not found' });
    }

    res.json(settings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;