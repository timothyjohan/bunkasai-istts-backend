// File ini adalah bagian dari aplikasi Express.js dan berfungsi
// sebagai router untuk pendaftaran Cosplay Competition.

// Dependencies:
//  express: Framework web untuk Node.js
const express = require("express");
const router = express.Router();
const {
  createCosplayCompetition,
  getAllCosplayCompetitions,
  getCosplayCompetitionByTelp,
  updateCosplayCompetitionStatus,
  getCosplayCompetitionByEmail,
} = require("../controllers/cosplayCompetitionController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

// Endpoint: POST /new
// Deskripsi:
//  Endpoint ini digunakan untuk menambahkan pendaftar baru untuk Cosplay Competition.
//  Endpoint ini menerima data form yang berisi nama_peserta, telp, dan nama_kelompok.
//  Bukti transfer di-handle oleh endpoint terpisah (/api/transfer-proof/uploadTransferProof).
// Middleware:
//  - authenticateToken: Memastikan bahwa request dibuat oleh pengguna yang terotentikasi.
router.post("/new", authenticateToken, createCosplayCompetition);

// Endpoint: GET /
// Deskripsi:
//  Endpoint ini digunakan untuk mendapatkan semua data pendaftar Cosplay Competition dari database.
//  Hanya admin yang dapat mengakses endpoint ini.
// Middleware:
//  - authenticateToken: Memastikan user terotentikasi.
//  - authorizeAdmin: Memastikan user memiliki hak akses sebagai admin.
router.get("/", authenticateToken, authorizeAdmin, getAllCosplayCompetitions);

// Endpoint: GET /:telp
// Deskripsi:
//  Endpoint ini digunakan untuk mendapatkan data pendaftar Cosplay Competition berdasarkan nomor telepon.
// Middleware:
//  - authenticateToken: Memastikan user terotentikasi.
router.get("/:telp", authenticateToken, getCosplayCompetitionByTelp);

// Endpoint: PUT /:telp
// Deskripsi:
//  Endpoint ini digunakan untuk mengubah status partisipasi pendaftar.
//  (Contoh: mengubah status dari 'pending' menjadi 'confirmed').
// Middleware:
//  - authenticateToken: Memastikan user terotentikasi.
router.put("/:telp", authenticateToken, updateCosplayCompetitionStatus);

// Endpoint: GET /email/:email
// Deskripsi:
//  Endpoint ini digunakan untuk mendapatkan data pendaftar Cosplay Competition berdasarkan email.
// Middleware:
//  - authenticateToken: Memastikan user terotentikasi.
router.get("/email/:email", authenticateToken, getCosplayCompetitionByEmail);

module.exports = router;
