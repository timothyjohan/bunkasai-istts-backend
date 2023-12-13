// File ini adalah titik masuk utama untuk aplikasi Node.js yang
// menggunakan Express.js sebagai kerangka kerja web. Aplikasi ini
// juga menggunakan beberapa modul lain seperti cors, mongoose, dan dotenv.

// Import Modul: Modul yang diperlukan untuk aplikasi ini diimpor.
// Modul ini termasuk express, cors, mongoose, dan dotenv, serta beberapa modul rute khusus.
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const multer = require("multer");
const { default: axios } = require("axios");
const dotenvs = require("dotenv").config().parsed;
const fs = require("fs");
const Coswalk = require("./models/Coswalk");
const Tenant = require("./models/Tenant");
const Jsong = require("./models/Jsong");
const User = require("./models/User");
const Gallery = require("./models/Gallery");
const Feedback = require("./models/Feedback");


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
// File ini adalah bagian dari aplikasi Express.js yang berfungsi
// sebagai app untuk endpoint yang berhubungan dengan "Coswalk".

// Dependencies :
//  express: Framework web untuk Node.js
//  multer: Middleware untuk menangani multipart/form-data, yang digunakan untuk upload file
//  axios: Klien HTTP berbasis Promise untuk melakukan request ke API
//  dotenv: Modul untuk memuat variabel lingkungan dari file .env
//  fs: Modul bawaan Node.js untuk bekerja dengan sistem file

// File ini adalah bagian dari aplikasi Express.js yang berfungsi
// sebagai app untuk endpoint yang berhubungan dengan "Coswalk".

// Dependencies :
//  express: Framework web untuk Node.js
//  multer: Middleware untuk menangani multipart/form-data, yang digunakan untuk upload file
//  axios: Klien HTTP berbasis Promise untuk melakukan request ke API
//  dotenv: Modul untuk memuat variabel lingkungan dari file .env
//  fs: Modul bawaan Node.js untuk bekerja dengan sistem file

const storage = multer.diskStorage({});

const upload = multer({ storage });

// Endpoint
//  POST /new
//    Endpoint ini digunakan untuk menambahkan peserta Coswalk baru.

// Request:
//  Body:
//    nama_peserta: Nama peserta
//    nama_panggung: Nama panggung peserta
//    instagram: Akun Instagram peserta
//  File:
//    bukti: Bukti pendaftaran dalam format file

// Response:
//  Status 201: Peserta berhasil ditambahkan. Mengembalikan objek peserta yang baru dibuat.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Proses yang dilakukan oleh endpoint ini:
//  1. Menerima data dari form.
//  2. Membaca file bukti dan mengubahnya menjadi format base64.
//  3. Mengirimkan request POST ke Imgur API untuk mengupload gambar.
//  4. Membuat objek newCoswalk dengan data yang diterima dan link gambar yang diupload.
//  5. Membuat peserta baru di database dengan objek newCoswalk.
//  6. Mengirimkan response dengan status 201 dan objek newCoswalk.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

