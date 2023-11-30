const express = require('express');
const router = express.Router();
const Jsong = require('../models/Jsong');
const multer = require('multer');
const { default: axios } = require('axios');
const dotenv = require('dotenv').config().parsed;
const fs = require('fs');



const storage = multer.diskStorage({})

const upload = multer({storage})

//Add new Jsong contestant
router.post('/new', upload.single('bukti'), async (req, res) => {
  const {nama_peserta, telp, nama_panggung, lagu, link} = req.body
  const bukti = fs.readFileSync(req.file.path, { encoding: 'base64' });
  if (!bukti) {
    return res.status(400).send('No file uploaded.');
  }
  try {
    const imgurResponse = await axios.post(
      `https://api.imgur.com/3/image?client_id=${process.env.IMGUR_CLIENT_ID}`,
      {
        image: bukti,
        headers: {
          Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
        },
      }
      )

      let tempImg = imgurResponse.data.data.link
      const newJsong = {
        nama_peserta: nama_peserta,
        telp: telp,
        nama_panggung:nama_panggung,
        lagu:lagu,
        link:link,
        img:tempImg,
        status:false
      }
      await Jsong.create(newJsong)
      return res.status(201).send(newJsong)
      
    
  } catch (error) {
    return res.status(500).send(error)
  }

})

module.exports = router