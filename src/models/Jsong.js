// Overview
// Schema (Model) JSongs digunakan untuk menyimpan informasi terkait
// partisipasi peserta dalam suatu acara yang berkaitan dengan
// penampilan musik atau bernyanyi. Setiap dokumen dalam koleksi
// ini mencakup informasi seperti nama peserta, nomor telepon,
// nama panggung, judul lagu, tautan lagu, path file atau URL gambar peserta,
// dan status partisipasi.

const { default: mongoose } = require("mongoose");

const JsongSchema = new mongoose.Schema({
    nama_peserta: {
        type: String,
        required: true,
    },
    telp: {
        type: String,
        required: true,
    },
    nama_panggung: {
        type: String,
        required: true,
    },
    lagu: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
});

// Validasi Data
// Schema ini menggunakan required: true pada setiap field,
// memastikan bahwa semua informasi yang dibutuhkan untuk melibatkan
// peserta dalam acara musik disediakan.

module.exports = mongoose.model("jsongs", JsongSchema);

// Schema ini diekspor sebagai model Mongoose dengan nama 'jsongs'.
// Model ini dapat digunakan di bagian lain dari aplikasi untuk
// berinteraksi dengan koleksi 'jsongs' dalam basis data MongoDB.
