// File ini adalah bagian dari aplikasi Express.js yang menangani operasi terkait pengguna.
// File ini menggunakan model User dari Mongoose untuk berinteraksi dengan database MongoDB.

// Dependencies :
//  express: Framework web untuk Node.js
//  ../models/User: Model Mongoose untuk koleksi User dalam database MongoDB
//  jsonwebtoken: Untuk membuat dan memverifikasi token JWT

const express = require("express");
const router = express.Router();
const {
  loginUser,
  getAllUsers,
  registerUser,
} = require("../controllers/userController");
const authenticateToken = require("../middleware/auth");
const { loginLimiter, threeTryLimitter } = require("../middleware/rateLimitter");

// Endpoint
//  POST /
//    Menerima username dan password dalam req.body. Jika username
//    dan password ada, maka mencoba mencari pengguna dengan username yang
//    diberikan. Jika pengguna ditemukan dan password cocok, maka membuat
//    token JWT dan mengirimkannya kembali dalam respons. Jika password tidak cocok,
//    mengirim respons dengan status 400 dan pesan "Password salah!". Jika pengguna
//    tidak ditemukan, mengirim respons dengan status 404 dan pesan "User Bukan Admin!".
//    Jika username atau password tidak ada, mengirim respons dengan status 400 dan pesan "Semua field wajib diisi!".
// Request:
//  Body:
//    username: Username pengguna
//    password: Password pengguna
// Response:
//  Status 201: Pengguna berhasil ditambahkan. Mengembalikan objek pengguna yang baru dibuat.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Cara kerja endpoint ini:
//  1. Menerima data dari form.
//  2. Membuat objek newUser dengan data yang diterima.
//  3. Membuat pengguna baru di database dengan objek newUser.
//  4. Mengirimkan response dengan status 201 dan objek newUser.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

router.post("/", loginLimiter ,loginUser);

// Endpoint
//  POST /register
//    Menerima username dan password dalam req.body. Jika username
//    dan password ada, maka mencoba mencari pengguna dengan username yang
//    diberikan. Jika pengguna ditemukan, mengirim respons dengan status 400 dan pesan "Username sudah digunakan!".
//    Jika pengguna tidak ditemukan, membuat pengguna baru di database dan mengirim respons dengan status 201 dan objek pengguna yang baru dibuat.
//    Jika username atau password tidak ada, mengirim respons dengan status 400 dan pesan "Semua field wajib diisi!".
// Request:
//  Body:
//    username: Username pengguna
//    password: Password pengguna
// Response:
//  Status 201: Pengguna berhasil ditambahkan. Mengembalikan objek pengguna yang baru dibuat.
//  Status 400: Username sudah digunakan atau field tidak lengkap.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

router.post("/register", threeTryLimitter, registerUser);

// Endpoint
//  GET /
//    Menerima token JWT dalam header "x-auth-token". Jika token tidak ada,
//    mengirim respons dengan status 400 dan pesan "Authentication token is missing".
//    Jika token ada, mencoba memverifikasi token. Jika verifikasi gagal,
//    akan menangkap error (kode belum selesai).
// Response:
//  Status 200: Mengembalikan array yang berisi semua pengguna yang ada.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Cara kerja endpoint ini:
//  1. Mencari semua pengguna yang ada di database.
//  2. Mengirimkan response dengan status 200 dan array yang berisi semua pengguna yang ada.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

router.get("/", authenticateToken, getAllUsers);

module.exports = router;
