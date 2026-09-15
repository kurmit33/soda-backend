const router = require('express').Router();
const { Log } = require('../models/Models');
const verify = require('../middleware/auth');

// Pobierz logi konkretnego typu (drink lub purchase)
router.get('/:type', verify, async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user.id, type: req.params.type }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Dodaj log
router.post('/', verify, async (req, res) => {
  try {
    const newLog = new Log({ ...req.body, userId: req.user.id });
    const savedLog = await newLog.save();
    res.json(savedLog);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Usuń log
router.delete('/:id', verify, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || id === 'undefined') {
      return res.status(400).json({ error: 'Invalid log ID' });
    }

    const deletedLog = await Log.findOneAndDelete({ _id: id, userId: req.user.id });
    
    if (!deletedLog) {
      return res.status(404).json({ error: 'Log not found' });
    }

    res.json({ message: 'Usunięto', deletedId: id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;