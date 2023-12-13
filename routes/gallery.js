// File gallery.js ini adalah bagian dari aplikasi Node.js yang
// menggunakan Express.js sebagai framework dan MongoDB sebagai database.
// File ini berfungsi untuk mengatur rute dan logika bisnis yang
// berhubungan dengan galeri foto.

// Dependencies :
//  express: Framework web untuk Node.js
//  multer: Middleware untuk menangani multipart/form-data, yang digunakan untuk upload file
//  axios: Klien HTTP berbasis Promise untuk melakukan request ke API
//  dotenv: Modul untuk memuat variabel lingkungan dari file .env
//  fs: Modul bawaan Node.js untuk bekerja dengan sistem file
//  ../models/Gallery: Model Mongoose untuk koleksi Gallery dalam database MongoDB

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { default: axios } = require("axios");
const dotenv = require("dotenv").config().parsed;
const fs = require("fs");
const Gallery = require("../models/Gallery");

const storage = multer.diskStorage({});

const upload = multer({ storage });

// Endpoint
//  POST /new
//    Endpoint ini digunakan untuk menambahkan foto baru ke galeri.
//    Foto diupload melalui form dengan nama field 'photo'.
//    Foto tersebut kemudian dibaca sebagai string base64 dan dikirim ke Imgur API
//    untuk dihosting. URL gambar yang dihasilkan kemudian disimpan ke database MongoDB.
// Request:
//  File:
//    photo: Foto yang diupload dalam format file

// Response:
//  Status 201: Foto berhasil ditambahkan. Mengembalikan objek foto yang baru dibuat.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Cara kerja endpoint ini:
//  1. Menerima data dari form.
//  2. Membaca file foto dan mengubahnya menjadi format base64.
//  3. Mengirimkan request POST ke Imgur API untuk mengupload gambar.
//  4. Membuat objek newphoto dengan data yang diterima dan link gambar yang diupload.
//  5. Membuat foto baru di database dengan objek newphoto.
//  6. Mengirimkan response dengan status 201 dan objek newphoto.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.
router.post("/new", upload.single("photo"), async (req, res) => {
    const photo = fs.readFileSync(req.file.path, { encoding: "base64" });

    try {
        const imgurResponse = await axios.post(
            `https://api.imgur.com/3/image?client_id=${process.env.IMGUR_CLIENT_ID}`,
            {
                image: photo,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
                },
            }
        );
        let tempImg = imgurResponse.data.data.link;

        const newphoto = {
            img: tempImg,
        };

        await Gallery.create(newphoto);

        return res.status(201).send(newphoto);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

// Endpoint
//  GET /
//    Endpoint ini digunakan untuk mendapatkan semua foto yang ada di galeri.
//    Foto-foto tersebut diambil dari database MongoDB dan dikirim kembali sebagai response.
// Response:
//  Status 200: Mengembalikan array yang berisi semua foto yang ada.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Cara kerja endpoint ini:
//  1. Mengambil semua foto dari database.
//  2. Mengirimkan response dengan status 200 dan array yang berisi semua foto.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

router.get("/", async (req, res) => {
    const request = await Gallery.find();
    return res.status(200).send(request);
});

// Endpoint
//  DELETE /:id
//    Endpoint ini digunakan untuk menghapus foto dari galeri.
//    Foto tersebut dihapus dari database MongoDB dan dari Imgur API.
// Request:
//  Parameter:
//    id: ID foto yang ingin dihapus

// Response:
//  Status 201: Foto berhasil dihapus. Mengembalikan pesan sukses.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Cara kerja endpoint ini:
//  1. Mengambil ID foto dari parameter.
//  2. Mencari foto dengan ID tersebut di database.
//  3. Menghapus foto dari database.
//  4. Menghapus foto dari Imgur API.
//  5. Mengirimkan response dengan status 201 dan pesan sukses.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const url = `https://i.imgur.com/${id}.png`;

    try {
        await Gallery.deleteOne({ img: url });
        await axios.delete(
            `https://api.imgur.com/3/image/${id}?client_id=${process.env.IMGUR_CLIENT_ID}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
                },
            }
        );
        return res.status(201).send(`Image berhasil dihapus`);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Environtment Variables
//  IMGUR_CLIENT_ID: Client ID Imgur API
//  IMGUR_TOKEN: Access Token Imgur API

// Error Handling
// Jika terjadi kesalahan saat mengupload foto atau mengambil foto dari database,
// server akan mengirim response dengan status 500 dan pesan error.

module.exports = router;
