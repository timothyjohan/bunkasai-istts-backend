const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/transferProof");

const {
  uploadTransferProof,
} = require("../controllers/transferProofController");
const { threeTryLimitter } = require("../middleware/rateLimitter");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");
const transferProof = require("../models/transferProof");

router.post(
  "/uploadTransferProof",
  upload.single("transferProof") /*upload bukti transfer*/,
  threeTryLimitter,
  uploadTransferProof
);

router.get(
  "/getTransferProof/:email/:type",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { email, type } = req.params;
      const transferProofs = await transferProof.findOne({ email, type });
      if (!transferProofs) {
        return res.status(404).json({ message: "No transfer proof found" });
      }
      res.json(transferProofs);
    } catch (error) {
      console.error("Error fetching transfer proofs:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
