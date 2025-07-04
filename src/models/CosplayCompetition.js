// Overview
// Schema (Model) JSongs digunakan untuk menyimpan informasi terkait
// partisipasi peserta dalam suatu acara yang berkaitan dengan
// penampilan musik atau bernyanyi. Setiap dokumen dalam koleksi
// ini mencakup informasi seperti nama peserta, nomor telepon,
// nama panggung, judul lagu, tautan lagu, path file atau URL gambar peserta,
// dan status partisipasi.

const { default: mongoose } = require("mongoose");

const CosplayCompetitionSchema = new mongoose.Schema({
    nama_peserta: {
        type: String,
        required: true,
    },
    telp: {
        type: String,
        required: true,
    },
    nama_kelompok: {
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

module.exports = mongoose.model("coscomps", CosplayCompetitionSchema);

// Schema ini diekspor sebagai model Mongoose dengan nama 'jsongs'.
// Model ini dapat digunakan di bagian lain dari aplikasi untuk
// berinteraksi dengan koleksi 'jsongs' dalam basis data MongoDB.
