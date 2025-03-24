const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/transferProof");

const {
  uploadTransferProof,
} = require("../controllers/transferProofController");

router.post(
  "/uploadTransferProof",
  upload.single("transferProof") /*upload bukti transfer*/,
  uploadTransferProof
);

module.exports = router;