app.post("api/coswalk/new", upload.single("bukti"), async (req, res) => {
    const { nama_peserta, nama_panggung, instagram } = req.body;
    const bukti = fs.readFileSync(req.file.path, { encoding: "base64" });

    try {
        const imgurResponse = await axios.post(
            `https://api.imgur.com/3/image?client_id=${process.env.IMGUR_CLIENT_ID}`,
            {
                image: bukti,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
                },
            }
        );
        let tempImg = imgurResponse.data.data.link;

        const newCoswalk = {
            nama_peserta: nama_peserta,
            nama_panggung: nama_panggung,
            instagram: instagram,
            img: tempImg,
            status: false,
        };

        await Coswalk.create(newCoswalk);

        return res.status(201).send(newCoswalk);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Endpoint
//  GET /
//    Endpoint ini digunakan untuk mendapatkan daftar peserta Coswalk.

// Request:
//  Tidak ada parameter khusus yang diperlukan.

// Response:
//  Status 200: Mengembalikan array dari objek peserta.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Proses yang dilakukan oleh endpoint ini:
//  1. Mencari semua peserta di database.
//  2. Mengirimkan response dengan status 200 dan array yang berisi semua peserta.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

app.get("api/coswalk/", async (req, res) => {
    try {
        const coswalk = await Coswalk.find();
        return res.status(200).send(coswalk);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Endpoint
//  GET /:instagram
//    Endpoint ini digunakan untuk mendapatkan data peserta Coswalk berdasarkan Instagram.

// Request:
//  Parameter:
//    instagram: Instagram peserta

// Response:
//  Status 200: Mengembalikan objek peserta.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Proses yang dilakukan oleh endpoint ini:
//  1. Mencari peserta di database dengan Instagram yang diberikan.
//  2. Mengirimkan response dengan status 200 dan objek peserta.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

app.get("api/coswalk/:instagram", async (req, res) => {
    const { instagram } = req.params;
    try {
        const coswalks = await Coswalk.findOne({ instagram: instagram });
        return res.status(200).send(coswalks);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Endpoint
//  DELETE /:instagram
//    Endpoint ini digunakan untuk menghapus peserta Coswalk berdasarkan Instagram.

// Request:
//  Parameter:
//    instagram: Instagram peserta

// Response:
//  Status 200: Peserta berhasil dihapus. Mengembalikan objek peserta yang dihapus.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Proses yang dilakukan oleh endpoint ini:
//  1. Mencari peserta di database dengan Instagram yang diberikan.
//  2. Menghapus peserta dari database.
//  3. Mengirimkan response dengan status 200 dan objek peserta.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

app.put("api/coswalk/:instagram", async (req, res) => {
    const { instagram } = req.params;
    const get = await Coswalk.findOne({ instagram: instagram });
    const update = await Coswalk.updateOne(
        { instagram: instagram },
        { status: !get.status }
    );
    res.send(update);
});

// File tenants.js ini adalah modul app Express.js yang
// menangani operasi CRUD (Create, Read, Update, Delete) untuk model Tenant.

// Dependencies :
//  express: Framework web untuk Node.js
//  ../models/Tenant: Model Mongoose untuk koleksi Tenant dalam database MongoDB


// Endpoint
//  POST /new
//    Membuat tenant baru.
// Request:
//  Body:
//    nama_tenant: Nama tenant
//    nama_cp: Nama kontak person tenant
//    telp: Nomor telepon tenant
//    alamat: Alamat tenant

// Response:
//  Status 201: Tenant berhasil ditambahkan. Mengembalikan objek tenant yang baru dibuat.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Cara kerja endpoint ini:
//  1. Menerima data dari form.
//  2. Membuat objek newTenant dengan data yang diterima.
//  3. Membuat tenant baru di database dengan objek newTenant.
//  4. Mengirimkan response dengan status 201 dan objek newTenant.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

app.post("api/tenant/new", async (req, res) => {
    const { nama_tenant, nama_cp, telp, alamat } = req.body;

    const newTenant = {
        nama_tenant: nama_tenant,
        nama_cp: nama_cp,
        telp: telp,
        alamat: alamat,
        status: false,
    };
    try {
        await Tenant.create(newTenant);
    } catch (error) {
        return res.status(500).send(error);
    }

    return res.status(201).send(newTenant);
});

// Endpoint
//  GET /
//    Mengembalikan semua tenant yang ada.
// Response:
//  Status 200: Mengembalikan array yang berisi semua tenant yang ada.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Cara kerja endpoint ini:
//  1. Mencari semua tenant yang ada di database.
//  2. Mengirimkan response dengan status 200 dan array yang berisi semua tenant yang ada.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

app.get("api/tenant/", async (req, res) => {
    try {
        const tenants = await Tenant.find();
        return res.status(200).send(tenants);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Endpoint
//  PUT /:telp
//    Mengubah status tenant.

// Request:
//  Parameter:
//    telp: Nomor telepon tenant
// Response:
//  Status 200: Mengembalikan objek tenant.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Cara kerja endpoint ini:
//  1. Mengambil nomor telepon tenant dari parameter.
//  2. Mencari tenant di database dengan nomor telepon yang diberikan.
//  3. Mengubah status tenant.
//  4. Mengirimkan response dengan status 200 dan objek tenant.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

app.put("api/tenant/:tel", async (req, res) => {
    const { tel } = req.params;
    const get = await Tenant.findOne({ telp: tel });

    const update = await Tenant.updateOne(
        { telp: tel },
        { status: !get.status }
    );
    res.send(update);
});

app.post("/api/jsong/new", upload.single("bukti"), async (req, res) => {
    const { nama_peserta, telp, nama_panggung, lagu, link } = req.body;
    const bukti = fs.readFileSync(req.file.path, { encoding: "base64" });
    try {
        const imgurResponse = await axios.post(
            `https://api.imgur.com/3/image?client_id=${process.env.IMGUR_CLIENT_ID}`,
            {
                image: bukti,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
                },
            }
        );

        let tempImg = imgurResponse.data.data.link;
        const newJsong = {
            nama_peserta: nama_peserta,
            telp: telp,
            nama_panggung: nama_panggung,
            lagu: lagu,
            link: link,
            img: tempImg,
            status: false,
        };
        await Jsong.create(newJsong);
        return res.status(201).send(newJsong);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Endpoint
//  GET /
//    Endpoint ini digunakan untuk mendapatkan semua kontestan Jsong dari database.
//    Endpoint ini tidak menerima parameter apapun.

// Request:
//  Tidak ada
// Response:
//  Status 200: Mengembalikan array dari objek kontestan.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Proses yang dilakukan oleh endpoint ini:
//  1. Mencari semua kontestan di database.
//  2. Mengirimkan response dengan status 200 dan array yang berisi semua kontestan.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.
app.get("/api/jsong/", async (req, res) => {
    try {
        const jsongs = await Jsong.find();
        return res.status(200).send(jsongs);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Endpoint
//  GET /:telp
//    Endpoint ini digunakan untuk mendapatkan kontestan Jsong berdasarkan nomor telepon.
//    Endpoint ini menerima parameter telp yang merupakan nomor telepon peserta.

// Request:
//  Parameter:
//    telp: Nomor telepon peserta
// Response:
//  Status 200: Mengembalikan objek kontestan.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Proses yang dilakukan oleh endpoint ini:
//  1. Mencari kontestan di database dengan nomor telepon yang diberikan.
//  2. Mengirimkan response dengan status 200 dan objek kontestan.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.
app.get("/api/jsong/:telp", async (req, res) => {
    const { telp } = req.params;
    try {
        const jsongs = await Jsong.findOne({ telp: telp });
        return res.status(200).send(jsongs);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Endpoint
//  PUT /:telp
//    Endpoint ini digunakan untuk mengubah status partisipasi kontestan.
//    Endpoint ini menerima parameter telp yang merupakan nomor telepon peserta.

// Request:
//  Parameter:
//    telp: Nomor telepon peserta
// Response:
//  Status 200: Mengembalikan objek kontestan yang telah diubah.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Proses yang dilakukan oleh endpoint ini:
//  1. Mencari kontestan di database dengan nomor telepon yang diberikan.
//  2. Mengubah status partisipasi kontestan.
//  3. Mengirimkan response dengan status 200 dan objek kontestan yang telah diubah.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.
app.put("/api/jsong/:telp", async (req, res) => {
    const { telp } = req.params;
    const get = await Jsong.findOne({ telp: telp });
    const update = await Jsong.updateOne(
        { telp: telp },
        { status: !get.status }
    );
    res.send(update);
});

app.get('/api/jsong/cek', (req, res) => {
  res.send('GET request to the jsong')
})

const jwt = require("jsonwebtoken");
const JWT_KEY = "proyek2gatel";

// Endpoint
//  POST /
//    Menerima username dan password dalam req.body. Jika username
//    dan password ada, maka mencoba mencari pengguna dengan username yang
//    diberikan. Jika pengguna ditemukan dan password cocok, maka membuat
//    token JWT dan mengirimkannya kembali dalam respons. Jika password tidak cocok,
//    mengirim respons dengan status 400 dan pesan "Password salah!". Jika pengguna
//    tidak ditemukan, mengirim respons dengan status 404 dan pesan "User Bukan Admin!".
//    Jika username atau password tidak ada, mengirim respons dengan status 400 dan pesan "Semua field wajib diisi!".
// Request:
//  Body:
//    username: Username pengguna
//    password: Password pengguna
// Response:
//  Status 201: Pengguna berhasil ditambahkan. Mengembalikan objek pengguna yang baru dibuat.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Cara kerja endpoint ini:
//  1. Menerima data dari form.
//  2. Membuat objek newUser dengan data yang diterima.
//  3. Membuat pengguna baru di database dengan objek newUser.
//  4. Mengirimkan response dengan status 201 dan objek newUser.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

app.post("/api/user/", async (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        const user = await User.findOne({ username });
        if (user) {
            if (user.password === password) {
                const token = jwt.sign(
                    {
                        username: user.username,
                        password: user.password,
                    },
                    JWT_KEY,
                    { expiresIn: "1h" }
                );
                user.updateOne({ api_key: token });

                return res.status(200).json({
                    body: {
                        username,
                        token,
                    },
                });
            } else {
                return res.status(400).send({ message: "Password salah!" });
            }
        } else {
            return res.status(404).send({ message: "User Bukan Admin!" });
        }
    } else {
        return res.status(400).send({ message: "Semua field wajib diisi!" });
    }
});

// Endpoint
//  GET /
//    Menerima token JWT dalam header "x-auth-token". Jika token tidak ada,
//    mengirim respons dengan status 400 dan pesan "Authentication token is missing".
//    Jika token ada, mencoba memverifikasi token. Jika verifikasi gagal,
//    akan menangkap error (kode belum selesai).
// Response:
//  Status 200: Mengembalikan array yang berisi semua pengguna yang ada.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Cara kerja endpoint ini:
//  1. Mencari semua pengguna yang ada di database.
//  2. Mengirimkan response dengan status 200 dan array yang berisi semua pengguna yang ada.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

app.get("/api/user/", async (req, res) => {
    const { user } = req.body;
    let token = req.header("x-auth-token");
    if (!req.header("x-auth-token")) {
        return res.status(400).send("Authentication token is missing");
    }
    let userdata;
    try {
        userdata = jwt.verify(token, JWT_KEY);
    } catch (err) {
        return res.status(400).send("Invalid JWT Key");
    }

    let result = { userdata };

    return res.status(201).send({
        result,
    });
});

app.post("/api/gallery/new", upload.single("photo"), async (req, res) => {
    const photo = fs.readFileSync(req.file.path, { encoding: "base64" });

    try {
        const imgurResponse = await axios.post(
            `https://api.imgur.com/3/image?client_id=${process.env.IMGUR_CLIENT_ID}`,
            {
                image: photo,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
                },
            }
        );
        let tempImg = imgurResponse.data.data.link;

        const newphoto = {
            img: tempImg,
        };

        await Gallery.create(newphoto);

        return res.status(201).send(newphoto);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

// Endpoint
//  GET /
//    Endpoint ini digunakan untuk mendapatkan semua foto yang ada di galeri.
//    Foto-foto tersebut diambil dari database MongoDB dan dikirim kembali sebagai response.
// Response:
//  Status 200: Mengembalikan array yang berisi semua foto yang ada.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Cara kerja endpoint ini:
//  1. Mengambil semua foto dari database.
//  2. Mengirimkan response dengan status 200 dan array yang berisi semua foto.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

app.get("/api/gallery/", async (req, res) => {
    const request = await Gallery.find();
    return res.status(200).send(request);
});

// Endpoint
//  DELETE /:id
//    Endpoint ini digunakan untuk menghapus foto dari galeri.
//    Foto tersebut dihapus dari database MongoDB dan dari Imgur API.
// Request:
//  Parameter:
//    id: ID foto yang ingin dihapus

// Response:
//  Status 201: Foto berhasil dihapus. Mengembalikan pesan sukses.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Cara kerja endpoint ini:
//  1. Mengambil ID foto dari parameter.
//  2. Mencari foto dengan ID tersebut di database.
//  3. Menghapus foto dari database.
//  4. Menghapus foto dari Imgur API.
//  5. Mengirimkan response dengan status 201 dan pesan sukses.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

app.delete("/api/gallery/:id", async (req, res) => {
    const { id } = req.params;
    const url = `https://i.imgur.com/${id}.png`;

    try {
        await Gallery.deleteOne({ img: url });
        await axios.delete(
            `https://api.imgur.com/3/image/${id}?client_id=${process.env.IMGUR_CLIENT_ID}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
                },
            }
        );
        return res.status(201).send(`Image berhasil dihapus`);
    } catch (error) {
        return res.status(500).send(error);
    }
});


app.post("/api/feedback/new", async (req, res) => {
    const { kritik, saran, pesan, kesan } = req.body;
    const newFeedback = {
        kritik: kritik,
        saran: saran,
        pesan: pesan,
        kesan: kesan,
    };
    try {
        await Feedback.create(newFeedback);
    } catch (error) {
        return res.status(500).send(error);
    }

    return res.status(201).send(newFeedback);
});

// Endpoint
//  GET /
//    Mengembalikan semua feedback yang ada.
// Response:
//  Status 200: Mengembalikan array yang berisi semua feedback yang ada.
//  Status 500: Terjadi kesalahan server. Mengembalikan pesan error.

// Cara kerja endpoint ini:
//  1. Mencari semua feedback yang ada di database.
//  2. Mengirimkan response dengan status 200 dan array yang berisi semua feedback yang ada.
// Jika terjadi error, endpoint ini akan mengirimkan response dengan status 500 dan pesan error.

app.get("/api/feedback", async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        return res.status(200).send(feedbacks);
    } catch (error) {
        return res.status(500).send(error);
    }
});


// app.use("/api/feedback", feedback);

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
