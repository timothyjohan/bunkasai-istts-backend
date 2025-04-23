const mongoose = require("mongoose");

const transferProofSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["ticket", "jsong", "coswalk"],
    required: true,
  },
  status: {
    type: String,
    enum: ["checking", "valid", "invalid"],
    default: "checking",
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TransferProof", transferProofSchema);
