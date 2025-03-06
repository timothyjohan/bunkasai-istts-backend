const express = require("express");
const router = express.Router();
const {
    createTransaction,
} = require("../controllers/paymentController");
const authenticateToken = require("../middleware/auth");

router.get("/transaction", authenticateToken, createTransaction);

module.exports = router;
