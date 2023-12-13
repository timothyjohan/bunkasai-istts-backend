// File tenants.js ini adalah modul router Express.js yang
// menangani operasi CRUD (Create, Read, Update, Delete) untuk model Tenant.

// Dependencies :
//  express: Framework web untuk Node.js
//  ../models/Tenant: Model Mongoose untuk koleksi Tenant dalam database MongoDB
const express = require("express");
const router = express.Router();
const Tenant = require("../models/Tenant");

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

router.post("/new", async (req, res) => {
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

router.get("/", async (req, res) => {
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

router.put("/:tel", async (req, res) => {
    const { tel } = req.params;
    const get = await Tenant.findOne({ telp: tel });

    const update = await Tenant.updateOne(
        { telp: tel },
        { status: !get.status }
    );
    res.send(update);
});

module.exports = router;
