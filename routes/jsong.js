const express = require('express');
const router = express.Router();
const Jsong = require('../models/Jsong');


//Add new Jsong contestant
router.post('/new', async (req, res) => {
  const {nama_peserta, telp, nama_panggung, lagu, link} = req.body
  const newJsong = {
    nama_peserta: nama_peserta,
    telp: telp,
    nama_panggung:nama_panggung,
    lagu:lagu,
    link:link,
    status:false
  }
  try {
    await Jsong.create(newJsong)
    
  } catch (error) {
    return res.status(500).send(error)
  }

  return res.status(201).send(newJsong)
})


module.exports = router