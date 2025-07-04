// File ini adalah bagian dari aplikasi Express.js dan berfungsi
// sebagai router untuk pendaftaran Lomba Yonkoma.

// Dependencies:
//  express: Framework web untuk Node.js
const express = require("express");
const router = express.Router();
const {
  createYonkoma,
  getAllYonkomas,
  getYonkomaByTelp,
  updateYonkomaStatus,
  getYonkomaByEmail,
} = require("../controllers/yonkomaController"); // TODO: Create this controller
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

// Endpoint: POST /new
// Deskripsi:
//  Endpoint ini digunakan untuk menambahkan pendaftar baru untuk Lomba Yonkoma.
//  Endpoint ini akan menerima data form yang berisi nama_peserta dan telp.
//  File Yonkoma dan bukti transfer akan di-handle oleh endpoint terpisah.
// Middleware:
//  - authenticateToken: Memastikan bahwa request dibuat oleh pengguna yang terotentikasi.
router.post("/new", authenticateToken, createYonkoma);

// Endpoint: GET /
// Deskripsi:
//  Endpoint ini digunakan untuk mendapatkan semua data pendaftar Lomba Yonkoma dari database.
//  Hanya admin yang dapat mengakses endpoint ini.
// Middleware:
//  - authenticateToken: Memastikan user terotentikasi.
//  - authorizeAdmin: Memastikan user memiliki hak akses sebagai admin.
router.get("/", authenticateToken, authorizeAdmin, getAllYonkomas);

// Endpoint: GET /:telp
// Deskripsi:
//  Endpoint ini digunakan untuk mendapatkan data pendaftar Lomba Yonkoma berdasarkan nomor telepon.
// Middleware:
//  - authenticateToken: Memastikan user terotentikasi.
router.get("/:telp", authenticateToken, getYonkomaByTelp);

// Endpoint: PUT /:telp
// Deskripsi:
//  Endpoint ini digunakan untuk mengubah status partisipasi pendaftar.
// Middleware:
//  - authenticateToken: Memastikan user terotentikasi.
router.put("/:telp", authenticateToken, updateYonkomaStatus);

// Endpoint: GET /email/:email
// Deskripsi:
//  Endpoint ini digunakan untuk mendapatkan data pendaftar Lomba Yonkoma berdasarkan email.
// Middleware:
//  - authenticateToken: Memastikan user terotentikasi.
router.get("/email/:email", authenticateToken, getYonkomaByEmail);

module.exports = router;
