// File ini adalah titik masuk utama untuk aplikasi Node.js yang
// menggunakan Express.js sebagai kerangka kerja web. Aplikasi ini
// juga menggunakan beberapa modul lain seperti cors, mongoose, dan dotenv.

// Import Modul: Modul yang diperlukan untuk aplikasi ini diimpor.
// Modul ini termasuk express, cors, mongoose, dan dotenv, serta beberapa modul rute khusus.
const express = require("express");
const cors = require("cors");
const tenants = require("./routes/tenants");
const jsong = require("./routes/jsong");
const coswalk = require("./routes/coswalk");
const user = require("./routes/user");
const gallery = require("./routes/gallery");
const feedback = require("./routes/feedback");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

// Inisialisasi Aplikasi Express: Aplikasi Express dibuat dan port ditetapkan.
const app = express();
const port = 3666;

// Middleware: Middleware ditambahkan ke aplikasi.
// Ini termasuk cors (untuk mengizinkan permintaan lintas asal),
// dan middleware untuk parsing JSON dan URL-encoded bodies.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route: Rute ditambahkan ke aplikasi. Setiap rute memiliki modul rute sendiri.
app.use("/api/tenants", tenants);
app.use("/api/jsong", jsong);
app.use("/api/coswalk", coswalk);
app.use("/api/user", user);
app.use("/api/gallery", gallery);
app.use("/api/feedback", feedback);

// Rute Default: Rute default ("/") mengirimkan pesan sederhana.
app.get("/", (req, res) => {
    res.send("GET request to the homepage");
});

// Menjalankan Server: Server mulai mendengarkan port yang
// ditentukan dalam file konfigurasi .env. Koneksi ke database MongoDB juga dibuat.
app.listen(process.env.PORT, async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.klxoze2.mongodb.net/${process.env.DB_NAME}`
        );
        console.log("hehehhehee");
    } catch (error) {
        console.log(error);
    }
    console.log(`Server is running on port ${process.env.PORT}`);
});
