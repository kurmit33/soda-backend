const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Format: "Bearer TOKEN"
  if (!token) return res.status(401).json({ error: 'Brak dostępu. Wymagany token.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Dodaje ID użytkownika do requestu
    next();
  } catch (err) {
    res.status(400).json({ error: 'Nieprawidłowy token.' });
  }
};