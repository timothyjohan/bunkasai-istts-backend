// File ini adalah bagian dari aplikasi Express.js dan berfungsi
// sebagai router untuk model Jsong. File ini menggunakan
// beberapa modul seperti express, multer, axios, dotenv, dan fs.

// Dependencies :
//  express: Framework web untuk Node.js
//  multer: Middleware untuk menangani multipart/form-data, yang digunakan untuk upload file
//  axios: Klien HTTP berbasis Promise untuk melakukan request ke API
//  dotenv: Modul untuk memuat variabel lingkungan dari file .env
//  fs: Modul bawaan Node.js untuk bekerja dengan sistem file
const express = require("express");
const router = express.Router();
const {
  createJsong,
  getAllJsongs,
  getJsongByTelp,
  updateJsongStatus,
  checkJsong,
} = require("../controllers/jsongController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

// Endpoint
//  POST /new
//    Endpoint ini digunakan untuk menambahkan kontestan baru ke dalam Jsong.
//    Endpoint ini menerima form data yang berisi nama_peserta, telp,
//    nama_panggung, lagu, link, dan bukti (sebagai file).

// Request:
//  Body:
//    nama_peserta: Nama peserta
//    telp: Nomor telepon peserta
//    nama_panggung: Nama panggung peserta
//    lagu: Judul lagu yang dinyanyikan peserta
//    link: Tautan lagu yang dinyanyikan peserta
//  File:
//    bukti: Bukti pendaftaran dalam format file

// Response:
//  Status 201: Peserta berhasil ditambahkan. Mengembalikan objek peserta yang baru dibuat.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Proses yang dilakukan oleh endpoint ini:
//  1. Menerima data dari form.
//  2. Membaca file bukti dan mengubahnya menjadi format base64.
//  3. Mengirimkan request POST ke Imgur API untuk mengupload gambar.
//  4. Membuat objek newJsong dengan data yang diterima dan link gambar yang diupload.
//  5. Membuat kontestan baru di database dengan objek newJsong.
//  6. Mengirimkan response dengan status 201 dan objek newJsong.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

router.post("/new", authenticateToken, createJsong);

// Endpoint
//  GET /
//    Endpoint ini digunakan untuk mendapatkan semua kontestan Jsong dari database.
//    Endpoint ini tidak menerima parameter apapun.

// Request:
//  Tidak ada
// Response:
//  Status 200: Mengembalikan array dari objek kontestan.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Proses yang dilakukan oleh endpoint ini:
//  1. Mencari semua kontestan di database.
//  2. Mengirimkan response dengan status 200 dan array yang berisi semua kontestan.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

router.get("/", authenticateToken, authorizeAdmin, getAllJsongs);

// Endpoint
//  GET /:telp
//    Endpoint ini digunakan untuk mendapatkan kontestan Jsong berdasarkan nomor telepon.
//    Endpoint ini menerima parameter telp yang merupakan nomor telepon peserta.

// Request:
//  Parameter:
//    telp: Nomor telepon peserta
// Response:
//  Status 200: Mengembalikan objek kontestan.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Proses yang dilakukan oleh endpoint ini:
//  1. Mencari kontestan di database dengan nomor telepon yang diberikan.
//  2. Mengirimkan response dengan status 200 dan objek kontestan.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

router.get("/:telp", authenticateToken, getJsongByTelp);

// Endpoint
//  PUT /:telp
//    Endpoint ini digunakan untuk mengubah status partisipasi kontestan.
//    Endpoint ini menerima parameter telp yang merupakan nomor telepon peserta.

// Request:
//  Parameter:
//    telp: Nomor telepon peserta
// Response:
//  Status 200: Mengembalikan objek kontestan yang telah diubah.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Proses yang dilakukan oleh endpoint ini:
//  1. Mencari kontestan di database dengan nomor telepon yang diberikan.
//  2. Mengubah status partisipasi kontestan.
//  3. Mengirimkan response dengan status 200 dan objek kontestan yang telah diubah.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

router.put("/:telp", authenticateToken, updateJsongStatus);

router.get("/cek", authenticateToken, checkJsong);

module.exports = router;
