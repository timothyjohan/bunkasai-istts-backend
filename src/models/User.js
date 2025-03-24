// Overview
// Schema (Model) Users ini digunakan untuk menyimpan informasi terkait pengguna.
// Setiap dokumen dalam koleksi ini menyimpan informasi seperti username dan password.

const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Validasi Data
// Schema ini menggunakan required: true pada setiap field,
// memastikan bahwa semua informasi yang dibutuhkan untuk melibatkan
// pengguna dalam aplikasi disediakan.

module.exports = mongoose.model("users", UserSchema);

// Schema ini diekspor sebagai model Mongoose dengan nama 'users'.
// Model ini dapat digunakan di bagian lain dari aplikasi untuk
// berinteraksi dengan koleksi 'users' dalam basis data MongoDB.
