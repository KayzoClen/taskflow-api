// Configuration de l'application

import 'dotenv/config';

module.exports = {
  port: 3000,
  // Cle utilisee pour signer les exports admin (voir routes/admin.js)
  adminApiKey: process.env.ADMIN_KEY,
  dataRetentionDays: 90,
};
