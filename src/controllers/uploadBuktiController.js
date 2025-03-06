const multer = require("multer");
const fs = require("fs"); //filesystem
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const folderName = `uploads/${req.body.type}/${req.body.username}`;

    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, { recursive: true });
    }

    callback(null, folderName);
  },
  filename: (req, file, callback) => {
    console.log(file);
    const fileExtension = path.extname(file.originalname).toLowerCase();

    // callback(null, "tes.jpg");

    // memberi nama file sesuai dengan nama file asli yang diupload
    // callback(null, file.originalname);
    if (file.fieldname == "username") {
      callback(null, `profpic${fileExtension}`);
    } else if (file.fieldname == "pengguna_file[]") {
      callback(null, `${id}${fileExtension}`);
      id++;
    } else {
      callback(null, false);
    }
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000, // dalam byte jadi 1000 = 1kb 1000000 = 1mb
  },
  fileFilter: (req, file, callback) => {
    // buat aturan dalam bentuk regex, mengenai extension apa saja yang diperbolehkan
    const rules = /jpeg|jpg|png/;

    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileMimeType = file.mimetype;

    const cekExt = rules.test(fileExtension);
    const cekMime = rules.test(fileMimeType);

    if (cekExt && cekMime) {
      callback(null, true);
    } else {
      callback(null, false);
      return callback(
        new multer.MulterError(
          "Tipe file harus .png, .jpg atau .jpeg",
          file.fieldname
        )
      );
    }
  },
});

const singleFile = (req, res) => {
  const uploadingFile = upload.single("username");
  uploadingFile(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .send((err.message || err.code) + " pada field " + err.field);
    }
    const body = req.body;
    return res.status(200).json(body);
  });
};
