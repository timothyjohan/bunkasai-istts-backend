const express = require("express");
const router = express.Router();
const {
    createTransaction,
} = require("../controllers/paymentController");

router.get("/transaction", createTransaction);

module.exports = router;
