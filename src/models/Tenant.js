// Overview
// Schema (Model) Tenants digunakan untuk menyimpan informasi terkait penyewa atau tenant,
// khususnya dalam konteks properti atau ruangan. Setiap dokumen dalam koleksi ini
// mencakup informasi seperti nama tenant, nama kontak utama, nomor telepon, alamat,
// dan status keaktifan.

const { default: mongoose } = require("mongoose");

const TenantSchema = new mongoose.Schema({
    nama_tenant: {
        type: String,
        required: true,
    },
    nama_cp: {
        type: String,
        required: true,
    },
    telp: {
        type: String,
        required: true,
    },
    alamat: {
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
// tenant dalam suatu properti disediakan.

module.exports = mongoose.model("tenants", TenantSchema);

// Schema ini diekspor sebagai model Mongoose dengan nama 'tenants'.
// Model ini dapat digunakan di bagian lain dari aplikasi untuk
// berinteraksi dengan koleksi 'tenants' dalam basis data MongoDB.
