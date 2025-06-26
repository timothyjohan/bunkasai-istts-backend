// Overview
// Schema (Model) Coswalks ini dirancang untuk menyimpan informasi tentang peserta
// dalam suatu acara coswalk. Ini mencakup bidang seperti nama peserta,
// nama panggung, nama Instagram, gambar yang mewakili cosplay mereka,
// dan status mereka dalam acara.

const { default: mongoose } = require("mongoose");

const CoswalkSchema = new mongoose.Schema({
    nama_peserta: {
        type: String,
        required: true,
    },
    nama_panggung: {
        type: String,
        required: true,
    },
    instagram: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
});

// Validasi Data
// Schema ini menggunakan required: true pada beberapa field, memastikan informasi penting disediakan.

module.exports = mongoose.model("coswalks", CoswalkSchema);

// Schema ini diekspor sebagai model Mongoose dengan nama 'coswalks'.
// Model ini dapat digunakan di bagian lain dari aplikasi untuk
// berinteraksi dengan koleksi 'coswalks' dalam basis data MongoDB.
