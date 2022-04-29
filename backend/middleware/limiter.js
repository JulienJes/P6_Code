const rateLimit = require("express-rate-limit"); // Importation de express-rate-limit

exports.passwordLimiter = rateLimit({ // Definission d'un nombre de requête max possible dans un temps donné pour le mdp
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requêtes
});