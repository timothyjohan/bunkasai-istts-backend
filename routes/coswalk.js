const express = require('express');
const router = express.Router();
const Coswalk = require('../models/Coswalk');
const multer = require('multer');
const { default: axios } = require('axios');
const dotenv = require('dotenv').config().parsed;
const fs = require('fs');



const storage = multer.diskStorage({})

const upload = multer({storage})

//Add new Coswalk contestant
router.post('/new', upload.single('bukti'), async (req, res) => {
  const {nama_peserta, nama_panggung, instagram} = req.body
  const bukti = fs.readFileSync(req.file.path, { encoding: 'base64' });


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
      )
      let tempImg = imgurResponse.data.data.link
      
      const newCoswalk = {
        nama_peserta: nama_peserta,
        nama_panggung:nama_panggung,
        instagram:instagram,
        img:tempImg,
        status:false
      }

    await Coswalk.create(newCoswalk)
    
    return res.status(201).send(newCoswalk)
  } catch (error) {
    return res.status(500).send(error)
  }

})


module.exports = router