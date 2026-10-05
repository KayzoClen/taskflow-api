// Configuration de l'application

module.exports = {
  port: 3000,
  // Cle utilisee pour proteger les exports admin (voir routes/admin.js).
  // Definie via la variable d'environnement ADMIN_API_KEY, jamais commitee.
  adminApiKey: process.env.ADMIN_API_KEY,
  dataRetentionDays: 90,
};
