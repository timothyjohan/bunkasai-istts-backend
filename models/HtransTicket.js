// Overview
// Schema (Model) Galleries ini digunakan untuk menyimpan informasi terkait galeri gambar.
// Setiap dokumen dalam koleksi ini menyimpan URL atau path file gambar.

const { default: mongoose } = require("mongoose");

const HtransTicketSchema = new mongoose.Schema({
    invoice_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    used_status: {
        type: Boolean,
        required: true,
    },
});

// Validasi Data
// Schema ini menggunakan required: true pada field img,
// memastikan bahwa setiap dokumen dalam galeri memiliki informasi gambar.

module.exports = mongoose.model("htrans_tickets", HtransTicketSchema);

// Schema ini diekspor sebagai model Mongoose dengan nama 'galleries'.
// Model ini dapat digunakan di bagian lain dari aplikasi untuk
// berinteraksi dengan koleksi 'galleries' dalam basis data MongoDB.
