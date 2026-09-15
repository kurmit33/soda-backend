require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const logsRoutes = require('./routes/logsRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const purchasesRoutes = require('./routes/purchasesRoutes');

function getMongoUri() {
  if (process.env.MONGO_URI && process.env.MONGO_URI.trim() !== '') {
    return process.env.MONGO_URI.trim();
  }

  const requiredMongoVars = ['MONGO_HOST', 'MONGO_DB', 'MONGO_USER', 'MONGO_PASSWORD'];
  const missingMongoVars = requiredMongoVars.filter((key) => {
    return !process.env[key] || process.env[key].trim() === '';
  });

  if (missingMongoVars.length > 0) {
    throw new Error(
      `Brakuje konfiguracji MongoDB. Ustaw MONGO_URI albo komplet zmiennych: ${requiredMongoVars.join(', ')}. Brakujace: ${missingMongoVars.join(', ')}`
    );
  }

  const host = process.env.MONGO_HOST.trim();
  const db = process.env.MONGO_DB.trim();
  const user = encodeURIComponent(process.env.MONGO_USER.trim());
  const password = encodeURIComponent(process.env.MONGO_PASSWORD.trim());

  return `mongodb://${user}:${password}@${host}:27017/${db}?authSource=${db}`;
}



const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((key) => {
  return !process.env[key] || process.env[key].trim() === '';
});

if (missingEnvVars.length > 0) {
  throw new Error(`Brakuje wymaganych zmiennych srodowiskowych: ${missingEnvVars.join(', ')}`);
}

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/health', (req, res) => {
  res.json({ ok: true });
});
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/purchases', purchasesRoutes);

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }

  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function startServer() {
  const mongoUri = getMongoUri();

  try {
    await mongoose.connect(mongoUri);
    console.log('Polaczono z baza MongoDB');

    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, () => {
      console.log(`Backend dziala na porcie ${PORT}`);
    });
  } catch (err) {
    console.error('Blad uruchamiania aplikacji:', err);
    process.exit(1);
  }
}

module.exports = { app, startServer, getMongoUri };

if (require.main === module) {
  startServer();
}
