const mongoose = require("mongoose");

const transferProofSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Ticket", "Jsong", "Coswalk"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Checking", "Valid", "Invalid"],
    default: "Checking",
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TransferProof", transferProofSchema);
