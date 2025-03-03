// Overview
// Schema (Model) Feedbacks ini dibuat untuk menyimpan umpan balik dari
// pengguna atau pelanggan. Informasi yang disimpan mencakup kritik,
// saran, pesan, dan kesan yang diberikan oleh pengguna.

const { default: mongoose } = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
    kritik: {
        type: String,
        required: true,
    },
    saran: {
        type: String,
        required: true,
    },
    pesan: {
        type: String,
        required: true,
    },
    kesan: {
        type: String,
        required: true,
    },
});

// Validasi Data
// Schema ini menggunakan required: true pada beberapa field, memastikan informasi penting disediakan.

module.exports = mongoose.model("feedbacks", FeedbackSchema);

// Schema ini diekspor sebagai model Mongoose dengan nama 'feedbacks'.
// Model ini dapat digunakan di bagian lain dari aplikasi untuk
// berinteraksi dengan koleksi 'feedbacks' dalam basis data MongoDB.
