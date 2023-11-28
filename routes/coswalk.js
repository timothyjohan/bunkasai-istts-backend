const express = require('express');
const router = express.Router();
const Coswalk = require('../models/Coswalk');


//Add new Coswalk contestant
router.post('/new', async (req, res) => {
  const {nama_peserta, nama_panggung, instagram} = req.body
  const newCoswalk = {
    nama_peserta: nama_peserta,
    nama_panggung:nama_panggung,
    instagram:instagram,
    status:false
  }
  try {
    await Coswalk.create(newCoswalk)
    
  } catch (error) {
    return res.status(500).send(error)
  }

  return res.status(201).send(newCoswalk)
})


module.exports = router