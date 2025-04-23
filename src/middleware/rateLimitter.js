const rateLimit = require("express-rate-limit");

// Limit registration: max 3 requests per IP per minute
const registerLimiter = rateLimit({
  windowMs: 300 * 1000, // 5 minute
  max: 3,
  message: { message: "Terlalu banyak percobaan, coba lagi nanti." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limit login: max 10 requests per IP per minute
const loginLimiter = rateLimit({
  windowMs: 300 * 1000, // 5 minute
  max: 10,
  message: { message: "Terlalu banyak percobaan login, coba lagi sebentar lagi." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  registerLimiter,
  loginLimiter,
};
