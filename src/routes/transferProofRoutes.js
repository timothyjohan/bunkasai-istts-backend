const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/transferProof");

const {
  uploadTransferProof,
} = require("../controllers/transferProofController");
const { threeTryLimitter } = require("../middleware/rateLimitter");

router.post(
  "/uploadTransferProof",
  upload.single("transferProof") /*upload bukti transfer*/,
  threeTryLimitter,
  uploadTransferProof
);

module.exports = router;
