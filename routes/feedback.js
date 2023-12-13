// File feedback.js ini adalah bagian dari aplikasi Express.js yang berfungsi
// untuk menangani permintaan HTTP ke endpoint /feedback. File ini
// menggunakan model Feedback dari Mongoose untuk berinteraksi dengan database MongoDB.

// Dependencies :
//  express: Framework web untuk Node.js
//  ../models/Feedback: Model Mongoose untuk koleksi Feedback dalam database MongoDB

const express = require("express");
const Feedback = require("../models/Feedback");
const router = express.Router();

// Endpoint
//  POST /new
//    Membuat feedback baru.
// Request:
//  Body:
//    kritik: Kritik yang diberikan oleh pengguna
//    saran: Saran yang diberikan oleh pengguna
//    pesan: Pesan yang diberikan oleh pengguna
//    kesan: Kesan yang diberikan oleh pengguna

// Response:
//  Status 201: Umpan balik berhasil ditambahkan. Mengembalikan objek umpan balik yang baru dibuat.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Cara kerja endpoint ini:
//  1. Menerima data dari form.
//  2. Membuat objek newFeedback dengan data yang diterima.
//  3. Membuat feedback baru di database dengan objek newFeedback.
//  4. Mengirimkan response dengan status 201 dan objek newFeedback.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

router.post("/new", async (req, res) => {
    const { kritik, saran, pesan, kesan } = req.body;
    const newFeedback = {
        kritik: kritik,
        saran: saran,
        pesan: pesan,
        kesan: kesan,
    };
    try {
        await Feedback.create(newFeedback);
    } catch (error) {
        return res.status(500).send(error);
    }

    return res.status(201).send(newFeedback);
});

// Endpoint
//  GET /
//    Mengembalikan semua feedback yang ada.
// Response:
//  Status 200: Mengembalikan array yang berisi semua feedback yang ada.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Cara kerja endpoint ini:
//  1. Mencari semua feedback yang ada di database.
//  2. Mengirimkan response dengan status 200 dan array yang berisi semua feedback yang ada.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

router.get("/", async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        return res.status(200).send(feedbacks);
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;
