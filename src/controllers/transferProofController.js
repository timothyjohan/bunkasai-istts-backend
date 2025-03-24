const TransferProof = require("../models/transferProof");

// Upload bukti transfer
const uploadTransferProof = async (req, res) => {
  try {
    const { email, type } = req.body;

    // insert ke db
    const newProof = new TransferProof({
      email,
      filePath: req.file.path,
      type,
      status: "Checking",
      uploadedAt: new Date(),
    });
    await newProof.save();

    res
      .status(201)
      .json({ message: "File uploaded successfully!", proof: newProof });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadTransferProof };
