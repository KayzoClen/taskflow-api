// Configuration de l'application
// TODO: externaliser ça un jour si on a le temps

module.exports = {
  port: process.env.PORT || 3000,
  adminApiKey: process.env.ADMIN_API_KEY,
  dataRetentionDays: 90,
};
