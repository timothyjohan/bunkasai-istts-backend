// File ini adalah bagian dari aplikasi Express.js yang menangani operasi terkait pengguna.
// File ini menggunakan model User dari Mongoose untuk berinteraksi dengan database MongoDB.

// Dependencies :
//  express: Framework web untuk Node.js
//  ../models/User: Model Mongoose untuk koleksi User dalam database MongoDB
//  jsonwebtoken: Untuk membuat dan memverifikasi token JWT
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_KEY = "proyek2gatel";

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

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        const user = await User.findOne({ username });
        if (user) {
            if (user.password === password) {
                const token = jwt.sign(
                    {
                        username: user.username,
                        password: user.password,
                    },
                    JWT_KEY,
                    { expiresIn: "1h" }
                );
                user.updateOne({ api_key: token });

                return res.status(200).json({
                    body: {
                        username,
                        token,
                    },
                });
            } else {
                return res.status(400).send({ message: "Password salah!" });
            }
        } else {
            return res.status(404).send({ message: "User Bukan Admin!" });
        }
    } else {
        return res.status(400).send({ message: "Semua field wajib diisi!" });
    }
});

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

router.get("/", async (req, res) => {
    const { user } = req.body;
    let token = req.header("x-auth-token");
    if (!req.header("x-auth-token")) {
        return res.status(400).send("Authentication token is missing");
    }
    let userdata;
    try {
        userdata = jwt.verify(token, JWT_KEY);
    } catch (err) {
        return res.status(400).send("Invalid JWT Key");
    }

    let result = { userdata };

    return res.status(201).send({
        result,
    });
});

module.exports = router;
