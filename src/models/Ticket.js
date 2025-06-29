// models/Ticket.js

// Overview
// Schema (Model) Tiket digunakan untuk menyimpan informasi terkait
// pembelian tiket oleh pengguna. Setiap dokumen dalam koleksi
// ini mencakup informasi seperti ID unik (ULID), nama pembeli,
// dan status pembelian.

const { default: mongoose } = require("mongoose");

const TicketSchema = new mongoose.Schema({
    ulid: {
        type: String,
        required: true,
        unique: true, // ULID should be unique for each ticket
    },
    name: { // Corresponds to nama_pembeli in the frontend
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: false, // Default status for a new ticket, e.g., 'pending'
    },
    // You might want to add other fields later, such as:
    // email: {
    //     type: String,
    //     required: true,
    // },
    // transfer_proof_url: { // To store the link to the uploaded transfer proof
    //     type: String,
    //     required: false, // Or true if always required
    // },
    // purchase_date: {
    //     type: Date,
    //     default: Date.now,
    // },
});

// Validasi Data
// Schema ini menggunakan required: true pada field-field utama,
// memastikan bahwa semua informasi yang dibutuhkan untuk pembelian
// tiket disediakan. 'ulid' juga diatur sebagai unik.

module.exports = mongoose.model("tickets", TicketSchema);

// Schema ini diekspor sebagai model Mongoose dengan nama 'tickets'.
// Model ini dapat digunakan di bagian lain dari aplikasi untuk
// berinteraksi dengan koleksi 'tickets' dalam basis data MongoDB.
