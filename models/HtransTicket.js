// Overview
// Schema (Model) HtransTicket ini digunakan untuk menyimpan informasi terkait tiket transaksi.
// Setiap dokumen dalam koleksi ini menyimpan ID invoice, nama, dan status penggunaan.

const { Schema, model } = require("mongoose");

const HtransTicketSchema = new Schema({
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
// Schema ini menggunakan required: true pada field invoice_id dan name,
// memastikan bahwa setiap dokumen dalam koleksi HtransTicket memiliki informasi yang diperlukan.

module.exports = model("HtransTicket", HtransTicketSchema);

// Schema ini diekspor sebagai model Mongoose dengan nama 'HtransTicket'.
// Model ini dapat digunakan di bagian lain dari aplikasi untuk
// berinteraksi dengan koleksi 'HtransTicket' dalam basis data MongoDB.
