// File ini adalah bagian dari aplikasi Express.js yang berfungsi
// sebagai router untuk endpoint yang berhubungan dengan "Coswalk".

// Dependencies :
//  express: Framework web untuk Node.js
//  multer: Middleware untuk menangani multipart/form-data, yang digunakan untuk upload file
//  axios: Klien HTTP berbasis Promise untuk melakukan request ke API
//  dotenv: Modul untuk memuat variabel lingkungan dari file .env
//  fs: Modul bawaan Node.js untuk bekerja dengan sistem file

const express = require("express");
const router = express.Router();
const Coswalk = require("../models/Coswalk");
const multer = require("multer");
const { default: axios } = require("axios");
const dotenv = require("dotenv").config().parsed;
const fs = require("fs");

const storage = multer.diskStorage({});

const upload = multer({ storage });

// Endpoint
//  POST /new
//    Endpoint ini digunakan untuk menambahkan peserta Coswalk baru.

// Request:
//  Body:
//    nama_peserta: Nama peserta
//    nama_panggung: Nama panggung peserta
//    instagram: Akun Instagram peserta
//  File:
//    bukti: Bukti pendaftaran dalam format file

// Response:
//  Status 201: Peserta berhasil ditambahkan. Mengembalikan objek peserta yang baru dibuat.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Proses yang dilakukan oleh endpoint ini:
//  1. Menerima data dari form.
//  2. Membaca file bukti dan mengubahnya menjadi format base64.
//  3. Mengirimkan request POST ke Imgur API untuk mengupload gambar.
//  4. Membuat objek newCoswalk dengan data yang diterima dan link gambar yang diupload.
//  5. Membuat peserta baru di database dengan objek newCoswalk.
//  6. Mengirimkan response dengan status 201 dan objek newCoswalk.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

router.post("/new", upload.single("bukti"), async (req, res) => {
    const { nama_peserta, nama_panggung, instagram } = req.body;
    const bukti = fs.readFileSync(req.file.path, { encoding: "base64" });

    try {
        const imgurResponse = await axios.post(
            `https://api.imgur.com/3/image?client_id=${process.env.IMGUR_CLIENT_ID}`,
            {
                image: bukti,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
                },
            }
        );
        let tempImg = imgurResponse.data.data.link;

        const newCoswalk = {
            nama_peserta: nama_peserta,
            nama_panggung: nama_panggung,
            instagram: instagram,
            img: tempImg,
            status: false,
        };

        await Coswalk.create(newCoswalk);

        return res.status(201).send(newCoswalk);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Endpoint
//  GET /
//    Endpoint ini digunakan untuk mendapatkan daftar peserta Coswalk.

// Request:
//  Tidak ada parameter khusus yang diperlukan.

// Response:
//  Status 200: Mengembalikan array dari objek peserta.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Proses yang dilakukan oleh endpoint ini:
//  1. Mencari semua peserta di database.
//  2. Mengirimkan response dengan status 200 dan array yang berisi semua peserta.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

router.get("/", async (req, res) => {
    try {
        const coswalk = await Coswalk.find();
        return res.status(200).send(coswalk);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Endpoint
//  GET /:instagram
//    Endpoint ini digunakan untuk mendapatkan data peserta Coswalk berdasarkan Instagram.

// Request:
//  Parameter:
//    instagram: Instagram peserta

// Response:
//  Status 200: Mengembalikan objek peserta.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Proses yang dilakukan oleh endpoint ini:
//  1. Mencari peserta di database dengan Instagram yang diberikan.
//  2. Mengirimkan response dengan status 200 dan objek peserta.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

router.get("/:instagram", async (req, res) => {
    const { instagram } = req.params;
    try {
        const coswalks = await Coswalk.findOne({ instagram: instagram });
        return res.status(200).send(coswalks);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Endpoint
//  DELETE /:instagram
//    Endpoint ini digunakan untuk menghapus peserta Coswalk berdasarkan Instagram.

// Request:
//  Parameter:
//    instagram: Instagram peserta

// Response:
//  Status 200: Peserta berhasil dihapus. Mengembalikan objek peserta yang dihapus.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Proses yang dilakukan oleh endpoint ini:
//  1. Mencari peserta di database dengan Instagram yang diberikan.
//  2. Menghapus peserta dari database.
//  3. Mengirimkan response dengan status 200 dan objek peserta.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

router.put("/:instagram", async (req, res) => {
    const { instagram } = req.params;
    const get = await Coswalk.findOne({ instagram: instagram });
    const update = await Coswalk.updateOne(
        { instagram: instagram },
        { status: !get.status }
    );
    res.send(update);
});

module.exports = router;
