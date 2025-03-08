const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const user = require("../models/User");
const TransferProof = require("../models/transferProof");

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: async (req, file, callback) => {
    const { username, type } = req.body;
    const uploadType = ["Ticket", "Jsong", "Coswalk"];

    //cek required field
    if (!username) {
      return callback(new Error("Username is required!"), null);
    }
    if (!type) {
      return callback(new Error("Type is required!"), null);
    }
    if (!uploadType.includes(type)) {
      return callback(new Error("Invalid upload type!"), null);
    }

    //cek username terdaftar di db
    const checkUsername = await user.findOne({ username });
    if (!checkUsername) {
      return callback(new Error("Username not found!"), null);
    }

    // Cek apakah ada data dengan username dan type
    const existingProofs = await TransferProof.find({ username, type });

    // Temukan entri pertama yang memiliki status selain "Invalid"
    const existingValidProof = existingProofs.find(
      (proof) => proof.status !== "Invalid"
    );

    if (existingValidProof) {
      return callback(
        new Error(
          `Proof already exists with status '${existingValidProof.status}'!`
        ),
        null
      );
    }

    const folderName = `uploads/${type}`;
    fs.mkdirSync(folderName, { recursive: true });
    callback(null, folderName);
  },
  filename: (req, file, callback) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    callback(null, `bukti_${uuidv4()}${fileExtension}`);
  },
});

const fileFilter = (req, file, callback) => {
  const allowedExtensions = /jpeg|jpg|png/;
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const fileMimeType = file.mimetype;

  if (
    allowedExtensions.test(fileExtension) &&
    allowedExtensions.test(fileMimeType)
  ) {
    callback(null, true);
  } else {
    return callback(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Files must be in .png, .jpg, or .jpeg format"
      )
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5000000 }, // Maksimal 5MB
});

module.exports = { upload };
