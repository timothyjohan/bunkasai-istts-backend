// File galleryRoutes.js ini adalah bagian dari aplikasi Node.js yang
// menggunakan Express.js sebagai framework dan MongoDB sebagai database.
// File ini berfungsi untuk mengatur rute dan logika bisnis yang
// berhubungan dengan galeri foto.

// Dependencies :
//  express: Framework web untuk Node.js
//  ../controllers/galleryController: Modul controller untuk galeri
const express = require("express");
const router = express.Router();
const {
    createGallery,
    getAllGalleries,
    deleteGallery,
} = require("../controllers/galleryController");

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

router.post("/new", createGallery);

// Endpoint
//  GET /
//    Mengembalikan semua gallery yang ada.
// Response:
//  Status 200: Mengembalikan array yang berisi semua gallery yang ada.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Cara kerja endpoint ini:
//  1. Mencari semua gallery yang ada di database.
//  2. Mengirimkan response dengan status 200 dan array yang berisi semua gallery yang ada.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

router.get("/", getAllGalleries);

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

router.delete("/:id", deleteGallery);

// Environtment Variables
//  IMGUR_CLIENT_ID: Client ID Imgur API
//  IMGUR_TOKEN: Access Token Imgur API

// Error Handling
// Jika terjadi kesalahan saat mengupload foto atau mengambil foto dari database,
// server akan mengirim response dengan status 500 dan pesan error.

module.exports = router;
