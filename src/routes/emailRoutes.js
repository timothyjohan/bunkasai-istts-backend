// File ini adalah bagian dari aplikasi Express.js dan berfungsi
// sebagai router untuk pendaftaran Cosplay Competition.

// Dependencies:
//  express: Framework web untuk Node.js
const express = require("express");
const router = express.Router();

const { authenticateToken, authorizeAdmin } = require("../middleware/auth");
const { sendEmail } = require("../controllers/emailController");

router.post("/ticket", sendEmail);

module.exports = router;
