// Overview
// Schema (Model) Galleries ini digunakan untuk menyimpan informasi terkait galeri gambar.
// Setiap dokumen dalam koleksi ini menyimpan URL atau path file gambar.

const { default: mongoose } = require("mongoose");

const GallerySchema = new mongoose.Schema({
    img: {
        type: String,
        required: true,
    },
});

// Validasi Data
// Schema ini menggunakan required: true pada field img,
// memastikan bahwa setiap dokumen dalam galeri memiliki informasi gambar.

module.exports = mongoose.model("galleries", GallerySchema);

// Schema ini diekspor sebagai model Mongoose dengan nama 'galleries'.
// Model ini dapat digunakan di bagian lain dari aplikasi untuk
// berinteraksi dengan koleksi 'galleries' dalam basis data MongoDB.
